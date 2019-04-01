import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { connect } from "react-redux";
import { OfflineImage } from "react-native-image-offline";
import styles from "./styles";

import {
  CoreConfig,
  metaHelpers,
  CoreActions,
} from "@pru-rt-internal/rnmobile-app-core-framework";

const {
  CLOSE_WHITE,
  TOUR1,
  TOUR2,
  TOUR3,
  TOUR4,
  TOUR5,
  TOUR6,
  TapIcon,
  SliderIcon,
  SCREEN_KEY_TOUR_PAGES,
  COMMON_KEY_CROSS_ICON,
} = CoreConfig;

const helpers = metaHelpers;
const { updateTour, updateTourStatus } = CoreActions;

const KEY_PAGE_1 = "firsttour";
const KEY_PAGE_2 = "secondtour";
const KEY_PAGE_3 = "thirdtour";
const KEY_PAGE_4 = "fourthtour";
const KEY_PAGE_5 = "fifthtour";
const KEY_PAGE_6 = "sixthtour";
const KEY_PAGE_7 = "seventhtour";

const TYPE_TAP_ICON = "tapicon";
const TYPE_SLIDER_ICON = "slidericon";

const STYLE_FIRST_TOUR_CONTAINER = "firstTourContainer";
const STYLE_SECOND_TOUR_CONTAINER = "secondTourContainer";
const STYLE_THIRD_TOUR_CONTAINER = "thirdTourContainer";
const STYLE_FOURTH_TOUR_CONTAINER = "fourthTourContainer";
const STYLE_FIFTH_TOUR_CONTAINER = "fifthTourContainer";
const STYLE_SIXTH_TOUR_CONTAINER = "sixthTourContainer";
const STYLE_SEVENTH_TOUR_CONTAINER = "seventhTourContainer";
const STYLE_TAB_ICON = "tapIcon";
const STYLE_SLIDER_ICON = "sliderIcon";

class TourPage extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.meta !== null && prevState.flag === undefined) {
      return {
        flag: 0,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      flag: undefined,
    };
    this.onNext = this.onNext.bind(this);
  }

  componentWillUnmount() {
    flag = 0;
  }

  onNext() {
    const { meta } = this.props;
    if (meta != null && meta.metaDetail != null) {
      const tourScreen = helpers.findScreen(SCREEN_KEY_TOUR_PAGES);
      if (this.state.flag < tourScreen.pages.length - 1) {
        this.setState(
          {
            flag: this.state.flag + 1,
          },
          () => {
            const { flag } = this.state;
            this.props.updateTour(
              tourScreen.pages[flag].key,
              tourScreen.pages[flag].iconType
            );
          }
        );
      } else {
        this.props.updateTour(undefined, undefined);
        this.props.hide();
        this.props.updateTourStatus(false);
      }
    }
  }

  getFallbackBackgroundImage(pageKey) {
    switch (pageKey) {
      case KEY_PAGE_1:
        return TOUR1;
      case KEY_PAGE_2:
        return TOUR2;
      case KEY_PAGE_3:
        return TOUR3;
      case KEY_PAGE_4:
        return TOUR4;
      case KEY_PAGE_5:
        return TOUR5;
      case KEY_PAGE_6:
        return TOUR6;
      case KEY_PAGE_7:
        return TOUR7;
      default:
        return TOUR1;
    }
  }

  getIcon(iconType) {
    switch (iconType) {
      case TYPE_TAP_ICON:
        return TapIcon;
      case TYPE_SLIDER_ICON:
        return SliderIcon;
      default:
        return TapIcon;
    }
  }

  getPageStyle(pageKey) {
    switch (pageKey) {
      case KEY_PAGE_1:
        return STYLE_FIRST_TOUR_CONTAINER;
      case KEY_PAGE_2:
        return STYLE_SECOND_TOUR_CONTAINER;
      case KEY_PAGE_3:
        return STYLE_THIRD_TOUR_CONTAINER;
      case KEY_PAGE_4:
        return STYLE_FOURTH_TOUR_CONTAINER;
      case KEY_PAGE_5:
        return STYLE_FIFTH_TOUR_CONTAINER;
      case KEY_PAGE_6:
        return STYLE_SIXTH_TOUR_CONTAINER;
      case KEY_PAGE_7:
        return STYLE_SEVENTH_TOUR_CONTAINER;
      default:
        return STYLE_FIRST_TOUR_CONTAINER;
    }
  }

  getIconStyle(iconType) {
    switch (iconType) {
      case TYPE_TAP_ICON:
        return STYLE_TAB_ICON;
      case TYPE_SLIDER_ICON:
        return STYLE_SLIDER_ICON;
      default:
        return TapIcon;
    }
  }

  render() {
    // const { meta } = this.props;
    // alert('Render');
    //if (meta != null && meta.metaDetail != null) {

    const { meta, show } = this.props;
    const { flag } = this.state;
    if (flag !== undefined) {
      const tourScreen = helpers.findScreen(SCREEN_KEY_TOUR_PAGES);
      const commons = meta.metaDetail.commons;
      const textData = tourScreen.pages[flag].text.map((item, index) => (
        <Text key={index} style={styles[item.type]}>
          {item.label}
        </Text>
      ));

      const tourPage = (
        <React.Fragment>
          {/* 'Replacement for Modal' */}
          <View style={show ? styles.tourOverlay : styles.tourOverlayHidden}>
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.closeBtn}
                accessible
                accessibilityLabel="closeTour"
                testID="closeTour"
                onPress={() => {
                  this.props.updateTour(undefined, undefined);
                  this.props.hide();
                  this.props.updateTourStatus(false);
                }}
              >
                <OfflineImage
                  style={styles.close}
                  fallbackSource={CLOSE_WHITE}
                  key={COMMON_KEY_CROSS_ICON}
                  source={{
                    uri: helpers.findCommon(COMMON_KEY_CROSS_ICON).image,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* Touchable wrapper to move to next tour on press */}
          {/* also disables touch on underlying highlights */}
          <View
            style={
              show ? styles.tourOverlayTransparent : styles.tourOverlayHidden
            }
          >
            <TouchableWithoutFeedback onPress={this.onNext}>
              <View
                style={styles[this.getPageStyle(tourScreen.pages[flag].key)]}
              >
                {textData}
                {tourScreen.pages[flag].showIcon && (
                  <OfflineImage
                    style={
                      styles[this.getIconStyle(tourScreen.pages[flag].iconType)]
                    }
                    source={{ uri: tourScreen.pages[flag].icon }}
                    key={`${tourScreen.pages[flag].key}icon`}
                    fallbackSource={this.getIcon(
                      tourScreen.pages[flag].iconType
                    )}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </React.Fragment>
      );
      return tourScreen.pages[flag].text ? tourPage : null;
    }
  }
}

const mapStateToProps = state => ({
  meta: state.meta,
  refreshImage: state.meta.refreshImage,
});

export default connect(
  mapStateToProps,
  { updateTour, updateTourStatus }
)(TourPage);
