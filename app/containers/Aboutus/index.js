import React from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, BackHandler } from "react-native";
import { connect } from "react-redux";

import {
  CoreComponents,
  CoreConfig,
  metaHelpers,
} from "@pru-rt-internal/rnmobile-app-core-framework";

import styles from "./styles";

const { Header, Loader } = CoreComponents;
const { SCREEN_KEY_ABOUT_US } = CoreConfig;
const helpers = metaHelpers;

const KEY_TERMS = "termsandconditions";
const KEY_PRIVACY = "privacy";

class Aboutus extends React.Component {
  constructor(props) {
    super(props);
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
    if (meta != null && meta.metaDetail != null) {
      const title = helpers.findScreen(SCREEN_KEY_ABOUT_US).label;
      const terms = helpers.findElement(SCREEN_KEY_ABOUT_US, KEY_TERMS).label;
      const privacy = helpers.findElement(SCREEN_KEY_ABOUT_US, KEY_PRIVACY).label;
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
            onPress={() => navigation.navigate("AboutTerms")}
          >
            <Text style={styles.text}>{terms}</Text>
          </TouchableOpacity>
          <View style={styles.horizontalLine} />
          <TouchableOpacity
            style={styles.contentViewItems}
            onPress={() => navigation.navigate("Privacy")}
          >
            <Text style={styles.text}>{privacy}</Text>
          </TouchableOpacity>
          <View style={styles.horizontalLine} />
        </View>
      );
    }
    return <Loader />;
  }
}

Aboutus.propTypes = {
  meta: PropTypes.objectOf(PropTypes.any).isRequired,
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  meta: state.meta,
});

export default connect(
  mapStateToProps,
  {}
)(Aboutus);
