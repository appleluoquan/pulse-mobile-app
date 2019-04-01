import React, { Component } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { OfflineImage } from "react-native-image-offline";

import {
  colors,
  CoreComponents,
  CoreConfig,
  metaHelpers,
  CoreActions,
} from "@pru-rt-internal/rnmobile-app-core-framework";

import { BabylonComponents } from "@pru-rt-internal/react-native-babylon-chatbot";
import getStartedStyles from "./styles";
import { SLIDER_LOGO_WHITE, BABYLON_LOGO_WHITE } from "../../config/images";

const { AppButton, CarouselView } = CoreComponents;
const { Languages } = BabylonComponents;

const helpers = metaHelpers;
const {
  openTermsAndConditions,
  openPrivacyPolicy,
  hideTermsAndConditions,
  hidePrivacyPolicy,
} = CoreActions;
const {
  height,
  SCREEN_KEY_GET_STARTED,
  COMMON_KEY_APP_LOGO,
  COMMON_KEY_BABYLON_LOGO,
} = CoreConfig;

import getSlideImage from "./carousel-images";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPage: 0,
    };
    this.handleScrollBegin = this.handleScrollBegin.bind(this);
  }

  privacyVisibility() {
    const { openPrivacyPolicy } = this.props;
    openPrivacyPolicy();
  }

  navigate(page) {
    const { navigation } = this.props;
    navigation.replace(page);
  }

  termsVisibility() {
    const { openTermsAndConditions } = this.props;
    openTermsAndConditions();
  }

  slides() {
    const { refreshImage } = this.props;

    const getStarted = helpers.findScreen(SCREEN_KEY_GET_STARTED);
    return getStarted.slides ? (
      getStarted.slides.map((data, index) => {
        const imgObj = getSlideImage(index);
        return (
          <View key={data.key} style={getStartedStyles.imageContainer}>
            <OfflineImage
              resizeMode="cover"
              reloadImage={refreshImage}
              fallbackSource={imgObj.image}
              source={{ uri: data.image }}
              style={getStartedStyles.container}
            />
            <View
              accessible
              testID="sliderContent"
              accessibilityLabel="sliderContent"
              style={
                imgObj.displayBabylonLogo
                  ? getStartedStyles.babylonMidContent
                  : getStartedStyles.midContent
              }
            >
              <Text
                accesible
                accessibilityLabel="sliderTitle"
                style={getStartedStyles.title}
              >
                {data.label}
              </Text>
              <Text
                accesible
                accessibilityLabel="sliderSubTitle"
                style={getStartedStyles.subtitle}
              >
                {data.description}
              </Text>
              {imgObj.displayBabylonLogo ? (
                <OfflineImage
                  accessibilityLabel="babylonLogo"
                  resizeMode="contain"
                  accesible
                  key={COMMON_KEY_BABYLON_LOGO}
                  style={[getStartedStyles.babylonImage]}
                  fallbackSource={BABYLON_LOGO_WHITE}
                  source={{
                    uri: helpers.findCommon(COMMON_KEY_BABYLON_LOGO).image,
                  }}
                />
              ) : null}
            </View>
          </View>
        );
      })
    ) : (
      <View />
    );
  }

  navigateToSplash() {
    // this.props.dispatchMetaReset();
    this.navigate("Splash");
  }

  handleScrollBegin() {
    this.setState({
      initialPage: 0,
    });
  }

  render() {
    const { languageList, navigateToMainScreen } = this.props;
    if (navigateToMainScreen) {
      this.navigate("HomeTab");
      return null;
    }

    const getStarted = helpers.findScreen(SCREEN_KEY_GET_STARTED);
    return getStarted.slides ? (
      <View style={{ flex: 1 }}>
        <View style={[getStartedStyles.topOptions]}>
          <Languages
            language={languageList}
            accessible
            accessibilityLabel="langContainer"
            testID="langContainer"
            wrap={getStartedStyles.langContainer}
            view={getStartedStyles.lang}
            indicateColor={colors.white}
            navigate={() => this.navigateToSplash()}
          />
          <View>
            <OfflineImage
              accessibilityLabel="logo"
              resizeMode="contain"
              accesible
              key={COMMON_KEY_APP_LOGO}
              style={[getStartedStyles.brandImage]}
              fallbackSource={SLIDER_LOGO_WHITE}
              source={{
                uri: helpers.findCommon(COMMON_KEY_APP_LOGO).image,
              }}
            />
          </View>
        </View>
        <CarouselView
          count={getStarted.slides.length}
          animate
          initialPage={this.state.initialPage}
          onScrollBegin={this.handleScrollBegin}
          indicatorOffset={height * (1 / 6.5)}
        >
          {this.slides()}
        </CarouselView>
        <View
          accessible
          style={{
            position: "absolute",
            bottom: 25,
            alignSelf: "center",
          }}
          testID="getStarted"
          accessibilityLabel="getStarted"
        >
          <AppButton
            type={getStartedStyles.getStart}
            title={getStarted.label}
            press={() => this.navigate("Login")}
          />
        </View>
      </View>
    ) : (
      <View />
    );
  }
}

const mapStateToProps = state => ({
  terms: state.trigger.openTerms,
  privacy: state.trigger.openPrivacy,
  email: state.auth.email,
  refreshImage: state.meta.refreshImage,
  metaFetch: state.meta.metaFetch,
  language: state.userPreferences.language,
  languageList: state.meta.languageList,
  navigateToMainScreen: state.auth.navigateToMainScreen,
});

export default connect(
  mapStateToProps,
  {
    openTermsAndConditions,
    openPrivacyPolicy,
    hideTermsAndConditions,
    hidePrivacyPolicy,
  }
)(Register);
