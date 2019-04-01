import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import styles from "./styles";

import {
  CoreComponents,
  CoreConfig,
  CoreUtils,
  CoreActions,
  metaHelpers,
} from "@pru-rt-internal/rnmobile-app-core-framework";

const {
  searchCustomerByEmail,
  createConnect,
  requestCustomerConnect,
} = CoreActions;

import Icon from "react-native-vector-icons/FontAwesome";
const { isNilOrEmpty, validateEmail } = CoreUtils;
const helpers = metaHelpers;
const { Loader, Label } = CoreComponents;
import PropTypes from "prop-types";
import { any } from "ramda";
const {
  ElementErrorManager,
  SCREEN_KEY_PROFILE_SEARCH,
  EMAIL_ID_REQUIRED,
} = CoreConfig;

const KEY_PLACEHOLDER = "searchplaceholder";
const KEY_OOPS = "oops";
const KEY_INVITE_NOTE = "invitenote";
const KEY_INVITE = "invite";
const KEY_PROFILE_FOUND = "profilefound";
const KEY_SEND_REQUEST = "sendrequest";
const KEY_REQUEST_SENT = "requestsent";
const KEY_INVITATION_SENT = "invitationsent";
const KEY_OWN_EMAILID = "ownemailid";
const KEY_ALREADY_CONNECTED = "alreadyconnected";
const KEY_REQUEST_PRESENT = "requestpresent";
const KEY_REQUIRED = "required";
const KEY_NOT_VALID = "not_valid";
class ProfileSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      showResult: false,
      loader: false,
    };
    this.searchInput = this.searchInput.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.sendInvite = this.sendInvite.bind(this);
    this.requestContainer = this.requestContainer.bind(this);
  }

  searchInput(val) {
    if (this.state.showResult) {
      this.setState({ showResult: false });
    }
    this.setState({ search: val });
  }

  onSearch() {
    const { searchCustomerByEmail, token } = this.props;
    const search = this.state.search.trim();
    this.setState({
      search,
    });
    if (this.validateSearch()) {
      searchCustomerByEmail(search, token)
        .then(() => {
          this.setState({ showResult: true });
        })
        .catch(error => {
          alert(error.message);
          //it will come here when the api calls fail
        });
    }
  }

  validateSearch() {
    const { senderMailId, connectRequests } = this.props;
    const search = this.state.search.trim();
    const acceptedMessage = helpers.findElement(
      SCREEN_KEY_PROFILE_SEARCH,
      KEY_ALREADY_CONNECTED
    ).label;
    const presentMessage = helpers.findElement(
      SCREEN_KEY_PROFILE_SEARCH,
      KEY_REQUEST_PRESENT
    ).label;
    const required = helpers.findElement(
      SCREEN_KEY_PROFILE_SEARCH,
      KEY_REQUIRED
    ).message;
    const notValid = helpers.findElement(
      SCREEN_KEY_PROFILE_SEARCH,
      KEY_NOT_VALID
    ).message;
    const emailError = validateEmail(search);
    if (!isNilOrEmpty(emailError)) {
      if (emailError == EMAIL_ID_REQUIRED) {
        alert(required);
      } else {
        alert(notValid);
      }
      return false;
    }
    if (search.toLowerCase() === senderMailId.toLowerCase()) {
      const errorMsg = helpers.findElement(
        SCREEN_KEY_PROFILE_SEARCH,
        KEY_OWN_EMAILID
      ).label;
      alert(errorMsg);
      return false;
    }

    let errorMsg = null;
    const isAlreadyInvited = any(connectRequest => {
      if (search.toLowerCase() === connectRequest.customerEmail.toLowerCase()) {
        switch (connectRequest.status) {
          case "ACCEPTED":
            errorMsg = search + " " + acceptedMessage;
            return true;
          case "INVITED":
            errorMsg = presentMessage;
            return true;
        }
      }
    })(connectRequests);

    if (isAlreadyInvited && errorMsg) {
      alert(errorMsg);
      return false;
    }
    return true;
  }

  sendRequest() {
    const { createConnect, token, senderId, searchResult } = this.props;
    this.setState({ loader: true });
    createConnect(senderId, searchResult.id, token)
      .then(() => {
        Alert.alert(
          helpers.findElement(SCREEN_KEY_PROFILE_SEARCH, KEY_REQUEST_SENT).label
        );
        this.setState({ search: "", showResult: false, loader: false });
      })
      .catch(error => {
        this.setState({ loader: false });
        alert(error.message);
        //it will come here when the api calls fail
      });
  }

  sendInvite() {
    const {
      requestCustomerConnect,
      token,
      senderMailId,
      meta,
      senderName,
    } = this.props;
    const { search } = this.state;
    this.setState({ loader: true });
    requestCustomerConnect(senderMailId, senderName, search, token)
      .then(() => {
        Alert.alert(
          helpers.findElement(SCREEN_KEY_PROFILE_SEARCH, KEY_INVITATION_SENT)
            .label
        );
        this.setState({ search: "", showResult: false, loader: false });
      })
      .catch(error => {
        this.setState({ loader: false });
        alert(error.message);
        //it will come here when the api calls fail
      });
  }

  requestContainer() {
    const { meta, searchResult } = this.props;
    const { search } = this.state;
    const profilefound = helpers.findElement(
      SCREEN_KEY_PROFILE_SEARCH,
      KEY_PROFILE_FOUND
    ).label;
    const sendrequest = helpers.findElement(
      SCREEN_KEY_PROFILE_SEARCH,
      KEY_SEND_REQUEST
    ).label;
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultProfileLabel}>{profilefound}</Text>
        {searchResult.profilePicture && (
          <View style={styles.resultProfilePic}>
            <Image
              style={styles.userPic}
              source={{
                uri: `data:image/jpeg;base64,${searchResult.profilePicture}`,
              }}
            />
          </View>
        )}
        {!searchResult.profilePicture && (
          <View style={[styles.resultProfilePic, styles.noImage]} />
        )}
        <Text style={styles.resultName}>
          {searchResult.firstName ? searchResult.firstName : ""}{" "}
          {searchResult.surName ? searchResult.surName : ""}
        </Text>
        <Text style={styles.resultEmail}>{search}</Text>
        {!this.state.loader && (
          <TouchableOpacity
            onPress={e => {
              e.preventDefault();
              this.sendRequest();
            }}
            style={[styles.buttonContainer, styles.activeButton]}
          >
            <Text style={styles.activeButtonText}>{sendrequest}</Text>
          </TouchableOpacity>
        )}
        {this.state.loader && (
          <TouchableOpacity
            onPress={e => {
              e.preventDefault();
            }}
            style={[styles.buttonContainer, styles.noBorder]}
          >
            <ActivityIndicator color="#ed1b2e" size={30} />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  inviteContainer() {
    const { search } = this.state;
    const oops = helpers.findElement(SCREEN_KEY_PROFILE_SEARCH, KEY_OOPS).label;
    const invite = helpers.findElement(SCREEN_KEY_PROFILE_SEARCH, KEY_INVITE)
      .label;
    const invitenote = helpers.findElement(
      SCREEN_KEY_PROFILE_SEARCH,
      KEY_INVITE_NOTE
    ).label;
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultMessage}>
          {oops} {search} {invitenote}
        </Text>
        <View style={[styles.resultProfilePic, styles.noImage]} />
        <Text style={styles.resultEmail}>{search}</Text>
        {!this.state.loader && (
          <TouchableOpacity
            onPress={e => {
              e.preventDefault();
              this.sendInvite();
            }}
            style={[styles.buttonContainer, styles.activeButton]}
          >
            <Text style={styles.activeButtonText}>{invite}</Text>
          </TouchableOpacity>
        )}
        {this.state.loader && (
          <TouchableOpacity
            onPress={e => {
              e.preventDefault();
            }}
            style={[styles.buttonContainer, styles.noBorder]}
          >
            <ActivityIndicator color="#ed1b2e" size={30} />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  render() {
    const { meta, searchResult } = this.props;
    const { showResult, search } = this.state;
    if (meta != null && meta.metaDetail != null) {
      const title = helpers.findScreen(SCREEN_KEY_PROFILE_SEARCH).label;
      const placeholder = helpers.findElement(
        SCREEN_KEY_PROFILE_SEARCH,
        KEY_PLACEHOLDER
      ).label;
      ElementErrorManager.setCurrentScreen(SCREEN_KEY_PROFILE_SEARCH);
      return (
        <View style={styles.container}>
          <Label style={styles.labelStyle} value={title} />
          <View style={styles.contentContainer}>
            <TextInput
              autoFocus
              value={search}
              onChangeText={val => this.searchInput(val)}
              placeholder={placeholder}
              style={styles.textinput}
              underlineColorAndroid="rgba(0,0,0,0)"
            />
            <TouchableOpacity
              style={styles.contentCenter}
              onPress={this.onSearch}
            >
              {/* <Image style={styles.clearImage} source={CLOSE} /> */}
              <Icon name="search" color="#ffffff" size={25} />
            </TouchableOpacity>
          </View>
          {isNilOrEmpty(searchResult) && showResult && this.inviteContainer()}
          {!isNilOrEmpty(searchResult) && showResult && this.requestContainer()}
        </View>
      );
    }
    return <Loader />;
  }
}

ProfileSearch.propTypes = {
  meta: PropTypes.object,
  token: PropTypes.string,
  senderId: PropTypes.string,
  searchResult: PropTypes.object,
  senderMailId: PropTypes.string,
  senderName: PropTypes.string,
  navigation: PropTypes.object,
  connectRequests: PropTypes.array,
  searchCustomerByEmail: PropTypes.func,
  createConnect: PropTypes.func,
  requestCustomerConnect: PropTypes.func,
};

const mapStateToProps = state => ({
  meta: state.meta,
  token: state.auth.token,
  senderId: state.profile.id,
  searchResult: state.connectData.searchResult,
  senderMailId: state.profile.email,
  senderName: state.profile.firstName,
  connectRequests: state.connectData.connectRequests,
});

export default connect(
  mapStateToProps,
  { searchCustomerByEmail, createConnect, requestCustomerConnect }
)(ProfileSearch);
