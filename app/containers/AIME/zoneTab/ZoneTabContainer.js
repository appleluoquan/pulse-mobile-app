import React from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { connect } from "react-redux";
import debounce from "lodash/debounce";
import OpenSettings from "react-native-open-settings";
import MapNavigator from "../../MapNavigator/MapNavigator";

import {
  CoreComponents,
  CoreConfig,
  CoreUtils,
  CoreActions,
  CoreServices,
  metaHelpers,
} from "@pru-rt-internal/rnmobile-app-core-framework";

const {
  height,
  colors,
  ZONE_TAB_SCREEN,
  COMMON_KEY_USER_LAT,
  COMMON_KEY_USER_LONG,
  SCREEN_KEY_CHAT_REPORT,
  SCREEN_KEY_MANAGE_PROFILE,
  COMMON_KEY_ENABLE_LOCATION_PERMS_MSG,
  COMMON_RISKZONE_MARKERS_LIMIT,
} = CoreConfig;
const { fetchRiskZoneMarkers } = CoreActions;
const { calDelta, getMapBounds } = CoreUtils;
const helpers = metaHelpers;
const {
  requestLocationPermission,
  fetchCurrentLocation,
  NavigationService,
} = CoreServices;
import { styles } from "./style";
const { Loader } = CoreComponents;
const INSIDE_BREAKOUT_LABEL = "insidebreakoutzone";
const OUTSIDE_BREAKOUT_LABEL = "outsidebreakoutzone";
const ACCESS_LOCATION_LABEL = "accesslocation";
const ACCESS_LOCATION_MESSAGE = "accesslocationmessage";
const KEY_OK = "ok";
const KEY_CANCEL = "cancel";
const HIGH_RISK = "highrisk";
const LOW_RISK = "lowrisk";
const NO_RISK = "norisk";

