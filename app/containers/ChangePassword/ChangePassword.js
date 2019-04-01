import React, { Component } from "react";
import { connect } from "react-redux";
import {
  ScrollView,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";

import {
  CoreComponents,
  CoreConfig,
  metaHelpers,
  CoreActions,
} from "@pru-rt-internal/rnmobile-app-core-framework";

const { AppButton } = CoreComponents;
const { changePassword, dispatchChangePasswordReset } = CoreActions;
import styles from "./styles";
import { CLOSE, EYE_CLOSE, EYE_OPEN } from "../../config";
const { Loader } = CoreComponents;
const helpers = metaHelpers;
const {
  colors,
  PASSWORD_PATTERN,
  SCREEN_KEY_CHANGE_PASSWORD,
  SCREEN_KEY_CHAT_REPORT,
} = CoreConfig;
import changePasswordStyles from "./styles";

const { ElementErrorManager } = CoreConfig;

const KEY_POLICY = "policy";

const ERROR_KEY_CURRENT_PASSWORD_MISMATCH = "not_current_password";
const KEY_CONFIRM_PASSWORD = "confirmpassword";
const KEY_NEW_PASSWORD = "newpassword";
const KEY_CURRENT_PASSWORD = "currentpassword";
const KEY_PASSWORD_CHANGED_MSG = "changepasswordsuccessmessage";
const ERROR_KEY_PASSWORD_REQUIRED = "required";
const ERROR_KEY_MATCH_CRITERIA = "match_criteria";
const ERROR_SAME_CURRENT_NEW_PASSWORD = "same_old_new_password";
const KEY_CHANGE_PASSWORD = "change";
const KEY_OK = "ok";

const InputWithLabel = ({
  label,
  hidePassword,
  managePasswordVisibility,
  handleTextChange,
  value,
  field,
  passErr,
  onBlur,
}) => {
  return (
    <View
      style={[
        styles.inputWithLabel,
        passErr
          ? { borderColor: colors.crimson, borderBottomWidth: 2 }
          : { borderColor: colors.silver },
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={styles.textBoxBtnHolder}>
        <TextInput
          placeholder={label}
          onBlur={onBlur}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          onChangeText={text => handleTextChange(field, text)}
          value={value}
          secureTextEntry={hidePassword}
          style={styles.textInput}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.visibilityBtn}
          onPress={() => managePasswordVisibility(field)}
        >
          <Image
            source={hidePassword ? EYE_CLOSE : EYE_OPEN}
            style={styles.btnImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      hidePasswordOld: true,
      hidePasswordNew: true,
      hidePasswordConfirm: true,
      currentPassErr: false,
      newPassErr: false,
      confirmPassErr: false,
      errorMessage: "",
      changePasswordLoading: false,
    };
    this.onPressChangeButton = this.onPressChangeButton.bind(this);
    this.managePasswordVisibility = this.managePasswordVisibility.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.Capitalize = this.Capitalize.bind(this);
  }

  managePasswordVisibility(key) {
    if (key === "oldPassword") {
      this.setState({ hidePasswordOld: !this.state.hidePasswordOld });
    } else if (key === "newPassword") {
      this.setState({ hidePasswordNew: !this.state.hidePasswordNew });
    } else {
      this.setState({ hidePasswordConfirm: !this.state.hidePasswordConfirm });
    }
  }

  handleTextChange(key, val) {
    const obj = {};
    obj[key] = val;
    this.setState(obj);
  }

  getErrorMsg(element, errorKey) {
    return helpers.findErrorMessage(element, errorKey).message;
  }

  // eslint-disable-next-line complexity
  onPressChangeButton() {
    const { meta } = this.props;
    const currentPassElement = helpers.findElement(
      SCREEN_KEY_CHANGE_PASSWORD,
      KEY_CURRENT_PASSWORD
    );
    const newPassElement = helpers.findElement(
      SCREEN_KEY_CHANGE_PASSWORD,
      KEY_NEW_PASSWORD
    );
    const confirmPassElement = helpers.findElement(
      SCREEN_KEY_CHANGE_PASSWORD,
      KEY_CONFIRM_PASSWORD
    );
    const alertMessage = helpers.findElement(
      SCREEN_KEY_CHANGE_PASSWORD,
      KEY_PASSWORD_CHANGED_MSG
    ).label;

    const ok = helpers
      .findElement(SCREEN_KEY_CHAT_REPORT, KEY_OK)
      .label.toUpperCase();

    const { oldPassword, newPassword, confirmPassword } = this.state;
    // this.setState({ error: {} });
    if (
      oldPassword === "" ||
      typeof oldPassword === "undefined" ||
      oldPassword == null
    ) {
      this.setState({
        errorMessage: this.getErrorMsg(
          currentPassElement,
          ERROR_KEY_PASSWORD_REQUIRED
        ),
        currentPassErr: true,
        newPassErr: false,
        confirmPassErr: false,
      });
    } else if (
      newPassword === "" ||
      typeof newPassword === "undefined" ||
      newPassword == null
    ) {
      this.setState({
        errorMessage: this.getErrorMsg(
          newPassElement,
          ERROR_KEY_PASSWORD_REQUIRED
        ),
        newPassErr: true,
        currentPassErr: false,
        confirmPassErr: false,
      });
    } else if (
      confirmPassword === "" ||
      typeof confirmPassword === "undefined" ||
      confirmPassword == null
    ) {
      this.setState({
        errorMessage: this.getErrorMsg(
          confirmPassElement,
          ERROR_KEY_PASSWORD_REQUIRED
        ),
        confirmPassErr: true,
        currentPassErr: false,
        newPassErr: false,
      });
    } else if (!newPassword.match(PASSWORD_PATTERN)) {
      this.setState({
        errorMessage: this.getErrorMsg(
          newPassElement,
          ERROR_KEY_MATCH_CRITERIA
        ),
        newPassErr: true,
        currentPassErr: false,
        confirmPassErr: false,
      });
    } else if (newPassword !== confirmPassword) {
      this.setState({
        errorMessage: this.getErrorMsg(
          confirmPassElement,
          ERROR_KEY_MATCH_CRITERIA
        ),
        confirmPassErr: true,
        currentPassErr: false,
        newPassErr: false,
      });
    } else if (oldPassword === newPassword) {
      this.setState({
        errorMessage: this.Capitalize(
          this.getErrorMsg(currentPassElement, ERROR_SAME_CURRENT_NEW_PASSWORD)
        ),
        confirmPassErr: true,
        currentPassErr: true,
        newPassErr: true,
      });
    } else {
      passwordError = "";
      passwordHasError = false;
      this.setState({
        errorMessage: "",
        confirmPassErr: false,
        currentPassErr: false,
        newPassErr: false,
        changePasswordLoading: true,
      });
      changePassword(
        this.state.oldPassword,
        this.state.newPassword,
        this.props.sessionId
      )
        .then(response => {
          // this.props.navigation.goBack();
          Alert.alert(
            "",
            alertMessage,
            [{ text: ok, onPress: () => this.props.navigation.goBack() }],
            { cancelable: false }
          );
        })
        .catch(err => {
          //it will come here when the api calls fail
          this.setState({
            changePasswordLoading: false,
            error: err ? err.message : null,
          });
        });
    }
  }

  Capitalize(str) {
    const capital = str.charAt(0).toUpperCase() + str.slice(1);
    return capital;
  }

  onPressCloseButton() {
    this.props.navigation.goBack();
  }

  handleBlur() {
    if (this.state.newPassword !== this.state.confirmPassword) {
      this.setState({ newPassErr: true });
    } else {
      this.setState({ newPassErr: false });
    }
  }

  render() {
    const {
      meta,
      changePasswordDone,
      dispatchChangePasswordReset,
    } = this.props;
    if (meta != null && meta.metaDetail != null) {
      ElementErrorManager.setCurrentScreen(SCREEN_KEY_CHANGE_PASSWORD);
      const passwordScreen = helpers.findScreen(SCREEN_KEY_CHANGE_PASSWORD);

      if (changePasswordDone) {
        alert(
          helpers.findElement(
            SCREEN_KEY_CHANGE_PASSWORD,
            KEY_PASSWORD_CHANGED_MSG
          ).label
        );
        dispatchChangePasswordReset();
        this.props.navigation.navigate("Settings");
        //  this.props.navigation.goBack();
      }

      const title = passwordScreen.label;
      const current = helpers.findElement(
        SCREEN_KEY_CHANGE_PASSWORD,
        KEY_CURRENT_PASSWORD
      ).label;
      const policy = helpers.findElement(SCREEN_KEY_CHANGE_PASSWORD, KEY_POLICY)
        .label;
      const newPassword = helpers.findElement(
        SCREEN_KEY_CHANGE_PASSWORD,
        KEY_NEW_PASSWORD
      ).label;
      const confirmPassword = helpers.findElement(
        SCREEN_KEY_CHANGE_PASSWORD,
        KEY_CONFIRM_PASSWORD
      ).label;
      const changePassword = helpers.findElement(
        SCREEN_KEY_CHANGE_PASSWORD,
        KEY_CHANGE_PASSWORD
      ).label;
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.white,
          }}
        >
          <TouchableOpacity
            onPress={() => this.onPressCloseButton()}
            style={styles.backCloseBtnWrapper}
          >
            <Image style={{ width: 28, height: 28, left: 0 }} source={CLOSE} />
          </TouchableOpacity>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <ScrollView
              style={{
                paddingLeft: "5%",
                paddingRight: "5%",
              }}
            >
              <View style={{ flex: 1.4 }}>
                <Text style={styles.title}>{title}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.subTitle}>{policy}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.red,
                    fontFamily:
                      Platform.OS === "ios"
                        ? "PruSansNormal"
                        : "pruSansRegular",
                  }}
                >
                  {this.state.errorMessage}
                </Text>
              </View>
              <InputWithLabel
                passErr={this.state.currentPassErr}
                field="oldPassword"
                label={current}
                value={this.state.oldPassword}
                handleTextChange={this.handleTextChange}
                hidePassword={this.state.hidePasswordOld}
                managePasswordVisibility={this.managePasswordVisibility}
              />
              <InputWithLabel
                passErr={this.state.newPassErr}
                field="newPassword"
                label={newPassword}
                value={this.state.newPassword}
                handleTextChange={this.handleTextChange}
                hidePassword={this.state.hidePasswordNew}
                managePasswordVisibility={this.managePasswordVisibility}
              />
              <InputWithLabel
                field="confirmPassword"
                label={confirmPassword}
                value={this.state.confirmPassword}
                handleTextChange={this.handleTextChange}
                hidePassword={this.state.hidePasswordConfirm}
                passErr={this.state.confirmPassErr}
                onBlur={this.handleBlur}
                managePasswordVisibility={this.managePasswordVisibility}
              />

              <View style={{ flex: 2, marginTop: 25, marginBottom: 25 }}>
                {!this.state.changePasswordLoading && (
                  <AppButton
                    type={styles.getStart}
                    title={changePassword}
                    press={() => {
                      this.onPressChangeButton();
                    }}
                  />
                )}
                {this.state.changePasswordLoading && (
                  <View>
                    <ActivityIndicator size="large" color={colors.crimson} />
                  </View>
                )}
                {this.state.error !== "" && (
                  <View style={changePasswordStyles.errorPadding}>
                    <Text style={changePasswordStyles.errorText}>
                      {this.state.error}
                    </Text>
                  </View>
                )}
              </View>
              <View style={{ flex: 1 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      );
    }
    return <Loader />;
  }
}

const mapStateToProps = state => ({
  meta: state.meta,
  email: state.auth.email,
  password: state.auth.password,
  sessionId: state.auth.token,
  changePasswordDone: state.auth.changePasswordDone,
});

export default connect(
  mapStateToProps,
  {
    dispatchChangePasswordReset,
  }
)(ChangePassword);
