import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TextInput,
  PermissionsAndroid,
} from "react-native";
import {
  CoreComponents,
  CoreConfig,
} from "@pru-rt-internal/rnmobile-app-core-framework";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../../common/styles";
import { AddProfileStyles } from "./styles";

const { AppButton, OrDivider } = CoreComponents;
const { NETWORK, colors, META_ADD_PROFILE } = CoreConfig;
export default class AddProfile extends Component {
  onConnect() {
    const { navigation } = this.props;
    try {
      const granted = PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS
      );
      granted.then(res => {
        if (res === PermissionsAndroid.RESULTS.GRANTED) {
          navigation.navigate("ContactList");
        } else {
          alert(JSON.stringify(res));
        }
      });
    } catch (err) {
      console.warn(err);
    }
  }

  render() {
    return (
      <View style={[styles.container, styles.wrapper]}>
        <Text style={AddProfileStyles.screenTitle}>
          {META_ADD_PROFILE.title}
        </Text>
        <Text style={AddProfileStyles.screenDescription}>
          {META_ADD_PROFILE.description}
        </Text>
        <Image
          source={NETWORK}
          style={AddProfileStyles.screenImage}
          resizeMode="contain"
        />
        <AppButton
          type={[styles.btn, styles.primary]}
          title={META_ADD_PROFILE.buttonTitle}
          press={this.onConnect.bind(this)}
        />
        <OrDivider />
        <KeyboardAvoidingView>
          <View style={AddProfileStyles.textInput}>
            <Icon name="search" size={20} color={colors.nevada} />
            <TextInput
              style={{ flex: 1 }}
              underlineColorAndroid="rgba(0,0,0,0)"
              placeholder={META_ADD_PROFILE.searchPlaceholder}
            />
            <Icon name="caret-right" size={20} color={colors.nevada} />
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
