import React from "react";
import PropTypes from "prop-types";
import { Platform, StyleSheet, Animated } from "react-native";
import { connect } from "react-redux";
import { TabNavigator } from "react-navigation";
import OfflineImage from "react-native-image-offline/src/OfflineImage";
import {
  CoreConfig,
  metaHelpers,
  CoreConstants,
} from "@pru-rt-internal/rnmobile-app-core-framework";
import Navigator from "./Navigator";
import Specialization from "./Specialization";

const { colors, width, SCREEN_KEY_NAVIGATION_MAIN_SCREEN } = CoreConfig;

const { HOSPITAL_TYPE, CLINIC_TYPE } = CoreConstants;

import {
  SPECIALIZATION_TAB_INACTIVE,
  CLINIC_TAB_ACTIVE,
  CLINIC_TAB_INACTIVE,
  HOSPITAL_TAB_ACTIVE,
  HOSPITAL_TAB_INACTIVE,
  SPECIALIZATION_TAB_ACTIVE,
} from "../../config/images";

const helpers = metaHelpers;

const KEY_HOSPITALS_ACTIVE = "activenavigationmainhospitals";
const KEY_CLINICS_ACTIVE = "activenavigationmainclinics";
const KEY_SPECIALIZATION_ACTIVE = "activenavigationmainspecialization";
const KEY_HOSPITALS_INACTIVE = "inactivenavigationmainhospitals";
const KEY_CLINICS_INACTIVE = "inactivenavigationmainclinics";
const KEY_SPECIALIZATION_INACTIVE = "inactivenavigationmainspecialization";

const NavigatorMenu = (
  initialRoute,
  renderFilterComponent,
  updateFilterComponent,
  closeFilterOverlay,
  navigateCallback
) =>
  TabNavigator(
    {
      Hospitals: {
        screen: navigationProps => (
          <Navigator
            type={HOSPITAL_TYPE}
            renderFilterComponent={renderFilterComponent}
            updateFilterComponent={updateFilterComponent}
            closeFilterOverlay={closeFilterOverlay}
            navigateCallback={navigateCallback}
            {...navigationProps}
          />
        ),
        navigationOptions: () => ({
          title: helpers.findElement(
            SCREEN_KEY_NAVIGATION_MAIN_SCREEN,
            KEY_HOSPITALS_ACTIVE
          ).label,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <OfflineImage
                resizeMode={"contain"}
                source={{
                  uri: helpers.findElement(
                    SCREEN_KEY_NAVIGATION_MAIN_SCREEN,
                    KEY_HOSPITALS_ACTIVE
                  ).image,
                }}
                style={styles.tabIcon}
                fallbackSource={HOSPITAL_TAB_ACTIVE}
              />
            ) : (
              <OfflineImage
                resizeMode={"contain"}
                source={{
                  uri: helpers.findElement(
                    SCREEN_KEY_NAVIGATION_MAIN_SCREEN,
                    KEY_HOSPITALS_INACTIVE
                  ).image,
                }}
                style={styles.tabIcon}
                fallbackSource={HOSPITAL_TAB_INACTIVE}
              />
            ),
        }),
      },
      Clinics: {
        screen: navigationProps => (
          <Navigator
            type={CLINIC_TYPE}
            renderFilterComponent={renderFilterComponent}
            updateFilterComponent={updateFilterComponent}
            closeFilterOverlay={closeFilterOverlay}
            {...navigationProps}
            navigateCallback={navigateCallback}
          />
        ),
        navigationOptions: () => ({
          title: helpers.findElement(
            SCREEN_KEY_NAVIGATION_MAIN_SCREEN,
            KEY_CLINICS_ACTIVE
          ).label,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <OfflineImage
                source={{
                  uri: helpers.findElement(
                    SCREEN_KEY_NAVIGATION_MAIN_SCREEN,
                    KEY_CLINICS_ACTIVE
                  ).image,
                }}
                resizeMode={"contain"}
                style={styles.tabIcon}
                fallbackSource={CLINIC_TAB_ACTIVE}
              />
            ) : (
              <OfflineImage
                resizeMode={"contain"}
                source={{
                  uri: helpers.findElement(
                    SCREEN_KEY_NAVIGATION_MAIN_SCREEN,
                    KEY_CLINICS_INACTIVE
                  ).image,
                }}
                style={styles.tabIcon}
                fallbackSource={CLINIC_TAB_INACTIVE}
              />
            ),
        }),
      },
      Specialization: {
        screen: navigationProps => (
          <Specialization
            {...navigationProps}
            navigateCallback={navigateCallback}
          />
        ),
        navigationOptions: () => ({
          title: helpers.findElement(
            SCREEN_KEY_NAVIGATION_MAIN_SCREEN,
            KEY_SPECIALIZATION_ACTIVE
          ).label,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <OfflineImage
                resizeMode={"contain"}
                source={{
                  uri: helpers.findElement(
                    SCREEN_KEY_NAVIGATION_MAIN_SCREEN,
                    KEY_SPECIALIZATION_ACTIVE
                  ).image,
                }}
                style={styles.tabIcon}
                fallbackSource={SPECIALIZATION_TAB_ACTIVE}
              />
            ) : (
              <OfflineImage
                resizeMode={"contain"}
                source={{
                  uri: helpers.findElement(
                    SCREEN_KEY_NAVIGATION_MAIN_SCREEN,
                    KEY_SPECIALIZATION_INACTIVE
                  ).image,
                }}
                style={styles.tabIcon}
                fallbackSource={SPECIALIZATION_TAB_INACTIVE}
              />
            ),
        }),
      },
    },
    {
      ...TabNavigator.Presets.AndroidTopTabs,
      tabBarOptions: {
        indicatorStyle: {
          opacity: 0,
        },
        activeTintColor: colors.crimson,
        showIcon: true,
        showLabel: true,
        upperCaseLabel: false,
        inactiveTintColor: colors.silver, // Color of tab when not pressed
        labelStyle: {
          fontSize: 10.7,
          lineHeight: 12,
          marginTop: 0,
          paddingTop: 4,
          paddingBottom: 4,
          fontFamily:
            Platform.OS === "ios" ? "PruSansNormal" : "pruSansRegular",
        },
        style: {
          marginTop: 0,
          marginBottom: 0,
          paddingTop: 0,
          paddingBottom: 0,
          borderTopWidth: 2,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          borderColor: colors.nevada,
          backgroundColor: colors.white,
          height: 63,
        },
      },
      initialRouteName: initialRoute,
      tabBarPosition: "bottom",
      lazy: true,
      swipeEnabled: false,
    }
  );

