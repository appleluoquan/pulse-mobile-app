import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";

import {
  CoreConfig,
  metaHelpers,
  CoreConstants,
} from "@pru-rt-internal/rnmobile-app-core-framework";

const {
  colors,
  SCREEN_KEY_NAVIGATION_MAIN_SCREEN,
  SCREEN_KEY_GETTING_TREATMENT,
} = CoreConfig;

import {
  BACK,
  CLINIC_TAB_INACTIVE,
  GETTING_TREATMENT,
  HOSPITAL_TAB_INACTIVE,
  SPECIALIZATION_TAB_INACTIVE,
  DOC_ON_CALL_ICON,
} from "../../config/images";

const { GET_TREATMENT, GO_TO_DOC_SERVICE } = CoreConstants;

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
    padding: 2,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  menuIcon: {
    height: 19.5,
    width: 21.3,
  },
  treatmentIcon: {
    width: 40,
    height: 35,
  },
  label: {
    fontSize: 20,
    color: colors.nevada,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
    marginLeft: 10,
  },
  option: {
    fontSize: 16,
    color: colors.nevada,
    marginTop: 5,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
  },
  flexRow: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  flexEquiSpace: {
    justifyContent: "space-between",
  },
  menu: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textCenter: {
    textAlign: "center",
  },
});

const KEY_GETTING_TREATMENT_LABEL = "gettingTreatmentLabel";
const KEY_GETTING_TREATMENT_ICON = "gettingTreatmentIcon";

const KEY_HOSPITALS_INACTIVE = "inactivenavigationmainhospitals";
const KEY_CLINICS_INACTIVE = "inactivenavigationmainclinics";
const KEY_SPECIALIZATION_INACTIVE = "inactivenavigationmainspecialization";

class GettingTreatment extends React.Component {
  constructor(props) {
    super(props);
    this.navigate = this.navigate.bind(this);
  }

  navigate(route) {
    const { navigation } = this.props;
    navigation.navigate("Navigator", { route });
  }

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
              accessibilityLabel="gettingTreatment"
              accessible
              key="gettingTreatment"
              fallbackSource={GETTING_TREATMENT}
              source={{
                uri: helpers.findElement(
                  SCREEN_KEY_GETTING_TREATMENT,
                  KEY_GETTING_TREATMENT_ICON
                ).label,
              }}
              style={[styles.treatmentIcon]}
              resizeMode="contain"
            />
            <Text style={styles.label}>
              {
                helpers.findElement(
                  SCREEN_KEY_GETTING_TREATMENT,
                  KEY_GETTING_TREATMENT_LABEL
                ).label
              }
            </Text>
          </View>
          <View style={styles.flexRow}>
            <TouchableOpacity
              style={styles.menu}
              onPress={() => this.navigate("Hospitals")}
            >
              <OfflineImage
                accessibilityLabel="menuIcon"
                accesible
                key="menuIcon"
                style={[styles.menuIcon]}
                resizeMode={"contain"}
                fallbackSource={HOSPITAL_TAB_INACTIVE}
                source={{
                  uri: helpers.findElement(
                    SCREEN_KEY_NAVIGATION_MAIN_SCREEN,
                    KEY_HOSPITALS_INACTIVE
                  ).image,
                }}
              />
              <Text style={styles.option}>
                {
                  helpers.findElement(
                    SCREEN_KEY_NAVIGATION_MAIN_SCREEN,
                    KEY_HOSPITALS_INACTIVE
                  ).label
                }
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menu}
              onPress={() => this.navigate("Clinics")}
            >
              <OfflineImage
                accessibilityLabel="menuIcon"
                accesible
                key="menuIcon"
                style={[styles.menuIcon]}
                resizeMode={"contain"}
                fallbackSource={CLINIC_TAB_INACTIVE}
                source={{
                  uri: helpers.findElement(
                    SCREEN_KEY_NAVIGATION_MAIN_SCREEN,
                    KEY_CLINICS_INACTIVE
                  ).image,
                }}
              />
              <Text style={styles.option}>
                {
                  helpers.findElement(
                    SCREEN_KEY_NAVIGATION_MAIN_SCREEN,
                    KEY_CLINICS_INACTIVE
                  ).label
                }
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menu}
              onPress={() => this.navigate("Specialization")}
            >
              <OfflineImage
                accessibilityLabel="menuIcon"
                accesible
                key="menuIcon"
                style={styles.menuIcon}
                resizeMode={"contain"}
                fallbackSource={SPECIALIZATION_TAB_INACTIVE}
                source={{
                  uri: helpers.findElement(
                    SCREEN_KEY_NAVIGATION_MAIN_SCREEN,
                    KEY_SPECIALIZATION_INACTIVE
                  ).image,
                }}
              />
              <Text style={[styles.option, styles.textCenter]}>
                {
                  helpers.findElement(
                    SCREEN_KEY_NAVIGATION_MAIN_SCREEN,
                    KEY_SPECIALIZATION_INACTIVE
                  ).label
                }
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.flexRow}>
            <TouchableOpacity
              style={styles.menu}
              onPress={() =>
                this.props.dispatch({
                  context: GET_TREATMENT,
                  type: GO_TO_DOC_SERVICE,
                })
              }
            >
              <OfflineImage
                accessibilityLabel="menuIcon"
                accesible
                key="menuIcon"
                style={[styles.menuIcon]}
                resizeMode={"contain"}
                fallbackSource={DOC_ON_CALL_ICON}
                source={{
                  uri: "",
                }}
              />
              <Text style={[styles.option, styles.textCenter]}>
                {"Online \n Consultation"}
              </Text>
            </TouchableOpacity>
            <View style={styles.menu} />
            <View style={styles.menu} />
          </View>
        </View>
      </View>
    );
  }
}

GettingTreatment.propTypes = {
  meta: PropTypes.instanceOf(Object).isRequired,
  navigation: PropTypes.instanceOf(Object).isRequired,
  dispatch: PropTypes.func,
};

const mapStateToProps = state => ({ meta: state.meta });

export default connect(mapStateToProps)(GettingTreatment);
