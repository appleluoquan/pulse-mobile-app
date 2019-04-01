import React from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  Platform,
  NativeModules,
  Alert,
  BackHandler,
} from "react-native";
import { connect } from "react-redux";
import OfflineImage from "react-native-image-offline/src/OfflineImage";
import MapNavigator from "./MapNavigator";

import {
  CoreComponents,
  CoreConfig,
  metaHelpers,
  CoreActions,
  CoreConstants,
} from "@pru-rt-internal/rnmobile-app-core-framework";

const { Loader, SlideUpPanel } = CoreComponents;
import OpenSettings from "react-native-open-settings";
const {
  fetchMarkers,
  fetchSpecializationList,
  filterChangeAction,
  setHospitalDetails,
} = CoreActions;
import HospitalDetail from "../HospitalDetail";
import Filter from "./Filter";
const helpers = metaHelpers;

const {
  SCREEN_KEY_NAVIGATION_MAIN_SCREEN,
  SCREEN_KEY_CLINICS_FILTER,
  SCREEN_KEY_HOSPITALS_FILTER,
  SCREEN_KEY_MANAGE_PROFILE,
  SCREEN_KEY_CHAT_REPORT,
  COMMON_KEY_USER_LAT,
  COMMON_KEY_USER_LONG,
  COMMOM_NO_OF_HOSPITAL,
  COMMON_KEY_ENABLE_LOCATION_PERMS_MSG,
  height,
  width,
} = CoreConfig;

const { HOSPITAL_TYPE } = CoreConstants;

import {
  BACK,
  NAVIGATOR_FILTER,
  HOSPITAL_MARKER_ACTIVE,
  HOSPITAL_MARKER_INACTIVE,
  CLINIC_MARKER_ACTIVE,
  CLINIC_MARKER_INACTIVE,
} from "../../config/images";

import styles from "./styles";
import ClinicDetail from "../ClinicDetail";

const KEY_FILTER_ICON = "navigatormainscreenfilter";
const KEY_FILTER_BY_LABEL = "navigationmainfilterby";
const KEY_CLEAR_LABEL = "navigationmainclear";
const KEY_OK = "ok";
const KEY_CANCEL = "cancel";

// Do not remove : Commented temporarily
/* const KEY_HOSPITALS = "activenavigationmainhospitals";
const KEY_CLINICS = "activenavigationmainclinics";

const ERROR_KEY_HOSPITALS_EMPTY_TITLE = "hospital_list_empty_title";
const ERROR_KEY_CLINICS_EMPTY_TITLE = "clinic_list_empty_title";
const ERROR_KEY_HOSPITALS_EMPTY = "hospital_list_empty";
const ERROR_KEY_CLINICS_EMPTY = "clinic_list_empty"; */

class Navigator extends React.Component {
  static calDelta(coords, distance = 10) {
    const { latitude, longitude, accuracy } = coords;
    const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
    const latDelta = (distance * 1000) / oneDegreeOfLatitudeInMeters;
    const longDelta =
      (distance * 1000 * (height / width)) /
      (oneDegreeOfLatitudeInMeters * Math.cos(latitude * (Math.PI / 180)));

    return {
      latitude,
      longitude,
      latitudeDelta: latDelta,
      longitudeDelta: longDelta,
      accuracy,
    };
  }

