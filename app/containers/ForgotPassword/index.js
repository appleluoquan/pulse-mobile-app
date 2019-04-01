import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Keyboard,
} from "react-native";
import { connect } from "react-redux";
import { OfflineImage } from "react-native-image-offline";
import styles from "../../common/styles";
import {
  CoreComponents,
  CoreConfig,
  metaHelpers,
  CoreActions,
} from "@pru-rt-internal/rnmobile-app-core-framework";

const { AppButton, AppTextInput, Timer } = CoreComponents;
const {
  CLOSE,
  EMAIL_PATTERN,
  colors,
  ElementErrorManager,
  SCREEN_KEY_FORGOT_PASSWORD,
  COMMON_KEY_CROSS_ICON,
  SCREEN_KEY_CHAT_REPORT,
  SCREEN_KEY_EMAIL_OTP_VERIFICATION,
} = CoreConfig;
import fpstyles from "./styles";
const helpers = metaHelpers;
const {
  forgotPasswordGenerateOtp,
  forgotPasswordValidateOtp,
  forgotPasswordChangePassNav,
  forgotPasswordOtpNav,
} = CoreActions;
import CodeInput from "react-native-confirmation-code-field";

const KEY_SEND_OTP = "forgotpasswordsendotp";
const KEY_OK = "ok";
const ALERT_MESSAGE = "newpasswordsent";
const KEY_EMAIL = "email";
const KEY_SENT_OTP = "forgotpasswordsentotp";
const KEY_FORGOT_PASSWORD_OTP = "forgotPasswordOTP";
const KEY_FOOTER = "forgotPasswordFooter";
const KEY_HEADER_LABEL = "forgotpasswordheaderlabel";
const KEY_FORGET_PASSWORD_DESC = "forgotpassworddesc";
const KEY_FOOTER_RESEND_EMAIL_STEP_ONE_DESCRIPTION =
  "forgotPasswordFooterResendEmailStepOneDescription";
const KEY_VERIFY_OTP = "forgotPasswordVerifyOTP";
const ERROR_KEY_REQUIRED = "required";
const ERROR_KEY_NOT_VALID = "not_valid";
const KEY_RESEND_OTP = "resendotp";