// eslint-disable-line no-unused-vars
class ZoneTabContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dangerZone: false,
      region: {},
      isPopupVisible: false,
    };
    this.insideBreakoutLabel = "";
    this.outsideBreakoutLabel = "";
    this.legends = "";
  }

  static getDerivedStateFromProps(nextProps) {
    // check risklevel from response to toggle alert text and icon
    if (
      nextProps.userInRiskZone !== undefined &&
      nextProps.userInRiskZone !== null &&
      nextProps.userInRiskZone.length > 0 //needed for actual API
    ) {
      const userRiskLevel = nextProps.userInRiskZone[0].features.riskLevel; //needed for actual API
      //const userRiskLevel = nextProps.userInRiskZone.features.riskLevel;
      if (userRiskLevel === "HighRisk") {
        return {
          dangerZone: true,
        };
      }
    }
  }

  componentWillUnmount() {
    const { navigateCallback } = this.props;

    BackHandler.removeEventListener("hardwareBackPress", navigateCallback);
  }

  componentDidMount() {
    const { navigateCallback } = this.props;

    BackHandler.addEventListener("hardwareBackPress", navigateCallback);
    this.insideBreakoutLabel = helpers.findElement(
      ZONE_TAB_SCREEN,
      INSIDE_BREAKOUT_LABEL
    ).label;

    this.outsideBreakoutLabel = helpers.findElement(
      ZONE_TAB_SCREEN,
      OUTSIDE_BREAKOUT_LABEL
    ).label;

    const accessLocationLabel = helpers.findElement(
      ZONE_TAB_SCREEN,
      ACCESS_LOCATION_LABEL
    ).label;

    const accessLocationMessage = helpers.findElement(
      ZONE_TAB_SCREEN,
      ACCESS_LOCATION_MESSAGE
    ).label;

    const highRisk = helpers.findElement(ZONE_TAB_SCREEN, HIGH_RISK).label;

    const lowRisk = helpers.findElement(ZONE_TAB_SCREEN, LOW_RISK).label;

    const noRisk = helpers.findElement(ZONE_TAB_SCREEN, NO_RISK).label;

    this.legends = [
      {
        label: highRisk,
        color: "rgba(255, 0, 0, 0.9)",
      },
      {
        label: lowRisk,
        color: "rgba(255, 0, 0, 0.3)",
      },
      {
        label: noRisk,
        color: "rgba(255,165,0,0.7)",
      },
    ];

    requestLocationPermission(accessLocationLabel, accessLocationMessage).then(
      permissionGranted => {
        if (permissionGranted) {
          this.updateRiskForUserLocation();
        } else {
          NavigationService.navigate("MainTab");
        }
      }
    );
  }

  renderLegends = () => {
    return (
      <View style={styles.legendsContainer}>
        {this.legends.map((legend, index) => {
          return (
            <View key={index} style={{ flexDirection: "row", margin: 1 }}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: legend.color,
                }}
              />
              <Text style={styles.legendText}>{legend.label} </Text>
            </View>
          );
        })}
      </View>
    );
  };

  toggleRiskLegend = () => {
    this.setState({
      isPopupVisible: !this.state.isPopupVisible,
    });
  };

  updateRiskForUserLocation = updateRegion => {
    const ok = helpers
      .findElement(SCREEN_KEY_CHAT_REPORT, KEY_OK)
      .label.toUpperCase();
    const cancel = helpers.findElement(SCREEN_KEY_MANAGE_PROFILE, KEY_CANCEL)
      .label;
    fetchCurrentLocation()
      .then(coordinates => {
        const lat =
          helpers.findCommon(COMMON_KEY_USER_LAT).value || coordinates.latitude;
        const long =
          helpers.findCommon(COMMON_KEY_USER_LONG).value ||
          coordinates.longitude;
        const newRegion = {
          latitude: parseFloat(lat),
          longitude: parseFloat(long),
        };
        const distanceInMeters = 8000;
        const region = calDelta(newRegion, distanceInMeters);
        if (updateRegion) {
          this.map.animateToRegion(region, 100);
        } else {
          this.onRegionChangeComplete(region);
        }
      })
      .catch(error => {
        const enablePermsMsg = helpers.findCommon(
          COMMON_KEY_ENABLE_LOCATION_PERMS_MSG
        ).label;
        if (
          error.PERMISSION_DENIED === error.code ||
          error.POSITION_UNAVAILABLE === error.code
        ) {
          Alert.alert(
            "",
            enablePermsMsg,
            [
              {
                text: ok,
                onPress: () => {
                  OpenSettings.openSettings();
                  NavigationService.navigate("MainTab");
                },
              },
              {
                text: cancel,
                style: "cancel",
                onPress: () => {
                  NavigationService.navigate("MainTab");
                },
              },
            ],
            { cancellable: false }
          );
        } else {
          Alert.alert(
            "",
            "Could not get current location",
            [
              {
                text: ok,
                onPress: () => {
                  NavigationService.navigate("MainTab");
                },
              },
            ],
            { cancellable: false }
          );
        }
      });
  };

  onRegionChangeComplete = region => {
    const { token } = this.props;
    const metaRiskZoneMarkerLimit = helpers.findCommon(
      COMMON_RISKZONE_MARKERS_LIMIT
    );
    const riskZoneMarkerLimit = metaRiskZoneMarkerLimit
      ? Number(metaRiskZoneMarkerLimit.value)
      : 20;
    const boundObject = getMapBounds(region);
    this.setState({
      region,
    });
    this.props.fetchRiskZoneMarkers(
      region,
      boundObject,
      token,
      riskZoneMarkerLimit
    );
  };

  imageView = (styleObject, imagePath) => {
    return (
      <Image resizeMode="contain" style={styleObject} source={imagePath} />
    );
  };

  renderAlertIcons = dangerZone => {
    if (dangerZone === true) {
      return (
        <View>
          <View
            style={[
              styles.alertIconContainer,
              {
                backgroundColor: colors.red,
                bottom: height / 2 - 30,
                marginBottom: 30,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.locationIcon}
              onPress={() => {
                this.toggleRiskLegend();
              }}
            >
              {this.imageView(
                styles.dangerAlertIcon,
                require("../../../images/dangerZone.png")
              )}
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.alertIconContainer,
              { backgroundColor: colors.white, bottom: height / 2 - 60 },
            ]}
          >
            <TouchableOpacity
              style={styles.locationIcon}
              onPress={() => {
                this.updateRiskForUserLocation(true);
              }}
            >
              {this.imageView(
                styles.locationIcon,
                require("../../../images/location.png")
              )}
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View>
        <View
          style={[
            styles.alertIconContainer,
            {
              backgroundColor: colors.white,
              bottom: height / 2 - 30,
              marginBottom: 30,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.locationIcon}
            onPress={() => {
              this.toggleRiskLegend();
            }}
          >
            {this.imageView(
              styles.dangerAlertIcon,
              require("../../../images/nonDanger.png")
            )}
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.alertIconContainer,
            { backgroundColor: colors.white, bottom: height / 2 - 60 },
          ]}
        >
          <TouchableOpacity
            style={styles.locationIcon}
            onPress={() => {
              this.updateRiskForUserLocation(true);
            }}
          >
            {this.imageView(
              styles.locationIcon,
              require("../../../images/location.png")
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  circleColor = riskPercentage => {
    let color;
    if (Number(riskPercentage) >= 0 && Number(riskPercentage) <= 0.33) {
      color = "rgba(255,165,0,0.7)";
    } else if (
      Number(riskPercentage) > 0.33 &&
      Number(riskPercentage) <= 0.66
    ) {
      color = "rgba(255, 0, 0, 0.3)";
    } else {
      color = "rgba(255, 0, 0, 0.8)";
    }
    return color;
  };

  render() {
    const { dangerZone, region, isPopupVisible } = this.state;
    const { markers } = this.props;
    const markerShape = "CIRCLE";
    const visibleMarkers = markers.map(marker =>
      Object.assign({}, marker, {
        shape: markerShape,
        latitude: marker.latitude,
        longitude: marker.longitude,
        fillColor: this.circleColor(marker.features.riskPercentage),
      })
    );
    if (Object.keys(region).length > 0) {
      return (
        <View style={styles.container}>
          <MapNavigator
            initialRegion={region}
            markers={visibleMarkers}
            onRegionChangeComplete={debounce(this.onRegionChangeComplete, 1000)}
            refHandler={ref => {
              this.map = ref;
            }}
          />
          {isPopupVisible && this.renderLegends()}
          {this.renderAlertIcons(dangerZone)}
        </View>
      );
    }
    return <Loader />;
  }
}

ZoneTabContainer.propTypes = {
  markers: PropTypes.arrayOf(PropTypes.object),
  meta: PropTypes.instanceOf(Object).isRequired,
  token: PropTypes.string.isRequired,
  userInRiskZone: PropTypes.arrayOf(PropTypes.object),
  fetchRiskZoneMarkers: PropTypes.func.isRequired,
  navigateCallback: PropTypes.func.isRequired,
};

ZoneTabContainer.defaultProps = {
  markers: [],
};

const mapStateToProps = state => ({
  meta: state.meta,
  markers: state.riskzone.riskzone.riskZoneMarkers,
  userInRiskZone: state.riskzone.riskzone.userInRiskZone,
  token: state.auth.token,
});

const mapDispatchToProps = {
  fetchRiskZoneMarkers,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ZoneTabContainer);
