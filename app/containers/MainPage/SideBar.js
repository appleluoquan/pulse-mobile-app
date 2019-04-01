import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  Share,
  Linking
} from "react-native";
import { connect } from "react-redux";
import Icons from "react-native-vector-icons/FontAwesome";
import { OfflineImage } from "react-native-image-offline";
import { path } from "ramda";

import {
  CoreConfig,
  CoreUtils,
  CoreActions,
  CoreServices,
  CoreConstants,
  metaHelpers,
} from "@pru-rt-internal/rnmobile-app-core-framework";
import * as images from "../../config";
import styles from "./style";


const { isNilOrEmpty } = CoreUtils;


const {
  SCREEN_KEY_LEFT_MENU,
  SCREEN_KEY_INVITE_FAMILY_AND_FRIENDS,
} = CoreConfig;

const { OFFERS } = CoreConstants;

const {
  handleDrawer,
  doAppLogout,
  doSocialLogout,
  babylonLogout,
  destroyBabylonChat,
  clearBabylonUserData,
  clearChatData,
} = CoreActions;

const { NavigationService } = CoreServices;
const KEY_PROFILE = "leftmenumanageprofile";
const KEY_CONNECT = "leftmenuconnect";
const KEY_SETTINGS = "leftmenusettings";
const KEY_HELP = "leftmenuhelp";
const KEY_FEEDBACK = "leftmenufeedback";
const KEY_SUPERAPP = "leftmenusuperappdemo";
const KEY_INVITE_MESSAGE_PREFIX = "messageprefix";
const KEY_INVITE_MESSAGE_SUFFIX = "messagesuffix";
const KEY_LOGOUT = "leftmenulogout";


const mapStateToProps = state => {
  return {
    meta: state.meta,
    userProfile: state.profile,
    documents: state.documents,
    babylonUserLoggedIn: state.babylonAuth.babylonUserLoggedIn,
    socialAccessType: state.account.socialAccessType,
  };
};

@connect(
  mapStateToProps,
  {
    babylonLogout,
    doAppLogout,
    clearChatDataAction: clearChatData,
    clearBabylonUserDataAction: clearBabylonUserData,
    destroyBabylonChat,
    handleDrawerAction: handleDrawer,
  }
)
export default class SideBar extends Component {
  constructor(props) {
    super(props);
    this.offlineImage = [
      images.PROFILE_ICON_INVERSE,
      images.SETTINGS_INVERSE,
      // TODO : Reverse the change when 'Invite family and friends' menu is enabled
      // images.SHARE_INVERSE,
      images.HELP_INVERSE,
      images.FEEDBACK_INVERSE,
      images.LOGOUT_INVERSE,
      images.SUPER_APP,
    ];
  }

  onLogoutPress() {
    const {
      babylonUserLoggedIn,
      babylonLogout,
      clearChatDataAction,
      clearBabylonUserDataAction,
      destroyBabylonChat,
      handleDrawerAction,
      socialAccessType,
      doAppLogout,
    } = this.props;
    handleDrawerAction(false);
    if (babylonUserLoggedIn) {
      babylonLogout();
      destroyBabylonChat();
    }
    clearBabylonUserDataAction();
    clearChatDataAction();
    doAppLogout();
    doSocialLogout(socialAccessType);
    NavigationService.navigate("Register");
  }

  navigate(page, params) {
    if (params) {
      NavigationService.navigate(page, params);
    } else {
      NavigationService.navigate(page);
    }
  }

  shareTextMessage() {
    const { userProfile } = this.props;
    const prefix = metaHelpers.findElement(
      SCREEN_KEY_INVITE_FAMILY_AND_FRIENDS,
      KEY_INVITE_MESSAGE_PREFIX
    ).label;
    const suffix = metaHelpers.findElement(
      SCREEN_KEY_INVITE_FAMILY_AND_FRIENDS,
      KEY_INVITE_MESSAGE_SUFFIX
    ).label;
    Share.share({
      message: `${prefix} ${userProfile.firstName} ${suffix}`,
    })
      .then(() => {
        // alert(result);
      })
      .catch(err => console.log(err));
  }

