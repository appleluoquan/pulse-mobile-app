import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Platform,
} from "react-native";
import ModalDropdown from "react-native-modal-dropdown";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import styles from "./styles";
import {
  CoreConfig,
  metaHelpers,
  CoreActions,
  CoreComponents,
} from "@pru-rt-internal/rnmobile-app-core-framework";
import MapNavigator from "../../MapNavigator/MapNavigator";
import StateLocationMeta from "../CountryLocationMeta";

const { getAIMEData } = CoreActions;
const { AIMEGraph } = CoreComponents;
const { TRENDS_SCREEN } = CoreConfig;
const helpers = metaHelpers;
const AREA_LABEL = "area";
const WEEK_LABEL = "thisweek";
const CASES_LABEL = "cases";
const OUTBREAK_LABEL = "outbreak";

const regularFont = Platform.OS === "ios" ? "PruSansNormal" : "pru-regular";
const boldFont = Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold";

class TrendSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      states: [],
      aimeResponse: {},
      area: "",
      outbreak: "",
      cases: "",
      graphData: [],
      casesData: [],
      aimeIndex: 0,
      outbreakBackround: "#E3E3E3",
      casesBackground: "",
      stateCoordinates: {
        latitude: null,
        longitude: null,
        graphInputLabel: "",
        graphInputCasesOutbreaks: "",
        graphInputWeekLabel: "",
      },
      stateLocationData: [],
      stateMarkersOutbreaks: [],
      stateMarkersCases: [],
      markerListData: [],
    };

    this.areaLabel = "";
    this.weekLabel = "";
    this.casesLabel = "";
    this.outbreakLabel = "";
  }

  componentWillUnmount() {
    const { navigateCallback } = this.props;

    BackHandler.removeEventListener("hardwareBackPress", navigateCallback);
  }

  componentDidMount() {
    const { navigateCallback, token } = this.props;

    BackHandler.addEventListener("hardwareBackPress", navigateCallback);

    this.props.getAIMEData(token);
    this.setState({
      graphInputLabel: this.outbreakLabel,
      graphInputWeekLabel: this.weekLabel,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      aimeResponse: nextProps.userProfile.aimeResponse,
    });
  }

  onSelectPicker(index) {
    const { aimeResponse, stateMarkersOutbreaks } = this.state;
    const outbreakArraySize = aimeResponse[index].outbreaks.length;
    const currentWeekOutbreak =
      aimeResponse[index].outbreaks[outbreakArraySize - 1];

    const casesArraySize = aimeResponse[index].cases.length;
    const currentWeekCases = aimeResponse[index].cases[casesArraySize - 1];
    //  const stateCoordinates = {
    //    latitude : aimeResponse[index].latitude,
    //    longitude :aimeResponse[index].longitude
    //  }

    const stateCoordinates = this.state.stateLocationData[index].location;
    this.setState({
      outbreak: currentWeekOutbreak,
      cases: currentWeekCases,
      casesData: aimeResponse[index].cases,
      graphData: aimeResponse[index].outbreaks,
      aimeIndex: index,
      outbreakBackround: "#E3E3E3",
      casesBackground: "white",
      stateCoordinates,
      graphInputLabel: this.outbreakLabel,
      graphInputCasesOutbreaks: aimeResponse[index].outbreaks[0],
      markerListData: stateMarkersOutbreaks,
    });
    return index;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const state = [];
    let stateLocation = [];
    const markersListOutbreaks = [];
    const markerListCases = [];
    const radiusBase = StateLocationMeta.RADIUS_BASE;
    const responseData = nextProps.userProfile.aimeResponse;
    if (Object.keys(responseData).length > 0) {
      for (let i = 0; i < nextProps.userProfile.aimeResponse.length; i += 1) {
        const stateData = nextProps.userProfile.aimeResponse[i];
        const config = StateLocationMeta.states[stateData.name];

        const stateObj = {
          name: nextProps.userProfile.aimeResponse[i].name,
          location: {
            latitude: nextProps.userProfile.aimeResponse[i].latitude,
            longitude: nextProps.userProfile.aimeResponse[i].longitude,
            latitudeDelta: config.latitudeDelta,
            longitudeDelta: config.longitudeDelta,
          },
        };
        const markerObj = {
          latitude: nextProps.userProfile.aimeResponse[i].latitude,
          longitude: nextProps.userProfile.aimeResponse[i].longitude,
          shape: "CIRCLE",
          radius:
            radiusBase * nextProps.userProfile.aimeResponse[i].outbreaks[0],
          fillColor: "rgba(255, 0, 0, 0.3)",
        };

        const markerObjCase = {
          ...markerObj,
          radius: radiusBase * nextProps.userProfile.aimeResponse[i].cases[0],
        };
        markerListCases.push(markerObjCase);
        stateLocation.push(stateObj);
        state.push(nextProps.userProfile.aimeResponse[i].name);
        markersListOutbreaks.push(markerObj);
      }
      markersListOutbreaks.shift();
      markerListCases.shift();
      const aimeCurrStateObject = nextProps.userProfile.aimeResponse[0];

      const outbreakArraySize = aimeCurrStateObject.outbreaks.length;
      const currentWeekOutbreak =
        aimeCurrStateObject.outbreaks[outbreakArraySize - 1];

      const casesArraySize = aimeCurrStateObject.cases.length;
      const currentWeekCases = aimeCurrStateObject.cases[casesArraySize - 1];

      const stateCoordinates = stateLocation[0].location;
      return {
        aimeResponse: nextProps.userProfile.aimeResponse,
        states: state,
        area: state[0],
        outbreak: currentWeekOutbreak,
        cases: currentWeekCases,
        graphData: aimeCurrStateObject.outbreaks,
        stateCoordinates,
        stateLocationData: stateLocation,
        graphInputCasesOutbreaks: aimeCurrStateObject.outbreaks[0],
        stateMarkersOutbreaks: markersListOutbreaks,
        stateMarkersCases: markerListCases,
        markerListData: markersListOutbreaks,
      };
    }
  }

  setGraphData(ref) {
    const {
      aimeResponse,
      aimeIndex,
      outbreak,
      cases,
      stateMarkersOutbreaks,
      stateMarkersCases,
    } = this.state;
    if (aimeResponse[aimeIndex] === undefined) {
      return;
    }
    if (ref === "outBreak") {
      this.setState({
        graphData: aimeResponse[aimeIndex].outbreaks,
        outbreakBackround: "#E3E3E3",
        casesBackground: "white",
        graphInputLabel: this.outbreakLabel,
        graphInputCasesOutbreaks: outbreak,
        markerListData: stateMarkersOutbreaks,
      });
    }
    if (ref === "cases") {
      this.setState({
        graphData: aimeResponse[aimeIndex].cases,
        outbreakBackround: "white",
        casesBackground: "#E3E3E3",
        graphInputLabel: this.casesLabel,
        graphInputCasesOutbreaks: cases,
        markerListData: stateMarkersCases,
      });
    }
  }

  onPressDropDown = () => {
    if (this.dropDownRef) {
      this.dropDownRef.show();
    }
  };

  render() {
    this.areaLabel = helpers.findElement(TRENDS_SCREEN, AREA_LABEL).label;
    this.weekLabel = helpers.findElement(TRENDS_SCREEN, WEEK_LABEL).label;
    this.casesLabel = helpers.findElement(TRENDS_SCREEN, CASES_LABEL).label;
    this.outbreakLabel = helpers.findElement(
      TRENDS_SCREEN,
      OUTBREAK_LABEL
    ).label;
    const {
      graphData,
      casesBackground,
      area,
      states,
      outbreakBackround,
      outbreak,
      cases,
      graphInputLabel,
      graphInputCasesOutbreaks,
      graphInputWeekLabel,
    } = this.state;

    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            height: 100,
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "column",
              height: 100,
              paddingTop: 0,
            }}
            onPress={() => {
              this.onPressDropDown();
            }}
          >
            <Text
              style={{
                paddingLeft: 20,
                paddingTop: 10,
                fontFamily: regularFont,
              }}
            >
              {this.areaLabel}
            </Text>
            <View style={{ flexDirection: "row", paddingLeft: 20 }}>
              <ModalDropdown
                ref={dropDownRef => {
                  this.dropDownRef = dropDownRef;
                }}
                textStyle={styles.textStyle}
                defaultValue={area}
                dropdownStyle={styles.dropdownStyle}
                dropdownTextStyle={styles.dropdownTextStyle}
                style={styles.dropDownButton}
                options={states}
                onSelect={index => this.onSelectPicker(index)}
              />
              <View>
                <MaterialIcons
                  pointerEvents="none"
                  name="arrow-drop-down"
                  size={25}
                  color="#a8a8a8"
                />
              </View>
            </View>
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              height: 100,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Text style={{ fontFamily: regularFont }}>{this.weekLabel}</Text>

            <TouchableOpacity
              onPress={() => this.setGraphData("outBreak")}
              style={{
                backgroundColor: outbreakBackround,
                borderRadius: 8,
                width: 70,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {outbreak}
              </Text>
              <Text style={{ textAlign: "center", fontFamily: regularFont }}>
                {this.outbreakLabel}
              </Text>
              <View style={{ alignItems: "center" }}>
                <MaterialIcons
                  pointerEvents="none"
                  name="arrow-drop-down"
                  size={25}
                  color="#a8a8a8"
                />
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              height: 100,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={() => this.setGraphData("cases")}
              style={{
                backgroundColor: casesBackground,
                borderRadius: 8,
                width: 70,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  alignItems: "center",
                  textAlign: "center",
                  fontFamily: boldFont,
                }}
              >
                {cases}
              </Text>
              <Text style={{ textAlign: "center", fontFamily: regularFont }}>
                {this.casesLabel}
              </Text>
              <View style={{ alignItems: "center" }}>
                <MaterialIcons
                  pointerEvents="none"
                  name="arrow-drop-down"
                  size={25}
                  color="#a8a8a8"
                  style={{ alignItems: "center", justifyContent: "center" }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <AIMEGraph
          data={graphData}
          graphInputLabel={graphInputLabel}
          graphInputWeekLabel={graphInputWeekLabel}
          graphInputCasesOutbreaks={graphInputCasesOutbreaks}
        />

        {this.state.stateLocationData.length > 0 && (
          <MapNavigator
            location={this.state.stateCoordinates}
            markers={this.state.markerListData}
          />
        )}
      </View>
    );
  }
}

TrendSelection.propTypes = {
  token: PropTypes.string.isRequired,
  navigateCallback: PropTypes.func.isRequired,
};

export const mapStateToProps = state => ({
  meta: state.meta,
  userProfile: state.profile,
  token: state.auth.token,
});

export default connect(
  mapStateToProps,
  { getAIMEData }
)(TrendSelection);
