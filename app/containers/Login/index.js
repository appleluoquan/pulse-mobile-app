import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
} from "react-native";

import {
  CoreComponents,
  CoreConstants,
  CoreConfig,
  CoreUtils,
  CoreActions,
  CoreServices,
  metaHelpers,
} from "@pru-rt-internal/rnmobile-app-core-framework";
import { BabylonComponents } from "@pru-rt-internal/react-native-babylon-chatbot";

import { connect } from "react-redux";
import { OfflineImage } from "react-native-image-offline";
import styles from "../../common/styles";
import loginStyles from "./styles";
import { NavigationActions, StackActions } from "react-navigation";
import TouchID from "react-native-touch-id";
import ForgotPassword from "../ForgotPassword";
import NewPassword from "../NewPassword";
import OpenSettings from "react-native-open-settings";
import { PRU_HEART } from "../../config/images";

const { AppButton, AppTextInput, OrDivider, SocialLogin } = CoreComponents;
const { Languages } = BabylonComponents;
const { NavigationService } = CoreServices;
const {
  handleTouchLogin,
  loginUser,
  dispatchForgotPasswordDetailsReset,
  authEmailChanged,
  authPasswordChanged,
} = CoreActions;
const {
  SCREEN_KEY_LOGIN,
  COMMON_KEY_APP_LOGO,
  SCREEN_KEY_MANAGE_PROFILE,
  KEY_FINGER_PRINT_NOT_ENROLLED,
  SCREEN_KEY_CHAT_REPORT,
  ElementErrorManager,
  colors,
} = CoreConfig;
const {
  EMAIL_ID_REQUIRED,
  INVALID_EMAIL_ID,
  INVALID_PASSWORD,
  PASSWORD_MATCH_CRITERIA_UNMET,
  NOT_ENROLLED,
  TOUCH_ID_NOT_ENROLLED,
  PASSWORD_REQUIRED,
} = CoreConstants;

const { isNilOrEmpty } = CoreUtils;
const helpers = metaHelpers;
const KEY_REGISTER = "registerlabel";
const DONT_HAVE_AN_ACCOUNT = "dont_have_an_account";
const LOGIN_WITH_FB = "loginFb";
const LOGIN_WITH_GOOGLE = "loginGoogle";
const KEY_EMAIL = "email";
const KEY_PASSWORD = "password";
const KEY_FORGOT_PASSWORD = "forgotpasswordLabel";
const KEY_LOGIN = "loginbutton";
const ERROR_KEY_EMAIL_REQUIRED = "required";
const ERROR_KEY_INVALID_EMAIL_ID = "not_valid";
const ERROR_KEY_PASSWORD_REQUIRED = "required";
const ERROR_KEY_PASSWORD_CRITERIA_MISMATCH = "match_criteria";
const KEY_FINGERPRINT_LOGIN_TITLE = "fingerprintlogintitlelabel";
const KEY_FINGERPRINT_TOUCH_ID_LABEL = "fingerprintusetouchidlabel";
const KEY_FINGERPRINT_AUTH_FAILED_LABEL = "fingerprintauthorizefailedlabel";
const KEY_FINGERPRINT_CANCEL_LABEL = "fingerprintcancellabel";
const KEY_FINGERPRINT_DETAILED_MESSAGE = "fingerprintdetailedmessagelabel";
const KEY_FINGER_PRINT_ERROR_MESSAGE =
  "fingerprintaddfingerprintconventionalloginlabel";
