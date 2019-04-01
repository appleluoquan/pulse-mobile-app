import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert,
} from "react-native";
import { RadioGroup, RadioButton } from "react-native-flexi-radio-button";
import PropTypes from "prop-types";
import {
  CoreComponents,
  CoreConfig,
  metaHelpers,
  CoreActions,
} from "@pru-rt-internal/rnmobile-app-core-framework";
import { BabylonActions } from "@pru-rt-internal/react-native-babylon-chatbot";
import { connect } from "react-redux";
import styles from "./styles";
import { CLOSE } from "../../config/images";

const { setCurrentLanguage } = BabylonActions;
const { colors, SCREEN_KEY_CHANGE_LANGUAGE } = CoreConfig;
const { fetchMetaDetail } = CoreActions;
const helpers = metaHelpers;
const { Loader } = CoreComponents;
class ChangeLanguage extends Component {
  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.fetchMeta = this.fetchMeta.bind(this);
    this.state = {
      languageLoading: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  onSelect(index, value) {
    this.fetchMeta(value);
  }

  onClose() {
    const { navigation } = this.props;

    navigation.goBack();
  }

  getSelectedIndex() {
    const { language, languageList } = this.props;

    for (let index = 0; index < languageList.length; index += 1) {
      const languageTemp = languageList[index];
      if (languageTemp.languageCode === language) {
        return index;
      }
    }

    return 0;
  }

  fetchMeta = languageCode => {
    this.setState({
      languageLoading: true,
    });
    const { language, fetchMetaDetail } = this.props;
    if (languageCode !== language) {
      //this is set here and not inside then function because of a bug in react-native-carousel
      this.props.setCurrentLanguage(languageCode);
      fetchMetaDetail(languageCode, null)
        .then(() => {
          this.setState({
            languageLoading: false,
          });
        })
        .catch(error => {
          this.props.setCurrentLanguage(language);
          Alert.alert(error.toString());
        });
    }
  };

  handleBackButtonClick() {
    const { navigation } = this.props;

    navigation.goBack();
    return true;
  }

  render() {
    const { languageList } = this.props;
    const changeLanguage = helpers.findScreen(SCREEN_KEY_CHANGE_LANGUAGE).label;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => this.onClose()}
          style={styles.closeImageEncloser}
        >
          <Image source={CLOSE} style={styles.closeImage} />
        </TouchableOpacity>
        <Text style={styles.heading}>{changeLanguage}</Text>
        <View>
          <RadioGroup
            size={35}
            thickness={1}
            color={colors.whitishgrey}
            selectedIndex={this.getSelectedIndex()}
            onSelect={(index, value) => this.onSelect(index, value)}
          >
            {languageList.map(data => (
              <RadioButton
                key={data.languageCode}
                value={data.languageCode}
                color={colors.crimson}
                style={styles.radioButton}
                onClick={() => this.fetchMeta(data.languageCode)}
              >
                <Text style={styles.text}>{data.language}</Text>
              </RadioButton>
            ))}
          </RadioGroup>
        </View>
        {this.state.languageLoading && <Loader />}
      </View>
    );
  }
}

ChangeLanguage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  language: PropTypes.string.isRequired,
  languageList: PropTypes.instanceOf(Array).isRequired,
  fetchMetaDetail: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  language: state.userPreferences.language,
  languageList: state.meta.languageList,
  meta: state.meta,
});

export default connect(
  mapStateToProps,
  {
    fetchMetaDetail,
    setCurrentLanguage,
  }
)(ChangeLanguage);
