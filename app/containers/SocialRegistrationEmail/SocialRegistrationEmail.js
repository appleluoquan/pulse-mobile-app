import React, { Component } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { connect } from "react-redux";
import { OfflineImage } from "react-native-image-offline";

import {
  CoreComponents,
  CoreConfig,
  metaHelpers,
  CoreActions,
} from "@pru-rt-internal/rnmobile-app-core-framework";

const { AppButton, AppTextInput } = CoreComponents;
import styles from "../../common/styles";
const {
  CLOSE,
  COMMON_KEY_CROSS_ICON,
  SCREEN_KEY_EMAIL_REGISTER_EMAIL,
  SCREEN_KEY_REGISTER,
} = CoreConfig;
import srestyles from "./styles";
const helpers = metaHelpers;
const { resumeSocialLogin, validateEmail } = CoreActions;
import { pathOr } from "ramda";
const { ElementErrorManager } = CoreConfig;

const KEY_PROVIDE_EMAIL = "provideemail";
const KEY_REASON = "reason";
const KEY_NEXT = "next";

export class SocialRegistrationEmail extends Component {
  constructor(props) {
    super(props);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.state = {};
  }

  onSend() {
    const { email } = this.state;
    this.validate(email);
  }

  handleFieldChange(name, value) {
    this.setState({ [name]: value });
  }

  validate(email) {
    const emailError = validateEmail(email);
    this.setState({
      emailError,
    });
    if (!emailError) {
      const { navigation } = this.props;
      const paramsData = pathOr({}, ["state", "params", "paramsData"], navigation);
      this.props.resumeSocialLogin({
        email,
        ...paramsData,
      });
      this.goToRegister();
    }
  }

  getEmailErrorMessage() {
    const { emailError } = this.state;
    return emailError || "";
  }

  goToRegister() {
    this.props.navigation.navigate("EmailRegister");
  }

  goBack() {
    this.props.navigation.goBack();
  }

  render() {
    const provideEmail = helpers.findElement(
      SCREEN_KEY_EMAIL_REGISTER_EMAIL,
      KEY_PROVIDE_EMAIL
    ).label;
    const reason = helpers.findElement(
      SCREEN_KEY_EMAIL_REGISTER_EMAIL,
      KEY_REASON
    ).label;
    const nextLabel = helpers.findElement(
      SCREEN_KEY_EMAIL_REGISTER_EMAIL,
      KEY_NEXT
    ).label;
    ElementErrorManager.setCurrentScreen(SCREEN_KEY_REGISTER);
    return (
      <ScrollView
        style={styles.whiteBackground}
        accessibilityLabel="container"
        accesible
      >
        <View style={styles.wrapper} accessibilityLabel="wrapper" accesible>
          <TouchableOpacity
            onPress={() => this.goBack()}
            style={srestyles.login}
            accessibilityLabel="loginBtn"
            accesible
          >
            <OfflineImage
              fallbackSource={CLOSE}
              accessibilityLabel="close"
              accesible
              key={COMMON_KEY_CROSS_ICON}
              source={{
                uri: "",
              }}
              style={styles.closeBtn}
            />
          </TouchableOpacity>
          <Text
            style={styles.screenTitle}
            accessibilityLabel="screenTitle"
            accesible
          >
            {provideEmail}
          </Text>
          <Text
            style={styles.screenDescription}
            accessibilityLabel="screenDescription"
            accesible
          >
            {reason}
          </Text>
          <AppTextInput
            keyboardType="email-address"
            inline
            label="Email"
            name="email"
            hasError={this.state.emailHasError}
            errorMsg={this.getEmailErrorMessage()}
            onChange={this.handleFieldChange}
            value={this.state.email}
          />
          <AppButton
            disable={this.state.disable}
            type={[styles.btn, styles.primary]}
            title={nextLabel}
            press={this.onSend.bind(this)}
          />
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  meta: state.meta,
});

const mapDispatchToProps = {
  resumeSocialLogin,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SocialRegistrationEmail);