const NavigatorStack = (
  initialRoute,
  renderFilterComponent,
  updateFilterComponent,
  closeFilterOverlay,
  navigateCallback
) =>
  NavigatorMenu(
    initialRoute,
    renderFilterComponent,
    updateFilterComponent,
    closeFilterOverlay,
    navigateCallback
  );

class NavigatorContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFilterOpen: false,
      renderer: null,
    };
    this._animatedValue = new Animated.Value(width);
    this.renderFilterComponent = this.renderFilterComponent.bind(this);
    this.updateFilterComponent = this.updateFilterComponent.bind(this);
    this.closeFilterOverlay = this.closeFilterOverlay.bind(this);
    this.navigateCallback = this.navigateCallback.bind(this);
    this.loadMap = this.loadMap.bind(this);
    this.renderAndroid = this.renderAndroid.bind(this);
    this.NavigatorStackContainer = NavigatorStack(
      props.navigation.state.params.route,
      this.renderFilterComponent,
      this.updateFilterComponent,
      this.closeFilterOverlay,
      this.navigateCallback
    );
  }

  navigateCallback(back = false) {
    const { navigation } = this.props;
    if (back) {
      navigation.goBack();
    } else {
      navigation.navigate("MainTab");
    }
  }

  renderFilterComponent(renderer) {
    this.setState(
      {
        isFilterOpen: true,
        renderer,
      },
      () => {
        Animated.timing(this._animatedValue, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start();
      }
    );
  }

  updateFilterComponent(renderer) {
    this.setState({
      renderer,
    });
  }

  closeFilterOverlay() {
    Animated.timing(this._animatedValue, {
      toValue: width,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      this.setState({
        isFilterOpen: false,
        renderer: null,
      });
    });
  }

  render() {
    return this.loadMap();
  }

  loadMap() {
    // if (Platform.OS === 'ios') {
    //   return (
    //     <RNGoogleMapView mapData="text" style={styles.map} />
    //   );
    // }

    return this.renderAndroid();
  }

  renderAndroid() {
    const { isFilterOpen, renderer } = this.state;
    return (
      <React.Fragment>
        <this.NavigatorStackContainer />
        {isFilterOpen && (
          <Animated.View
            style={[
              styles.overlay,
              {
                transform: [
                  {
                    translateX: this._animatedValue,
                  },
                ],
              },
            ]}
          >
            {renderer && renderer}
          </Animated.View>
        )}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  tabIcon: {
    width: 20,
    height: 20,
  },
});

NavigatorContainer.propTypes = {
  meta: PropTypes.instanceOf(Object).isRequired,
  navigation: PropTypes.instanceOf(Object).isRequired,
};

export default connect(state => ({
  meta: state.meta,
}))(NavigatorContainer);
