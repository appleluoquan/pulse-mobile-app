import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  CoreUtils,
  CoreActions,
} from "@pru-rt-internal/rnmobile-app-core-framework";
const { metaHelpers, isNilOrEmpty } = CoreUtils;
const { initializeAllData } = CoreActions;

class App extends React.PureComponent {
  componentDidMount() {
    metaHelpers.restoreOfflineImageCache();
  }

  UNSAFE_componentWillMount() {
    const {
      isLoggedIn,
      isRegistered,
      userVerified,
      navigation,
      loginTimestamp,
    } = this.props;
    let screen = "";
    let params = {};

    if (isNilOrEmpty(loginTimestamp)) {
      screen = "Register";
      this.props.initializeAllData();
    } else if (isLoggedIn) {
      screen = "MainTab";
    } else if (userVerified) {
      screen = "MainTermsAndConditions";
      params = {
        fromAuthAction: true,
        goBack: () => navigation.navigate("EmailRegister"),
      };
    } else if (isRegistered) {
      screen = "EmailRegister";
    } else {
      screen = "Register";
    }

    navigation.replace(screen, params);
  }

  render() {
    return null;
  }
}

App.propTypes = {
  isLoggedIn: PropTypes.bool,
  isRegistered: PropTypes.bool,
  userVerified: PropTypes.bool,
  navigation: PropTypes.object,
  loginTimestamp: PropTypes.number,
  initializeAllData: PropTypes.func,
};

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  isRegistered: state.register.isRegistered,
  userVerified: state.register.userVerified,
  loginTimestamp: state.meta.loginTimestamp,
});

export default connect(
  mapStateToProps,
  {
    initializeAllData,
  }
)(App);
