import React, { Component } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { connect } from "react-redux";
import ModalDropdown from "react-native-modal-dropdown";
import { OfflineImage } from "react-native-image-offline";

import {
  CoreConfig,
  metaHelpers,
  CoreActions,
  CoreComponents,
} from "@pru-rt-internal/rnmobile-app-core-framework";

import styles from "./styles";
import OpenSettings from "react-native-open-settings";

const {
  colors,
  ATTACHMENT_ICON,
  BACK,
  SCREEN_KEY_FEEDBACK,
  COMMON_KEY_GO_BACK,
  COMMON_ERROR_KEY_GENERIC_ERROR,
  SCREEN_KEY_MANAGE_PROFILE,
  SCREEN_KEY_CHAT_REPORT,
  KEY_GALLERY_PERMISSION,
} = CoreConfig;
const { Button, FeedbackTextInput } = CoreComponents;
const helpers = metaHelpers;
const { dispatchFeedbackReset, feedbackData } = CoreActions;
const KEY_SCREEN_DESCRIPTION = "feedbackscreendescription";
const KEY_SCREEN_DETAILED_DESCRIPTION = "feedbackscreendetaileddescription";
const KEY_DROP_DOWN_HEADER = "dropdownheader";
const KEY_DETAILED_INPUT_LABEL = "feedbackscreendetailedinputlabel";
const KEY_UPLOAD_ATTACHMENT = "feedbackscreenuploadattachmentbutton";
const KEY_SEND_FEEDBACK = "feedbackscreensendfeedbackbutton";
const TYPE_DROP_DOWN_ITEM = "dropdownitem";
const KEY_SUBMITTED_MSG = "feedbackscreensubmittedmessage";
const KEY_DESCRIPTION_REQUIRED_MSG = "feedbackscreendescriptionrequired";
const KEY_CANCEL = "cancel";
const KEY_OK = "ok";

