import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Alert,
  Image,
} from "react-native";
import { connect } from "react-redux";
import { OfflineImage } from "react-native-image-offline";
import Modal from "react-native-modal";
import OpenSettings from "react-native-open-settings";

import {
  CoreComponents,
  CoreServices,
  CoreConstants,
} from "@pru-rt-internal/rnmobile-app-core-framework";

const { Label } = CoreComponents;
import styles from "./styles";
const { checkDevicePermission, grantDevicePermissions } = CoreServices;
import { values, pickBy, any } from "ramda";

import {
  ONLINE_CONSULTATION,
  CAMERA,
  MICROPHONE,
  MICROPHONE_ACTIVE,
  ACCESS_GRANTED,
  CAMERA_ACTIVE,
  BACK,
  DOC_INLINE_LOGO,
} from "../../config/images";

const {
  DOC_SERVICE_LANDING,
  DOC_SERVICE_REQUEST_CONSULTATION,
  GO_BACK_TO_PREVIOUS_STACK,
  ConsultationStatus,
  ConsultationType,
} = CoreConstants;

class ConsultDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      permissions: {
        camera: false,
        microPhone: false,
      },
    };
    this.buttonData = [
      {
        title: "Consult with a doctor (VIDEO)",
        message: "Online consultation",
        image: ONLINE_CONSULTATION,
        imageKey: "online_consult",
        callType: ConsultationType.VIDEO_CHAT,
      },
      {
        title: "Consult with a doctor (AUDIO)",
        message: "Online consultation",
        image: ONLINE_CONSULTATION,
        imageKey: "online_consult",
        callType: ConsultationType.AUDIO_CHAT,
      },
    ];
    this.info =
      "Once the request for consultation is sent, it cannot be recalled or cancelled.";
    this.notes = "Doctors are available between 9am to 7pm on weekdays";
    this.permsRequired = [
      {
        key: "camera",
        permissionKey: "camera",
        display: "Camera",
        activeImg: CAMERA_ACTIVE,
        inactiveImg: CAMERA,
      },
      {
        key: "microPhone",
        permissionKey: "micro_phone",
        display: "Microphone",
        activeImg: MICROPHONE_ACTIVE,
        inactiveImg: MICROPHONE,
      },
    ];
    this.onConsultationPress = this.onConsultationPress.bind(this);
    this.checkRequiredPermissions = this.checkRequiredPermissions.bind(this);
    this.onGrantAccess = this.onGrantAccess.bind(this);
    this.hidePermissionsPopup = this.hidePermissionsPopup.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onGoBack);
  }

  checkRequiredPermissions() {
    const permsRequired = this.permsRequired;
    const promises = permsRequired.map(item =>
      checkDevicePermission(item.permissionKey)
    );
    return Promise.all(promises).then(results => {
      const newPermissions = {};
      permsRequired.map((item, idx) => {
        newPermissions[item.key] = results[idx];
      });
      const allPermissionsAvailable =
        values(pickBy(val => !val, newPermissions)).length === 0;
      this.setState({
        ...this.state,
        modalVisible: !allPermissionsAvailable,
        permissions: newPermissions,
      });

      return allPermissionsAvailable;
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onGoBack);
  }

  onConsultationPress(callType) {
    this.checkRequiredPermissions().then(allPermissionsAvailable => {
      if (allPermissionsAvailable) {
        this.startConsultation(callType);
      }
      this.callType = callType;
    });
  }

  hidePermissionsPopup() {
    this.setState({
      ...this.state,
      modalVisible: false,
    });
  }

  onGrantAccess() {
    const { permissions } = this.state;

    const allPermissions = this.permsRequired.reduce(
      (promiseChain, permission) => {
        return promiseChain.then(results => {
          let currentPromise = Promise.resolve(true);
          if (!permissions[permission.key]) {
            currentPromise = grantDevicePermissions(permission.permissionKey);
          }
          return currentPromise.then(result => [...results, result]);
        });
      },
      Promise.resolve([])
    );

    allPermissions.then(results => {
      //0 is permission granted
      const permissionDenied = any(x => !x)(results);
      if (permissionDenied) {
        Alert.alert(
          "Permissions required",
          "To use this feature, both Camera and Microphone permissions are required. Click OK to take you to settings page where you can grant the permission.",
          [
            {
              text: "OK",
              onPress: () => {
                OpenSettings.openSettings();
                this.hidePermissionsPopup();
              },
            },
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => this.hidePermissionsPopup(),
            },
          ]
        );
      } else {
        this.hidePermissionsPopup();
        this.startConsultation(this.callType);
      }
    });
  }

  startConsultation = callType => {
    if (this.props.consultationStatus === ConsultationStatus.REQUESTED)
      Alert.alert("Consultation request sent already");
    else
      this.props.dispatch({
        context: DOC_SERVICE_LANDING,
        type: DOC_SERVICE_REQUEST_CONSULTATION,
        payload: {
          callType,
        },
      });
  };

  onGoBack = () => {
    this.props.dispatch({
      context: DOC_SERVICE_LANDING,
      type: GO_BACK_TO_PREVIOUS_STACK,
    });
    return true;
  };

  renderPermissionsList() {
    return this.permsRequired.map(item => {
      const { permissions } = this.state;
      const hasPermission = permissions[item.key];
      return (
        <View style={styles.modalButton} key={item.key}>
          <View style={styles.contentCenter}>
            {hasPermission && (
              <OfflineImage
                key="access_granted"
                resizeMode="contain"
                style={styles.access_icons}
                fallbackSource={ACCESS_GRANTED}
                source={ACCESS_GRANTED}
              />
            )}
          </View>
          <View>
            <OfflineImage
              key="camera"
              resizeMode="contain"
              style={styles.icons}
              fallbackSource={hasPermission ? item.activeImg : item.inactiveImg}
              source={hasPermission ? item.activeImg : item.inactiveImg}
            />
          </View>
          <View style={styles.contentCenter}>
            <Text style={[styles.modalButtonLabel, { flexWrap: "wrap" }]}>
              {hasPermission
                ? item.display + " - permission granted"
                : item.display + " - permission not granted"}
            </Text>
          </View>
        </View>
      );
    });
  }
  render() {
    const { modalVisible } = this.state;
    const dataContainer = this.buttonData.map((item, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => this.onConsultationPress(item.callType)}
      >
        <View style={styles.consultationDataContainer}>
          <View style={styles.titleContainer}>
            <Label value={item.title} style={styles.title} />
            <Label value={item.message} style={styles.consultationSubhead} />
          </View>
          <OfflineImage
            key={item.imageKey}
            resizeMode="contain"
            style={styles.icons}
            fallbackSource={item.image}
            source={item.image}
          />
        </View>
      </TouchableOpacity>
    ));
    return (
      <View style={styles.container}>
        {/* <Header
          leftIconType="back"
          onLeftPress={this.onGoBack}
          showRightIcon={false}
        /> */}
        <View style={styles.headerContainer}>
          <View style={styles.closeIcon}>
            <TouchableOpacity style={styles.closeIcon} onPress={this.onGoBack}>
              <OfflineImage
                accessibilityLabel="back"
                accesible
                key="backIcon"
                style={[styles.closeIcon]}
                fallbackSource={BACK}
                source={BACK}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Image
              style={[styles.doclogo]}
              source={DOC_INLINE_LOGO}
            />
          </View>
        </View>
        <View style={styles.headerSection}>
          <Label value="Consultation with Doctor" style={styles.heading} />
          <Label value="Available daily, 8am to 12am" style={styles.timing}/>
          <Label value="(including public holidays)" style={styles.publicHoidayText}/>
        </View>
        <View style={styles.consultationBtnContainer}>
          {dataContainer}
          <Label
            value={this.info}
            style={[styles.consultationSubhead, styles.info]}
          />
        </View>
        <Label
          value={this.state.notes}
          style={[styles.consultationSubhead, styles.info, styles.footerNotes]}
        />
        <Modal
          isVisible={modalVisible}
          onBackdropPress={() => this.setState({ modalVisible: false })}
        >
          <View style={styles.profileModalContent}>
            <View style={styles.modalStyle}>
              <Text style={styles.modalLabel}>
                {`We need to access your device's`}{" "}
                <Text style={styles.labelBold}>camera</Text> and{" "}
                <Text style={styles.labelBold}>microphone</Text> before you can
                proceed
              </Text>
              <View style={styles.modalButtonContainer}>
                {this.renderPermissionsList()}
              </View>
              <View style={styles.modalFooterBtnContainer}>
                <TouchableOpacity
                  style={styles.modalFooterBtn}
                  onPress={e => {
                    e.preventDefault();
                    this.hidePermissionsPopup();
                  }}
                >
                  <Text
                    style={[
                      styles.modalFooterLabel,
                      styles.labelBold,
                      styles.textLeft,
                    ]}
                  >
                    CANCEL
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalFooterBtn}
                  onPress={e => {
                    e.preventDefault();
                    this.onGrantAccess();
                  }}
                >
                  <Text
                    style={[
                      styles.modalFooterLabel,
                      styles.labelBold,
                      styles.textRight,
                    ]}
                  >
                    GRANT ACCESS
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  meta: state.meta,
  consultationStatus: state.doctorServices.consultationStatus,
});
export default connect(mapStateToProps)(ConsultDoctor);
