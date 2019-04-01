import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from "react-native";

import {
  CoreComponents,
  CoreConfig,
  CoreUtils,
  CoreActions,
  CoreConstants,
} from "@pru-rt-internal/rnmobile-app-core-framework";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { OfflineImage } from "react-native-image-offline";
import CheckBox from "react-native-check-box";
import Modal from "react-native-modal";
import CodeInput from "react-native-confirmation-code-field";
import { pickBy, values, path } from "ramda";
import styles from "./styles";

const { colors } = CoreConfig;
const { AppButton, Label, Timer } = CoreComponents;
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { DOC_SERVICE_REGISTER,
  DOC_SERVICE_REGISTER_PATIENT,
  DOC_SERVICE_VERIFY_PHONE,
  DOC_SERVICE_VERIFY_OTP,
  DOC_SERVICE_RESEND_OTP,
  DOC_SERVICE_VERIFY_OTP_CANCEL,
  GO_BACK_TO_PREVIOUS_STACK,
  GO_TO_MANAGE_PROFILE,
  RESET_REGISTRATION_STATUS,
  RegistrationStatus,
  MOBILE_PATTERN,
  NAME_PATTERN,
} = CoreConstants;

import { CLOSE } from "../../config/images";

const { isNilOrEmpty } = CoreUtils;

class DocRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      showResend: false,
      restartTimer: false,
      error: {
        firstName: false,
        surName: false,
        phone: false,
      },
    };
    this.containerProps = { style: styles.otpInputContainer };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.goBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.goBack);
  }

  static getDerivedStateFromProps(nextProps) {
    const nextState = DocRegister.validateForm(nextProps);
    if (nextProps.error && nextProps.error.otp) {
      return {
        ...nextState,
        showResend: true,
      };
    }
    return nextState;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.profile.phone !== this.props.profile.phone) {
      if (
        this.props.verifiedPhoneNumber &&
        this.props.profile.phone !== this.props.verifiedPhoneNumber
      ) {
        this.props.dispatch({
          type: RESET_REGISTRATION_STATUS,
          payload: {
            registrationStatus: RegistrationStatus.TNC_ACCEPTED,
          },
        });
      }
    }
  }

  static validPhone(phone) {
    // console.log('MOBILE_PATTERN', MOBILE_PATTERN);
    return MOBILE_PATTERN.test(phone);
  }

  static validName(name) {
    return !isNilOrEmpty(name) && NAME_PATTERN.test(name);
  }

  static validateForm(props) {
    const { phone, firstName, surName } = props.profile;
    const error = {
      phone: !DocRegister.validPhone(phone),
      firstName: !DocRegister.validName(firstName),
      lastName: !DocRegister.validName(surName),
    };
    return {
      error: error,
    };
  }

  activateResend = () => {
    this.setState({
      showResend: true,
    });
  };

  hasErrors() {
    const errorFields = pickBy(val => val, this.state.error);
    return values(errorFields).length > 0;
  }

  disableProceedBtn() {
    return (
      !this.state.isChecked ||
      this.props.registrationStatus < RegistrationStatus.PHONE_OTP_VERIFIED
    );
  }

  onProceed = () => {
    this.props.dispatch({
      context: DOC_SERVICE_REGISTER,
      type: DOC_SERVICE_REGISTER_PATIENT,
      payload: {
        ...this.props.profile,
      },
    });
  };

  goBack = () => {
    this.props.dispatch({
      context: DOC_SERVICE_REGISTER,
      type: GO_BACK_TO_PREVIOUS_STACK,
    });
    return true;
  };

  goToManageProfile = () => {
    this.props.dispatch({
      context: DOC_SERVICE_REGISTER,
      type: GO_TO_MANAGE_PROFILE,
      payload: {
        userData: this.props.profile,
        editable: true,
        related: false,
        newProfile: false,
      },
    });
  };

  removeOTPPopup = () => {
    this.props.dispatch({
      context: DOC_SERVICE_REGISTER,
      type: DOC_SERVICE_VERIFY_OTP_CANCEL,
    });
  };

  resendOtp = () => {
    const { phone, country } = this.props.profile;
    this.props.dispatch({
      context: DOC_SERVICE_REGISTER,
      type: DOC_SERVICE_RESEND_OTP,
      payload: {
        countryPhoneCode: country.countryPhoneCode,
        mobileNumber: phone,
      },
    });
    this.refs.otp.clear();
    this.setState({
      showResend: false,
    });
  };

  checkboxText = () => {
    return (
      <View style={styles.flexRow}>
        <Text>I accept the associated </Text>
        <TouchableOpacity>
          <Text> Terms and Conditions </Text>
        </TouchableOpacity>
        <Text>and </Text>
        <TouchableOpacity>
          <Text> Privacy Policy </Text>
        </TouchableOpacity>
      </View>
    );
  };

  onFulfill = otp => {
    this.props.dispatch({
      context: DOC_SERVICE_REGISTER,
      type: DOC_SERVICE_VERIFY_OTP,
      payload: {
        otp,
      },
    });
  };

  verifyPhone = () => {
    const { phone, country } = this.props.profile;
    this.props.dispatch({
      context: DOC_SERVICE_REGISTER,
      type: DOC_SERVICE_VERIFY_PHONE,
      payload: {
        countryPhoneCode: country.countryPhoneCode,
        mobileNumber: phone,
      },
    });
  };

  cellProps = ({ /*index, isFocused,*/ hasValue }) => {
    const cellProps = {
      underlineColorAndroid: "transparent",
    };
    if (hasValue) {
      return {
        ...cellProps,
        style: [styles.otpInput, styles.otpInputNotEmpty],
      };
    }

    return {
      ...cellProps,
      style: styles.otpInput,
    };
  };

  getOtpModal = () => {
    return (
      <Modal
        isVisible={
          this.props.workflowId &&
          this.props.registrationStatus === RegistrationStatus.TNC_ACCEPTED
        }
        style={styles.mainContainer}
        backdropColor={colors.black}
        backdropOpacity={0.5}
        transparent={true}
      >
        <Text style={[styles.otpHeading]}>Enter OTP</Text>
        <CodeInput
          inputPosition="full-width"
          variant="clear"
          size={40}
          activeColor={colors.nevada}
          inactiveColor={colors.nevada}
          onFulfill={code => this.onFulfill(code)}
          containerStyle={styles.otpInputContainer}
          containerProps={this.containerProps}
          cellProps={this.cellProps}
          keyboardType="numeric"
          codeLength={6}
          ref="otp"
        />
        <View style={styles.resendOTPContainer}>
          {!this.state.showResend && (
            <Timer
              onFinish={this.activateResend}
              onRestart={this.state.restartTimer}
            />
          )}
          {this.props.error && this.props.error.otp && (
            <View style={styles.errorPadding}>
              <Text style={styles.errorText}>{this.props.error.otp}</Text>
            </View>
          )}
          {this.state.showResend && (
            <TouchableOpacity onPress={this.resendOtp}>
              <Text style={styles.resendOTPLink}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.cancelOTPContainer}
          onPress={this.removeOTPPopup}
        >
          <Text style={styles.cancelOTP}>CANCEL</Text>
        </TouchableOpacity>
      </Modal>
    );
  };

  getField = (label, value) => {
    const { error } = this.state;
    const { profile } = this.props;
    return (
      <View>
        <Label value={label} style={styles.label} />
        <Label
          value={path(value.split("."), profile)}
          style={[
            styles.textinput,
            {
              borderBottomColor:
                path(value.split("."), profile) == ""
                  ? colors.red
                  : colors.white,
            },
          ]}
        />
      </View>
    );
  };

  getPhoneField = (label, value, formHasError) => {
    const { profile } = this.props;
    const { error } = this.state;
    const labelText =
      this.props.registrationStatus < RegistrationStatus.PHONE_OTP_VERIFIED
        ? `${label} (Unverified)`
        : `${label} (Verified)`;
    const icon =
      this.props.registrationStatus < RegistrationStatus.PHONE_OTP_VERIFIED
        ? { name: "error", color: colors.orange }
        : { name: "check-circle", color: colors.green };

    // console.log('123123123123123123',this.props, this.state);
    return (
      <View>
        <View style={styles.flexRow}>
          <Label value={labelText} style={styles.label} />
          <MaterialIcons name={icon.name} size={20} color={icon.color} />
        </View>
        <View style={[styles.phoneField]}>
          <Text style={styles.textinput}>
            {profile.country.countryPhoneCode}
          </Text>
          <Text
            style={[
              styles.textinput,
              {
                borderBottomColor:
                  profile[value] === "" || error[value]
                    ? colors.red
                    : colors.white,
              },
              styles.phoneText,
            ]}
          >
            {profile[value]}
          </Text>

          {!formHasError &&
            this.props.registrationStatus <
              RegistrationStatus.PHONE_OTP_VERIFIED && (
              <TouchableOpacity
                style={styles.verifyBtn}
                onPress={this.verifyPhone}
                disabled={this.state.error.phone}
              >
                <Text style={styles.verifyText}>Verify Now</Text>
              </TouchableOpacity>
            )}
        </View>
      </View>
    );
  };

  render() {
    const formHasError = this.hasErrors();
    return (
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.closeIcon}>
          <TouchableOpacity style={styles.closeIcon} onPress={this.goBack}>
            <OfflineImage
              accessibilityLabel="back"
              accessible
              key="backIcon"
              style={[styles.closeIcon]}
              fallbackSource={CLOSE}
              source={CLOSE}
            />
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.headerSection}>
            <Label
              value={
                "Before we can help, we need to know some details about you."
              }
              style={styles.heading}
            />
            <Label
              value={"This helps us to give the best advise to you."}
              style={styles.subhead}
            />
          </View>
          <View>
            <View style={[styles.formSection]}>
              {this.getField("First Name", "firstName")}
              {this.getField("Last Name", "surName")}
              {this.getField("Email", "email")}
              {this.getField("County of Residence", "country.countryName")}
              {this.getPhoneField("Phone", "phone", formHasError)}

              <View style={styles.profileLink}>
                <Text style={{ color: colors.nevada }}>
                  If you wish to change any field please update your Profile
                </Text>
                <TouchableOpacity onPress={() => this.goToManageProfile()}>
                  <Text style={{ color: colors.crimson }}> here </Text>
                </TouchableOpacity>
              </View>

              {!formHasError && (
                <CheckBox
                  onClick={() => {
                    const nextCheckedState = !this.state.isChecked;
                    this.setState({
                      isChecked: nextCheckedState,
                    });
                  }}
                  style={styles.iAccept}
                  isChecked={this.state.isChecked}
                  rightText={
                    "I give my consent for Pulse to share my personal information"
                  }
                  rightTextStyle={styles.iAcceptText}
                  checkBoxColor={colors.nevada}
                />
              )}
              {this.props.error && this.props.error.form && (
                <View style={styles.errorPadding}>
                  <Text style={styles.errorText}>{this.props.error.form}</Text>
                </View>
              )}

              <AppButton
                title={"PROCEED"}
                press={this.onProceed}
                type={[styles.btn, styles.primary]}
                disable={formHasError || this.disableProceedBtn()}
              />
            </View>
          </View>
        </View>
        {this.getOtpModal()}
      </ScrollView>
    );
  }
}

DocRegister.propTypes = {
  dispatch: PropTypes.func,
  workflowId: PropTypes.string,
  error: PropTypes.instanceOf(Object),
  registrationStatus: PropTypes.number,
  profile: PropTypes.instanceOf(Object),
};

const profileSelector = state => ({
  ...state.profile,
  country: state.babylonAuth.country, //TODO: wrong place to store country
});

const mapStateToProps = state => ({
  meta: state.meta,
  profile: profileSelector(state),
  workflowId: state.doctorServices.workflowId,
  registrationStatus: state.doctorServices.registrationStatus,
  verifiedPhoneNumber: state.doctorServices.mobileNumber,
  error: state.doctorServices.error,
});

export default connect(mapStateToProps)(DocRegister);