  // eslint-disable-next-line complexity
  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      navigation,
      type,
      sessionId,
      distanceFilter,
      loading,
      fetchMarkers,
      filterChangeAction,
      markers,
      // meta,
    } = nextProps;
    const { params } = navigation.state;
    if (params) {
      const { populateSpeciality } = prevState;
      if (
        populateSpeciality === undefined ||
        (populateSpeciality &&
          params.filter.specialization.id !== populateSpeciality.id)
      ) {
        const specializationSelection = [];
        specializationSelection.push(params.filter.specialization.id);
        filterChangeAction(
          10,
          type === HOSPITAL_TYPE ? specializationSelection : []
        );
        const { region } = prevState;
        fetchMarkers(
          region,
          distanceFilter,
          type === HOSPITAL_TYPE ? specializationSelection : [],
          sessionId,
          type
        );
      }
      return {
        populateSpeciality: params.filter.specialization,
        detailId: undefined,
      };
    }
    if (loading !== prevState.loading) {
      if (!loading && prevState.loading && markers && markers.length === 0) {
        // Do not remove : Commented temporarily
        /*const { screens } = meta.metaDetail;
        const navigatorScreen = helpers.findScreen(
          screens,
          SCREEN_KEY_NAVIGATION_MAIN_SCREEN
        );
        const isHospitalType = type === HOSPITAL_TYPE;
        const element = helpers.findElement(
          SCREEN_KEY_NAVIGATION_MAIN_SCREEN,
          isHospitalType ? KEY_HOSPITALS : KEY_CLINICS
        );
        const errorTitle = helpers.findErrorMessage(
          element,
          isHospitalType
            ? ERROR_KEY_HOSPITALS_EMPTY_TITLE
            : ERROR_KEY_CLINICS_EMPTY_TITLE
        ).message;
        const errorMsg = helpers.findErrorMessage(
          element,
          isHospitalType ? ERROR_KEY_HOSPITALS_EMPTY : ERROR_KEY_CLINICS_EMPTY
        ).message;
        Alert.alert(errorTitle, errorMsg);*/
      }
      return { loading, detailId: undefined };
    }
    if (prevState.distanceFilter !== nextProps.distanceFilter) {
      const {
        type,
        sessionId,
        distanceFilter,
        specializationFilter,
        fetchMarkers,
      } = nextProps;
      const updatedRegion = Navigator.calDelta(
        prevState.location,
        nextProps.distanceFilter
      );
      fetchMarkers(
        updatedRegion,
        distanceFilter,
        type === HOSPITAL_TYPE ? specializationFilter : [],
        sessionId,
        type
      );
      return {
        distanceFilter: nextProps.distanceFilter,
        region: updatedRegion,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      permissionGranted: false,
      region: {},
      detailId: undefined,
      activeMarker:
        props.type === HOSPITAL_TYPE
          ? HOSPITAL_MARKER_ACTIVE
          : CLINIC_MARKER_ACTIVE,
      inactiveMarker:
        props.type === HOSPITAL_TYPE
          ? HOSPITAL_MARKER_INACTIVE
          : CLINIC_MARKER_INACTIVE,
      loading: props.loading,
      populateSpeciality: undefined,
      visibleHospitalCount: "",
      displayMap: false,
      type: props.type,
      distanceFilter: props.distanceFilter,
      location: {},
    };
    this.slideUpPanel = null;
    this.watchId = null;
    this.fetchCurrentLocation = this.fetchCurrentLocation.bind(this);
    this.updateRegion = this.updateRegion.bind(this);
    this.filterComponent = this.filterComponent.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
  }

  componentDidMount() {
    const { navigateCallback } = this.props;

    BackHandler.addEventListener("hardwareBackPress", navigateCallback);
    if (Platform.OS === "android") {
      this.requestLocationPermissionForAndroid();
    } else {
      this.fetchCurrentLocation();
      // this.checkForGPS();
    }
    // Populate Filter data
    const { fetchSpecializationList, selectedLanguage } = this.props;
    fetchSpecializationList(selectedLanguage);
    // Subscription
    this.subs = [
      this.props.navigation.addListener("didFocus", () => {
        this.setState({
          displayMap: true,
        });
      }),
      this.props.navigation.addListener("didBlur", () => {
        this.setState({
          detailId: undefined,
          displayMap: false,
        });
      }),
    ];
  }

  componentWillUnmount() {
    const { navigateCallback } = this.props;

    BackHandler.removeEventListener("hardwareBackPress", navigateCallback);

    if (this.watchId) {
      // eslint-disable-next-line no-undef
      navigator.geolocation.clearWatch(this.watchId);
    }
    this.subs.forEach(sub => sub.remove());
  }

  async requestLocationPermissionForAndroid() {
    const { navigateCallback } = this.props;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED || granted === true) {
        console.log("Location Permission grated!!!!!!!!!");
        const {
          ALREADY_ENABLED,
          USER_ENABLED_ON_REQUEST,
          promptForEnableLocationIfNeeded,
          /* ERR_FAILED_OPEN_DIALOG_CODE, ERR_SETTINGS_CHANGE_UNAVAILABLE_CODE,
          ERR_USER_DENIED_CODE, */
        } = NativeModules.LocationModule;
        promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
          .then(data => {
            if (data === ALREADY_ENABLED || data === USER_ENABLED_ON_REQUEST) {
              this.fetchCurrentLocation();
            }
          })
          .catch(err => {
            // The user has not accepted to enable the location services
            // or something went wrong during the process
            // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
            // codes :
            //  - ERR00 : The user has clicked on Cancel button in the popup
            //  - ERR01 : If the Settings change are unavailable
            //  - ERR02 : If the popup has failed to open
            console.log("Prompt location enable error ::: ", err);
            navigateCallback();
            // alert("Error " + err.message + ", Code : " + err.code);
          });
      } else {
        console.log("Location permission denied :: ", this.props);
        navigateCallback();
      }
    } catch (err) {
      navigateCallback();
      console.log("ERROR ON LOCATION PERMISSION ::: ", err);
    }
  }

  fetchCurrentLocation() {
    // eslint-disable-next-line no-undef
    const { meta } = this.props;
    const { navigateCallback } = this.props;
    const { geolocation } = navigator;
    const { commons } = meta.metaDetail;
    const ok = helpers
      .findElement(SCREEN_KEY_CHAT_REPORT, KEY_OK)
      .label.toUpperCase();
    const cancel = helpers.findElement(SCREEN_KEY_MANAGE_PROFILE, KEY_CANCEL)
      .label;
    geolocation.getCurrentPosition(
      response => {
        const { distanceFilter } = this.props;
        const lat =
          helpers.findCommon(COMMON_KEY_USER_LAT).value ||
          response.coords.latitude;
        const long =
          helpers.findCommon(COMMON_KEY_USER_LONG).value ||
          response.coords.longitude;
        const visibleHospitalCount =
          helpers.findCommon(COMMOM_NO_OF_HOSPITAL) || "";
        const visibleHospitalCountInt = parseInt(visibleHospitalCount.value);
        this.setState({
          visibleHospitalCount: visibleHospitalCountInt,
        });

        this.updateRegion(
          {
            latitude: parseFloat(lat),
            longitude: parseFloat(long),
            // ...response.coords,
            /*latitude: 12.9658,
            longitude: 80.2344,*/
            accuracy: 603,
          },
          distanceFilter,
          true
        );
      },
      error => {
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
                  navigateCallback(true);
                },
              },
              {
                text: cancel,
                style: "cancel",
                onPress: () => navigateCallback(true),
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
                  navigateCallback(true);
                },
              },
            ],
            { cancellable: false }
          );
        }
      },
      {
        maximumAge: 60000,
        timeout: 50000,
        enableHighAccuracy: false,
      }
    );
  }

  // checkForGPS() {
  //   navigator.geolocation.watchPosition(
  //     () => {
  //       console.log("GPS is enabled");
  //       this.setState({ locationEnabled: true });
  //       // if (this.state.appState === "active") {
  //         // fetchSpecializationList();
  //         this.fetchCurrentLocation();
  //       // }
  //     },
  //     () => {
  //       this.setState({ locationEnabled: false });
  //       this.enableGPSFromSettingsInIOS();
  //     }
  //   );
  // }

  // enableGPSFromSettingsInIOS() {
  //   Alert.alert(
  //     "Location Service is Turned off",
  //     'Turn on Location Services to Allow "Pulse" to determine your location',
  //     [
  //       {
  //         text: "Settings",
  //         onPress: () => {
  //           LinkingHelpers.openSettingsForIOS();
  //           this.props.navigateCallback(true);
  //         },
  //       },
  //       {
  //         text: "Cancel",
  //         onPress: () => {
  //           console.log("Cancel Pressed");
  //           this.props.navigateCallback(true);
  //         },
  //       },
  //     ],
  //     { cancelable: false }
  //   );
  // }

  updateRegion(location, distance, forceUpdate = false) {
    const { region } = this.state;
    if (region.latitude !== location.latitude || forceUpdate) {
      this.setState(
        {
          permissionGranted: true,
          location,
          region: Navigator.calDelta(location, distance),
        },
        () => {
          const {
            type,
            sessionId,
            distanceFilter,
            specializationFilter,
            fetchMarkers,
          } = this.props;
          const { region: updatedRegion } = this.state;
          fetchMarkers(
            updatedRegion,
            distanceFilter,
            type === HOSPITAL_TYPE ? specializationFilter : [],
            sessionId,
            type
          );
        }
      );
    }
  }

  clearFilter() {
    const { filterChangeAction, closeFilterOverlay } = this.props;
    filterChangeAction(10, [], () => {
      const { region } = this.state;
      const { distanceFilter } = this.props;
      this.updateRegion(region, distanceFilter, true);
      closeFilterOverlay();
    });
  }

  filterComponent() {
    const {
      closeFilterOverlay,
      distanceFilter,
      specializationFilter,
      meta,
      type,
    } = this.props;
    return (
      <React.Fragment>
        <View style={styles.flexRow}>
          <TouchableOpacity
            style={[styles.filterIcon, styles.backIconContainer]}
            onPress={closeFilterOverlay}
          >
            <OfflineImage
              accessibilityLabel="back"
              accesible
              key="backIcon"
              style={[styles.filterIcon]}
              fallbackSource={BACK}
              source={BACK}
            />
          </TouchableOpacity>
          <Text style={styles.filterTitle}>
            {
              helpers.findElement(
                SCREEN_KEY_NAVIGATION_MAIN_SCREEN,
                KEY_FILTER_BY_LABEL
              ).label
            }
          </Text>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={this.clearFilter}
          >
            <Text style={styles.clearText}>
              {
                helpers.findElement(
                  SCREEN_KEY_NAVIGATION_MAIN_SCREEN,
                  KEY_CLEAR_LABEL
                ).label
              }
            </Text>
          </TouchableOpacity>
        </View>
        <Filter
          metaScreenKey={
            type === HOSPITAL_TYPE
              ? SCREEN_KEY_HOSPITALS_FILTER
              : SCREEN_KEY_CLINICS_FILTER
          }
          value={{
            distance: `${distanceFilter}`,
            specialization:
              type === HOSPITAL_TYPE ? specializationFilter : undefined,
          }}
          onChange={filter => {
            const { specializationFilter, filterChangeAction } = this.props;
            filterChangeAction(
              parseInt(filter.distance, 10),
              type === HOSPITAL_TYPE
                ? filter.specialization
                : specializationFilter,
              () => {
                const { region } = this.state;
                this.updateRegion(region, filter.distance, true);
                closeFilterOverlay();
              }
            );
          }}
        />
      </React.Fragment>
    );
  }

  filterClosestMarkers = (markersArray, region, count) => {
    const currentLat = region.latitude;
    const currentLong = region.longitude;

    markersArray.forEach(marker => {
      const markerLat = marker.address.latitude;
      const markerLong = marker.address.longitude;

      const distance = Math.sqrt(
        Math.pow(currentLat - markerLat, 2) +
          Math.pow(currentLong - markerLong, 2)
      );
      marker.distance = distance;
    });

    markersArray.sort(function(a, b) {
      return a.distance - b.distance;
    });
    const returnCount =
      count > markersArray.length ? markersArray.length : count;
    return markersArray.slice(0, returnCount);
  };

  /* eslint-disable */
  render() {
    const { permissionGranted, region, detailId, displayMap } = this.state;
    const {
      markers,
      renderFilterComponent,
      meta,
      type,
      distanceFilter,
      loading,
    } = this.props;
    if (!permissionGranted || loading) {
      return <Loader />;
    }
    const { activeMarker, inactiveMarker, visibleHospitalCount } = this.state;
    const visibleMarkers = markers
      ? markers.map(marker =>
          Object.assign({}, marker, {
            icon: marker.id === detailId ? activeMarker : inactiveMarker,
            coordinate: {
              latitude: marker.address.latitude,
              longitude: marker.address.longitude,
            },
            title: marker.name,
          })
        )
      : [];

    const nearestMarkers =
      visibleMarkers.length > visibleHospitalCount
        ? this.filterClosestMarkers(
            visibleMarkers,
            region,
            visibleHospitalCount
          )
        : visibleMarkers;

    return (
      <React.Fragment>
        <TouchableOpacity
          onPress={() => {
            const { navigateCallback } = this.props;
            navigateCallback(true);
          }}
          style={styles.closeImageEncloser}
        >
          <OfflineImage
            source={BACK}
            style={styles.closeImage}
            fallbackSource={BACK}
          />
        </TouchableOpacity>
        <View style={styles.container}>
          {displayMap && markers !== undefined && (
            <MapNavigator
              location={region}
              onUserLocationChange={e =>
                this.updateRegion(e.nativeEvent.coordinate, distanceFilter)
              }
              // markers={visibleMarkers}
              markers={nearestMarkers}
              onMarkerPress={marker => {
                this.setState({
                  detailId: marker.id,
                });
                if (this.props.type === HOSPITAL_TYPE) {
                  this.props.setHospitalDetails(marker);
                }
              }}
            />
          )}
          {detailId && (
            <TouchableWithoutFeedback
              onPress={() => {
                if (this.slideUpPanel) {
                  this.setState(
                    {
                      detailId: null,
                    },
                    this.slideUpPanel.unmountFromView
                  );
                }
              }}
            >
              <View style={styles.filterOverlay} />
            </TouchableWithoutFeedback>
          )}
          <View
            style={[
              styles.overlay,
              {
                bottom:
                  detailId && this.slideUpPanel
                    ? this.slideUpPanel.collapseHeight - 75
                    : 15,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.filterTouchableContainer}
              onPress={() => {
                renderFilterComponent(this.filterComponent());
              }}
            >
              <OfflineImage
                style={styles.filterIcon}
                source={{
                  uri: helpers.findElement(
                    SCREEN_KEY_NAVIGATION_MAIN_SCREEN,
                    KEY_FILTER_ICON
                  ).image,
                }}
                key={KEY_FILTER_ICON}
                fallbackSource={NAVIGATOR_FILTER}
              />
            </TouchableOpacity>
          </View>
          <SlideUpPanel
            screenHeight={meta.applicationHeight}
            assignRef={instance => {
              this.slideUpPanel = instance;
            }}
            additionalStyles={styles.slideUpPanel}
            render={additionalProps => {
              if (type === HOSPITAL_TYPE) {
                return (
                  <HospitalDetail
                    detailId={detailId}
                    currentLocation={{
                      latitude: region ? region.latitude : null,
                      longitude: region ? region.longitude : null,
                    }}
                    {...additionalProps}
                  />
                );
              }
              return (
                <ClinicDetail
                  detailId={detailId}
                  currentLocation={{
                    latitude: region ? region.latitude : null,
                    longitude: region ? region.longitude : null,
                  }}
                  {...additionalProps}
                />
              );
            }}
          />
        </View>
      </React.Fragment>
    );
  }
}

Navigator.propTypes = {
  type: PropTypes.string.isRequired,
  meta: PropTypes.instanceOf(Object).isRequired,
  markers: PropTypes.array.isRequired,
  sessionId: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  navigation: PropTypes.instanceOf(Object).isRequired,
  fetchMarkers: PropTypes.func.isRequired,
  renderFilterComponent: PropTypes.func.isRequired,
  updateFilterComponent: PropTypes.func.isRequired,
  closeFilterOverlay: PropTypes.func.isRequired,
  distanceFilter: PropTypes.number.isRequired,
  specializationFilter: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchSpecializationList: PropTypes.func.isRequired,
  filterChangeAction: PropTypes.func.isRequired,
  navigateCallback: PropTypes.func.isRequired,
  setHospitalDetails: PropTypes.func.isRequired,
  selectedLanguage: PropTypes.string.isRequired,
};

const mapStateToProps = (state, props) => ({
  loading: state.navigator[props.type]["loading"],
  markers: state.navigator[props.type]["markers"],
  meta: state.meta,
  sessionId: state.auth.token,
  distanceFilter: state.navigator.filter.distance,
  specializationFilter: state.navigator.filter.selectedSpecialization,
  selectedLanguage: state.userPreferences.language,
});

const mapDispatchToProps = {
  fetchMarkers,
  fetchSpecializationList,
  filterChangeAction,
  setHospitalDetails,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigator);
