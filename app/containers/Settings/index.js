import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, Text, TouchableOpacity, BackHandler } from "react-native";
import { OfflineImage } from "react-native-image-offline";

import {
  CoreComponents,
  metaHelpers,
  CoreConstants,
} from "@pru-rt-internal/rnmobile-app-core-framework";

const { Loader } = CoreComponents;

const helpers = metaHelpers;
const {
  SCREEN_KEY_LEFT_MENU_SETTINGS,
  COMMON_KEY_GO_BACK,
  NOT_ENROLLED,
} = CoreConstants;

import { BACK } from "../../config/images";

import styles from "./styles";
import TouchID from "react-native-touch-id";
const KEY_SCREEN_HEADER = "leftmenusettingsheader";
const KEY_ACCOUNT = "leftmenusettingsaccount";
const KEY_LANGUAGE = "leftmenusettingslanguage";
const KEY_ABOUT_US = "leftmenusettingsaboutus";
const FITNESS_TRACKER = "leftmenusettingsgooglefit";
const FINGERPRINT = "leftmenusettingsfingerprint";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFingerPrintSupported: false,
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    this.updateFingerprintSupport();
  }
  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  settings() {
    const { meta } = this.props;
    if (meta != null && meta.metaDetail != null) {
      const leftMenuSettingsScreen = helpers.findScreen(
        SCREEN_KEY_LEFT_MENU_SETTINGS
      );
      const labelHeader = helpers.findElement(
        SCREEN_KEY_LEFT_MENU_SETTINGS,
        KEY_SCREEN_HEADER
      );
      return (
        <View style={styles.contentView}>
          <View style={styles.borderBottom}>
            <Text style={styles.title}>{labelHeader.label}</Text>
          </View>
          {leftMenuSettingsScreen.elements.map((data, index) =>
            this.conditionalRenderingForSettings(data, index)
          )}
        </View>
      );
    }
    return <Loader />;
  }

  handleBackButtonClick() {
    const { navigation } = this.props;
    navigation.goBack();
    return true;
  }

  updateFingerprintSupport() {
    const optionalConfigObject = {
      unifiedErrors: false, // use unified error messages (default false)
    };
    TouchID.isSupported(optionalConfigObject)
      .then(biometryType => {
        console.log("biometryType :", biometryType);
        // Success code
        if (biometryType !== "FaceID") {
          this.setState({
            isFingerPrintSupported: true,
          });
        }
      })
      .catch(error => {
        if (error.code === NOT_ENROLLED) {
          this.setState({
            isFingerPrintSupported: true,
          });
        } else {
          this.setState({ isFingerPrintSupported: false });
        }
        // Failure code
      });
  }

  conditionalRenderingForSettings(data) {
    if (
      (data.type !== "labelHeader" &&
        data.key !== "leftmenusettingsfingerprint") ||
      (data.key === "leftmenusettingsfingerprint" &&
        this.state.isFingerPrintSupported)
    )
      return (
        <View key={data.key}>
          <TouchableOpacity
            onPress={() => this.actionType(data.key)}
            style={styles.contentViewItems}
          >
            <Text style={styles.itemTitle}>{data.label}</Text>
            <Text style={styles.badge}>{data.badge}</Text>
          </TouchableOpacity>
          <View style={styles.borderBottom} />
        </View>
      );
    return null;
  }
  header() {
    const { meta, navigation } = this.props;
    return (
      <View>
        <TouchableOpacity
          style={styles.backIcnWrapper}
          onPress={() => this.handleBackButtonClick()}
          accessibilityLabel="goBack"
          accesible
        >
          <OfflineImage
            fallbackSource={BACK}
            accessibilityLabel="back"
            accesible
            style={styles.backIcn}
            key={COMMON_KEY_GO_BACK}
            source={{
              uri: helpers.findCommon(COMMON_KEY_GO_BACK).image,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  actionType(act) {
    const { navigation } = this.props;
    switch (act) {
      case KEY_ACCOUNT:
        navigation.navigate("Account");
        break;
      case KEY_LANGUAGE:
        navigation.navigate("ChangeLanguage");
        break;
      case KEY_ABOUT_US:
        navigation.navigate("Aboutus");
        break;
      case FITNESS_TRACKER:
        navigation.navigate("TrackActivityDetails");
        break;
      case FINGERPRINT:
        navigation.navigate("FingerprintPreferences");
        break;
      default:
        console.log("default");
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.header()}
        {this.settings()}
      </View>
    );
  }
}

Settings.propTypes = {
  meta: PropTypes.objectOf(PropTypes.any).isRequired,
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  meta: state.meta,
});

export default connect(
  mapStateToProps,
  null
)(Settings);
