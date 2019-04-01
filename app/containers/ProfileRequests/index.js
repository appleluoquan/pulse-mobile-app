import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import styles from "./styles";
import {
  CoreComponents,
  CoreConfig,
  CoreUtils,
  CoreActions,
  metaHelpers,
} from "@pru-rt-internal/rnmobile-app-core-framework";
const {
  fetchAllConnects,
  updateCustomerConnect,
  deleteCustomerConnect,
} = CoreActions;
const { isNilOrEmpty, getDateFormat } = CoreUtils;
const helpers = metaHelpers;
const { Loader } = CoreComponents;
import PropTypes from "prop-types";
const { ElementErrorManager, SCREEN_KEY_PROFILE_REQUEST } = CoreConfig;

const KEY_ACCEPT = "accept";
const KEY_DECLINE = "decline";
const KEY_CANCEL = "cancel";
const STATUS_ACCEPTED = "ACCEPTED";
const STATUS_REJECTED = "REJECTED";
const KEY_CANCEL_MSG = "cancelmsg";
const KEY_ACCEPT_MSG = "accepttmsg";
const KEY_REJECT_MSG = "rejectmsg";

class ProfileRequests extends Component {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.onUpdateCustomerConnect = this.onUpdateCustomerConnect.bind(this);
    this.onDeleteCustomerConnect = this.onDeleteCustomerConnect.bind(this);
    this.confirmRejectAlert = this.confirmRejectAlert.bind(this);
    this.confirmCancelAlert = this.confirmCancelAlert.bind(this);
  }

  componentDidMount() {
    const { fetchAllConnects, token, userId } = this.props;
    fetchAllConnects(userId, token);
  }

  onUpdateCustomerConnect(connect, status) {
    const { updateCustomerConnect, token, userId, meta } = this.props;
    updateCustomerConnect(connect, status, token, userId)
      .then(() => {
        if (status === STATUS_ACCEPTED) {
          Alert.alert(
            helpers.findElement(SCREEN_KEY_PROFILE_REQUEST, KEY_ACCEPT_MSG)
              .label
          );
        } else {
          Alert.alert(
            helpers.findElement(SCREEN_KEY_PROFILE_REQUEST, KEY_REJECT_MSG)
              .label
          );
        }
      })
      .catch(() => {
        alert(error.message);
        //it will come here when the api calls fail
      });
  }

  onDeleteCustomerConnect(connectId) {
    const { deleteCustomerConnect, token, meta } = this.props;
    deleteCustomerConnect(connectId, token)
      .then(() => {
        Alert.alert(
          helpers.findElement(SCREEN_KEY_PROFILE_REQUEST, KEY_CANCEL_MSG).label
        );
      })
      .catch(error => {
        alert(error.message);
        //it will come here when the api calls fail
      });
  }

  confirmRejectAlert(id, status) {
    Alert.alert(
      "",
      "Are you sure you want to reject?",
      [
        { text: "NO", onPress: () => {}, style: "cancel" },
        {
          text: "YES",
          onPress: () => this.onUpdateCustomerConnect(id, status),
        },
      ],
      {
        cancelable: true,
      }
    );
  }

  confirmCancelAlert(id) {
    Alert.alert(
      "",
      "Do you want to cancel the Request?",
      [
        { text: "NO", onPress: () => {}, style: "cancel" },
        {
          text: "YES",
          onPress: () => this.onDeleteCustomerConnect(id),
        },
      ],
      {
        cancelable: true,
      }
    );
  }

  renderItem(data) {
    const { userId } = this.props;
    const accept = helpers.findElement(SCREEN_KEY_PROFILE_REQUEST, KEY_ACCEPT)
      .label;
    const decline = helpers.findElement(SCREEN_KEY_PROFILE_REQUEST, KEY_DECLINE)
      .label;
    const cancel = helpers.findElement(SCREEN_KEY_PROFILE_REQUEST, KEY_CANCEL)
      .label;
    ElementErrorManager.setCurrentScreen(SCREEN_KEY_PROFILE_REQUEST);
    const createdTime = getDateFormat(data.item.auditDetail.createTime);
    return (
      <View>
        {data.item.status === "INVITED" && (
          <View style={styles.userView}>
            <View style={styles.nameContainer}>
              {!isNilOrEmpty(data.item.customerFirstName) && (
                <View>
                  {!isNilOrEmpty(data.item.customerSurName) && (
                    <Text style={styles.username}>
                      {data.item.customerFirstName} {data.item.customerSurName}
                    </Text>
                  )}
                  {isNilOrEmpty(data.item.customerSurName) && (
                    <Text style={styles.username}>
                      {data.item.customerFirstName}
                    </Text>
                  )}
                  <Text style={styles.email}>{data.item.customerEmail}</Text>
                </View>
              )}
              {isNilOrEmpty(data.item.customerFirstName) && (
                <View>
                  <Text style={styles.username}>{data.item.customerEmail}</Text>
                  <Text style={styles.message} />
                </View>
              )}
              {data.item.to == userId && (
                <View style={styles.dateContainer}>
                  <Text style={styles.date}>{createdTime}</Text>
                  <TouchableOpacity
                    onPress={e => {
                      e.preventDefault();
                      this.confirmRejectAlert(data.item, STATUS_REJECTED);
                    }}
                    style={[styles.buttonContainer, styles.inactiveButton]}
                  >
                    <Text style={styles.inactiveButtonText}>{decline}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={e => {
                      e.preventDefault();
                      this.onUpdateCustomerConnect(data.item, STATUS_ACCEPTED);
                    }}
                    style={[styles.buttonContainer, styles.activeButton]}
                  >
                    <Text style={styles.activeButtonText}>{accept}</Text>
                  </TouchableOpacity>
                </View>
              )}
              {data.item.to !== userId && (
                <View style={styles.dateContainer}>
                  <Text style={[styles.date, { flex: 0.5 }]}>
                    {createdTime}
                  </Text>
                  <TouchableOpacity
                    onPress={e => {
                      e.preventDefault();
                      this.confirmCancelAlert(data.item.id);
                    }}
                    style={[
                      styles.buttonContainer,
                      styles.inactiveButton,
                      styles.cancelButton,
                    ]}
                  >
                    <Text style={styles.inactiveButtonText}>{cancel}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    );
  }

  render() {
    const { meta, connectRequests } = this.props;
    if (meta != null && meta.metaDetail != null) {
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            style={styles.container}
            data={connectRequests}
            renderItem={this.renderItem}
            extraData={this.props}
            showsVerticalScrollIndicator={false}
          />
        </View>
      );
    }
    return <Loader />;
  }
}

ProfileRequests.propTypes = {
  meta: PropTypes.object,
  token: PropTypes.string,
  connectRequests: PropTypes.array,
  userId: PropTypes.string,
  fetchAllConnects: PropTypes.func,
  updateCustomerConnect: PropTypes.func,
  deleteCustomerConnect: PropTypes.func,
};

const mapStateToProps = state => ({
  meta: state.meta,
  token: state.auth.token,
  connectRequests: state.connectData.connectRequests,
  userId: state.profile.id,
});

export default connect(
  mapStateToProps,
  { fetchAllConnects, updateCustomerConnect, deleteCustomerConnect }
)(ProfileRequests);
