import React, { Component } from "react";
import { View, BackHandler } from "react-native";
import { connect } from "react-redux";
import Stars from "react-native-stars";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import {
  CoreComponents,
  CoreConstants,
} from "@pru-rt-internal/rnmobile-app-core-framework";

import styles from "./styles";
const { AppButton, Label, Header } = CoreComponents;
const { DOC_SERVICE_FEEDBACK, GO_BACK_TO_PREVIOUS_STACK } = CoreConstants;
import moment from "moment";

class ConsultationFeedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: 2.5,
    };
    this.submit = this.submit.bind(this);
    this.skip = this.skip.bind(this);
    this.onStarRatingPress = this.onStarRatingPress.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.goBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onGoBack);
  }

  submit() {
    this.goBack();
  }
  skip() {
    this.goBack();
  }

  goBack = () => {
    this.props.dispatch({
      context: DOC_SERVICE_FEEDBACK,
      type: GO_BACK_TO_PREVIOUS_STACK,
    });
  };

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });
  }

  render() {
    const now = moment();
    return (
      <View style={styles.container}>
        <Header
          leftIconType="back"
          onLeftPress={() => this.goBack()}
          showRightIcon={false}
        />
        <View style={styles.headerSection}>
          <Label value="Consultation concluded" style={styles.heading} />
        </View>
        <View style={styles.container}>
          <View style={styles.consultationBtnContainer}>
             
              <Label value="Thank you!" style={styles.title} />
            
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.imageContainer} />
            <View style={styles.contentCenter}>
              <Label
                value={this.props.doctorName}
                style={[
                  styles.consultationSubhead,
                  styles.labelBold,
                  styles.nameLabel,
                ]}
              />
              <Label
                value={now.format("DD MMMM YYYY")}
                style={styles.consultationSubhead}
              />
              <Label
                value={now.format("LT")}
                style={styles.consultationSubhead}
              />
            </View>
          </View>
          <View style={styles.consultationBtnContainer}>
            <View style={styles.titleContainer}>
              <Label
                value="Submit rating"
                style={[
                  styles.consultationSubhead,
                  styles.info,
                  styles.textCenter,
                  styles.success,
                  styles.labelBold,
                ]}
              />
            </View>
            <Stars
              half={true}
              default={1}
              update={this.onStarRatingPress}
              spacing={4}
              count={5}
              fullStar={<Icon size={30} name={"star"} style={[styles.star]} />}
              emptyStar={
                <Icon
                  name={"star-outline"}
                  size={30}
                  style={[styles.star, styles.emptyStar]}
                />
              }
              halfStar={
                <Icon size={30} name={"star-half"} style={[styles.star]} />
              }
            />
          </View>
        </View>
        <View>
          <AppButton
            type={[styles.btn, styles.primary]}
            title="SUBMIT"
            press={this.submit}
          />
          <AppButton
            type={[styles.btn, styles.default]}
            title="SKIP"
            press={this.skip}
            textStyle={styles.btnTextStyle}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  meta: state.meta,
  doctorName: state.doctorServices.consultation.doctorName,
});
export default connect(mapStateToProps)(ConsultationFeedback);
