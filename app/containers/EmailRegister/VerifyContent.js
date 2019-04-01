import React, { Component } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Keyboard,
  TouchableOpacity,
} from "react-native";

import {
  CoreConfig,
  metaHelpers,
  CoreActions,
  CoreComponents,
} from "@pru-rt-internal/rnmobile-app-core-framework";
import CodeInput from "react-native-confirmation-code-field";
import Toast from "react-native-root-toast";
import styles from "./styles";
const { Button, Timer } = CoreComponents;
import { connect } from "react-redux";

const { colors, SCREEN_KEY_EMAIL_OTP_VERIFICATION } = CoreConfig;
const helpers = metaHelpers;
const { verifyOtp, resendOtp, updateOtp } = CoreActions;
const { ElementErrorManager } = CoreConfig;
const KEY_CODE = "emailverificationotp";
const KEY_VERIFY_MSG = "emailverificationheaderdesc";
const KEY_VERIFY_MSG_2 = "emailverificationheaderdescret";
const KEY_VERIFY_OTP = "verifyemailverificaitonotp";
const KEY_LOADING_MSG = "emailverificationloadingmsg";
const KEY_FOOTER_TITLE = "emailotpverificationFooterTitle";
const KEY_STEP1_DESCRIPTION =
  "emailotpverificationFooterResendEmailStepOneDescription";
