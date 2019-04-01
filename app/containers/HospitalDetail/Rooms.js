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
const helpers = metaHelpers;
const { fetchRoomList } = CoreActions;
const { colors } = CoreConfig;
const { CustomFlatList } = CoreComponents; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.solidGray,
    padding: 20,
    paddingRight: 40,
    paddingLeft: 40,
  },
  flexRow: {
    flexDirection: "row",
  },
  flexStart: {
    flex: 1,
    alignItems: "flex-start",
  },
  type: {
    fontSize: 15,
    color: colors.grey66,
    marginTop: 10,
    marginBottom: 10,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
  },
  flexCenter: {
    flex: 1,
    alignItems: "center",
  },
  cost: {
    fontSize: 15,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
    color: colors.deepGrey,
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
    color: colors.deepGrey,
    marginTop: 10,
    marginBottom: 10,
  },
});

const HOSPITAL_DETAILS_ROOM_SCREEN = "hospiptalDetailRoomsScreen";
const ROOM_TITLE_TYPE = "roomTypeTitle";
const ROOM_TITLE_COST = "roomCostTitle";
const EMPTY_ROOM_PLACEHOLDER = "emptyRoomsPlaceholder";

class Rooms extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.detailID &&
      nextProps.detailID !== "" &&
      nextProps.detailID !== prevState.detailId
    ) {
      const { fetchRoomListAction, detailID, sessionId } = nextProps;
      fetchRoomListAction(detailID, sessionId);
      return {
        detailId: detailID,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      detailId: props.detailID,
    };
  }

  componentDidMount() {
    const { fetchRoomListAction, detailID, sessionId } = this.props;
    fetchRoomListAction(detailID, sessionId);
  }

  render() {
    const { loading, rooms } = this.props;
    return (
      <View style={styles.container}>
        {loading && (
          <View>
            <ActivityIndicator size="large" color={colors.crimson} />
          </View>
        )}
        {!loading && (
          <React.Fragment>
            {rooms && rooms.length > 0 && (
              <View style={styles.flexRow}>
                <View style={styles.flexStart}>
                  <Text style={styles.title}>
                    {`${
                      helpers.findElement(
                        HOSPITAL_DETAILS_ROOM_SCREEN,
                        ROOM_TITLE_TYPE
                      ).label
                    }`}
                  </Text>
                </View>
                <View style={styles.flexCenter}>
                  <Text style={styles.title}>
                    {`${
                      helpers.findElement(
                        HOSPITAL_DETAILS_ROOM_SCREEN,
                        ROOM_TITLE_COST
                      ).label
                    }`}
                  </Text>
                </View>
              </View>
            )}

            <CustomFlatList
              emptyPlaceholder={
                helpers.findElement(
                  HOSPITAL_DETAILS_ROOM_SCREEN,
                  EMPTY_ROOM_PLACEHOLDER
                ).label
              }
              data={rooms}
              renderItem={({ item }) => (
                <View style={styles.flexRow}>
                  <View style={styles.flexStart}>
                    <Text style={styles.type}>{`${item.type}`}</Text>
                  </View>
                  <View style={styles.flexCenter}>
                    <Text style={styles.cost}>{`${item.cost}`}</Text>
                  </View>
                </View>
              )}
            />
          </React.Fragment>
        )}
      </View>
    );
  }
}

Rooms.propTypes = {
  meta: PropTypes.objectOf(PropTypes.any).isRequired,
  detailID: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
  sessionId: PropTypes.string.isRequired,
  fetchRoomListAction: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    meta: state.meta,
    detailID: state.hospitalDetail.details.id,
    loading: state.hospitalDetail.roomList.loading,
    rooms: state.hospitalDetail.roomList.rooms,
    sessionId: state.auth.token,
  }),
  {
    fetchRoomListAction: fetchRoomList,
  }
)(Rooms);