let emailTemp = "";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleOtpFieldChange = this.handleOtpFieldChange.bind(this);
    this.userNotRegistered = this.userNotRegistered.bind(this);
    this.activateResend = this.activateResend.bind(this);
    this.state = {
      generateOtpLoading: false,
      isEmailSent: false,
      disable: false,
      btnTitle: helpers.findElement(SCREEN_KEY_FORGOT_PASSWORD, KEY_SEND_OTP)
        .label,
      emailError: "",
      emailHasError: false,
      otpError: "",
      otpHasError: false,
      validateOtpStatus: false,
      showResend: false,
      restartTimer: false,
    };
  }

  onSend() {
    const { email } = this.state;
    this.validate(email);
    this.setState({
      restartTimer: true,
      showResend: false,
    });
    Keyboard.dismiss();
  }

  onVerify() {
    const { otp } = this.state;
    this.validateOtp(otp);
    Keyboard.dismiss();
  }

  onResend() {
    const { meta } = this.props;
    if (meta != null && meta.metaDetail != null) {
      this.setState({
        otpHasError: false,
        otpError: "",
        otp: "",
        btnTitle: helpers.findElement(SCREEN_KEY_FORGOT_PASSWORD, KEY_SEND_OTP)
          .label,
        isEmailSent: false,
        disable: false,
      });
    }
  }

  showResend() {
    if (this.state.isEmailSent && !this.emailHasError) {
      const { meta } = this.props;
      if (meta != null && meta.metaDetail != null) {
        const forgotPasswordEnterEmail = helpers.findScreen(
          SCREEN_KEY_FORGOT_PASSWORD
        );
        return (
          <View
            style={[fpstyles.grayBox]}
            accessibilityLabel="grayBox"
            accesible
          >
            <Text style={fpstyles.grayBoxTitle}>
              {
                helpers.findElement(
                  SCREEN_KEY_FORGOT_PASSWORD,
                  KEY_FOOTER
                ).label
              }
            </Text>
            <Text style={fpstyles.grayBoxDescriptionTitle}>
              {/*
                helpers.findElement(
                  SCREEN_KEY_FORGOT_PASSWORD,
                  KEY_FOOTER_RESEND_EMAIL_STEP_ONE_HEADING,
                ).label
                */}
            </Text>
            <Text style={fpstyles.grayBoxContent}>
              {
                helpers.findElement(
                  SCREEN_KEY_FORGOT_PASSWORD,
                  KEY_FOOTER_RESEND_EMAIL_STEP_ONE_DESCRIPTION
                ).label
              }
            </Text>
          </View>
        );
      }
    }
    return <View />;
  }

  handleFieldChange(name, value) {
    this.setState({ [name]: value });
    const { email } = this.state;
  }

  handleOtpFieldChange(code) {
    this.setState({ otp: code });
    const { otp } = this.state;
  }

  validate(email) {
    const { meta } = this.props;
    const emailElement = helpers.findElement(
      SCREEN_KEY_FORGOT_PASSWORD,
      KEY_EMAIL
    );
    if (email === "" || typeof email === "undefined") {
      this.setState({
        emailError: helpers.findErrorMessage(emailElement, ERROR_KEY_REQUIRED)
          .message,
        emailHasError: true,
      });
    } else if (!EMAIL_PATTERN.test(email)) {
      this.setState({
        emailError: helpers.findErrorMessage(emailElement, ERROR_KEY_NOT_VALID)
          .message,
        emailHasError: true,
      });
    } else {
      this.setState({
        emailError: "",
        emailHasError: false,
        isEmailSent: true,
        generateOtpLoading: true,
        generateOtpErrorMessage: "",
        validateOtpErrorMessage: "",
      });
      emailTemp = email;
      forgotPasswordGenerateOtp(email, this.userNotRegistered)
        .then(workflowId => {
          this.setState({
            generateOtpLoading: false,
            generateOtpStatus: true,
            workflowId: workflowId,
          });
        })
        .catch(error => {
          //TODO show error message
          this.setState({
            generateOtpLoading: false,
            generateOtpStatus: false,
            validateOtpErrorMessage: error.message,
          });
        });
    }
  }
  userNotRegistered(userNotRegisteredMessage) {
    this.setState({
      generateOtpLoading: false,
      generateOtpStatus: false,
      // validateOtpErrorMessage: error.message,
    });
    const { meta } = this.props;
    const okMessage = helpers
      .findElement(SCREEN_KEY_CHAT_REPORT, KEY_OK)
      .label.toUpperCase();

    Alert.alert(
      "",
      userNotRegisteredMessage,
      [
        {
          text: okMessage,
          onPress: () => {
            // this.props.setNewPasswordModalVisible(false);
            // this.props.setForgotPasswordModalVisible(false);
            this.setState({
              generateOtpLoading: false,
              generateOtpStatus: false,
              disable: false,
              btnTitle: helpers.findElement(
                SCREEN_KEY_FORGOT_PASSWORD,
                KEY_SEND_OTP
              ).label,
            });
          },
        },
      ],
      { cancelable: false }
    );
  }

  validateOtp(otp) {
    const { meta } = this.props;
    if (meta != null && meta.metaDetail != null) {
      const errorMapper = helpers.findElement(
        SCREEN_KEY_FORGOT_PASSWORD,
        KEY_FORGOT_PASSWORD_OTP
      );
      if (otp === "" || typeof otp === "undefined") {
        this.setState({
          otpError: helpers.findErrorMessage(errorMapper, ERROR_KEY_REQUIRED)
            .message,
          otpHasError: true,
        });
      } else {
        this.setState({
          otpError: "",
          otpHasError: false,
          validateOtpLoading: true,
          generateOtpErrorMessage: "",
          validateOtpErrorMessage: "",
        });
        forgotPasswordValidateOtp(otp, this.state.workflowId)
          .then(response => {
            this.setState({
              forgotPasswordOtp: otp,
              validateOtpLoading: false,
              validateOtpStatus: true,
            });
            this.props.storeNewPasswordData({
              email: this.state.email,
              validateOtpStatus: true,
              workflowId: this.state.workflowId,
            });
            this.navigateToLoginScreen();
          })
          .catch(error => {
            //TODO show error && navigate to login
            this.setState({
              validateOtpLoading: false,
              validateOtpStatus: false,
              validateOtpErrorMessage: error.message,
              otpHasError: true,
            });
          });
      }
    }
  }
  navigateToLoginScreen() {
    const okMessage = helpers
      .findElement(SCREEN_KEY_CHAT_REPORT, KEY_OK)
      .label.toUpperCase();

    const alertMessage = helpers.findElement(
      SCREEN_KEY_FORGOT_PASSWORD,
      ALERT_MESSAGE
    ).label;

    Alert.alert(
      "",
      alertMessage,
      [
        {
          text: okMessage,
          onPress: () => {
            this.props.setNewPasswordModalVisible(false);
            this.props.setForgotPasswordModalVisible(false);
          },
        },
      ],
      { cancelable: false }
    );
  }

  showCode() {
    console.log("show resend", this.state.showResend);
    const { meta } = this.props;
    const { restartTimer } = this.state;
    if (
      this.state.btnTitle ===
      helpers.findElement(SCREEN_KEY_FORGOT_PASSWORD, KEY_SEND_OTP).label
    ) {
      this.setState({
        btnTitle: helpers.findElement(SCREEN_KEY_FORGOT_PASSWORD, KEY_SENT_OTP)
          .label,
        disable: true,
      });
    }

    const forgotPasswordEnterEmail = helpers.findScreen(
      SCREEN_KEY_FORGOT_PASSWORD
    );
    const resend = helpers.findElement(
      SCREEN_KEY_EMAIL_OTP_VERIFICATION,
      KEY_RESEND_OTP
    ).label;
    return (
      <View accessibilityLabel="code" accesible>
        <CodeInput
          inputPosition="full-width"
          variant="clear"
          size={50}
          activeColor={colors.nevada}
          inactiveColor={colors.nevada}
          onFulfill={code => this.handleOtpFieldChange(code)}
          containerStyle={styles.otpInputContainer}
          containerProps={this.containerProps}
          cellProps={this.cellProps}
          keyboardType="numeric"
          codeLength={6}
          ref="otp"
        />
        {this.state.otpHasError && (
          <View style={styles.errorPadding}>
            <Text style={{ color: colors.red }}>
              {this.getOtpErrorMessage()}
            </Text>
          </View>
        )}
        {!this.state.validateOtpLoading && (
          <AppButton
            type={[styles.btn, styles.primary, fpstyles.verify]}
            title={
              helpers.findElement(
                SCREEN_KEY_FORGOT_PASSWORD,
                KEY_VERIFY_OTP
              ).label
            }
            press={this.onVerify.bind(this)}
          />
        )}
        {this.state.validateOtpLoading && (
          <View>
            <ActivityIndicator size="large" color={colors.crimson} />
          </View>
        )}
        {this.state.showResend && (
          <View>
            <TouchableOpacity onPress={this.onSend.bind(this)}>
              <Text style={styles.resendText}>{resend}</Text>
            </TouchableOpacity>
          </View>
        )}
        {!this.state.showResend && (
          <Timer onFinish={this.activateResend} onRestart={restartTimer} />
        )}
      </View>
    );
  }

  getEmailErrorMessage() {
    const { emailError } = this.state;
    const { generateOtpErrorMessage } = this.state; //SJ

    if (emailError !== "" && emailError !== null) {
      return emailError;
    } else if (
      generateOtpErrorMessage !== "" &&
      generateOtpErrorMessage !== null
    ) {
      return generateOtpErrorMessage;
    }

    return "";
  }

  getOtpErrorMessage() {
    const { otpError } = this.state;
    const { validateOtpErrorMessage } = this.state; //SJ

    if (otpError !== "" && otpError !== null) {
      return otpError;
    } else if (
      validateOtpErrorMessage !== "" &&
      validateOtpErrorMessage !== null
    ) {
      return validateOtpErrorMessage;
    }
    return "";
  }

  activateResend() {
    this.setState({
      showResend: true,
    });
  }
  render() {
    const { meta } = this.props;
    const forgotPasswordEnterEmail = helpers.findScreen(
      SCREEN_KEY_FORGOT_PASSWORD
    );
    ElementErrorManager.setCurrentScreen(SCREEN_KEY_FORGOT_PASSWORD);
    return (
      <ScrollView
        style={[styles.whiteBackground, { flex: 1 }]}
        accessibilityLabel="container"
        accesible
        keyboardShouldPersistTaps="always"
      >
        <View
          style={fpstyles.fpContainer}
          accessibilityLabel="wrapper"
          accesible
        >
          <TouchableOpacity
            onPress={() => this.props.setForgotPasswordModalVisible(false)}
            style={fpstyles.login}
            accessibilityLabel="loginBtn"
            accesible
          >
            <OfflineImage
              fallbackSource={CLOSE}
              accessibilityLabel="close"
              accesible
              key={COMMON_KEY_CROSS_ICON}
              source={{
                uri: helpers.findCommon(COMMON_KEY_CROSS_ICON).image,
              }}
              style={fpstyles.forgotcloseBtn}
            />
          </TouchableOpacity>
          <View style={fpstyles.contentView}>
            <Text
              style={fpstyles.screenTitle}
              accessibilityLabel="screenTitle"
              accesible
            >
              {
                helpers.findElement(
                  SCREEN_KEY_FORGOT_PASSWORD,
                  KEY_HEADER_LABEL
                ).label
              }
            </Text>
            <Text
              style={styles.screenDescription}
              accessibilityLabel="screenDescription"
              accesible
            >
              {
                helpers.findElement(
                  SCREEN_KEY_FORGOT_PASSWORD,
                  KEY_FORGET_PASSWORD_DESC
                ).label
              }
            </Text>
            <AppTextInput
              inline
              keyboardType="email-address"
              label={
                helpers.findElement(
                  SCREEN_KEY_FORGOT_PASSWORD,
                  KEY_EMAIL
                ).label
              }
              name="email"
              hasError={this.state.emailHasError}
              errorMsg={this.getEmailErrorMessage()}
              onChange={this.handleFieldChange}
              value={this.state.email}
            />
            {!this.state.generateOtpLoading && (
              <AppButton
                disable={this.state.disable}
                type={[styles.btn, styles.primary, fpstyles.verify]}
                title={this.state.btnTitle}
                press={this.onSend.bind(this)}
              />
            )}
            {this.state.generateOtpLoading && (
              <View>
                <ActivityIndicator size="large" color={colors.crimson} />
              </View>
            )}
            {this.state.generateOtpStatus && this.showCode()}
          </View>
          {this.showResend()}
        </View>
        {/* {this.state.validateOtpStatus &&
          Alert.alert(
            "",
            "The new password has been sent to your registered email",
            [
              {
                text: helpers
                  .findElement(
                    meta.metaDetail.screens,
                    SCREEN_KEY_CHAT_REPORT,
                    KEY_OK
                  )
                  .label.toUpperCase(),
                onPress: () => {
                  setTimeout(() => {
                    this.props.setForgotPasswordModalVisible(false);
                  }, 300);
                },
              },
            ],
            { cancelable: false }
          )
          this.props.setForgotPasswordModalVisible(false);
          } */}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  meta: state.meta,
});

export default connect(
  mapStateToProps,
  {
    forgotPasswordValidateOtp,
    forgotPasswordChangePassNav,
    forgotPasswordOtpNav,
  }
)(ForgotPassword);
