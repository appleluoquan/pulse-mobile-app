import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  BackHandler,
} from "react-native";

import {
  CoreComponents,
  CoreConfig,
  metaHelpers,
  CoreActions,
  colors,
} from "@pru-rt-internal/rnmobile-app-core-framework";

import { OfflineImage } from "react-native-image-offline";
import { ARROW, BACK } from "../../config/images";
const { SCREEN_KEY_HOSPITALS_FILTER } = CoreConfig;
const { fetchSpecializationList } = CoreActions;
const helpers = metaHelpers;
const { CustomFlatList, SearchBar } = CoreComponents;

const KEY_SELECT_SPECIALITY = "specialitySelect";
const KEY_EMPTY_PLACEHOLDER = "filteremptyplaceholder";

class Specialization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: "",
    };
  }

  componentDidMount() {
    const {
      fetchSpecializationListAction,
      navigateCallback,
      selectedLanguage,
    } = this.props;

    BackHandler.addEventListener("hardwareBackPress", navigateCallback);
    fetchSpecializationListAction(selectedLanguage);
  }

  componentWillUnmount() {
    const { navigateCallback } = this.props;

    BackHandler.removeEventListener("hardwareBackPress", navigateCallback);
  }

  render() {
    const { specialityList } = this.props;
    return (
      <View style={styles.overlay}>
        <TouchableOpacity
          style={[styles.filterIcon, styles.backIconContainer]}
          onPress={() => {
            const { navigateCallback } = this.props;
            navigateCallback(true);
          }}
        >
          <OfflineImage
            accessibilityLabel="back"
            accesible
            key="backIcon"
            style={[styles.filterIcon]}
            fallbackSource={BACK}
            source={BACK}
          />
        </TouchableOpacity>
        {specialityList && specialityList.length !== 0 && (
          <View style={styles.searchBarContainer}>
            <SearchBar
              placeholder={
                helpers.findElement(
                  SCREEN_KEY_HOSPITALS_FILTER,
                  KEY_SELECT_SPECIALITY
                ).label
              }
              value={this.state.searchString}
              onChange={searchString => {
                this.setState({
                  searchString,
                });
              }}
            />
          </View>
        )}
        <CustomFlatList
          emptyPlaceholder={
            helpers.findElement(
              SCREEN_KEY_HOSPITALS_FILTER,
              KEY_EMPTY_PLACEHOLDER
            ).label
          }
          data={specialityList.filter(option =>
            option.label
              .toLowerCase()
              .includes(this.state.searchString.toLowerCase())
          )}
          style={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.flexRow}
              onPress={() => {
                const { navigation } = this.props;
                navigation.navigate("Hospitals", {
                  filter: { specialization: item },
                });
              }}
            >
              <Text style={styles.specializationOption}>{`${item.label}`}</Text>
              <OfflineImage
                source={ARROW}
                style={styles.arrowStyle}
                fallbackSource={ARROW}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

Specialization.propTypes = {
  meta: PropTypes.objectOf(PropTypes.any).isRequired,
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  specialityList: PropTypes.arrayOf(PropTypes.any).isRequired,
  selectedLanguage: PropTypes.string.isRequired,
  fetchSpecializationListAction: PropTypes.func.isRequired,
  navigateCallback: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  listContainer: {
    paddingRight: 10,
    paddingLeft: 10,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 30,
    paddingLeft: 30,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey63,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: colors.white,
  },
  specializationOption: {
    color: colors.deepGrey,
    fontSize: 15,
    flex: 3,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    alignItems: "center",
  },
  searchBarContainer: {
    margin: 10,
  },
  filterIcon: {
    width: 20,
    height: 20,
  },
  backIconContainer: {
    marginLeft: 10,
    marginTop: 20,
  },
  arrowStyle: {
    width: 10,
    height: 20,
  },
});

export default connect(
  state => ({
    meta: state.meta,
    sessionId: state.auth.token,
    specialityList: state.navigator.filter.specialization,
    selectedLanguage: state.userPreferences.language,
  }),
  {
    fetchSpecializationListAction: fetchSpecializationList,
  }
)(Specialization);