const KEY_OK = "ok";
const KEY_CANCEL = "cancel";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginInProgress: false,
      emailError: null,
      passwordError: null,
      error: null,
      showForgotPasswordModal: false,
      showNewPasswordModal: false,
      newPasswordData: {},
      isFingerPrintSupported: false,
    };
    this.handleForgotPasswordFlow = this.handleForgotPasswordFlow.bind(this);
  }

  componentWillMount() {
    this.props.dispatchForgotPasswordDetailsReset();
  }

  componentDidMount() {
    this.updateFingerprintSupport();
  }

  updateFingerprintSupport = async () => {
    const optionalConfigObject = {
      unifiedErrors: false, // use unified error messages (default false)
    };
    TouchID.isSupported(optionalConfigObject)
      .then(biometryType => {
        if (biometryType !== "FaceID") {
          this.setState({
            isFingerPrintSupported: true,
          });
        }
      })
      .catch(error => {
        if (
          error.code === NOT_ENROLLED ||
          error.name == TOUCH_ID_NOT_ENROLLED
        ) {
          this.setState({
            isFingerPrintSupported: true,
          });
        } else {
          this.setState({ isFingerPrintSupported: false });
        }
      });
  };

  showFingerPrintErrorAlert() {
    const errorText = helpers.findElement(
      SCREEN_KEY_LOGIN,
      KEY_FINGER_PRINT_ERROR_MESSAGE
    ).label;
    Alert.alert("Fingerprint Error", errorText);
  }

  handleFingerprintAuthentication = () => {
    const loginLable = helpers.findElement(
      SCREEN_KEY_LOGIN,
      KEY_FINGERPRINT_LOGIN_TITLE
    ).label;
    const useTouchIdLabel = helpers.findElement(
      SCREEN_KEY_LOGIN,
      KEY_FINGERPRINT_TOUCH_ID_LABEL
    ).label;
    const authorizeFailedLabel = helpers.findElement(
      SCREEN_KEY_LOGIN,
      KEY_FINGERPRINT_AUTH_FAILED_LABEL
    ).label;
    const cancelLabel = helpers.findElement(
      SCREEN_KEY_LOGIN,
      KEY_FINGERPRINT_CANCEL_LABEL
    ).label;
    const detailedMessage = helpers.findElement(
      SCREEN_KEY_LOGIN,
      KEY_FINGERPRINT_DETAILED_MESSAGE
    ).label;

    const optionalConfigObject = {
      title: loginLable, // Android
      imageColor: "#e00606", // Android
      imageErrorColor: "#ff0000", // Android
      sensorDescription: useTouchIdLabel, // Android
      sensorErrorDescription: authorizeFailedLabel, // Android
      cancelText: cancelLabel, // Android
      fallbackLabel: "", // iOS (if empty, then label is hidden)
      unifiedErrors: false, // use unified error messages (default false)
      passcodeFallback: false, // iOS
    };

    TouchID.authenticate(detailedMessage, optionalConfigObject)
      .then(success => {
        // Success code
        const {
          refreshToken,
          previousUser,
          fingerPrintAuthEnabledForEmail,
          handleTouchLogin,
        } = this.props;

        handleTouchLogin(
          refreshToken,
          fingerPrintAuthEnabledForEmail,
          previousUser
        )
          .then(userProfile => {
            this.setState({
              loginInProgress: false,
            });
            if (userProfile) {
              //it will come here when client side validation fails

              //navigate to main tab only if user profile fetch is successful
              NavigationService.dispatch(
                StackActions.reset({
                  index: 0,
                  key: null,
                  actions: [
                    NavigationActions.navigate({
                      routeName: "MainTab",
                    }),
                  ],
                })
              );
            } else {
              this.showFingerPrintErrorAlert();
            }
          })
          .catch(err => {
            //it will come here when the api calls fail
            this.setState({
              loginInProgress: false,
              error: err ? err.message : null,
            });
          });
      })
      .catch(error => {
        // Failure code
        this.handleFingerPrintAuthenticationError(error);
      });
  };

  handleFingerPrintAuthenticationError = error => {
    const { meta } = this.props;
    const fingerPintEnroll = helpers.findElement(
      SCREEN_KEY_LOGIN,
      KEY_FINGER_PRINT_NOT_ENROLLED
    ).label;

    const ok = helpers
      .findElement(SCREEN_KEY_CHAT_REPORT, KEY_OK)
      .label.toUpperCase();

    const cancel = helpers.findElement(SCREEN_KEY_MANAGE_PROFILE, KEY_CANCEL)
      .label;
    if (error.code === NOT_ENROLLED || error.name == TOUCH_ID_NOT_ENROLLED) {
      Alert.alert(
        "",
        fingerPintEnroll,
        [
          { text: cancel, style: "cancel" },
          { text: ok, onPress: () => OpenSettings.openSettings() },
        ],
        { cancelable: false }
      );
    }
  };

  onLogin() {
    const { email, password, loginUser, previousUser } = this.props;
    this.setState({
      loginInProgress: true,
      error: null,
    });

    loginUser({ email, password, previousUser })
      .then(({ error }) => {
        if (error) {
          //it will come here when client side validation fails
          this.setState({
            ...error,
            loginInProgress: false,
          });
        } else {
          this.setState({
            loginInProgress: false,
          });
          //navigate to main tab only if user profile fetch is successful
          NavigationService.dispatch(
            StackActions.reset({
              index: 0,
              key: null,
              actions: [
                NavigationActions.navigate({
                  routeName: "MainTab",
                }),
              ],
            })
          );
        }
      })
      .catch(err => {
        //it will come here when the api calls fail
        this.setState({
          loginInProgress: false,
          passwordError: "",
          error: err ? err.message : null,
        });
      });

    Keyboard.dismiss();
  }

  onEmailChange(name, email) {
    this.props.emailChanged(email);
  }

  onPasswordChange(name, password) {
    this.props.passwordChanged(password);
  }

  navigate(page) {
    this.props.navigation.replace(page);
  }

  getErrorMsg(errorKey) {
    switch (errorKey) {
      case EMAIL_ID_REQUIRED:
        return helpers.findErrorMessage(
          helpers.findElement(SCREEN_KEY_LOGIN, KEY_EMAIL),
          ERROR_KEY_EMAIL_REQUIRED
        ).message;
      case INVALID_EMAIL_ID:
        return helpers.findErrorMessage(
          helpers.findElement(SCREEN_KEY_LOGIN, KEY_EMAIL),
          ERROR_KEY_INVALID_EMAIL_ID
        ).message;

      case PASSWORD_REQUIRED:
        return helpers.findErrorMessage(
          helpers.findElement(SCREEN_KEY_LOGIN, KEY_PASSWORD),
          ERROR_KEY_PASSWORD_REQUIRED
        ).message;

      case INVALID_PASSWORD:
        return helpers.findErrorMessage(
          helpers.findElement(SCREEN_KEY_LOGIN, KEY_PASSWORD),
          ERROR_KEY_PASSWORD_REQUIRED
        ).message;

      case PASSWORD_MATCH_CRITERIA_UNMET:
        return helpers.findErrorMessage(
          helpers.findElement(SCREEN_KEY_LOGIN, KEY_PASSWORD),
          ERROR_KEY_PASSWORD_CRITERIA_MISMATCH
        ).message;
      default:
        return "";
    }
  }

  setForgotPasswordModalVisible(visible) {
    this.setState({ showForgotPasswordModal: visible });
  }
  storeNewPasswordData(result) {
    this.setState({ newPasswordData: result });
  }
  setNewPasswordModalVisible(visible) {
    this.setState({ showNewPasswordModal: visible });
    if (!visible) {
      this.setState({ newPasswordData: {} });
    }
  }

  onPressedFingerprintButton = () => {
    const isFingerprintEnabled = !isNilOrEmpty(
      this.props.fingerPrintAuthEnabledForEmail
    );

    if (!isFingerprintEnabled) {
      this.showFingerPrintErrorAlert();
    } else {
      this.handleFingerprintAuthentication();
    }
  };

  renderFingerPrintButton = () => {
    if (this.state.isFingerPrintSupported) {
      return (
        <View style={loginStyles.fingerprintContainer}>
          <TouchableOpacity
            testID="fingerprint_login"
            accessibilityLabel="fingerprint_login"
            onPress={() => {
              this.onPressedFingerprintButton();
            }}
          >
            <Image
              resizeMode="contain"
              style={{ width: 50, height: 50 }}
              source={require("../../images/touchIDLogo.png")}
            />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  handleForgotPasswordFlow() {
    this.props.dispatchForgotPasswordDetailsReset();
    this.navigate("Forgot");
  }

  renderLoginInProgressView = () => {
    if (this.state.loginInProgress) {
      return (
        <View>
          <ActivityIndicator size="large" color={colors.crimson} />
        </View>
      );
    }
    return null;
  };

  renderErrorMsg = () => {
    if (this.state.error && this.state.error !== "") {
      return (
        <View style={loginStyles.errorPadding}>
          <Text style={loginStyles.errorText}>{this.state.error}</Text>
        </View>
      );
    }
    return null;
  };

  renderLoginButton = () => {
    if (!this.state.loginInProgress) {
      return (
        <AppButton
          type={[styles.btn, styles.primary]}
          title={helpers.findElement(SCREEN_KEY_LOGIN, KEY_LOGIN).label}
          press={this.onLogin.bind(this)}
        />
      );
    }
    return null;
  };

  render() {
    ElementErrorManager.setCurrentScreen(SCREEN_KEY_LOGIN);
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          style={loginStyles.container}
          accessibilityLabel="container"
          accesible
        >
          <View style={loginStyles.subContainer1}>
            <View style={styles.topOptions}>
              <Languages
                accesible
                style={{ fontSize: 15.3 }}
                accessibilityLabel="langContainer"
                testID="langContainer"
                indicateColor="#6b6a6d"
              />
            </View>
            <OfflineImage
              accessibilityLabel="logo"
              accesible
              key={COMMON_KEY_APP_LOGO}
              resizeMode={"contain"}
              style={[loginStyles.brandImage]}
              fallbackSource={PRU_HEART}
              source={{
                uri: helpers.findCommon(COMMON_KEY_APP_LOGO).image,
              }}
            />
          </View>
          <View style={loginStyles.subContainer2}>
            <AppTextInput
              onChange={this.onEmailChange.bind(this)}
              value={this.props.email}
              name="email"
              inline
              keyboardType="email-address"
              label={helpers.findElement(SCREEN_KEY_LOGIN, KEY_EMAIL).label}
              hasError={this.state.emailError}
              errorMsg={this.getErrorMsg(this.state.emailError)}
            />
            <AppTextInput
              name="password"
              inline
              secureText
              label={helpers.findElement(SCREEN_KEY_LOGIN, KEY_PASSWORD).label}
              value={this.props.password}
              onChange={this.onPasswordChange.bind(this)}
              hasError={this.state.passwordError}
              errorMsg={this.getErrorMsg(this.state.passwordError)}
            />
            <View style={{ width: "100%", alignItems: "flex-end" }}>
              <TouchableOpacity
                accessibilityLabel="forgotBtn"
                accesible
                onPress={() => {
                  this.setForgotPasswordModalVisible(true);
                }}
                style={loginStyles.forgotPassword}
              >
                <Text
                  accessibilityLabel="forgotText"
                  accesible
                  style={[styles.rightText, loginStyles.forgotPasswordText]}
                >
                  {
                    helpers.findElement(SCREEN_KEY_LOGIN, KEY_FORGOT_PASSWORD)
                      .label
                  }
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={loginStyles.subContainer3}>
            {this.renderLoginButton()}
            {this.renderLoginInProgressView()}
            {this.renderErrorMsg()}
            <OrDivider style={loginStyles.orDivider} />
            <SocialLogin
              fbText={helpers.findCommon(LOGIN_WITH_FB).label}
              gmailText={helpers.findCommon(LOGIN_WITH_GOOGLE).label}
              {...this.props}
            />
            {this.renderFingerPrintButton()}
            <View style={loginStyles.registerContainer}>
              <Text style={loginStyles.newText}>
                {
                  helpers.findElement(SCREEN_KEY_LOGIN, DONT_HAVE_AN_ACCOUNT)
                    .label
                }
              </Text>
              <TouchableOpacity
                hitSlop={{ top: 20, left: 0, bottom: 20, right: 0 }}
                onPress={() => {
                  this.navigate("EmailRegister");
                }}
                style={[loginStyles.headerButton]}
                accessibilityLabel="registerBtn"
                accesible
              >
                <View
                  style={{
                    alignSelf: "flex-start",
                    borderBottomWidth: 1,
                    borderColor: "#6b6a6d",
                  }}
                >
                  <Text
                    accessibilityLabel="registerText"
                    accesible
                    style={[
                      styles.rightText,
                      loginStyles.emailRegisterText,
                      loginStyles.headerButtonText,
                    ]}
                  >
                    {helpers
                      .findElement(SCREEN_KEY_LOGIN, KEY_REGISTER)
                      .label.toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <Modal visible={this.state.showForgotPasswordModal}>
            <ForgotPassword
              setForgotPasswordModalVisible={this.setForgotPasswordModalVisible.bind(
                this
              )}
              storeNewPasswordData={this.storeNewPasswordData.bind(this)}
              setNewPasswordModalVisible={this.setNewPasswordModalVisible.bind(
                this
              )}
            />
          </Modal>
          <Modal visible={this.state.showNewPasswordModal}>
            <NewPassword
              setNewPasswordModalVisible={this.setNewPasswordModalVisible.bind(
                this
              )}
              newPasswordData={this.state.newPasswordData}
            />
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => ({
  email: state.auth.email,
  password: state.auth.password,
  meta: state.meta,
  previousUser: state.sharedData.user,
  //isFingerprintEnabled: state.userPreferences.isFingerprintEnabled,
  // auth: state.auth,
  refreshToken: state.auth.refreshToken,
  fingerPrintAuthEnabledForEmail:
    state.sharedData.fingerPrintAuthEnabledForEmail,
});

export default connect(
  mapStateToProps,
  {
    passwordChanged: authPasswordChanged,
    emailChanged: authEmailChanged,
    loginUser,
    dispatchForgotPasswordDetailsReset,
    handleTouchLogin,
  }
)(Login);
