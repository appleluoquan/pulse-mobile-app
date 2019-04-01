import React from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";

import {
  CoreComponents,
  CoreConfig,
  CoreUtils,
  CoreActions,
  CoreConstants,
  metaHelpers,
} from "@pru-rt-internal/rnmobile-app-core-framework";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import Carousel from "react-native-carousel-view";
import ImagePicker from "react-native-image-crop-picker";
import OpenSettings from "react-native-open-settings";
import styles from "./style";
import {
  SERVICE_VISIT,
  SERVICE_PRAY,
  SERVICE_WELLNESS,
  SERVICE_DOCTOR,
} from "../../config/images";
import TourPage from "../TourPage";
import { EN_BANNER, BM_BANNER } from "../../config";
import { OfflineImage } from "react-native-image-offline";
import {
  pressCheckSymptoms,
  pressClinicTab,
} from "../Navigation/TabBarComponent";

const { TrackActivity, WithHighlight } = CoreComponents;
const {
  SCREEN_KEY_LANDING_PAGE,
  SCREEN_KEY_MANAGE_PROFILE,
  SCREEN_KEY_CHAT_REPORT,
  KEY_CAMERA_PERMISSION,
} = CoreConfig;
const { EN_REVIEW_SERVICES, BM_REVIEW_SERVICES } = CoreConstants;
const helpers = metaHelpers;
const { handleNewUser, calculateBmi, TOUR_STEPS } = CoreActions;
const { colors } = CoreConfig;
const { ElementErrorManager } = CoreConfig;
const { isNilOrEmpty } = CoreUtils;
const KEY_HOW_CAN_I_HELP = "landingpagehowcanihelplabel";
const TYPE_DROP_DOWN_ITEM = "dropdownitem";
const TYPE_SERVICE = "serviceList";
const KEY_BMI_TITLE = "uploadyourselfie";
const KEY_BMI_DESC = "bmidescription";
const KEY_SERVICE_PRAYER = "servicePrayer";
const KEY_SERVICE_AIME = "serviceAime";
const KEY_SERVICE_DOCTOR = "serviceDoctor";
const KEY_SERVICE_HOSPITAL = "serviceHospital";
const KEY_OUR_SERVICES = "landingpageourServicesLabel";
const KEY_CANCEL = "cancel";
const KEY_OK = "ok";

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPage: 0,
    };
    this.handleScrollBegin = this.handleScrollBegin.bind(this);
    this.onSelectPicker = this.onSelectPicker.bind(this);
  }

  navigate(page) {
    this.props.navigation && this.props.navigation.navigate(page);
  }

  quickAction(act, key) {
    if (key === "uploadyourselfie") {
      this.showCamera();
    } else {
      const { navigate } = this.props.navigation;
      navigate("Healthtips", { healthTip: act });
    }
  }

  showCamera() {
    const { sessionId, language } = this.props;

    const cameraPermission = helpers.findElement(
      SCREEN_KEY_MANAGE_PROFILE,
      KEY_CAMERA_PERMISSION
    ).label;
    const ok = helpers
      .findElement(SCREEN_KEY_CHAT_REPORT, KEY_OK)
      .label.toUpperCase();
    const cancel = helpers.findElement(SCREEN_KEY_MANAGE_PROFILE, KEY_CANCEL)
      .label;

    ImagePicker.openCamera({
      width: 200,
      height: 200,
      compressImageMaxWidth: 200,
      compressImageMaxHeight: 200,
      includeBase64: true,
      useFrontCamera: true,
      compressImageQuality: 0.8,
      photo: "photo",
    })
      .then(image => {
        if (!isNilOrEmpty(sessionId)) {
          this.props.calculateBmi(sessionId, image.data, language);
        }
      })
      .catch(error => {
        console.log("error code is " + error.code);
        if (error.code !== "E_PICKER_CANCELLED" && Platform.OS === "ios") {
          Alert.alert(
            "",
            cameraPermission,
            [
              { text: ok, onPress: () => OpenSettings.openSettings() },
              { text: cancel, style: "cancel" },
            ],
            { cancelable: false }
          );
        }
      });
  }

  horizontalSlider() {
    const { language, bmiResponse } = this.props;
    const bmiTitle = helpers.findElement(SCREEN_KEY_LANDING_PAGE, KEY_BMI_TITLE)
      .label;
    const bmiDesc = helpers.findElement(SCREEN_KEY_LANDING_PAGE, KEY_BMI_DESC)
      .label;
    const bmiKey = helpers.findElement(SCREEN_KEY_LANDING_PAGE, KEY_BMI_TITLE)
      .key;

    let tips =
      language === "EN" ? [...EN_REVIEW_SERVICES] : [...BM_REVIEW_SERVICES];
    let bmiTips;
    if (isNilOrEmpty(bmiResponse)) {
      bmiTips = { title: bmiTitle, description: bmiDesc, key: bmiKey };
    } else {
      bmiTips = {
        title: bmiTitle,
        description: bmiDesc + " : " + bmiResponse.result,
        key: bmiKey,
        result: bmiResponse.result,
      };
    }

    tips = [bmiTips, ...tips];
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalView}
      >
        {tips.map((data, index) => (
          <TouchableOpacity
            style={styles.reviewServices}
            key={index}
            testID={`healthTips-${index}`}
            accessibilityLabel={`healthTips-${index}`}
            onPress={() => this.quickAction(data.title, data.key)}
          >
            <Text
              testID={`healthTipsTitle-${index}`}
              accessibilityLabel={`healthTipsTitle-${index}`}
              numberOfLines={3}
              ellipsizeMode="tail"
              style={styles.reviewHead}
            >
              {data.title}
            </Text>
            <Text
              testID={`healthTipsDescription-${index}`}
              accessibilityLabel={`healthTipsDescription-${index}`}
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.descp}
            >
              {data.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  hideModal() {
    this.props.handleNewUser(false);
  }

  onSelectPicker(label) {
    const { navigation } = this.props;

    const landingScreen = helpers.findScreen(SCREEN_KEY_LANDING_PAGE);

    const key = helpers
      .findAllElementsByType(landingScreen, TYPE_DROP_DOWN_ITEM)
      .find(item => item.label === label).key;
    this.setState({ value: key });
    switch (key) {
      case "landingpagedropdownaddfamilymember":
        navigation.navigate("Profile", {
          editable: true,
          related: true,
          newProfile: true,
        });
        break;
      case "landingpagedropdownassesshealth":
        this.props.pressClinicTab(this.props);
        break;
      case "landingpagedropdownaboutus":
        navigation.navigate("Aboutus");
        break;
      case "landingpagedropdownchecksymptoms":
        this.props.pressCheckSymptoms(this.props);
        break;
      case "landingpagedropdownaddprofile":
        navigation.navigate("ManageProfile");
        break;
      case "landingpagedropdownchangepassword":
        navigation.navigate("ChangePassword");
        break;
      default:
        return false;
    }
  }

  sliders() {
    const { language } = this.props;
    const BANNER = language === "EN" ? EN_BANNER : BM_BANNER;
    return BANNER.map((data, index) => (
      <View key={index}>
        <Image resizeMode="cover" source={data.banner} style={styles.banner} />
      </View>
    ));
  }

  renderActivityTracking = isNotNowRow => {
    return (
      <View style={[styles.centerContent]}>
        <TrackActivity {...this.props} isNotNowRow={isNotNowRow} />
      </View>
    );
  };

  handleScrollBegin() {
    this.setState({
      initialPage: 0,
    });
  }

  getServiceImage(key) {
    switch (key) {
      case KEY_SERVICE_PRAYER:
        return SERVICE_PRAY;
      case KEY_SERVICE_AIME:
        return SERVICE_WELLNESS;
      case KEY_SERVICE_DOCTOR:
        return SERVICE_DOCTOR;
      case KEY_SERVICE_HOSPITAL:
        return SERVICE_VISIT;
      default:
        return null;
    }
  }
  navigation(key) {
    const { navigate } = this.props.navigation;
    const navMap = {
      [KEY_SERVICE_PRAYER]: "",
      [KEY_SERVICE_AIME]: "StayingWell",
      [KEY_SERVICE_DOCTOR]: "GettingTreatment",
      [KEY_SERVICE_HOSPITAL]: "",
    };
    navMap[key] && navigate(navMap[key]);
  }
  render() {
    const { userProfile, bmiLoading, language } = this.props;
    let pageContent = null;
    const landingScreen = helpers.findScreen(SCREEN_KEY_LANDING_PAGE);
    const serviceList = helpers.findAllElementsByType(
      landingScreen,
      TYPE_SERVICE
    );
    ElementErrorManager.setCurrentScreen(SCREEN_KEY_LANDING_PAGE);
    const BANNER = language === "EN" ? EN_BANNER : BM_BANNER;
    const ourServicesLabel = helpers.findElement(
      SCREEN_KEY_LANDING_PAGE,
      KEY_OUR_SERVICES
    ).label;
    pageContent = (
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.landingPageBackground }}
      >
        <View style={styles.carouselContainer}>
          <Carousel
            delay={10000}
            height={(Dimensions.get("window").height * 33) / 100}
            initialPage={this.state.initialPage}
            count={BANNER.length}
            onScrollBegin={this.handleScrollBegin}
            indicatorColor={colors.white}
            indicatorSize={12}
            indicatorOffset={8}
            hideIndicators={true}
          >
            {this.sliders()}
          </Carousel>
          <Image
            resizeMode="stretch"
            style={{ width: Dimensions.get("window").width, height: 8 }}
            source={require("../../images/shadow_long.png")}
          />
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.headerText}>
            {
              helpers.findElement(
                SCREEN_KEY_LANDING_PAGE,
                KEY_HOW_CAN_I_HELP
              ).label
            }
            {userProfile && userProfile.firstName
              ? ` ${userProfile.firstName}!`
              : "!"}
          </Text>
        </View>
        {this.renderActivityTracking(false)}
        <View style={styles.ourServiceContainer}>
          <Text style={styles.ourServicesText}>{ourServicesLabel}</Text>
          <View style={styles.serviceWrapper}>
            {serviceList.map((data, index) => (
              <TouchableOpacity
                key={data.key}
                onPress={() => this.navigation(data.key)}
                style={styles.serviceContainer}
              >
                <View style={styles.serviceImageContainer}>
                  <OfflineImage
                    resizeMode="contain"
                    style={styles.servicesImg}
                    fallbackSource={this.getServiceImage(data.key)}
                    source={{ uri: data.image }}
                  />
                </View>
                <Text style={styles.serviceName}>{data.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <WithHighlight tourStep={TOUR_STEPS.THIRD}>
          <View style={styles.sliderContainer}>{this.horizontalSlider()}</View>
        </WithHighlight>
        {!this.props.fitnessTracker.isFitnessTrackingEnabled &&
          this.renderActivityTracking(true)}
        {this.props.isNewUser && (
          <TourPage
            show={true}
            hide={this.hideModal.bind(this)}
            navigation={this.props.navigation}
          />
        )}
      </ScrollView>
    );

    return (
      <View style={styles.container}>
        {bmiLoading && (
          <View style={styles.loaderProfile}>
            <ActivityIndicator
              size="large"
              color={Platform.OS == "ios" ? colors.white : colors.crimson}
            />
          </View>
        )}
        {pageContent}
      </View>
    );
  }
}

MainPage.propTypes = {
  navigation: PropTypes.object,
  sessionId: PropTypes.string,
  language: PropTypes.string,
  meta: PropTypes.object,
  isNewUser: PropTypes.bool,
  calculateBmi: PropTypes.func,
  fitnessTracker: PropTypes.object,
};

const mapStateToProps = state => ({
  meta: state.meta,
  language: state.userPreferences.language,
  sessionId: state.auth.token,
  userProfile: state.profile,
  isNewUser: state.auth.isNewUser,
  bmiLoading: state.bmi.loading,
  touring: state.tour.touring,
  babylonToken: state.auth.babylonToken,
  babylonStatus: state.auth.babylonStatus,
  healthFlowsData: state.healthCheck.healthFlows,
  bmiResponse: state.bmi.successData,
  fitnessTracker: state.fitnessTracker,
});

export default connect(
  mapStateToProps,
  {
    calculateBmi,
    handleNewUser,
    pressCheckSymptoms,
    pressClinicTab,
  }
)(MainPage);
