import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Keyboard,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import {
  CoreComponents,
  CoreConfig,
  CoreUtils,
  CoreActions,
  metaHelpers,
  CoreConstants,
} from "@pru-rt-internal/rnmobile-app-core-framework";
import { BabylonComponents } from "@pru-rt-internal/react-native-babylon-chatbot";
import { connect } from "react-redux";
import { OfflineImage } from "react-native-image-offline";
import styles from "../../common/styles";
import VerifyContent from "./VerifyContent";
import * as images from "../../config";
import registrationStyles from "./styles";
import { is } from "ramda";

const { Languages } = BabylonComponents;
const { isNilOrEmpty } = CoreUtils;
const {
  AppButton,
  PopUp,
  AppTextInput,
  OrDivider,
  SocialLogin,
  TermsAndPrivacy,
} = CoreComponents;
const {
  registerEmailChanged,
  registerPasswordChanged,
  openTermsAndConditions,
  openPrivacyPolicy,
  hideTermsAndConditions,
  hidePrivacyPolicy,
  registerUser,
  closeVerifyEmailFromUI,
} = CoreActions;

const helpers = metaHelpers;

const {
  ElementErrorManager,
  SCREEN_KEY_REGISTER,
  SCREEN_KEY_EMAIL_OTP_VERIFICATION,
  COMMON_KEY_APP_LOGO,
  colors,
} = CoreConfig;

const {
  EMAIL_ID_REQUIRED,
  INVALID_EMAIL_ID,
  INVALID_PASSWORD,
  PASSWORD_MATCH_CRITERIA_UNMET,
  EMAIL_ID_ALREADY_EXISTS,
  PASSWORD_REQUIRED,
} = CoreConstants;

//TODO - MOCK. Replace with v2 API call data from redux

const KEY_REGISTER = "registerbutton";
const KEY_EMAIL = "email";
const KEY_PASSWORD = "password";
const KEY_LOGIN = "loginlabel";
const ALREADY_HAVE_AN_ACCOUNT = "already_have_an_account";
const CONNECT_WITH_FB = "connectFb";
const CONNECT_WITH_GOOGLE = "connectGoogle";
const KEY_OTP_VERIFICATION_LABEL = "emailverificationheaderlabel";
const ERROR_KEY_EMAIL_REQUIRED = "required";
const ERROR_KEY_INVALID_EMAIL_ID = "not_valid";
const ERROR_KEY_EMAIL_ALREADY_EXISTS = "already_exists";
const ERROR_KEY_PASSWORD_REQUIRED = "required";
const ERROR_KEY_INVALID_PASSWORD = "not_valid";
const ERROR_KEY_PASSWORD_CRITERIA_MISMATCH = "match_criteria";

class EmailRegister extends Component {
  constructor(props) {
    super(props);
    this.onCloseVarifyEmail = this.onCloseVarifyEmail.bind(this);
    this.state = {
      email: this.props.email,
      password: "",
    };
  }

  getErrorMsg(errorKey) {
    switch (errorKey) {
      case EMAIL_ID_REQUIRED:
        return helpers.findErrorMessage(
          helpers.findElement(SCREEN_KEY_REGISTER, KEY_EMAIL),
          ERROR_KEY_EMAIL_REQUIRED
        ).message;
      case INVALID_EMAIL_ID:
        return helpers.findErrorMessage(
          helpers.findElement(SCREEN_KEY_REGISTER, KEY_EMAIL),
          ERROR_KEY_INVALID_EMAIL_ID
        ).message;
      case EMAIL_ID_ALREADY_EXISTS:
        return helpers.findErrorMessage(
          helpers.findElement(SCREEN_KEY_REGISTER, KEY_EMAIL),
          ERROR_KEY_EMAIL_ALREADY_EXISTS
        ).message;

      case PASSWORD_REQUIRED:
        return helpers.findErrorMessage(
          helpers.findElement(SCREEN_KEY_REGISTER, KEY_PASSWORD),
          ERROR_KEY_PASSWORD_REQUIRED
        ).message;

      case INVALID_PASSWORD:
        return helpers.findErrorMessage(
          helpers.findElement(SCREEN_KEY_REGISTER, KEY_PASSWORD),
          ERROR_KEY_INVALID_PASSWORD
        ).message;

      case PASSWORD_MATCH_CRITERIA_UNMET:
        return helpers.findErrorMessage(
          helpers.findElement(SCREEN_KEY_REGISTER, KEY_PASSWORD),
          ERROR_KEY_PASSWORD_CRITERIA_MISMATCH
        ).message;
      default:
        return "";
    }
  }

  onEmailChange(name, email) {
    // this.props.emailChanged(email);
    this.setState({
      email,
    });
  }

  onPasswordChange(name, password) {
    // this.props.passwordChanged(password);
    this.setState({
      password,
    });
  }

  onRegister() {
    const { email, password } = this.state;
    this.props.registerUser({ email, password });
    Keyboard.dismiss();
  }

  termsVisibility() {
    this.props.openTermsAndConditions();
  }

  privacyVisibility() {
    this.props.openPrivacyPolicy();
  }

  hidePopUp() {
    this.props.hideTermsAndConditions();
    this.props.hidePrivacyPolicy();
  }

  onCloseVarifyEmail() {
    this.props.closeVerifyEmailFromUI();
  }

  popUps() {
    return (
      <TermsAndPrivacy
        showTerms={this.props.terms}
        showPrivacy={this.props.privacy}
        {...this.props}
        hidePopUp={() => this.hidePopUp()}
      />
    );
  }

