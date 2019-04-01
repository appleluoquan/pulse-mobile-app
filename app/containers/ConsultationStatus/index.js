import React, { Component } from "react";
import { View, ActivityIndicator, BackHandler, Text } from "react-native";
import { connect } from "react-redux";
import { OfflineImage } from "react-native-image-offline";
import { AnimatedCircularProgress } from "react-native-circular-progress";

import {
  CoreComponents,
  CoreConfig,
  CoreConstants,
  CoreActions,
} from "@pru-rt-internal/rnmobile-app-core-framework";

import styles from "./styles";
import { CONSULTATION_STATUS, CLOSE_WHITE } from "../../config/images";

const { Label, Header, AppButton, MinuteTimer } = CoreComponents;
const { colors, CONSULTATION_TIME_OUT_VALUE,
  CONSULTATION_START_WAIT_TIME} = CoreConfig;

const { DOC_SERVICE_CONSULTATION, 
  DOC_SERVICE_START_CALL,
  GO_BACK_TO_PREVIOUS_STACK,
  DOC_SERVICE_INITIALIZE_DATA,
  DOC_SERVICE_CALL_REQUEST_TIMED_OUT,
  DOC_SERVICE_REQUEST_TIMED_OUT, 
  ConsultationStatus} = CoreConstants;
const toggleLoader =  CoreActions;

class DoctorConsultationStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notesHead: "Request Sent!",
      noteOne:
        "1. Make sure you are in an area where your device has good Internet connection.",
      noteTwo:
        "2. Once the request for consultation is sent, it cannot be recalled or cancelled.",
    };
    this.startConsultation = this.startConsultation.bind(this);
    
    this.prefill = (100 * this.timeElapsed()) / CONSULTATION_TIME_OUT_VALUE;

    this.consultationWaitTimer = null;
    this.callReceivetimer = null;
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.goBack);

    this.circularProgress && this.circularProgress.animate(100, CONSULTATION_TIME_OUT_VALUE);

    const timeLeft = CONSULTATION_TIME_OUT_VALUE - this.timeElapsed();    
    this.consultationWaitTimer = setTimeout(() => {
      this.props.dispatch({
        type: DOC_SERVICE_REQUEST_TIMED_OUT,
        payload: {
          consultationId: this.props.consultationId,
        },
      });
    }, timeLeft);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.goBack);
    this.clearTimer();
    //error handling
    this.props.dispatch(toggleLoader(false));
    //if doctor has accepted then reset on going back
    if (this.props.status === ConsultationStatus.AVAILABLE) {
      this.props.dispatch({
        type: DOC_SERVICE_INITIALIZE_DATA,
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { status } = this.props;
    if (prevProps.status !== status && status === ConsultationStatus.AVAILABLE) {
      this.callReceivetimer = setTimeout(() => {
        this.props.dispatch({
          type: DOC_SERVICE_CALL_REQUEST_TIMED_OUT,
        });
      }, CONSULTATION_START_WAIT_TIME);
    }
  }

  getStatusText = status => {
    switch (status) {
      case ConsultationStatus.REQUESTED:
        return "Request Sent!";
      case ConsultationStatus.FAILED:
        return "We are sorry";
      case ConsultationStatus.TIMED_OUT:
        return "Please try again";
      case ConsultationStatus.ACCEPTED:
      case ConsultationStatus.AVAILABLE:
        return "Request Confirmed";
      default:
        return " ";
    }
  };

  getStatusMessage = status => {
    switch (status) {
      case ConsultationStatus.REQUESTED:
        return "Waiting for Doctor’s confirmation…";
      case ConsultationStatus.TIMED_OUT:
        return "You did not connect in time…";
      case ConsultationStatus.FAILED:
        return "Doctors are either busy or not available at this hour. Please try again after some time.";
      default:
        return " ";
    }
  };

  startConsultation() {
    this.props.dispatch({
      context: DOC_SERVICE_CONSULTATION,
      type: DOC_SERVICE_START_CALL,
    });
    this.clearTimer();
  };

  clearTimer = () => {
    this.callReceivetimer && clearTimeout(this.callReceivetimer);
    this.consultationWaitTimer && clearTimeout(this.consultationWaitTimer);
  }

  goBack = () => {
    if (this.props.status !== ConsultationStatus.AVAILABLE) {
      this.props.dispatch({
        context: DOC_SERVICE_CONSULTATION,
        type: GO_BACK_TO_PREVIOUS_STACK,
      });
    }
    return true;
  };

  timeElapsed = () => {
    return new Date() - new Date(this.props.lastRequestTimestamp);
  };

  // eslint-disable-next-line complexity
  render() {
    const { status } = this.props;
    const timeLeft = CONSULTATION_TIME_OUT_VALUE - this.timeElapsed();
    return (
      <View style={styles.container}>
        <Header
          leftIconType="back"
          onLeftPress={this.goBack}
          showRightIcon={false}
        />
        <View style={styles.headerSection}>
          <Label value="Consultation Status" style={styles.heading} />
        </View>
        <View style={styles.consultationBtnContainer}>
          <View style={styles.titleContainer}>
            <Label value={this.getStatusText(status)} style={styles.title} />
            <Label
              value={this.getStatusMessage(status)}
              style={[styles.consultationSubhead, styles.textCenter]}
            />
            {status === ConsultationStatus.REQUESTED && (
              <View style={styles.iconContainer}>
                <AnimatedCircularProgress
                  ref={ref => (this.circularProgress = ref)}
                  size={130}
                  width={5}
                  fill={this.state.fill}
                  rotation={180}
                  backgroundColor={colors.crimson}
                  tintColor={colors.white}
                  prefill={this.prefill}
                >
                  {fill => (
                    <MinuteTimer
                      timerDurationSecs={1}
                      totalDurationInMillis={timeLeft}
                      timerColor={colors.crimson}
                    />
                  )}
                </AnimatedCircularProgress>
              </View>
            )}
            {status === ConsultationStatus.FAILED && (
              <View style={[styles.iconContainer, styles.requestFailed]}>
                <OfflineImage
                  key={"consultation_status"}
                  resizeMode="contain"
                  style={styles.icons}
                  fallbackSource={CLOSE_WHITE}
                  source={CLOSE_WHITE}
                />
              </View>
            )}
            {status === ConsultationStatus.TIMED_OUT && (
              <View style={[styles.iconContainer, styles.requestFailed]}>
                <OfflineImage
                  key={"consultation_status"}
                  resizeMode="contain"
                  style={styles.icons}
                  fallbackSource={CLOSE_WHITE}
                  source={CLOSE_WHITE}
                />
              </View>
            )}
            {(status === ConsultationStatus.ACCEPTED ||
              status === ConsultationStatus.AVAILABLE) && (
              <View style={styles.iconContainer}>
                <OfflineImage
                  key={"consultation_status"}
                  resizeMode="contain"
                  style={styles.icons}
                  fallbackSource={CONSULTATION_STATUS}
                  source={CONSULTATION_STATUS}
                />
              </View>
            )}
          </View>
        </View>
        {status === ConsultationStatus.AVAILABLE && (
          <View style={styles.iconContainer}>
            <Text style={styles.title}> If you don't start your consultation within this time, your request gets rejected </Text>
            <AnimatedCircularProgress
              ref={ref => ref && ref.animate(100, CONSULTATION_START_WAIT_TIME)}
              size={60}
              width={5}
              fill={this.state.fill}
              rotation={180}
              backgroundColor={colors.crimson}
              tintColor={colors.white}
            >
              {fill => (
                <MinuteTimer
                  timerDurationSecs={1}
                  totalDurationInMillis={CONSULTATION_START_WAIT_TIME}
                  timerColor={colors.crimson}
                />
              )}
            </AnimatedCircularProgress>
          </View>
        )}
        <View>
          <Label
            value={this.state.notesHead}
            style={[styles.consultationSubhead, styles.labelBold]}
          />
          <Label
            value={this.state.noteOne}
            style={[styles.consultationSubhead]}
          />
          <Label
            value={this.state.noteTwo}
            style={[styles.consultationSubhead]}
          />
          {status === ConsultationStatus.FAILED && (
            <AppButton
              type={[styles.btn, styles.default]}
              title="GO BACK"
              press={this.goBack}
              textStyle={styles.btnTextStyle}
            />
          )}
          {status !== ConsultationStatus.FAILED &&
            status !== ConsultationStatus.TIMED_OUT && (
              <AppButton
                type={[styles.btn, styles.primary]}
                title="START CONSULTATION"
                press={this.startConsultation}
                disable={status !== ConsultationStatus.AVAILABLE}
              />
            )}
          {status === ConsultationStatus.TIMED_OUT && (
            <AppButton
              type={[styles.btn, styles.default]}
              title="TRY AGAIN"
              press={this.goBack}
              textStyle={styles.btnTextStyle}
            />
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  meta: state.meta,
  status: state.doctorServices.consultationStatus,
  lastRequestTimestamp: state.doctorServices.lastRequestTimestamp,
  consultationId: state.doctorServices.consultationId,
});
export default connect(mapStateToProps)(DoctorConsultationStatus);
