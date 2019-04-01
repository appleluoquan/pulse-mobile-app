import React, { Component } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BackHandler } from "react-native";
import {
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Picker,
  Text,
  View,
  Linking,
  Platform,
} from "react-native";

import {
  CoreComponents,
  CoreConfig,
  metaHelpers,
} from "@pru-rt-internal/rnmobile-app-core-framework";

import ModalDropdown from "react-native-modal-dropdown";
import { connect } from "react-redux";
import { OfflineImage } from "react-native-image-offline";
import helpStyles from "./styles";
import styles from "../../common/styles";

const { CLOSE, EMAIL, SCREEN_KEY_HELP, COMMON_KEY_CROSS_ICON } = CoreConfig;
const helpers = metaHelpers;
const { Loader } = CoreComponents;

const KEY_DD_HEADER = "helpscreendropdownheader";
const KEY_EMAIL = "helpscreenemail";
const KEY_EMAIL_ID = "helpscreenemailid";
const KEY_CONTACT_DESCRIPTION = "helpscreencontactdescription";
const KEY_MAIL_BUTTON = "helpscreenmailusbutton";
const TYPE_DROP_DOWN_ITEM = "dropdownitem";
const KEY_FEEDBACK = "helpscreenfeedbackbutton";

class Help extends Component {
  constructor() {
    super();
    this.state = {
      value: "",
      content: "",
      heading: "",
      selectedDropDownOption: "",
    };

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick.bind(this)
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick.bind(this)
    );
  }

  handleBackButtonClick() {
    this.props.navigation.goBack();
    return true;
  }

  onSelectPicker(label) {
    const { meta } = this.props;
    if (meta != null && meta.metaDetail != null) {
      const helpScreen = helpers.findScreen(SCREEN_KEY_HELP);

      const key = helpers
        .findAllElementsByType(helpScreen, TYPE_DROP_DOWN_ITEM)
        .find(item => item.label === label).key;

      this.setState({ value: key });
      const elements = helpers.findAllElementsByType(
        helpScreen,
        TYPE_DROP_DOWN_ITEM
      );

      const selectedElement = elements.find(element => element.key === key);

      this.setState({
        content: selectedElement.description,
        heading: selectedElement.label,
        selectedDropDownOption: label,
      });
    }
  }

  onPressCloseButton() {
    this.props.navigation.goBack();
  }

  onPressMailButton() {
    const emailid = helpers.findElement(SCREEN_KEY_HELP, KEY_EMAIL_ID)
      .label;
    this.props.navigation.navigate("Feedback", {
      selectedDropDownOption: this.state.selectedDropDownOption,
    });
  }

  render() {
    const { meta } = this.props;
    if (meta != null && meta.metaDetail != null) {
      const helpScreen = helpers.findScreen(SCREEN_KEY_HELP);

      const dropDownOptions = helpers
        .findAllElementsByType(helpScreen, TYPE_DROP_DOWN_ITEM)
        .map(item => item.label);
      if (this.state.content === "") {
        this.onSelectPicker(dropDownOptions[0]);
      }
      return (
        <View contentContainerStyle={helpStyles.container}>
          <ScrollView style={helpStyles.scrollView}>
            <View>
              <TouchableOpacity
                onPress={() => this.handleBackButtonClick()}
                style={{ paddingHorizontal: 15, width: 60, height: 60 }}
              >
                <OfflineImage
                  fallbackSource={CLOSE}
                  accessibilityLabel="close"
                  accesible
                  key={COMMON_KEY_CROSS_ICON}
                  source={{
                    uri: helpers.findCommon(COMMON_KEY_CROSS_ICON).image,
                  }}
                  style={helpStyles.closeBtn}
                />
              </TouchableOpacity>
            </View>
            <View style={helpStyles.leftSpacing}>
              <Text
                style={[
                  helpStyles.Header,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    fontSize: 21.7,
                    fontFamily:
                      Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
                    marginTop: 10,
                  },
                ]}
              >
                {helpScreen.label}
              </Text>
              <Text
                style={[
                  helpStyles.Header,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    fontSize: 15,
                    fontFamily:
                      Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
                    marginLeft: 15,
                    marginTop: 30,
                  },
                ]}
              >
                {helpers.findElement(SCREEN_KEY_HELP, KEY_DD_HEADER).label}
              </Text>
              <View>
                <View style={{ justifyContent: "center" }}>
                  <View
                    style={[
                      helpStyles.dropbox,
                      { marginTop: 30, alignItems: "center" },
                    ]}
                  >
                    <ModalDropdown
                      textStyle={helpStyles.textStyle}
                      dropdownStyle={helpStyles.dropdownStyle}
                      dropdownTextStyle={helpStyles.dropdownTextStyle}
                      style={helpStyles.dropDownButton}
                      defaultValue={dropDownOptions[0]}
                      options={dropDownOptions}
                      onSelect={(index, key) => this.onSelectPicker(key)}
                    />
                    <View pointerEvents="none" style={helpStyles.dropDownIcon}>
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
            </View>
            <View style={{ marginLeft: 30, marginRight: 30 }}>
              <Text style={helpStyles.pickerHeading}>{this.state.heading}</Text>
              <Text style={helpStyles.pickerContent}>{this.state.content}</Text>
            </View>
            <View style={helpStyles.ruler} />
            <View
              style={{ flexDirection: "row", flex: 0.5, paddingHorizontal: 20 }}
            >
              <OfflineImage
                fallbackSource={EMAIL}
                accessibilityLabel="email"
                accesible
                key={KEY_EMAIL}
                source={{
                  uri: helpers.findElement(SCREEN_KEY_HELP, KEY_EMAIL)
                    .image,
                }}
                style={{ width: 40, marginTop: 15, height: 30 }}
              />

              <View style={{ flex: 1, marginTop: 10 }}>
                <Text style={[helpStyles.heading]}>
                  {helpers.findElement(SCREEN_KEY_HELP, KEY_EMAIL).label}
                </Text>
                <Text style={[helpStyles.mailId]}>
                  {
                    helpers.findElement(SCREEN_KEY_HELP, KEY_EMAIL_ID)
                      .label
                  }
                </Text>
                <Text style={helpStyles.description}>
                  {
                    helpers.findElement(
                      SCREEN_KEY_HELP,
                      KEY_CONTACT_DESCRIPTION
                    ).label
                  }
                </Text>
              </View>
            </View>
            <View style={helpStyles.leftSpacing}>
              <TouchableOpacity
                style={helpStyles.button}
                onPress={() => this.onPressMailButton()}
              >
                <Text style={helpStyles.buttonText}>
                  {
                    helpers.findElement(SCREEN_KEY_HELP, KEY_FEEDBACK)
                      .label
                  }
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );
    }
    return <Loader />;
  }
}

const mapStateToProps = state => ({
  meta: state.meta,
  refreshImage: state.meta.refreshImage,
});

export default connect(
  mapStateToProps,
  {}
)(Help);
