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
const { colors, SCREEN_KEY_CLINIC_DETAIL_SCREEN_TABS } = CoreConfig;
const helpers = metaHelpers;

import styles from "./styles";
const getClinicDetails = CoreActions;

// Padding for detail header + Height of bottom bar navigator - 10
const paddingOnNavigatorHeaderFlex =
  Platform.OS === "ios" ? 25 + 40 + 53 : 40 + 53;

const KEY_INFO_TAB = "clinicdetailscreendetailsinfotab";

const NavigatorDetailMenu = () =>
  TabNavigator(
    {
      InfoTab: {
        screen: Info,
        navigationOptions: () => ({
          tabBarLabel: helpers.findElement(
            SCREEN_KEY_CLINIC_DETAIL_SCREEN_TABS,
            KEY_INFO_TAB
          ).label,
        }),
      },
    },
    {
      ...TabNavigator.Presets.AndroidTopTabs,
      tabBarOptions: {
        indicatorStyle: {
          opacity: 1,
          backgroundColor: colors.lightGray,
          height: 7,
          padding: 0,
        },
        activeTintColor: colors.nevada,
        showIcon: false,
        showLabel: true,
        upperCaseLabel: false,
        inactiveTintColor: colors.silver, // Color of tab when not pressed
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

class ClinicDetail extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { detailId } = nextProps;
    if (nextProps.detailId !== prevState.detailId) {
      if (nextProps.detailId) {
        // TODO : Fetch new details from props
        const { fetchDetailsAction, sessionId } = nextProps;
        fetchDetailsAction(detailId, sessionId, nextProps.mountIntoView);
      } else {
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
    this.ClinicTab = NavigatorDetailMenu(props.detailId);
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
      meta,
      hospitalName,
      slideDown,
      address,
      currentLocation,
    } = this.props;
    return (
      <View style={styles.container}>
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
        <this.ClinicTab />
      </View>
    );
  }
}

ClinicDetail.propTypes = {
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
  setParentHeight: PropTypes.func.isRequired,
  slideDown: PropTypes.func.isRequired,
  mountIntoView: PropTypes.func.isRequired,
  unmountFromView: PropTypes.func.isRequired,
};

ClinicDetail.defaultProps = {
  detailId: undefined,
};

export default connect(
  state => ({
    meta: state.meta,
    sessionId: state.auth.token,
    loading: state.clinicDetail.loading,
    hospitalName: state.clinicDetail.name,
    address: state.clinicDetail.address,
  }),
  {
    fetchDetailsAction: getClinicDetails,
  }
)(ClinicDetail);
