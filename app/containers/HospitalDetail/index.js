import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View, Platform } from "react-native";
import { TabNavigator } from "react-navigation";
import Info from "./Info";
import {
  CoreComponents,
  CoreConfig,
  metaHelpers,
  CoreActions,
} from "@pru-rt-internal/rnmobile-app-core-framework";

const { NavigatorDetailFlex } = CoreComponents;

const { colors, SCREEN_KEY_HOSPITAL_DETAIL_SCREEN_TABS } = CoreConfig;
const helpers = metaHelpers;
import Doctors from "./Doctors";
import Rooms from "./Rooms";
import Specialization from "./Specialization";

import styles from "./styles";
const { fetchHospitalDetails, setHospitalDetails } = CoreActions;

// Padding for detail header + Height of bottom bar navigator
const paddingOnNavigatorHeaderFlex =
  Platform.OS === "ios" ? 25 + 40 + 53 : 40 + 53;

const KEY_INFO_TAB = "hospitaldetailscreendetailsinfotab";
const KEY_SPECIALITY_TAB = "hospitaldetailscreendetailsspecidalitytab";
const KEY_DOCTORS_TAB = "hospitaldetailscreendetailsdoctorstab";
const KEY_ROOMS_TAB = "hospitaldetailscreendetailsroomstab";

const NavigatorDetailMenu = () =>
  TabNavigator(
    {
      InfoTab: {
        screen: Info,
        navigationOptions: () => ({
          tabBarLabel: helpers.findElement(
            SCREEN_KEY_HOSPITAL_DETAIL_SCREEN_TABS,
            KEY_INFO_TAB
          ).label,
        }),
      },
      SpecialityTab: {
        screen: () => <Specialization />,
        navigationOptions: () => ({
          tabBarLabel: helpers.findElement(
            SCREEN_KEY_HOSPITAL_DETAIL_SCREEN_TABS,
            KEY_SPECIALITY_TAB
          ).label,
        }),
      },
      DoctorsTab: {
        screen: () => <Doctors />,
        navigationOptions: () => ({
          tabBarLabel: helpers.findElement(
            SCREEN_KEY_HOSPITAL_DETAIL_SCREEN_TABS,
            KEY_DOCTORS_TAB
          ).label,
        }),
      },
      RoomsTab: {
        screen: () => <Rooms />,
        navigationOptions: () => ({
          tabBarLabel: helpers.findElement(
            SCREEN_KEY_HOSPITAL_DETAIL_SCREEN_TABS,
            KEY_ROOMS_TAB
          ).label,
        }),
      },
    },
    {
      ...TabNavigator.Presets.AndroidTopTabs,
      tabBarOptions: {
        indicatorStyle: {
          opacity: 1,
          backgroundColor: "#efefef",
          height: 7,
          padding: 0,
        },
        activeTintColor: colors.nevada,
        showIcon: false,
        showLabel: true,
        upperCaseLabel: false,
        inactiveTintColor: "#a8a8a8", // Color of tab when not pressed
        labelStyle: {
          fontSize: 16.3,
          lineHeight: 16.3,
          marginTop: 0,
          marginBottom: 2,
          marginLeft: 5,
          marginRight: 5,
          fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
        },
        style: {
          // borderBottomColor: '#29000000',
          // borderBottomWidth: 2,
          marginTop: 0,
          paddingTop: 0,
          backgroundColor: colors.white, // Makes Android tab bar white instead of standard blue
        },
      },
      tabBarPosition: "top",
      lazy: true,
      swipeEnabled: false,
    }
  );

class HospitalDetail extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { detailId } = nextProps;
    if (nextProps.detailId !== prevState.detailId) {
      if (nextProps.detailId) {
        // TODO : Fetch new details from props
        const { fetchDetailsAction, sessionId } = nextProps;
        fetchDetailsAction(detailId, sessionId, nextProps.mountIntoView);
      } else {
        const { setHospitalDetailsAction } = nextProps;
        setHospitalDetailsAction({
          id: "",
          name: "",
          timing: "",
          specialities: [],
          contactDetails: {},
          address: {},
        });
        nextProps.unmountFromView();
      }
      return {
        detailId: nextProps.detailId,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      detailId: props.detailId,
    };
    this.HospitalTab = NavigatorDetailMenu(props.detailId);
  }

  componentDidMount() {
    const { detailId, fetchDetailsAction, sessionId } = this.props;
    if (detailId) {
      fetchDetailsAction(detailId, sessionId);
    }
  }

  render() {
    const {
      expanded,
      detailId,
      meta,
      hospitalName,
      slideDown,
      address,
      currentLocation,
    } = this.props;
    return (
      <View style={styles.container}>
        {/* {expanded && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={slideDown}
            style={styles.closeImageEncloser}
          >
            <Image source={BACK} style={styles.closeImage} />
          </TouchableOpacity>
        )} */}
        <NavigatorDetailFlex
          meta={meta}
          name={hospitalName}
          currentLocation={currentLocation}
          location={{
            latitude: address ? address.latitude : null,
            longitude: address ? address.longitude : null,
          }}
          layoutProps={{
            onLayout: event => {
              const { setParentHeight } = this.props;
              setParentHeight(
                event.nativeEvent.layout.height + paddingOnNavigatorHeaderFlex
              );
            },
          }}
        />
        <this.HospitalTab />
      </View>
    );
  }
}

HospitalDetail.propTypes = {
  meta: PropTypes.objectOf(PropTypes.any).isRequired,
  detailId: PropTypes.string,
  expanded: PropTypes.bool.isRequired,
  sessionId: PropTypes.string.isRequired,
  hospitalName: PropTypes.string.isRequired,
  address: PropTypes.objectOf(PropTypes.any).isRequired,
  currentLocation: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }).isRequired,
  fetchDetailsAction: PropTypes.func.isRequired,
  setHospitalDetailsAction: PropTypes.func.isRequired,
  setParentHeight: PropTypes.func.isRequired,
  slideDown: PropTypes.func.isRequired,
  mountIntoView: PropTypes.func.isRequired,
  unmountFromView: PropTypes.func.isRequired,
};

HospitalDetail.defaultProps = {
  detailId: undefined,
};

export default connect(
  state => ({
    meta: state.meta,
    sessionId: state.auth.token,
    loading: state.hospitalDetail.details.loading,
    hospitalName: state.hospitalDetail.details.name,
    address: state.hospitalDetail.details.address,
  }),
  {
    fetchDetailsAction: fetchHospitalDetails,
    setHospitalDetailsAction: setHospitalDetails,
  }
)(HospitalDetail);
