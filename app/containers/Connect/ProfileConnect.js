import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "../../common/styles";

import { CoreConfig } from "@pru-rt-internal/rnmobile-app-core-framework";

import { ProfileConnectStyles } from './styles';
const { META_PROFILE_CONNECT } = CoreConfig;

export default class ProfileConnect extends Component {
  renderConnect() {
    const { navigation } = this.props;
    if (META_PROFILE_CONNECT.connections.length === 0) {
      return (
        <View>
          <Text>{META_PROFILE_CONNECT.noConnection}</Text>
          <View style={ProfileConnectStyles.horizontalLine} />
          <TouchableOpacity onPress={() => navigation.navigate('AddProfile')}>
            <Text style={ProfileConnectStyles.add}>{ META_PROFILE_CONNECT.add }</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View>
        <View style={ProfileConnectStyles.horizontalLine} />
        { META_PROFILE_CONNECT.connections.map((data, index) => (
          <View key={data.recordID}>
            <View style={ProfileConnectStyles.flexRow}>
              <View style={ProfileConnectStyles.imageContainer}>
                <Image source={data.src} style={ProfileConnectStyles.profileImage} />
              </View>
              <View>
                <Text style={ProfileConnectStyles.connectionName}>{data.name}</Text>
                <Text style={ProfileConnectStyles.connectionTagLine}>{data.tag}</Text>
                { this.renderRelationship(data) }
              </View>
            </View>
            <View style={ProfileConnectStyles.horizontalLine} />
          </View>
        )) }
        <TouchableOpacity onPress={() => navigation.navigate('AddProfile')}>
          <Text style={ProfileConnectStyles.add}>{ META_PROFILE_CONNECT.addMore }</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderRelationship(data) {
    if (data.relationship) {
      return (<Text style={ProfileConnectStyles.connectionRelationship}>{data.relationshipTitle}</Text>);
    }
    return (
      <TouchableOpacity>
        <Text style={ProfileConnectStyles.connectionRelationship}>{data.relationshipTitle}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={[styles.container, styles.wrapper]}>
        <Text style={ProfileConnectStyles.screenTitle}>{ META_PROFILE_CONNECT.title }</Text>
        <View>{ this.renderConnect() }</View>
      </View>
    );
  }
}
