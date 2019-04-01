import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  BackHandler,
} from "react-native";
import {
  CoreComponents,
  CoreConfig,
  metaHelpers,
  CoreConstants,
} from "@pru-rt-internal/rnmobile-app-core-framework";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { OfflineImage } from "react-native-image-offline";
import CheckBox from "react-native-check-box";
import styles from "./styles";
import { DOCTOR, CLOSE, DOC_INLINE_LOGO } from "../../config/images";
const { AppButton } = CoreComponents;
const {
  colors,
  COMMON_KEY_TERMS,
  SCREEN_KEY_TERMS_AND_CONDITIONS,
  SCREEN_KEY_PRIVACY_POLICY,
} = CoreConfig;
const helpers = metaHelpers;
const {
  DOC_SERVICE_INTRO,
  DOC_SERVICE_TNC_ACCEPTED,
  GO_BACK_TO_PREVIOUS_STACK,
  GO_BACK_TO_PREVIOUS_SCREEN,
} = CoreConstants;

class Introduction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
    };
    this.onProceed = this.onProceed.bind(this);
  }

  onProceed() {
    this.props.dispatch({
      context: DOC_SERVICE_INTRO,
      type: DOC_SERVICE_TNC_ACCEPTED,
    });
  }

  goBack = () => {
    this.props.dispatch({
      context: DOC_SERVICE_INTRO,
      type: GO_BACK_TO_PREVIOUS_SCREEN,
    });
  };
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.goBack);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.goBack);
  }
  goBack = () => {
    this.props.dispatch({
      context: DOC_SERVICE_INTRO,
      type: GO_BACK_TO_PREVIOUS_STACK,
    });
  };
  renderInlineLogoText = () => {
    return (
      <View>
        <View style={styles.textLogo}>
          <Text style={styles.poweredByText}>Whenever the </Text>
          <OfflineImage
            accessibilityLabel="DocOnCallLogo"
            resizeMode="contain"
            accesible
            key="DocOnCallinlineLogo"
            style={styles.docOnCallImage}
            fallbackSource={DOC_INLINE_LOGO}
            source={DOC_INLINE_LOGO}
          />
          <Text style={styles.poweredByText}>
            appears, you are receiving the services from
          </Text>
        </View>
        <Text style={[styles.poweredByText, { marginTop: 0 }]}>
          DoctorOnCall.
        </Text>
      </View>
    );
  };

  checkboxText() {
    const { navigation } = this.props;
    const title = helpers.findScreen(SCREEN_KEY_TERMS_AND_CONDITIONS).label;
    const termsPrutopia = helpers.findCommon(COMMON_KEY_TERMS).label;
    const privacyTitle = helpers.findScreen(SCREEN_KEY_PRIVACY_POLICY).label;
    return (
      <View style={[styles.flexRow, { flexWrap: "wrap" }]}>
        <Text>
          <Text style={{ color: colors.nevada }}>I agree to the</Text>
          {/* <TouchableOpacity
          onPress={() =>
            navigation.navigate("Common", {
              content: termsPrutopia,
              screenTitle: title,
            })
          }
        > */}
          <Text
            style={{ color: colors.crimson }}
            onPress={() =>
              navigation.navigate("Common", {
                content: termsPrutopia,
                screenTitle: title,
              })
            }
          >
            {" "}
            Terms and Conditions{" "}
          </Text>
          {/* </TouchableOpacity> */}
          <Text style={{ color: colors.nevada }}>and </Text>
          {/* <TouchableOpacity
          onPress={() =>
            navigation.navigate("Common", {
              content: termsPrutopia,
              screenTitle: privacyTitle,
            })
          }
        > */}
          <Text
            style={{ color: colors.crimson }}
            onPress={() =>
              navigation.navigate("Common", {
                content: termsPrutopia,
                screenTitle: privacyTitle,
              })
            }
          >
            {" "}
            Privacy Policy{" "}
          </Text>
          {/* </TouchableOpacity> */}
          <Text style={{ color: colors.nevada }}>
            of DoctorOnCall. I also acknowledge that I will be directed to My
            Profile page in PULSE to update or confirm my profile before I can
            proceed to use the Online Consultation services that are provided by
            DoctorOnCall.
          </Text>
        </Text>
        {this.renderInlineLogoText()}
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.closeIcon}>
            <TouchableOpacity style={styles.closeIcon} onPress={this.goBack}>
              <OfflineImage
                accessibilityLabel="back"
                accesible
                key="backIcon"
                style={[styles.closeIcon]}
                fallbackSource={CLOSE}
                source={CLOSE}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Image style={[styles.doclogo]} source={DOC_INLINE_LOGO} />
          </View>
        </View>

        <ScrollView style={{ flex: 1 }}>
          <View style={styles.doctorImgaeWrapper}>
            <OfflineImage
              accessibilityLabel="doctorIcon"
              accesible
              style={styles.doctorImage}
              key="doctorIcon"
              resizeMode={"contain"}
              fallbackSource={DOCTOR}
              source={{
                uri: "",
              }}
            />
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.title}>
              {"CONSULT, RECEIVE TREATMENT \n AND ANSWERS FROM WHERE YOU ARE"}
            </Text>
            <Text style={styles.subTitle}>
              {
                "A qualified and registered doctor provides a \n diagnosis, recommends the right treatment, and if \n necessary, issues an electronic prescription."
              }
            </Text>
          </View>
          <View style={styles.termsWrapper}>
            <CheckBox
              style={styles.checkBox}
              onClick={() => {
                this.setState({
                  isChecked: !this.state.isChecked,
                });
              }}
              isChecked={this.state.isChecked}
              rightTextView={this.checkboxText()}
              rightTextStyle={styles.iAcceptText}
              checkBoxColor={colors.nevada}
            />
          </View>
          <View style={styles.proceedBt}>
            <AppButton
              title={"PROCEED"}
              disable={!this.state.isChecked}
              press={this.onProceed}
              type={[styles.btn, styles.primary]}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

Introduction.propTypes = {
  meta: PropTypes.instanceOf(Object).isRequired,
  dispatch: PropTypes.func,
};

const mapStateToProps = state => ({
  meta: state.meta,
});

export default connect(mapStateToProps)(Introduction);
