import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import Contacts from "react-native-contacts";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from 'react-redux';
import styles from '../../common/styles';
import {
  ProfileConnectStyles,
  AddProfileStyles,
  ContactListStyles,
} from "./styles";


import {
  CoreConfig,
  CoreActions,
} from "@pru-rt-internal/rnmobile-app-core-framework";

const { colors, CONTACT_LIST_META, PROFILE_IMG } = CoreConfig;
const { readContacts } = CoreActions;

class ContactList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNotification: false,
    };
  }

  componentWillMount() {
    Contacts.getAll((err, contacts) => {
      if (err) throw err;
      this.props.readContacts(contacts);
    });
  }

  displayProfilePic(hasThumbnail, path) {
    if (hasThumbnail) {
      return (
        <View style={ProfileConnectStyles.imageContainer}>
          <Image source={{ uri: path }} style={ProfileConnectStyles.profileImage} />
        </View>
      );
    }
    return (
      <View style={ProfileConnectStyles.imageContainer}>
        <Image source={PROFILE_IMG} style={ProfileConnectStyles.profileImage} />
      </View>
    );
  }

  sendRequest() {
    this.setState({
      showNotification: true,
    });
  }

  closeNotification() {
    this.setState({
      showNotification: false,
    });
  }


  showNotification() {
    const { showNotification } = this.state;
    if (showNotification) {
      return (
        <View style={ProfileConnectStyles.notification}>
          <Text style={ProfileConnectStyles.notificationText}>
            { CONTACT_LIST_META.request }
          </Text>
          <TouchableOpacity onPress={this.closeNotification.bind(this)}>
            <Text style={ProfileConnectStyles.close}>x</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  renderContacts() {
    const { contacts } = this.props;
    const allContacts = contacts.contacts;
    return (
      allContacts.map((data, index) => (
        <TouchableOpacity onPress={this.sendRequest.bind(this)} key={data.recordID}>
          <View style={ProfileConnectStyles.flexRow}>
            { this.displayProfilePic(data.hasThumbnail, data.thumbnailPath) }
            <View>
              <Text style={ProfileConnectStyles.connectionName}>{data.givenName}</Text>
              <Text style={ProfileConnectStyles.connectionTagLine}>{data.jobTitle}</Text>
            </View>
          </View>
          <View style={ProfileConnectStyles.horizontalLine} />
        </TouchableOpacity>
      )));
  }
  
  render() {
    return (
      <View style={[styles.container, styles.wrapper]}>
        { this.showNotification() }
        <View style={ProfileConnectStyles.flexRow}>
          <Text style={ContactListStyles.screenTitle}>{ CONTACT_LIST_META.title }</Text>
          <TouchableOpacity style={ContactListStyles.seacrhIcon}>
            <Icon name="search" size={22} color={colors.nevada} />
          </TouchableOpacity>
        </View>
        <Text style={AddProfileStyles.description}>{ CONTACT_LIST_META.description }</Text>
        <View style={ProfileConnectStyles.horizontalLine} />
        <ScrollView>{ this.renderContacts() }</ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  contacts: state.contacts,
});

export default connect(
  mapStateToProps,
  {
    readContacts,
  },
)(ContactList);