  navigate(page) {
    this.props.navigation.replace(page);
  }

  verifyContent(email) {
    return (
      <VerifyContent
        email={email}
        changeVisibility={() => this.props.closeVerifyEmailFromUI()}
      />
    );
  }

  emailVerify() {
    const email = this.state.email;
    return (
      <PopUp
        show={this.props.verifyEmail}
        changeVisibility={() => this.props.closeVerifyEmailFromUI()}
        title={
          helpers.findElement(
            SCREEN_KEY_EMAIL_OTP_VERIFICATION,
            KEY_OTP_VERIFICATION_LABEL
          ).label
        }
        content={this.verifyContent(email)}
      />
    );
  }

  render() {
    const registerScreen = helpers.findScreen(SCREEN_KEY_REGISTER);
    ElementErrorManager.setCurrentScreen(SCREEN_KEY_REGISTER);
    console.log("EmailRegisterProps", this.props);
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          accessibilityLabel="container"
          accessible
          style={styles.container}
        >
          <View style={registrationStyles.subContainer1}>
            <View style={styles.topOptions}>
              <Languages
                accessible
                style={{ fontSize: 15.3 }}
                accessibilityLabel="langContainer"
                testID="langContainer"
                indicateColor="#6b6a6d"
                navigate={() => this.navigateToSplash()}
              />
            </View>
            <OfflineImage
              accessibilityLabel="logo"
              accesible
              resizeMode={Platform.OS === "ios" ? "contain" : "contain"}
              key={COMMON_KEY_APP_LOGO}
              style={[registrationStyles.brandImage]}
              fallbackSource={images.PRU_HEART}
              source={{
                uri: helpers.findCommon(COMMON_KEY_APP_LOGO).image,
              }}
            />
          </View>
          <View style={registrationStyles.subContainer2}>
            <AppTextInput
              onChange={this.onEmailChange.bind(this)}
              value={this.state.email}
              name="email"
              inline
              keyboardType="email-address"
              label={helpers.findElement(SCREEN_KEY_REGISTER, KEY_EMAIL).label}
              hasError={!isNilOrEmpty(this.props.emailError)}
              errorMsg={this.getErrorMsg(this.props.emailError)}
            />
            <AppTextInput
              onChange={this.onPasswordChange.bind(this)}
              name="password"
              inline
              secureText
              style={{ marginBottom: 0 }}
              label={
                helpers.findElement(SCREEN_KEY_REGISTER, KEY_PASSWORD).label
              }
              value={this.state.password}
              hasError={!isNilOrEmpty(this.props.passwordError)}
              errorMsg={this.getErrorMsg(this.props.passwordError)}
            />
            <Text style={styles.passType}>
              {helpers.findPolicy(registerScreen, "password").policy.message}
            </Text>

            {this.props.loading && (
              <View>
                <ActivityIndicator size="large" color={colors.crimson} />
              </View>
            )}
            {this.props.error && is(String, this.props.error) && (
              <View style={registrationStyles.errorPadding}>
                <Text style={registrationStyles.errorText}>
                  {this.props.error}
                </Text>
              </View>
            )}
          </View>
          <View style={registrationStyles.subContainer3}>
            {!this.props.loading && (
              <AppButton
                type={[styles.btn, styles.primary]}
                title={
                  helpers.findElement(SCREEN_KEY_REGISTER, KEY_REGISTER).label
                }
                press={this.onRegister.bind(this)}
              />
            )}
            {!this.props.verifyEmail && (
              <View>
                <OrDivider style={registrationStyles.orDivider} />
                <SocialLogin
                  fbText={helpers.findCommon(CONNECT_WITH_FB).label}
                  gmailText={helpers.findCommon(CONNECT_WITH_GOOGLE).label}
                  {...this.props}
                />
              </View>
            )}
            <View style={registrationStyles.registerContainer}>
              <Text style={registrationStyles.newText}>
                {
                  helpers.findElement(
                    SCREEN_KEY_REGISTER,
                    ALREADY_HAVE_AN_ACCOUNT
                  ).label
                }
              </Text>
              <TouchableOpacity
                hitSlop={{ top: 20, left: 0, bottom: 20, right: 0 }}
                onPress={() => {
                  this.navigate("Login");
                }}
                style={registrationStyles.headerButton}
                accessibilityLabel="loginBtn"
                accesible
              >
                <View style={registrationStyles.regBtnTextStyle}>
                  <Text
                    accessibilityLabel="registerText"
                    accesible
                    style={[
                      styles.rightText,
                      registrationStyles.emailRegisterText,
                      registrationStyles.headerButtonText,
                    ]}
                  >
                    {helpers
                      .findElement(SCREEN_KEY_REGISTER, KEY_LOGIN)
                      .label.toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {this.emailVerify()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => ({
  email: state.register.email,
  emailError: state.register.emailError,
  error: state.register.error,
  loading: state.register.loading,
  password: state.register.password,
  passwordError: state.register.passwordError,
  privacy: state.trigger.openPrivacy,
  terms: state.trigger.openTerms,
  verifyEmail: state.register.verifyEmail,
});

export default connect(
  mapStateToProps,
  {
    closeVerifyEmailFromUI,
    emailChanged: registerEmailChanged,
    hidePrivacyPolicy,
    hideTermsAndConditions,
    openPrivacyPolicy,
    openTermsAndConditions,
    passwordChanged: registerPasswordChanged,
    registerUser,
  }
)(EmailRegister);
