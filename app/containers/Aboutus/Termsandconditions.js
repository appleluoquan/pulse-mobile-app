import React from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, BackHandler } from "react-native";
import { connect } from "react-redux";

import {
  CoreComponents,
  CoreConfig,
  metaHelpers,
} from "@pru-rt-internal/rnmobile-app-core-framework";

const { Header } = CoreComponents;
const helpers = metaHelpers;

const {
  SCREEN_KEY_TERMS_AND_CONDITIONS,
  COMMON_KEY_TERMS_BABYLON,
  COMMON_KEY_TERMS,
  COMMON_KEY_TERMS_AIME,
  COMMON_KEY_TERMS_MY_DOC,
} = CoreConfig;

import styles from "./styles";

const KEY_PRUTOPIA = "prutopia";
const KEY_BABYLON = "babylon";
const KEY_AIME = "AIME";
const KEY_DOC_ON_CALL = "docservice";

class Termsandconditions extends React.Component {
  constructor() {
    super();
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
    const { navigation } = this.props;
    navigation.goBack();
    return true;
  }

  render() {
    const { meta, navigation } = this.props;
    const title = helpers.findScreen(SCREEN_KEY_TERMS_AND_CONDITIONS).label;
    const prutopia = helpers.findElement(
      SCREEN_KEY_TERMS_AND_CONDITIONS,
      KEY_PRUTOPIA
    ).label;

    const babylon = helpers.findElement(
      SCREEN_KEY_TERMS_AND_CONDITIONS,
      KEY_BABYLON
    ).label;

    const aime = helpers.findElement(SCREEN_KEY_TERMS_AND_CONDITIONS, KEY_AIME)
      .label;

    const doctorOnCall = helpers.findElement(
      SCREEN_KEY_TERMS_AND_CONDITIONS,
      KEY_DOC_ON_CALL
    ).label;
    //const doctorOnCall = "Doctor on Call";

    const termsBabylon = helpers.findCommon(COMMON_KEY_TERMS_BABYLON).label;
    const termsPrutopia = helpers.findCommon(COMMON_KEY_TERMS).label;
    const termsAime = helpers.findCommon(COMMON_KEY_TERMS_AIME).label;
    const termsDOC = helpers.findCommon(COMMON_KEY_TERMS_MY_DOC).label;

    const prutopiaTnCHeader = helpers.findCommon(COMMON_KEY_TERMS).header;
    const babylonTnCHeader = helpers.findCommon(COMMON_KEY_TERMS_BABYLON)
      .header;
    const doconCallTnCHeader = helpers.findCommon(COMMON_KEY_TERMS_MY_DOC)
      .header;

    return (
      <View style={styles.container}>
        <Header
          style={{ paddingLeft: 0 }}
          leftIconType="back"
          onLeftPress={e => {
            e.preventDefault();
            navigation.goBack();
          }}
          onRightPress={() => console.log("Right button pressed")}
          showRightIcon={false}
        />
        <Text style={styles.heading}>{title}</Text>
        <View style={styles.horizontalLine} />
        <TouchableOpacity
          style={styles.contentViewItems}
          onPress={() =>
            navigation.navigate("Common", {
              content: termsPrutopia,
              screenTitle: prutopiaTnCHeader,
            })
          }
        >
          <Text style={styles.text}>{prutopia}</Text>
        </TouchableOpacity>
        <View style={styles.horizontalLine} />
        <TouchableOpacity
          style={styles.contentViewItems}
          onPress={() =>
            navigation.navigate("Common", {
              content: termsBabylon,
              screenTitle: babylonTnCHeader,
            })
          }
        >
          <Text style={styles.text}>{babylon}</Text>
        </TouchableOpacity>
        <View style={styles.horizontalLine} />
        <TouchableOpacity
          style={styles.contentViewItems}
          onPress={() =>
            navigation.navigate("Common", {
              content: termsAime,
              screenTitle: title,
            })
          }
        >
          <Text style={styles.text}>{aime}</Text>
        </TouchableOpacity>
        <View style={styles.horizontalLine} />
        <TouchableOpacity
          style={styles.contentViewItems}
          onPress={() =>
            navigation.navigate("Common", {
              content: termsDOC,
              screenTitle: doconCallTnCHeader,
            })
          }
        >
          <Text style={styles.text}>{doctorOnCall}</Text>
        </TouchableOpacity>
        <View style={styles.horizontalLine} />
      </View>
    );
  }
}

Termsandconditions.propTypes = {
  meta: PropTypes.objectOf(PropTypes.any).isRequired,
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  meta: state.meta,
});

export default connect(
  mapStateToProps,
  {}
)(Termsandconditions);
