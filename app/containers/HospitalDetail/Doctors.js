import React from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import {
  CoreConfig,
  metaHelpers,
  CoreActions,
  CoreComponents,
} from "@pru-rt-internal/rnmobile-app-core-framework";
import { connect } from "react-redux";
const { CustomFlatList, SearchBar } = CoreComponents;
const helpers = metaHelpers;
const { fetchDoctorList } = CoreActions;
const { colors } = CoreConfig;

const HOSPITAL_DETAIL_DOCTORS_PAGE = "hospiptalDetailDoctorsScreen";
const DOCTORS_SEARCH_PLACEHOLDEDR = "searchDoctorsPlaceholder";
const DOCTORS_EMPTY_PLACEHOLDER = "emptyDoctorsPlaceholder";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.solidGray,
    padding: 10,
  },
  itemContainer: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey63,
  },
  title: {
    fontSize: 16,
    color: colors.grey64,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
  },
  caption: {
    color: colors.grey65,
    marginTop: 5,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
  },
  searchBarContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
});

class Doctors extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.detailID &&
      nextProps.detailID !== "" &&
      nextProps.detailID !== prevState.detailId
    ) {
      const { fetchDoctorListAction, detailID, sessionId } = nextProps;
      fetchDoctorListAction(detailID, sessionId);
      return {
        detailId: detailID,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      searchString: "",
      detailId: props.detailID,
    };
    this.component = null;
  }

  componentDidMount() {
    const { fetchDoctorListAction, detailID, sessionId } = this.props;
    fetchDoctorListAction(detailID, sessionId);
  }

  render() {
    const { searchString } = this.state;
    const { loading, doctors } = this.props;
    return (
      <View style={styles.container}>
        {loading && (
          <View>
            <ActivityIndicator size="large" color={colors.crimson} />
          </View>
        )}
        {!loading && (
          <React.Fragment>
            {doctors && doctors.length > 0 && (
              <View style={styles.searchBarContainer}>
                <SearchBar
                  value={searchString}
                  placeholder={
                    helpers.findElement(
                      HOSPITAL_DETAIL_DOCTORS_PAGE,
                      DOCTORS_SEARCH_PLACEHOLDEDR
                    ).label
                  }
                  onChange={search => {
                    this.setState({
                      searchString: search,
                    });
                  }}
                />
              </View>
            )}

            <CustomFlatList
              emptyPlaceholder={
                helpers.findElement(
                  HOSPITAL_DETAIL_DOCTORS_PAGE,
                  DOCTORS_EMPTY_PLACEHOLDER
                ).label
              }
              data={
                doctors
                  ? doctors.filter(doctor =>
                      doctor.name
                        .toLowerCase()
                        .includes(searchString.toLowerCase())
                    )
                  : []
              }
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Text style={styles.title}> {`${item.name}`} </Text>
                  <Text style={styles.caption} numberOfLines={1}>
                    {" "}
                    {`${item.specialities[0]}`}{" "}
                  </Text>
                </View>
              )}
            />
          </React.Fragment>
        )}
      </View>
    );
  }
}

Doctors.propTypes = {
  meta: PropTypes.objectOf(PropTypes.any).isRequired,
  detailID: PropTypes.string.isRequired,
  sessionId: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  doctors: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchDoctorListAction: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    meta: state.meta,
    detailID: state.hospitalDetail.details.id,
    doctors: state.hospitalDetail.doctorList.doctors,
    loading: state.hospitalDetail.doctorList.loading,
    sessionId: state.auth.token,
  }),
  {
    fetchDoctorListAction: fetchDoctorList,
  }
)(Doctors);
