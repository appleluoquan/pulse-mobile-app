import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  Image,
  View,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";

import {
  CoreComponents,
  CoreConfig,
  metaHelpers,
  CoreActions,
} from "@pru-rt-internal/rnmobile-app-core-framework";

import { connect } from "react-redux";
import { OfflineImage } from "react-native-image-offline";
const { AppButton } = CoreComponents;

const {
  SCREEN_KEY_SET_NEW_PASSWORD,
  COMMON_KEY_CROSS_ICON,
  SCREEN_KEY_CHAT_REPORT,
  colors,
  PASSWORD_PATTERN,
  CLOSE,
  EYE_CLOSE,
  EYE_OPEN,
} = CoreConfig;

const helpers = metaHelpers;

const { resetPassword } = CoreActions;
import styles from "../../common/styles";
import npStyles from "./styles";
const { Loader } = CoreComponents;

const KEY_NEW_PASSWORD = "newpassword";
const KEY_RETYPE_NEW_PASSWORD = "retypenewpassword";
const KEY_SCREEN_HEADER_LABEL = "setupnewpasswordheaderlabel";
const KEY_SETUP_NEW_PASSWORD_DESCRIPTION = "setupnewpasswordheaderdesc";
const KEY_SETUP_PASSWORD_BUTTON = "setupnewpasswordbutton";
const KEY_OK = "ok";
const KEY_SETUP_PASSWORD_SUCCESS = "setupnewpasswordsuccess";

const ERROR_KEY_PASSWORD_REQUIRED = "required";
const ERROR_KEY_PASSWORD_CRITERIA_MISMATCH = "match_criteria";
const ERROR_KEY_PASSWORD_NOT_MATCH_NEW_PASSWORD = "not_match_new_password";

const InputWithLabel = ({
  label,
  hidePassword,
  managePasswordVisibility,
  handleTextChange,
  value,
  field,
  passErr,
  onBlur,
  errorMsg,
}) => {
  return (
    <View style={npStyles.textContainer}>
      <View
        style={[
          npStyles.inputWithLabel,
          passErr
            ? { borderColor: colors.crimson, borderBottomWidth: 2 }
            : { borderColor: colors.silver },
        ]}
      >
        <Text style={npStyles.label}>{label}</Text>
        <View style={npStyles.textBoxBtnHolder}>
          <TextInput
            placeholder={label}
            onBlur={onBlur}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            onChangeText={text => handleTextChange(field, text)}
            value={value}
            secureTextEntry={hidePassword}
            style={npStyles.textInput}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={npStyles.visibilityBtn}
            onPress={() => managePasswordVisibility(field)}
          >
            <Image
              source={hidePassword ? EYE_CLOSE : EYE_OPEN}
              style={npStyles.btnImage}
            />
          </TouchableOpacity>
        </View>
      </View>
      {errorMsg ? <Text style={npStyles.errorLabel}>{errorMsg}</Text> : null}
    </View>
  );
};

