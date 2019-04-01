import React, { Component } from "react";
import { ScrollView, View, Text, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  CoreComponents,
  CoreConfig,
} from "@pru-rt-internal/rnmobile-app-core-framework";

import styles from "../../common/styles";
import notificationStyles from "./styles";
import * as images from "../../config/images";

const { colors } = CoreConfig;
const { NotificationButton } = CoreComponents;
const NOTIFICATION_META = {
  title: "Notifications",
  notification: [
    {
      unread: true,
      icon: images.PRUTOPIA_NOTIFICATION,
      title: "Protupia",
      date: "18:03 on 13 Aug",
      description:
        "It’s time for Polio vaccination for Jenny.Recommend to get it done by 10 Sep 2018.",
      type: "DONE",
    },
    {
      unread: true,
      icon: images.PROFILE_IMG,
      title: "Liam Ward ",
      date: "10:03 on 12 Aug",
      description: "Requested to connect.",
      type: "REQUEST",
    },
    {
      unread: false,
      icon: images.PROFILE_IMG,
      title: "Ulla Smith ",
      date: "10:03 on 12 Aug",
      description:
        "Invited you to join challenge: Walk 10,000 steps for 1 week",
      type: "REQUEST",
    },
    {
      unread: false,
      icon: images.PROFILE_IMG,
      title: "Prutopia",
      date: "10:03 on 12 Aug",
      description:
        "Walk 300 more steps today to get 10 points today See Dashboard ",
      type: "NO_ACTION",
    },
    {
      unread: false,
      icon: images.PROFILE_IMG,
      title: "Prutopia",
      date: "10:03 on 12 Aug",
      description:
        "Dr.Smith will visit you today at 3:00 PM See Upcomiong appointments",
      type: "NO_ACTION",
    },
    {
      unread: false,
      icon: images.PROFILE_IMG,
      title: "John Smith ",
      date: "10:03 on 12 Aug",
      description: "Accepted your connection request.",
      type: "NO_ACTION",
    },
    {
      unread: false,
      icon: images.PROFILE_IMG,
      title: "John Smith ",
      date: "10:03 on 12 Aug",
      description:
        "Accepted your invite to join challenge: Walk 10,000 steps for 1 week ",
      type: "NO_ACTION",
    },
  ],
};
export default class Notification extends Component {
  showAction(type) {
    switch (type) {
      case "DONE":
        return <NotificationButton title="DONE" />;
      case "REQUEST":
        return (
          <View style={notificationStyles.flexRow}>
            <NotificationButton title="ACCEPT" />
            <NotificationButton title="DECLINE" type="negative" />
          </View>
        );
      default:
        break;
    }
  }

  readStatus(status) {
    if (status) return <View style={notificationStyles.square} />;
  }

  renderNotification() {
    return NOTIFICATION_META.notification.map((data, index) => (
      <View>
        <View style={notificationStyles.flexRow}>
          {this.readStatus(data.unread)}
          <Image
            style={notificationStyles.notificationIcon}
            source={data.icon}
          />
          <View>
            <Text style={notificationStyles.notificationTitle}>
              {data.title}
            </Text>
            <Text style={notificationStyles.notificationDate}>{data.date}</Text>
            <Text style={notificationStyles.notificationDescription}>
              {data.description}
            </Text>
            <View style={notificationStyles.flexRow}>
              {this.showAction(data.type)}
            </View>
          </View>
        </View>
        <View style={notificationStyles.horizontalLine} />
      </View>
    ));
  }

  render() {
    return (
      <View style={[styles.container, styles.wrapper]}>
        <View style={notificationStyles.flexRow}>
          <Text style={notificationStyles.screenTitle}>
            {NOTIFICATION_META.title}
          </Text>
          <TouchableOpacity style={notificationStyles.seacrhIcon}>
            <Icon name="gear" size={22} color={colors.nevada} />
          </TouchableOpacity>
        </View>
        <View style={notificationStyles.horizontalLine} />
        <ScrollView>{this.renderNotification()}</ScrollView>
      </View>
    );
  }
}