class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: "",
      originalImagesData: "",
      description: "",
      feedbackHasError: false,
      feedbackErrorMessage: "",
    };
    this.showGallery = this.showGallery.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.removeImage = this.removeImage.bind(this);
  }

  componentWillMount() {
    this.props.dispatchFeedbackReset();
  }

  onCategoryChange(val, label) {
    this.setState({ category: label });
  }

  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    this.props.navigation.goBack();
    return true;
  }

  submitFeedback() {
    const { originalImagesData } = this.state;
    if (this.state.description === "") {
      this.setState({
        feedbackHasError: true,
        feedbackErrorMessage: helpers.findElement(
          SCREEN_KEY_FEEDBACK,
          KEY_DESCRIPTION_REQUIRED_MSG
        ).label,
      });
    } else {
      this.setState({
        feedbackHasError: false,
        feedbackErrorMessage: "",
      });
      const imagesArray = [];
      if (originalImagesData != "") {
        if (Platform.OS !== "ios") {
          const attachment = {
            filename: originalImagesData.path
              .split("///")
              .pop()
              .split("/")
              .pop(),
            content: originalImagesData.data.toString(),
          };
          imagesArray.push(attachment);
        } else {
          const attachment = {
            filename: originalImagesData.filename,
            content: originalImagesData.data.toString(),
          };
          imagesArray.push(attachment);
        }
      }
      const data = {
        description: this.state.description,
        feedbackFor: this.state.category,
        feedbackAttachments: imagesArray,
        token: this.props.sessionId,
        email: this.props.email,
      };
      this.props.feedbackData(data);
    }
  }

  removeImage() {
    this.setState({
      originalImagesData: "",
    });
  }

  showGallery() {
    const galleryPermission = helpers.findElement(
      SCREEN_KEY_MANAGE_PROFILE,
      KEY_GALLERY_PERMISSION
    ).label;
    const ok = helpers
      .findElement(SCREEN_KEY_CHAT_REPORT, KEY_OK)
      .label.toUpperCase();
    const cancel = helpers.findElement(SCREEN_KEY_MANAGE_PROFILE, KEY_CANCEL)
      .label;

    ImagePicker.openPicker({
      mediaType: "photo",
      width: 300,
      height: 300,
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      includeBase64: true,
      compressImageQuality: 0.7,
      photo: "photo",
      multiple: false,
    })
      .then(galleryImages => {
        this.setState({
          originalImagesData: galleryImages,
        });
      })
      .catch(error => {
        if (error.code !== "E_PICKER_CANCELLED" && Platform.OS === "ios") {
          Alert.alert(
            "",
            galleryPermission,
            [
              { text: ok, onPress: () => OpenSettings.openSettings() },
              { text: cancel, style: "cancel" },
            ],
            { cancelable: false }
          );
        }
      });
  }

  onChange(name, val) {
    this.setState({ description: val });
  }

  // eslint-disable-next-line complexity
  render() {
    const {
      submitFeedbackDone,
      submitFeedbackError,
      dispatchFeedbackReset,
      navigation,
    } = this.props;
    let index = 0;
    const feedbackScreen = helpers.findScreen(SCREEN_KEY_FEEDBACK);
    const dropDownOptions = helpers
      .findAllElementsByType(feedbackScreen, TYPE_DROP_DOWN_ITEM)
      .map(x => x.label);
    if (
      ((((navigation || {}).state || {}).params || {}).selectedDropDownOption ||
        "") !== ""
    ) {
      const label = this.props.navigation.state.params.selectedDropDownOption;
      index = dropDownOptions.indexOf(label);
    }
    index = index === -1 ? 0 : index;
    if (this.state.category === "") {
      this.setState({
        category: dropDownOptions[index],
      });
    }
    if (submitFeedbackDone) {
      Alert.alert(
        "",
        helpers.findElement(SCREEN_KEY_FEEDBACK, KEY_SUBMITTED_MSG).label
      );
      dispatchFeedbackReset();
      this.setState({
        originalImagesData: [],
        description: "",
      });
    } else if (submitFeedbackError) {
      Alert.alert(
        "",
        helpers.findCommonErrorMessages(COMMON_ERROR_KEY_GENERIC_ERROR).message
      );
      dispatchFeedbackReset();
    }
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <TouchableOpacity
            onPress={this.handleBackButtonClick}
            accessibilityLabel="goBack"
            style={styles.backIcnWrapper}
            accesible
          >
            <OfflineImage
              fallbackSource={BACK}
              accessibilityLabel="back"
              accesible
              key={COMMON_KEY_GO_BACK}
              style={styles.backIcn}
              source={{
                uri: helpers.findCommon(COMMON_KEY_GO_BACK).image,
              }}
            />
          </TouchableOpacity>
          <ScrollView style={styles.scrollviewContainer}>
            <Text style={styles.thanksMsg}>
              {
                helpers.findElement(SCREEN_KEY_FEEDBACK, KEY_SCREEN_DESCRIPTION)
                  .label
              }
            </Text>
            <View style={styles.thanksPara}>
              <Text style={styles.thanks}>
                {
                  helpers.findElement(
                    SCREEN_KEY_FEEDBACK,
                    KEY_SCREEN_DETAILED_DESCRIPTION
                  ).label
                }
              </Text>
            </View>
            <View style={styles.leftSpacing}>
              <Text style={styles.feedback}>
                {
                  helpers.findElement(SCREEN_KEY_FEEDBACK, KEY_DROP_DOWN_HEADER)
                    .label
                }
              </Text>
              <View style={{ alignItems: "center" }}>
                <View style={[styles.dropbox, { marginTop: 30 }]}>
                  <ModalDropdown
                    textStyle={styles.textStyle}
                    defaultValue={dropDownOptions[index]}
                    dropdownStyle={styles.dropdownStyle}
                    dropdownTextStyle={styles.dropdownTextStyle}
                    style={styles.dropDownButton}
                    options={dropDownOptions}
                    onSelect={(val, label) => this.onCategoryChange(val, label)}
                  />
                  <View pointerEvents="none" style={styles.dropDownIcon}>
                    <MaterialIcons
                      pointerEvents="none"
                      name="arrow-drop-down"
                      size={25}
                      color="#a8a8a8"
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.leftSpacing}>
              <Text style={[styles.thanksPara, { marginLeft: 0 }]}>
                {
                  helpers.findElement(
                    SCREEN_KEY_FEEDBACK,
                    KEY_DETAILED_INPUT_LABEL
                  ).label
                }
              </Text>
              <FeedbackTextInput
                name="description"
                hasError={this.state.feedbackHasError}
                errorMsg={this.state.feedbackErrorMessage}
                onChange={this.onChange}
                value={this.state.description}
              />
              <Text style={styles.feedbackCounter}>
                {this.state.description.length}
              </Text>
            </View>

            {this.state.originalImagesData != "" && ( //this.state.originalImagesData.map(image => (
              <View style={styles.imageDetailContainer}>
                <OfflineImage
                  fallbackSource={ATTACHMENT_ICON}
                  accessibilityLabel="attachment"
                  accesible
                  key={KEY_UPLOAD_ATTACHMENT}
                  style={styles.uploadImg}
                  source={{
                    uri: helpers.findElement(
                      SCREEN_KEY_FEEDBACK,
                      KEY_UPLOAD_ATTACHMENT
                    ).image,
                  }}
                />
                <Text numberOfLines={1} style={styles.attachedText}>
                  {Platform.OS !== "ios"
                    ? this.state.originalImagesData.path
                        .split("///")
                        .pop()
                        .split("/")
                        .pop()
                    : this.state.originalImagesData.filename}
                </Text>
                <TouchableOpacity
                  style={styles.removeBtnContainer}
                  onPress={() => {
                    this.removeImage();
                  }}
                >
                  <Text style={styles.removeBtnLabel}>Remove</Text>
                </TouchableOpacity>
              </View>
            )
            //))
            }
            {this.state.originalImagesData == "" && (
              <TouchableOpacity
                style={styles.uploadBtnContainer}
                onPress={() => {
                  this.showGallery();
                }}
              >
                <OfflineImage
                  fallbackSource={ATTACHMENT_ICON}
                  accessibilityLabel="attachment"
                  accesible
                  key={KEY_UPLOAD_ATTACHMENT}
                  style={[
                    styles.uploadImg,
                    { marginLeft: 10, marginRight: 10 },
                  ]}
                  source={{
                    uri: helpers.findElement(
                      SCREEN_KEY_FEEDBACK,
                      KEY_UPLOAD_ATTACHMENT
                    ).image,
                  }}
                />
                <Text numberOfLines={1} style={styles.uploadBtn}>
                  {
                    helpers.findElement(
                      SCREEN_KEY_FEEDBACK,
                      KEY_UPLOAD_ATTACHMENT
                    ).label
                  }
                </Text>
              </TouchableOpacity>
            )}
            {!this.props.loading && (
              <View style={styles.leftSpacing}>
                <Button
                  text={
                    helpers.findElement(SCREEN_KEY_FEEDBACK, KEY_SEND_FEEDBACK)
                      .label
                  }
                  wrapper={styles.submitBtn}
                  style={styles.btnText}
                  onClick={() => this.submitFeedback()}
                />
              </View>
            )}
            {this.props.loading && (
              <View>
                <ActivityIndicator size="large" color={colors.crimson} />
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  meta: state.meta,
  refreshImage: state.meta.refreshImage,
  loading: state.feedback.loading,
  submitFeedbackDone: state.feedback.submitFeedbackDone,
  submitFeedbackError: state.feedback.submitFeedbackError,
  sessionId: state.auth.token,
  email: state.auth.email,
});

export default connect(
  mapStateToProps,
  {
    dispatchFeedbackReset,
    feedbackData,
  }
)(Feedback);