const ERROR_KEY_REQUIRED = "required";
const KEY_RESEND_ACTIVATION_CODE = "resendactivationcode";
class VerifyContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      showResend: false,
      restartTimer: false,
    };
    this.requestResendOtp = this.requestResendOtp.bind(this);
    this.activateResend = this.activateResend.bind(this);
  }
  componentWillUnmount() {
    const { updateOtp } = this.props;
    updateOtp("");
  }

  loadingMsg() {
    const { otpVerified } = this.props;
    return otpVerified ? (
      <View style={styles.mg_10}>
        <Text style={styles.loading}>
          {
            helpers.findElement(
              SCREEN_KEY_EMAIL_OTP_VERIFICATION,
              KEY_LOADING_MSG
            ).label
          }
        </Text>
        <View style={styles.flx_rw}>
          <Text style={[styles.dot, { backgroundColor: colors.crimson }]} />
          <Text style={styles.dot} />
          <Text style={styles.dot} />
          <Text style={styles.dot} />
        </View>
      </View>
    ) : null;
  }

  onChangeOtp(otpValue) {
    const { updateOtp } = this.props;
    updateOtp(otpValue);
  }

  verify() {
    Keyboard.dismiss();
    const { verifyOtp, workflowId, otp } = this.props;
    const otpElement = helpers.findElement(
      SCREEN_KEY_EMAIL_OTP_VERIFICATION,
      KEY_CODE
    );
    const otpRequired = helpers.findErrorMessage(otpElement, ERROR_KEY_REQUIRED)
      .message;
    this.setState({
      error: null,
    });

    if (otp) {
      verifyOtp(workflowId, otp).then(({ error }) => {
        if (error) {
          this.setState({
            error,
          });
        }
      });
    } else {
      this.setState({
        error: otpRequired,
      });
    }
  }

  requestResendOtp() {
    const { workflowId, resendOtp } = this.props;
    resendOtp(workflowId);
    this.setState({
      restartTimer: true,
      showResend: false,
    });
  }

  activateResend() {
    this.setState({
      showResend: true,
    });
  }

  renderToast = () => {
    //TODO: remove hardcoded once metaupdate
    const { meta, userVerified } = this.props;
    if (userVerified) {
      return (
        <Toast
          visible={userVerified}
          duration={1000}
          position={-50}
          shadow={false}
          animation={true}
          hideOnPress={true}
          textColor={colors.white}
          backgroundColor={colors.silver}
          opacity={1.0}
          onHide={() => {
            this.setState({ toastVisible: false });
          }}
        >
          Successfully Verified
        </Toast>
      );
    }
    return null;
  };

  render() {
    const { loading, userVerified } = this.props;
    const { restartTimer, error, showResend } = this.state;
    const otpVerificationScreen = helpers.findScreen(
      SCREEN_KEY_EMAIL_OTP_VERIFICATION
    );
    ElementErrorManager.setCurrentScreen(SCREEN_KEY_EMAIL_OTP_VERIFICATION);
    const resend = helpers.findElement(
      SCREEN_KEY_EMAIL_OTP_VERIFICATION,
      KEY_RESEND_ACTIVATION_CODE
    ).label;
    return (
      <ScrollView
        style={styles.VerifyContainer}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.VerifyContent}>
          <Text style={styles.msgSent}>
            {
              helpers.findElement(
                SCREEN_KEY_EMAIL_OTP_VERIFICATION,
                KEY_VERIFY_MSG
              ).label
            }

            <Text style={styles.emailText}>{this.props.email}.</Text>
            <Text style={styles.msgSent}>
              {
                helpers.findElement(
                  SCREEN_KEY_EMAIL_OTP_VERIFICATION,
                  KEY_VERIFY_MSG_2
                ).label
              }
            </Text>
          </Text>
          <View style={styles.inputView}>
            <Text style={styles.label}>
              {
                helpers.findElement(SCREEN_KEY_EMAIL_OTP_VERIFICATION, KEY_CODE)
                  .label
              }
            </Text>
            <CodeInput
              inputPosition="full-width"
              variant="clear"
              size={50}
              activeColor={colors.nevada}
              inactiveColor={colors.nevada}
              onFulfill={code => this.onChangeOtp(code)}
              containerStyle={styles.otpInputContainer}
              containerProps={this.containerProps}
              cellProps={this.cellProps}
              keyboardType="numeric"
              codeLength={6}
              ref="otp"
            />
          </View>
          {!loading && (
            <Button
              text={
                helpers.findElement(
                  SCREEN_KEY_EMAIL_OTP_VERIFICATION,
                  KEY_VERIFY_OTP
                ).label
              }
              disabled={userVerified ? true : false}
              wrapper={[styles.register, { opacity: 1 }]}
              style={styles.registerText}
              onClick={() => this.verify()}
            />
          )}
          {loading && (
            <View>
              <ActivityIndicator size="large" color={colors.crimson} />
            </View>
          )}
          {this.loadingMsg()}
          {error !== "" && (
            <View style={styles.errorPadding}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
        {showResend && (
          <View>
            <TouchableOpacity onPress={this.requestResendOtp}>
              <Text style={styles.resendText}>{resend}</Text>
            </TouchableOpacity>
          </View>
        )}
        {!showResend && (
          <Timer onFinish={this.activateResend} onRestart={restartTimer} />
        )}
        <View style={styles.warn}>
          <Text style={styles.footerTitle}>
            {
              helpers.findElement(
                SCREEN_KEY_EMAIL_OTP_VERIFICATION,
                KEY_FOOTER_TITLE
              ).label
            }
          </Text>
          <Text style={styles.allMsg}>
            {
              helpers.findElement(
                SCREEN_KEY_EMAIL_OTP_VERIFICATION,
                KEY_STEP1_DESCRIPTION
              ).label
            }
          </Text>
        </View>
        {this.renderToast()}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  accountEmail: state.account.email,
  firstName: state.account.firstName,
  isLoggedIn: state.auth.isLoggedIn,
  isRegistered: state.register.isRegistered,
  isSocialLoggedIn: state.account.isSocialLoggedIn,
  lastName: state.account.lastName,
  loading: state.auth.loading,
  meta: state.meta,
  otp: state.register.otp,
  otpVerified: state.register.otpVerified,
  userVerified: state.register.userVerified,
  profilePic: state.account.profilePic,
  profilePicData: state.account.profilePicData,
  socialAccessType: state.account.socialAccessType,
  socialEmailReturned: state.account.socialEmailReturned,
  socialLoginID: state.account.socialLoginID,
  workflowId: state.register.workflowId,
});

export default connect(
  mapStateToProps,
  {
    updateOtp,
    verifyOtp,
    resendOtp,
  }
)(VerifyContent);
