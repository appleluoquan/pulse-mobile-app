import React from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, BackHandler } from "react-native";
import { connect } from "react-redux";

import {
  CoreComponents,
  CoreConfig,
  metaHelpers,
} from "@pru-rt-internal/rnmobile-app-core-framework";

const { Header, Loader } = CoreComponents;
const helpers = metaHelpers;

const {
  COMMON_KEY_PRIVACY_BABYLON,
  COMMON_KEY_PRIVACY,
  SCREEN_KEY_PRIVACY_POLICY,
  COMMON_KEY_PRIVACY_MY_DOC,
} = CoreConfig;

import styles from "./styles";

const KEY_PRUTOPIA = "prutopia";
const KEY_BABYLON = "babylon";
const KEY_DOC_ON_CALL = "docservice";

class Privacy extends React.Component {
  constructor() {
    super();
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    const { navigation } = this.props;
    navigation.goBack();
    return true;
  }

  render() {
    const { meta, navigation } = this.props;
    if (meta != null && meta.metaDetail != null) {
      const title = helpers.findScreen(SCREEN_KEY_PRIVACY_POLICY).label;
      const prutopia = helpers.findElement(SCREEN_KEY_PRIVACY_POLICY, KEY_PRUTOPIA).label;
      const babylon = helpers.findElement(SCREEN_KEY_PRIVACY_POLICY, KEY_BABYLON).label;
      const docOnCall = helpers.findElement(SCREEN_KEY_PRIVACY_POLICY, KEY_DOC_ON_CALL).label;
      //const docOnCall = "Doctor on Call";
      const termsBabylon = helpers.findCommon(COMMON_KEY_PRIVACY_BABYLON).label;
      const termsPrutopia = helpers.findCommon(COMMON_KEY_PRIVACY).label;
      const privacyPolicyMyDoc = helpers.findCommon(COMMON_KEY_PRIVACY_MY_DOC).label;
      const termsPrutopiaHeader = helpers.findCommon(COMMON_KEY_PRIVACY).header;
      return (
        <View style={styles.container}>
          <Header
            style={{ paddingLeft: 0 }}
            leftIconType="back"
            onLeftPress={(e) => {
              e.preventDefault();
              navigation.goBack();
            }}
            onRightPress={() => console.log('Right button pressed')}
            showRightIcon={false}
          />
          <Text style={styles.heading}>{title}</Text>
          <View style={styles.horizontalLine} />
          <TouchableOpacity
            style={styles.contentViewItems}
            onPress={() => navigation.navigate('Common', { content: termsPrutopia, screenTitle: termsPrutopiaHeader })
            }
          >
            <Text style={styles.text}>{prutopia}</Text>
          </TouchableOpacity>
          <View style={styles.horizontalLine} />
          <TouchableOpacity
            style={styles.contentViewItems}
            onPress={() => navigation.navigate('Common', { content: termsBabylon, screenTitle: title })
            }
          >
            <Text style={styles.text}>{babylon}</Text>
          </TouchableOpacity>
          <View style={styles.horizontalLine} />
          <TouchableOpacity
            style={styles.contentViewItems}
            onPress={() => navigation.navigate('Common', { content: privacyPolicyMyDoc, screenTitle: title })
            }
          >
            <Text style={styles.text}>{docOnCall}</Text>
          </TouchableOpacity>
          <View style={styles.horizontalLine} />
        </View>
      );
    }
    return <Loader />;
  }
}

Privacy.propTypes = {
  meta: PropTypes.objectOf(PropTypes.any).isRequired,
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  meta: state.meta,
});

export default connect(
  mapStateToProps,
  {},
)(Privacy);