  showResult(result) {
    // alert(result);
  }

  actionType(key) {
    const { handleDrawerAction } = this.props;
    switch (key) {
      case KEY_PROFILE: {
        handleDrawerAction(false);
        this.navigate("ManageProfile");
        break;
      }
      case KEY_CONNECT: {
        handleDrawerAction(false);
        break;
      }
      case KEY_SETTINGS: {
        handleDrawerAction(false);
        this.navigate("Settings");
        break;
      }
      case KEY_HELP: {
        handleDrawerAction(false);
        this.navigate("HelpScreen");
        break;
      }
      case KEY_FEEDBACK: {
        handleDrawerAction(false);
        this.navigate("Feedback");
        break;
      }
      case KEY_LOGOUT: {
        handleDrawerAction(false);
        this.onLogoutPress();
        break;
      }
      case KEY_SUPERAPP: {
        // handleDrawerAction(false);
        this.onHopApp();
        break;
      }
      default:
        console.log("default");
    }
  }

  onHopApp = () => {
    Linking.canOpenURL('SuperAppDemo://home?userToken=MTAwNjY5NjkyOTcxOgHP71AmXV5f+sHT80sRoMygoSwk').then(supported => {
      if (!supported) {
        alert('Please install SuperApp')
      } else {
        this.props.handleDrawerAction(false);
        return Linking.openURL('SuperAppDemo://home?userToken=MTAwNjY5NjkyOTcxOgHP71AmXV5f+sHT80sRoMygoSwk')
      }
    });
  };

  menus(dataValue) {
    return dataValue.map((data, index) => (
      <View key={data.key}>
        <TouchableOpacity
          style={styles.flx_rw_icn}
          onPress={() => this.actionType(data.key)}
        >
          <OfflineImage
            resizeMode="contain"
            style={styles.icon}
            key={data.key}
            fallbackSource={data.offlineImage || this.offlineImage[index]}
            source={data.image}
          />
          <Text text={data.label} style={styles.sideBarText}>
            {data.label}
          </Text>
        </TouchableOpacity>
      </View>
    ));
  }

  render() {
    const { userProfile, documents } = this.props;
    const leftMenu = metaHelpers.findScreen(SCREEN_KEY_LEFT_MENU);

    const hasProfilePic = !isNilOrEmpty(path(["profilePicture"], documents));
    const element = {
      image: "image url",
      key: "leftmenusuperappdemo",
      label: "SuperApp Demo",
      type: "label",
    };
    const elements = JSON.parse(JSON.stringify(leftMenu.elements));
    elements.push(element);

    console.log('CoreActions_CoreActions', CoreActions);
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.sidebarBack}
      >
        <View style={styles.userDetail}>
          {!hasProfilePic && (
            <View style={[styles.userPic, styles.cameraPic]}>
              <Icons name="camera" size={30} color="#68737a" />
            </View>
          )}
          {hasProfilePic && (
            <Image
              style={styles.userPic}
              source={{
                uri: `data:image/jpeg;base64,${documents.profilePicture}`,
              }}
            />
          )}
          {userProfile && userProfile.firstName !== "" && (
            <Text style={styles.username}>{userProfile.firstName}</Text>
          )}
        </View>
        <View style={styles.menuBar}>{this.menus(elements)}</View>
        <View style={styles.offerBar}>{this.menus(OFFERS)}</View>
      </ScrollView>
    );
  }
}

SideBar.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any),
  meta: PropTypes.objectOf(PropTypes.any).isRequired,
  userProfile: PropTypes.objectOf(PropTypes.any).isRequired,
  babylonUserLoggedIn: PropTypes.bool.isRequired,
  socialAccessType: PropTypes.string,
  babylonLogout: PropTypes.func.isRequired,
  clearChatDataAction: PropTypes.func.isRequired,
  clearBabylonUserDataAction: PropTypes.func.isRequired,
  destroyBabylonChat: PropTypes.func.isRequired,
  handleDrawerAction: PropTypes.func.isRequired,
  doAppLogout: PropTypes.func.isRequired,
};
