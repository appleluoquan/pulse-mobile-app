import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  CoreConfig,
  metaHelpers,
} from "@pru-rt-internal/rnmobile-app-core-framework";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
const { colors, SCREEN_KEY_STAYING_WELL } = CoreConfig;
import { BACK, STAYING_WELL, DENGUE_ALERT_ICON } from "../../config/images";
import { OfflineImage } from "react-native-image-offline";
const helpers = metaHelpers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: colors.white,
  },
  content: {
    padding: 10,
    flex: 1,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  menuIcon: {
    height: 30,
    width: 30,
  },
  treatmentIcon: {
    width: 40,
    height: 35,
  },
  label: {
    fontSize: 20,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
    color: colors.nevada,
    marginLeft: 10,
    flex: 1,
  },
  flexRow: {
    flex: 0.07,
    marginTop: 10,
    flexDirection: "row",
  },

  flexItem: {
    flex: 0.07,
    marginTop: 20,
    flexDirection: "row",
    marginLeft: 30,
  },

  menu: {
    justifyContent: "center",
    alignItems: "center",
    height: 60,
  },
  alertText: {
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
  },
});

const KEY_STAYING_WELL_LABEL = "stayingWellLabel";
const KEY_STAYING_WELL_ICON = "stayingWellIcon";

const KEY_DENGUE_ALERT = "dengueAlertMenu";

class StayingWell extends React.Component {
  navigateAIME = () => {
    const { navigation } = this.props;
    if (this.props.regStatus === "REGISTERED") {
      navigation.navigate("AIME");
    } else {
      navigation.navigate("AIMERegister");
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => {
            const { navigation } = this.props;
            navigation.goBack();
          }}
        >
          <OfflineImage
            accessibilityLabel="back"
            accesible
            key="backIcon"
            style={[styles.backIcon]}
            fallbackSource={BACK}
            source={BACK}
          />
        </TouchableOpacity>
        <View style={styles.content}>
          <View style={styles.flexRow}>
            <OfflineImage
              accessibilityLabel="stayingWell"
              accessible
              key="stayingWell"
              fallbackSource={STAYING_WELL}
              source={{
                uri: helpers.findElement(
                  SCREEN_KEY_STAYING_WELL,
                  KEY_STAYING_WELL_ICON
                ).label,
              }}
              style={[styles.treatmentIcon]}
              resizeMode="contain"
            />
            <Text style={styles.label}>
              {
                helpers.findElement(
                  SCREEN_KEY_STAYING_WELL,
                  KEY_STAYING_WELL_LABEL
                ).label
              }
            </Text>
          </View>
          <View style={styles.flexItem}>
            <TouchableOpacity
              style={styles.menu}
              onPress={() => {
                this.navigateAIME();
              }}
            >
              <OfflineImage
                accessibilityLabel="menuIcon"
                accesible
                key="menuIcon"
                style={[styles.menuIcon]}
                fallbackSource={DENGUE_ALERT_ICON}
                source={{
                  uri: helpers.findElement(
                    SCREEN_KEY_STAYING_WELL,
                    KEY_DENGUE_ALERT
                  ).image,
                }}
              />
              <Text style={styles.alertText}>
                {
                  helpers.findElement(
                    SCREEN_KEY_STAYING_WELL,
                    KEY_DENGUE_ALERT
                  ).label
                }
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

StayingWell.propTypes = {
  meta: PropTypes.instanceOf(Object).isRequired,
  navigation: PropTypes.instanceOf(Object).isRequired,
};

const mapStateToProps = state => ({
  meta: state.meta,
  regStatus: state.regAIME.registrationStatus,
});

export default connect(mapStateToProps)(StayingWell);
