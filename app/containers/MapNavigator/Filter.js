import React from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import {
  CoreConfig,
  CoreComponents,
  metaHelpers,
} from "@pru-rt-internal/rnmobile-app-core-framework";
import { OfflineImage } from "react-native-image-offline";
import { BACK, CHECKBOX_ACTIVE, CHECKBOX_INACTIVE } from "../../config";

const { CustomFlatList, RemovableBadge, SearchBar } = CoreComponents;
const { colors, width } = CoreConfig;
const helpers = metaHelpers;

const DISTANCE_FILTER_KEY = "distanceFilter";
const DISTANCE_OPTIONS_KEY = "distanceOption";
const SPECIALITY_FILTER_KEY = "specialityFilter";
const SPECIALITY_PLACEHOLDER_KEY = "specialitySearch";
const KEY_SELECT_SPECIALITY = "specialitySelect";

const KEY_APPLY_BTN = "filterapplybutton";
const KEY_SPECIALIZATION_EMPTY_TEXT = "filteremptyplaceholder";

class Filter extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.value.distance !== prevState.filter.distance ||
      (nextProps.value.specialization &&
        nextProps.value.specialization.length !==
          prevState.filter.specialization.length)
    ) {
      return {
        filter: nextProps.value,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      isSpecializationOpen: false,
      selectedSpecialization: props.value.specialization || [],
      filter: props.value,
      searchText: "",
    };
    this._animatedValue = new Animated.Value(width);
    this.closeSpecializationSelect = this.closeSpecializationSelect.bind(this);
  }

  closeSpecializationSelect() {
    Animated.timing(this._animatedValue, {
      toValue: width,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      this.setState({
        isSpecializationOpen: false,
      });
    });
  }

  renderSpecializationSelect() {
    const { specialityList, metaScreenKey } = this.props;
    return (
      <Animated.View
        style={[
          styles.overlay,
          styles.animationView,
          {
            transform: [
              {
                translateX: this._animatedValue,
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backIcon}
          onPress={this.closeSpecializationSelect}
        >
          <OfflineImage
            accessibilityLabel="back"
            accesible
            key="backIcon"
            style={[styles.backIcon]}
            fallbackSource={BACK}
            source={BACK}
          />
        </TouchableOpacity>
        {specialityList && specialityList.length !== 0 && (
          <View style={styles.searchBarContainer}>
            <SearchBar
              placeholder={
                helpers.findElement(metaScreenKey, KEY_SELECT_SPECIALITY).label
              }
              value={this.state.searchText}
              onChange={searchText => {
                this.setState({
                  searchText,
                });
              }}
            />
          </View>
        )}
        <View style={styles.flexed}>
          <CustomFlatList
            emptyPlaceholder={
              helpers.findElement(metaScreenKey, KEY_SPECIALIZATION_EMPTY_TEXT)
                .label
            }
            data={specialityList.filter(option =>
              option.id
                .toLowerCase()
                .includes(this.state.searchText.toLowerCase())
            )}
            extraData={this.state.selectedSpecialization}
            renderItem={({ item }) => {
              const active = this.state.selectedSpecialization.find(
                speciality => speciality === item.id
              );
              return (
                <TouchableOpacity
                  style={styles.flexRow}
                  onPress={() => {
                    this.setState({
                      selectedSpecialization: active
                        ? this.state.selectedSpecialization.filter(
                            selected => selected !== item.id
                          )
                        : [...this.state.selectedSpecialization, item.id],
                    });
                  }}
                >
                  {active ? (
                    <OfflineImage
                      style={styles.checkboxIcon}
                      source={{ uri: "" }}
                      key={`checkboxIcon-active-${item.id}`}
                      fallbackSource={CHECKBOX_ACTIVE}
                    />
                  ) : (
                    <OfflineImage
                      style={styles.checkboxIcon}
                      source={{ uri: "" }}
                      key={`checkboxIcon-inactive-${item.id}`}
                      fallbackSource={CHECKBOX_INACTIVE}
                    />
                  )}
                  <Text style={styles.specializationOption}>{`${
                    item.label
                  }`}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => {
            this.setState(
              {
                filter: Object.assign({}, this.state.filter, {
                  specialization: this.state.selectedSpecialization,
                }),
              },
              this.closeSpecializationSelect
            );
          }}
        >
          <Text style={styles.applyButtonText}>
            {" "}
            {helpers.findElement(metaScreenKey, KEY_APPLY_BTN).label}{" "}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  render() {
    const { filter, isSpecializationOpen } = this.state;
    const { onChange, metaScreenKey, specialityList } = this.props;

    const FilterScreen = helpers.findScreen(metaScreenKey);
    const distanceOptions = helpers.findAllElementsByType(
      FilterScreen,
      DISTANCE_OPTIONS_KEY
    );
    return (
      <React.Fragment>
        <View style={styles.container}>
          <ScrollView style={styles.scrollContainer}>
            {filter.distance && (
              <React.Fragment>
                <Text style={styles.title}>
                  {`${
                    helpers.findElement(metaScreenKey, DISTANCE_FILTER_KEY)
                      .label
                  } ${filter.distance}`}
                </Text>
                <View style={styles.flexRowWrap}>
                  {distanceOptions.map(option => {
                    const active = option.key === filter.distance;
                    return (
                      <RemovableBadge
                        key={option.label}
                        label={option.label}
                        style={active ? styles.activeBadge : null}
                        textStyle={active ? styles.activeOption : null}
                        accessibilityLabel={active ? "SelectedDistance" : ""}
                        onPress={() => {
                          this.setState({
                            filter: Object.assign({}, filter, {
                              distance: option.key,
                            }),
                          });
                        }}
                      />
                    );
                  })}
                </View>
              </React.Fragment>
            )}
            {filter.specialization &&
              specialityList &&
              specialityList.length !== 0 && (
                <React.Fragment>
                  <Text style={styles.title}>
                    {`${
                      helpers.findElement(metaScreenKey, SPECIALITY_FILTER_KEY)
                        .label
                    }`}
                  </Text>
                  <TouchableOpacity
                    style={styles.searchSection}
                    onPress={() => {
                      this.setState(
                        {
                          isSpecializationOpen: true,
                        },
                        () => {
                          Animated.timing(this._animatedValue, {
                            toValue: 0,
                            duration: 100,
                            useNativeDriver: true,
                          }).start();
                        }
                      );
                    }}
                  >
                    <Text style={styles.searchTextBox}>
                      {`${
                        helpers.findElement(
                          metaScreenKey,
                          SPECIALITY_PLACEHOLDER_KEY
                        ).label
                      }`}
                    </Text>
                    <MaterialIcon
                      pointerEvents="none"
                      name="play-arrow"
                      size={25}
                      color="#707070"
                    />
                  </TouchableOpacity>
                  <View style={styles.flexRowWrap}>
                    {filter.specialization.map(option => (
                      <RemovableBadge
                        key={option}
                        label={
                          this.props.specialityList.find(
                            speciality => speciality.id === option
                          ).label
                        }
                        removable
                        onRemove={speciality => {
                          this.setState({
                            filter: Object.assign({}, this.state.filter, {
                              specialization: this.state.filter.specialization.filter(
                                selected => selected !== speciality
                              ),
                            }),
                            selectedSpecialization: this.state.filter.specialization.filter(
                              selected => selected.id !== speciality
                            ),
                          });
                        }}
                      />
                    ))}
                  </View>
                </React.Fragment>
              )}
          </ScrollView>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => {
              onChange(this.state.filter);
            }}
          >
            <Text style={styles.applyButtonText}>
              {" "}
              {helpers.findElement(metaScreenKey, KEY_APPLY_BTN).label}{" "}
            </Text>
          </TouchableOpacity>
        </View>
        {isSpecializationOpen && this.renderSpecializationSelect()}
      </React.Fragment>
    );
  }
}

Filter.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  meta: PropTypes.object.isRequired,
  specialityList: PropTypes.arrayOf(PropTypes.object).isRequired,
  metaScreenKey: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    marginTop: 20,
    flex: 1,
  },
  title: {
    color: colors.deepGrey,
    fontSize: 16,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  flexRowWrap: {
    marginTop: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  activeBadge: {
    backgroundColor: colors.lighterRed,
    borderColor: colors.lighterRed,
  },
  activeOption: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 15,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
  },
  searchSection: {
    marginTop: 15,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: colors.nevada,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  searchTextBox: {
    flex: 6,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: colors.white,
  },
  checkboxIcon: {
    width: 15,
    height: 15,
    margin: 10,
    alignItems: "center",
  },
  specializationOption: {
    color: colors.deepGrey,
    fontSize: 15,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    alignItems: "center",
  },
  applyButton: {
    marginTop: 10,
    backgroundColor: colors.lighterRed,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    padding: 15,
  },
  applyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  searchBarContainer: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  animationView: {
    flex: 1,
    flexDirection: "column",
    padding: 20,
  },
  flexed: {
    flex: 1,
  },
  scrollContainer: {
    flex: 0.9,
  },
});

export default connect(
  state => ({
    meta: state.meta,
    specialityList: state.navigator.filter.specialization,
  }),
  null
)(Filter);
