import React from "react";
import { View, Platform } from "react-native";
import { TabNavigator, createStackNavigator } from "react-navigation";
import {
  getStore,
  CoreConfig,
  metaHelpers,
  CoreActions,
  CoreConstants,
} from "@pru-rt-internal/rnmobile-app-core-framework";

import { BabylonNavigation } from "@pru-rt-internal/react-native-babylon-chatbot";
const { ChatStack, HealthCheckStack } = BabylonNavigation;
const { SCREEN_INDEX_MAPPING, SCREEN_KEY_HOME_TAB } = CoreConfig;
import { OfflineImage } from "react-native-image-offline";

import MainPage from "../MainPage";
import TabBarComponent from "./TabBarComponent";
import {
  HOME_RED,
  HOME_GREY,
  SYMPTOMES_RED,
  RECORD_GREY,
  MORE_GREY,
  SYMPTOMES_GREY,
  RECORD_RED,
  MORE_RED,
} from "../../config";
import GettingTreatment from "../GettingTreatment";
import StayingWell from "../StayingWell";

const { store } = getStore();
const helpers = metaHelpers;
const { IS_DRAWER_OPEN } = CoreActions;
const { OPENTOK_VIDEO_CALL, GET_TREATMENT } = CoreConstants;
const ACTIVE_CHECK_SYMPTOMS = "activechecksymptoms";
const ACTIVE_HOME = "activehome";
const ACTIVE_ASSESS_HEALTH = "activeassesshealth";
const ACTIVE_MORE = "activemore";
const INACTIVE_CHECK_SYMPTOMS = "inactivechecksymptoms";
const INACTIVE_HOME = "activehome";
const INACTIVE_ASSESS_HEALTH = "inactiveassesshealth";
const INACTIVE_MORE = "inactivemore";

const HomeTab = createStackNavigator(
  {
    MainPage: {
      screen: MainPage,
      navigationOptions: {
        gesturesEnabled: false,
        header: null, // this will hide the header
      },
    },
    [GET_TREATMENT]: {
      screen: GettingTreatment,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      },
    },
    StayingWell: {
      screen: StayingWell,
      navigationOptions: {
        gesturesEnabled: false,
        header: null,
      },
    },
  },
  {
    initialRouteName: "MainPage",
  }
);

HomeTab.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  const { routeName } = navigation.state.routes[navigation.state.index];
  if (routeName === OPENTOK_VIDEO_CALL) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};

const MainTab = TabNavigator(
  {
    HomeTab: {
      screen: HomeTab,
      navigationOptions: {
        tabBarLabel: () => homeTabMeta(ACTIVE_HOME).label,
        tabBarIcon: ({ focused }) =>
          focused ? (
            <OfflineImage
              style={{ width: 20, height: 20 }}
              source={{ uri: homeTabMeta(ACTIVE_HOME).image }}
              fallbackSource={HOME_RED}
            />
          ) : (
            <OfflineImage
              style={{ width: 20, height: 20 }}
              source={{ uri: homeTabMeta(INACTIVE_HOME).image }}
              fallbackSource={HOME_GREY}
            />
          ),
        tabBarOnPress: ({ scene, jumpToIndex }) => {
          jumpToIndex(scene.index);
          store.dispatch({
            type: "current_screen",
            value: scene.route.key,
          });
        },
      },
    },
    ChatTab: {
      screen: ChatStack,
      navigationOptions: ({ navigation }) => {
        return {
          tabBarVisible: true,
          tabBarLabel: () => homeTabMeta(ACTIVE_CHECK_SYMPTOMS).label,
          tabBarIcon: ({ focused }) =>
            focused
              ? tabBarIcon(ACTIVE_CHECK_SYMPTOMS, SYMPTOMES_RED)
              : tabBarIcon(INACTIVE_CHECK_SYMPTOMS, SYMPTOMES_GREY),
        };
      },
    },
    ClinicTab: {
      screen: HealthCheckStack,
      navigationOptions: ({ navigation }) => {
        return {
          tabBarVisible: true,
          tabBarLabel: () => homeTabMeta(ACTIVE_ASSESS_HEALTH).label,
          tabBarIcon: ({ focused }) =>
            focused
              ? tabBarIcon(ACTIVE_ASSESS_HEALTH, RECORD_RED)
              : tabBarIcon(INACTIVE_ASSESS_HEALTH, RECORD_GREY),
        };
      },
    },
    HealthCheckTab: {
      screen: View,
      navigationOptions: {
        tabBarLabel: () => homeTabMeta(ACTIVE_MORE).label,
        tabBarIcon: ({ focused }) =>
          focused
            ? tabBarIcon(ACTIVE_MORE, MORE_RED)
            : tabBarIcon(INACTIVE_MORE, MORE_GREY),
        tabBarOnPress: ({ jumpToIndex }) => {
          const currentActiveTab = store.getState().trigger.currentScreen;
          const currentScreenIndex = SCREEN_INDEX_MAPPING[currentActiveTab];
          jumpToIndex(currentScreenIndex);
          store.dispatch({
            type: IS_DRAWER_OPEN,
            value: true,
          });
        },
      },
    },
  },
  {
    ...TabNavigator.Presets.AndroidTopTabs,
    tabBarOptions: {
      indicatorStyle: {
        opacity: 0,
      },
      activeTintColor: "#ed1b2e",
      showIcon: true,
      showLabel: true,
      upperCaseLabel: false,
      inactiveTintColor: "#a8a8a8", // Color of tab when not pressed
      labelStyle: {
        fontSize: 10.7,
        lineHeight: 12,
        marginTop: 0,
        paddingTop: 4,
        paddingBottom: 4,
        fontFamily: Platform.OS == "ios" ? "PruSansNormal" : "pruSansRegular",
      },
      style: {
        marginTop: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        borderTopWidth: 2,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderColor: "#68737a",
        backgroundColor: "#fff", // Makes Android tab bar white instead of standard blue
        height: 63, // I didn't use this in my app, so the numbers may be off.
      },
    },
    tabBarPosition: "bottom",
    lazy: true,
    swipeEnabled: false,
    tabBarComponent: TabBarComponent,
  }
);

const tabBarIcon = (imageKey, fallbackSource) => (
  <OfflineImage
    style={{ width: 20, height: 20 }}
    source={{ uri: homeTabMeta(imageKey).image }}
    fallbackSource={fallbackSource}
  />
);

const homeTabMeta = key => {
  return helpers.findElement(SCREEN_KEY_HOME_TAB, key);
};
export default MainTab;