class NewPassword extends Component {
  constructor(props) {
    super(props);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.state = {
      newPasswordErrorMsg: "",
      newPasswordHasError: false,
      confirmPasswordHasError: false,
      confirmPasswordErrorMsg: "",
      hidePasswordNew: true,
      hidePasswordConfirm: true,
      newPassword: "",
      confirmPassword: "",
    };
    this.managePasswordVisibility = this.managePasswordVisibility.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleTextChange(key, val) {
    const obj = {};
    obj[key] = val;
    this.setState(obj);
  }

  managePasswordVisibility(key) {
    if (key === "newPassword") {
      this.setState({ hidePasswordNew: !this.state.hidePasswordNew });
    } else {
      this.setState({ hidePasswordConfirm: !this.state.hidePasswordConfirm });
    }
  }

  onSetup() {
    const newPassword = this.state.newPassword;
    const confirmPassword = this.state.confirmPassword;
    this.validate(newPassword, confirmPassword);
  }

  handleFieldChange(name, value) {
    this.setState({ [name]: value });
  }

  validate(newPassword, confirmPassword) {
    const newPasswordScreen = helpers.findScreen(SCREEN_KEY_SET_NEW_PASSWORD);
    if (newPassword === "" || typeof newPassword === "undefined") {
      this.setState({
        newPasswordErrorMsg: helpers.findErrorMessage(
          helpers.findElement(SCREEN_KEY_SET_NEW_PASSWORD, KEY_NEW_PASSWORD),
          ERROR_KEY_PASSWORD_REQUIRED
        ).message,
        newPasswordHasError: true,
      });
    } else if (
      confirmPassword === "" ||
      typeof confirmPassword === "undefined"
    ) {
      this.setState({
        confirmPasswordErrorMsg: helpers.findErrorMessage(
          helpers.findElement(
            SCREEN_KEY_SET_NEW_PASSWORD,
            KEY_RETYPE_NEW_PASSWORD
          ),
          ERROR_KEY_PASSWORD_REQUIRED
        ).message,
        confirmPasswordHasError: true,
        newPasswordErrorMsg: "",
        newPasswordHasError: false,
      });
    } else if (!newPassword.match(PASSWORD_PATTERN)) {
      this.setState({
        newPasswordErrorMsg: helpers.findErrorMessage(
          helpers.findElement(
            SCREEN_KEY_SET_NEW_PASSWORD,
            KEY_RETYPE_NEW_PASSWORD
          ),
          ERROR_KEY_PASSWORD_CRITERIA_MISMATCH
        ).message,
        newPasswordHasError: true,
        confirmPasswordHasError: false,
        confirmPasswordErrorMsg: "",
      });
    } else if (confirmPassword !== newPassword) {
      this.setState({
        newPasswordErrorMsg: "",
        newPasswordHasError: false,
        confirmPasswordHasError: true,
        confirmPasswordErrorMsg: helpers.findErrorMessage(
          helpers.findElement(
            SCREEN_KEY_SET_NEW_PASSWORD,
            KEY_RETYPE_NEW_PASSWORD
          ),
          ERROR_KEY_PASSWORD_NOT_MATCH_NEW_PASSWORD
        ).message,
      });
    } else {
      this.setState({
        newPasswordErrorMsg: "",
        newPasswordHasError: false,
        confirmPasswordHasError: false,
        confirmPasswordErrorMsg: "",
        resetPasswordLoading: true,
        resetPasswordErrorMessage: "",
      });
      resetPassword(
        this.props.newPasswordData.email,
        confirmPassword,
        this.props.newPasswordData.workflowId
      )
        .then(() => {
          this.setState({
            resetPasswordLoading: false,
            resetPasswordStatus: true,
          });
        })
        .catch(() => {
          this.setState({
            resetPasswordLoading: false,
            resetPasswordStatus: false,
          });
        });
    }
  }

  getConfirmErrorMessage() {
    const { confirmPasswordErrorMsg, resetPasswordErrorMessage } = this.state;

    if (confirmPasswordErrorMsg !== "" && confirmPasswordErrorMsg !== null) {
      return confirmPasswordErrorMsg;
    }
    if (
      resetPasswordErrorMessage !== "" &&
      resetPasswordErrorMessage !== null
    ) {
      return resetPasswordErrorMessage;
    }

    return "";
  }

  render() {
    const { meta, newPasswordData } = this.props;
    if (meta != null && meta.metaDetail != null) {
      const newPasswordScreen = helpers.findScreen(SCREEN_KEY_SET_NEW_PASSWORD);
      const commons = meta.metaDetail.commons;
      const ok = helpers
        .findElement(SCREEN_KEY_CHAT_REPORT, KEY_OK)
        .label.toUpperCase();
      if (this.state.resetPasswordStatus === true) {
        const that = this;
        Alert.alert(
          "",
          helpers.findElement(
            SCREEN_KEY_SET_NEW_PASSWORD,
            KEY_SETUP_PASSWORD_SUCCESS
          ).label,
          [
            {
              text: ok,
              onPress: () => {
                that.props.setNewPasswordModalVisible(false);
              },
            },
          ],
          { cancelable: false }
        );
      }

      return (
        <ScrollView
          accessibilityLabel="container"
          accesible
          style={[styles.container, npStyles.container]}
        >
          <TouchableOpacity
            style={npStyles.backBtnWrapper}
            onPress={() => this.props.setNewPasswordModalVisible(false)}
          >
            <OfflineImage
              fallbackSource={CLOSE}
              accessibilityLabel="loginBtn"
              accesible
              key={COMMON_KEY_CROSS_ICON}
              source={{
                uri: helpers.findCommon(COMMON_KEY_CROSS_ICON).image,
              }}
              style={styles.closeBtn}
            />
          </TouchableOpacity>

          <View style={npStyles.leftSpacing}>
            <Text
              accessibilityLabel="screenTitle"
              accesible
              style={styles.screenTitle}
            >
              {
                helpers.findElement(
                  SCREEN_KEY_SET_NEW_PASSWORD,
                  KEY_SCREEN_HEADER_LABEL
                ).label
              }
            </Text>
            <Text
              accessibilityLabel="screenDescription"
              accesible
              style={styles.screenDescription}
            >
              {
                helpers.findElement(
                  SCREEN_KEY_SET_NEW_PASSWORD,
                  KEY_SETUP_NEW_PASSWORD_DESCRIPTION
                ).label
              }
            </Text>

            <InputWithLabel
              field="newPassword"
              label={
                helpers.findElement(
                  SCREEN_KEY_SET_NEW_PASSWORD,
                  KEY_NEW_PASSWORD
                ).label
              }
              value={this.state.newPassword}
              handleTextChange={this.handleTextChange}
              hidePassword={this.state.hidePasswordNew}
              errorMsg={this.state.newPasswordErrorMsg}
              passErr={this.state.newPasswordHasError}
              managePasswordVisibility={this.managePasswordVisibility}
            />

            <InputWithLabel
              field="confirmPassword"
              label={
                helpers.findElement(
                  SCREEN_KEY_SET_NEW_PASSWORD,
                  KEY_RETYPE_NEW_PASSWORD
                ).label
              }
              value={this.state.confirmPassword}
              handleTextChange={this.handleTextChange}
              errorMsg={this.getConfirmErrorMessage()}
              hidePassword={this.state.hidePasswordConfirm}
              passErr={this.state.confirmPasswordHasError}
              managePasswordVisibility={this.managePasswordVisibility}
            />
            {!this.state.resetPasswordLoading && (
              <AppButton
                type={[styles.btn, styles.primary, npStyles.appButton]}
                title={
                  helpers.findElement(
                    SCREEN_KEY_SET_NEW_PASSWORD,
                    KEY_SETUP_PASSWORD_BUTTON
                  ).label
                }
                press={this.onSetup.bind(this)}
              />
            )}
            {this.state.resetPasswordLoading && (
              <View>
                <ActivityIndicator size="large" color={colors.crimson} />
              </View>
            )}
          </View>
        </ScrollView>
      );
    }
    return <Loader />;
  }
}

const mapStateToProps = state => ({
  meta: state.meta,
});

export default connect(
  mapStateToProps,
  {
    resetPassword,
  }
)(NewPassword);
