import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  BackHandler,
} from "react-native";

import {
  CoreComponents,
  CoreConfig,
  metaHelpers,
} from "@pru-rt-internal/rnmobile-app-core-framework";

import styles from "./styles";

const helpers = metaHelpers;
const { ElementErrorManager, SCREEN_KEY_ACCOUNT } = CoreConfig;
const { Header } = CoreComponents;

const KEY_SUBTITLE = "currentsetting";
const KEY_CONNECTED = "youareconnected";
const KEY_EMAIL = "email";
const KEY_PASSWORD = "password";
const KEY_CHANGE_PASSWORD = "changepassword";

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "email",
    };
    this.onChangePassword = this.onChangePassword.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
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

  onChangePassword() {
    const { navigation } = this.props;
    navigation.navigate("ChangePassword");
  }

  settings() {
    const accountScreen = helpers.findScreen(SCREEN_KEY_ACCOUNT);
    const title = accountScreen.label;
    const subTitle = helpers.findElement(SCREEN_KEY_ACCOUNT, KEY_SUBTITLE)
      .label;
    const connected = helpers.findElement(SCREEN_KEY_ACCOUNT, KEY_CONNECTED)
      .label;
    const email = helpers.findElement(SCREEN_KEY_ACCOUNT, KEY_EMAIL).label;
    const password = helpers.findElement(SCREEN_KEY_ACCOUNT, KEY_PASSWORD)
      .label;
    const changePassword = helpers.findElement(
      SCREEN_KEY_ACCOUNT,
      KEY_CHANGE_PASSWORD
    ).label;
    return (
      <View style={styles.contentView}>
        <Text style={styles.title}>{title}</Text>
        <View>
          <Text style={styles.subTitle}>{subTitle}</Text>
          <View style={styles.firstContainer}>
            <Image
              source={require("../../images/green_tick.png")}
              style={styles.imageStyle}
            />
            <Text style={styles.label}>
              {connected}
              {this.props.isSocialLoggedIn
                ? ` ${this.props.socialLoginType
                    .split("_")
                    .pop()
                    .toLowerCase()}`
                : ` ${email.toLowerCase()}`}
            </Text>
          </View>
          {!this.props.isSocialLoggedIn && (
            <View style={styles.changePassContainer}>
              <View style={{ flexDirection: "row" }}>
                <Text style={[styles.label, styles.changePassLabel]}>
                  {email}
                </Text>
                <Text style={styles.label}>{this.props.email}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={[styles.label, styles.changePassLabel]}>
                  {password}
                </Text>
                <TextInput
                  editable={false}
                  style={styles.passwordLabel}
                  secureTextEntry
                  underlineColorAndroid="rgba(0,0,0,0)"
                  value="Test12345"
                />
              </View>
              <Text
                style={[styles.label, styles.actionButton]}
                onPress={e => {
                  e.preventDefault();
                  this.onChangePassword();
                }}
              >
                {changePassword}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  render() {
    ElementErrorManager.setCurrentScreen(SCREEN_KEY_ACCOUNT);
    return (
      <ScrollView style={styles.container}>
        <Header
          leftIconType="back"
          onLeftPress={e => {
            e.preventDefault();
            this.props.navigation.goBack();
          }}
          onRightPress={() => console.log("Right button pressed")}
          showRightIcon={false}
        />
        {this.settings()}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  meta: state.meta,
  email: state.auth.email,
  password: state.auth.password,
  sessionId: state.auth.token,
  socialLoginType: state.account.socialAccessType,
  isSocialLoggedIn: state.account.isSocialLoggedIn,
});

export default connect(
  mapStateToProps,
  {}
)(Account);
