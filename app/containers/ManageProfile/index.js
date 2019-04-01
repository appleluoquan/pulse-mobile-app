import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  BackHandler,
} from "react-native";
import {
  CoreComponents,
  CoreConfig,
  CoreUtils,
  CoreActions,
  metaHelpers,
} from "@pru-rt-internal/rnmobile-app-core-framework";
import { OfflineImage } from "react-native-image-offline";
import Icons from "react-native-vector-icons/Feather";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome";
import Modal from "react-native-modal";
const { Label, Loader } = CoreComponents;
import styles from "./styles";
const {
  fetchUserDetail,
  getRelationList,
  getRelatedMembers,
  deleteCustomerRelation,
  updateProfileDetail,
  getDocumentById,
  fetchAllConnects,
  setAllConnectedMemberAction,
  deleteCustomerConnect,
} = CoreActions;
const { SCREEN_KEY_PROFILE_LIST, COMMON_KEY_CLOSE_WHITE } = CoreConfig;
const { isNilOrEmpty } = CoreUtils;
const helpers = metaHelpers;
import { path } from "ramda";
import PropTypes from "prop-types";
import ModalDropdown from "react-native-modal-dropdown";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const KEY_ADD_FRIENDS = "addfriends";
const KEY_LINK_ACCOUNT = "linkaccount";
const KEY_CREATE_PROFILE = "createprofile";
const KEY_LINK_ACCOUNT_IMAGE = "linkaccountimg";
const KEY_CREATE_PROFILE_IMAGE = "createprofileimg";
const KEY_ALERT_YES = "yes";
const KEY_ALERT_NO = "no";
const KEY_ME = "me";

const KEY_DELETE_MESSAGE_PREFIX = "deleteConfirmationPrefix";
const KEY_DELETE_MESSAGE_SUFFIX = "deleteConfirmationSuffix";

class ManageProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
    this.openModal = this.openModal.bind(this);
    this.navToProfile = this.navToProfile.bind(this);
    this.navToSearch = this.navToSearch.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.deleteProfile = this.deleteProfile.bind(this);
    this.deleteAlert = this.deleteAlert.bind(this);
    this.pickerValue = this.pickerValue.bind(this);
    this.updateConnectedMembers = this.updateConnectedMembers.bind(this);
    this.renderName = this.renderName.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    const { getRelationList } = this.props;
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    getRelationList();
    this.updateConnectedMembers();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  updateConnectedMembers() {
    const {
      getRelatedMembers,
      token,
      fetchAllConnects,
      userProfile,
      getDocumentById,
      setAllConnectedMemberAction,
    } = this.props;
    const promise1 = getRelatedMembers(token);
    const promise2 = fetchAllConnects(userProfile.id, token);

    Promise.all([promise1, promise2]).then(data => {
      const relatedMembers = data[0] ? data[0] : [];
      const connectedMembers = data[1] ? data[1].acceptedConnect : [];
      const mergedData = relatedMembers.concat(connectedMembers);
      const allConnectedMembers = [];

      mergedData.forEach(data => {
        if (path(["documents"], data)) {
          allConnectedMembers.push(
            getDocumentById(data.documents, this.props.token, false).then(
              base64Image => {
                data["profilePicture"] = base64Image;
                return data;
              }
            )
          );
        } else {
          data["profilePicture"] = "";
          allConnectedMembers.push(Promise.resolve(data));
        }
      });

      Promise.all(allConnectedMembers).then(results => {
        setAllConnectedMemberAction(results);
      });
    });
  }

  navToProfile(data) {
    this.setState({ modalVisible: false });
    const { navigation } = this.props;
    if (data) {
      if (data.linked) {
        navigation.navigate("Profile", {
          userData: data,
          editable: false,
          related: false,
          newProfile: false,
        });
      } else {
        navigation.navigate("Profile", {
          userData: data,
          editable: true,
          related: true,
          newProfile: false,
          updateConnectedMembers: this.updateConnectedMembers,
        });
      }
    } else {
      navigation.navigate("Profile", {
        editable: true,
        related: true,
        newProfile: true,
        updateConnectedMembers: this.updateConnectedMembers,
      });
    }
  }

  navToSearch() {
    this.setState({ modalVisible: false });
    const { navigation } = this.props;
    const { navigate } = navigation;
    navigate("ProfileSearch");
  }

  openModal() {
    this.setState({ modalVisible: true });
  }

  relationCheck(relation) {
    return (
      relation.toLowerCase() !== "spouse" &&
      relation.toLowerCase() !== "children"
    );
  }

  formatUserData(data) {
    return {
      firstName: data.firstName,
      surName: data.surName,
      sex: data.gender,
      dob: data.dob,
      addressDetails: {
        address: {
          line1: data.address1,
          city: data.address2,
          zipcode: data.address3,
          country: data.countryCode,
        },
      },
      contactDetails: {
        phone: {
          channel: "PHONE",
          value: data.phone,
        },
      },
      documents: data.documents,
    };
  }

  updateMemberRelationShip(userData, relation) {
    const { deleteCustomerRelation, token } = this.props;
    const { userProfile: pastUserDetails } = this.props;
    deleteCustomerRelation(userData.id, token, () => {
      userData = this.formatUserData(userData);
      this.newFamilyMember(relation, pastUserDetails, userData);
    });
  }

  newFamilyMember(relation, pastUserDetails, formData) {
    const userProfile = {};
    const {
      token: Token,
      updateProfileDetail: updateProfileDetailFunc,
    } = this.props;
    if (this.relationCheck(relation)) {
      userProfile["id"] = pastUserDetails.id;
      userProfile["relatesTo"] = {};
      userProfile["relatesTo"][relation.toLowerCase()] = [];
      userProfile["relatesTo"][relation.toLowerCase()].push(formData);
    } else {
      this.checkRelationSpouse(
        relation,
        userProfile,
        pastUserDetails,
        formData
      );
    }
    if (!isNilOrEmpty(Token)) {
      updateProfileDetailFunc(userProfile, Token, this.updateConnectedMembers);
    }
  }

  checkRelationSpouse(relation, userProfile, pastUserDetails, formData) {
    if (relation.toLowerCase() == "spouse") {
      userProfile["id"] = pastUserDetails.id;
      userProfile[relation.toLowerCase()] = {};
      userProfile[relation.toLowerCase()] = formData;
    } else {
      userProfile["id"] = pastUserDetails.id;
      userProfile[relation.toLowerCase()] = [];
      userProfile[relation.toLowerCase()].push(formData);
    }
  }

  pickerValue(val, data) {
    Object.assign(data, { relation: val });
    this.updateMemberRelationShip(data, val);
  }

  deleteAlert(data) {
    const { meta } = this.props;
    const deleteConfirmationPrefix = helpers.findElement(
      SCREEN_KEY_PROFILE_LIST,
      KEY_DELETE_MESSAGE_PREFIX
    ).label;
    const deleteConfirmationSuffix = helpers.findElement(
      SCREEN_KEY_PROFILE_LIST,
      KEY_DELETE_MESSAGE_SUFFIX
    ).label;

    let userName = data.firstName ? data.firstName : "";
    userName += data.surName ? " " + data.surName : "";

    const deleteMessage =
      deleteConfirmationPrefix + " " + userName + deleteConfirmationSuffix;

    const yes = helpers.findElement(SCREEN_KEY_PROFILE_LIST, KEY_ALERT_YES)
      .label;
    const no = helpers.findElement(SCREEN_KEY_PROFILE_LIST, KEY_ALERT_NO).label;
    Alert.alert(
      "",
      deleteMessage,
      [
        {
          text: no,
          onPress: () => {},
          style: "cancel",
        },
        { text: yes, onPress: () => this.deleteProfile(data) },
      ],
      { cancelable: false }
    );
  }

  deleteProfile(data) {
    const { token, deleteCustomerRelation, deleteCustomerConnect } = this.props;
    if (token && token != null) {
      if (data.linked) {
        deleteCustomerConnect(data.connectId, token, data.id);
      } else {
        deleteCustomerRelation(data.id, token);
      }
    }
  }

  renderSelfItem() {
    const {
      navigation,
      userProfile,
      profilePictureBase64,
      token,
      getDocumentById,
      meta,
    } = this.props;
    const meMessage = helpers.findElement(
      SCREEN_KEY_PROFILE_LIST,
      KEY_ME
    ).label;
    let localUserProfile = {};
    if (isNilOrEmpty(userProfile) && !path(["documents"], userProfile)) {
      // User detail empty for new users
      localUserProfile = {
        profilePicture: "",
      };
    } else if (
      path(["documents"], userProfile) &&
      isNilOrEmpty(userProfile.profilePicture)
    ) {
      // User has documents
      getDocumentById(userProfile.documents, token, true);
    } else {
      userProfile["profilePicture"] = profilePictureBase64;
      localUserProfile = userProfile;
    }
    const hasProfilePic = !isNilOrEmpty(
      path(["profilePicture"], localUserProfile)
    );
    const hasFirstName = !isNilOrEmpty(path(["firstName"], localUserProfile));
    return (
      <View style={styles.selfContainer}>
        <TouchableOpacity
          onPress={e => {
            e.preventDefault();
            navigation.navigate("Profile", {
              userData: localUserProfile,
              editable: true,
              related: false,
              newProfile: false,
            });
          }}
        >
          <View style={styles.userView}>
            <View>
              {!hasProfilePic && (
                <View style={[styles.userPic, styles.noImage]}>
                  <FontAwesomeIcons name="camera" size={20} color="#68737a" />
                </View>
              )}
              {hasProfilePic && (
                <Image
                  style={styles.userPic}
                  source={{
                    uri: `data:image/jpeg;base64,${
                      localUserProfile.profilePicture
                    }`,
                  }}
                />
              )}
            </View>
            <View style={styles.nameContainer}>
              {hasFirstName && (
                <Text style={styles.username}>{`${localUserProfile.firstName} ${
                  localUserProfile.surName
                }`}</Text>
              )}
              <Text style={styles.relation}>{meMessage}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  onRelationChange(index, key, data) {
    const { relationList } = this.props;
    const itemValue = relationList.find(x => x.key === key);
    this.pickerValue(itemValue.name, data);
  }

  renderName(data) {
    if (data.firstName || data.surName) {
      return (
        <Text style={styles.username}>
          {`${data.firstName} ${data.surName}`}
        </Text>
      );
    }
    if (path(["contactDetails", "email", "value"], data)) {
      return (
        <Text style={styles.username}>{data.contactDetails.email.value}</Text>
      );
    }
    return <Text style={styles.username} />;
  }

  renderItem(data) {
    const { relationList } = this.props;
    const whiteclose = helpers.findCommon(COMMON_KEY_CLOSE_WHITE);
    const dropDownOptions = relationList.map(x => x.key);
    const itemValue = relationList.find(x => x.name === data.item.relation);
    return (
      <TouchableOpacity
        key={data.item.id}
        onPress={() => this.navToProfile(data.item)}
      >
        <View style={styles.userView}>
          <View>
            {data.item.profilePicture != "" && (
              <Image
                style={styles.userPic}
                source={{
                  uri: `data:image/jpeg;base64,${data.item.profilePicture}`,
                }}
              />
            )}
            {data.item.profilePicture == "" && (
              <View style={[styles.userPic, styles.noImage]}>
                <FontAwesomeIcons name="camera" size={20} color="#68737a" />
              </View>
            )}
            {data.item.linked && (
              <View style={styles.connectedIcon}>
                <Icons name="link" size={16} color="#ffffff" />
              </View>
            )}
          </View>
          <View style={styles.nameContainer}>
            {this.renderName(data.item)}
            {!data.item.linked && (
              <View style={styles.dropbox}>
                <ModalDropdown
                  textStyle={styles.textStyle}
                  style={styles.dropDownButton}
                  dropdownStyle={styles.dropdownStyle}
                  dropdownTextStyle={styles.dropdownTextStyle}
                  defaultValue={itemValue.key}
                  options={dropDownOptions}
                  onSelect={(index, key) =>
                    this.onRelationChange(index, key, data.item)
                  }
                />
                <View pointerEvents="none" style={styles.dropDownIcon}>
                  <MaterialIcons
                    pointerEvents="none"
                    name="arrow-drop-down"
                    size={25}
                    color="#a8a8a8"
                  />
                </View>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={e => {
              e.preventDefault();
              this.deleteAlert(data.item);
            }}
          >
            <View style={styles.closeContainer}>
              <OfflineImage
                source={{ uri: whiteclose }}
                fallbackSource={require("../../images/close_white.png")}
                style={styles.closeIcon}
              />
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { meta, connectedList } = this.props;
    const { modalVisible } = this.state;
    if (meta != null && meta.metaDetail != null) {
      const addfriends = helpers.findElement(
        SCREEN_KEY_PROFILE_LIST,
        KEY_ADD_FRIENDS
      ).label;
      const createprofile = helpers.findElement(
        SCREEN_KEY_PROFILE_LIST,
        KEY_CREATE_PROFILE
      ).label;
      const createprofileimg = helpers.findElement(
        SCREEN_KEY_PROFILE_LIST,
        KEY_CREATE_PROFILE_IMAGE
      ).image;
      const linkaccount = helpers.findElement(
        SCREEN_KEY_PROFILE_LIST,
        KEY_LINK_ACCOUNT
      ).label;
      const linkaccountimg = helpers.findElement(
        SCREEN_KEY_PROFILE_LIST,
        KEY_LINK_ACCOUNT_IMAGE
      ).image;
      return (
        <View style={styles.container}>
          {this.renderSelfItem()}
          <FlatList
            style={styles.memberContainer}
            data={connectedList}
            renderItem={this.renderItem}
            extraData={this.props}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />
          <View style={styles.whiteBg}>
            <TouchableOpacity
              style={styles.button}
              onPress={this.openModal}
              activeOpacity={0.5}
            >
              <Label value={addfriends} style={styles.buttonText} />
            </TouchableOpacity>
          </View>
          <Modal
            isVisible={modalVisible}
            onBackdropPress={() => this.setState({ modalVisible: false })}
            hideModalContentWhileAnimating
          >
            <View style={styles.modalStyle}>
              <Text style={styles.modalHeaderLabel}>{addfriends}</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalLeftButton}
                  onPress={e => {
                    e.preventDefault();
                    this.navToProfile();
                  }}
                >
                  <OfflineImage
                    source={{ uri: createprofileimg }}
                    fallbackSource={require("../../images/add_friend.png")}
                    style={styles.addFriendIcon}
                  />
                  <Text style={styles.modalButtonLabel}>{createprofile}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalRightButton}
                  onPress={e => {
                    e.preventDefault();
                    this.navToSearch();
                  }}
                >
                  <OfflineImage
                    source={{ uri: linkaccountimg }}
                    fallbackSource={require("../../images/link_account.png")}
                    style={styles.linkAccountIcon}
                  />
                  <Text style={styles.modalButtonLabel}>{linkaccount}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      );
    }
    return <Loader />;
  }
}

const mapStateToProps = state => ({
  meta: state.meta,
  token: state.auth.token,
  userProfile: state.profile,
  connectedList: state.profile.connectedList,
  relationList: state.relationData.relationList,
  profilePictureBase64: state.documents.profilePicture,
});

export default connect(
  mapStateToProps,
  {
    fetchUserDetail,
    getRelationList,
    getRelatedMembers,
    deleteCustomerRelation,
    updateProfileDetail,
    getDocumentById,
    fetchAllConnects,
    setAllConnectedMemberAction,
    deleteCustomerConnect,
  }
)(ManageProfile);

ManageProfile.propTypes = {
  updateProfileDetail: PropTypes.func,
  fetchUserDetail: PropTypes.func,
  getRelationList: PropTypes.func,
  getRelatedMembers: PropTypes.func,
  deleteCustomerRelation: PropTypes.func,
  getDocumentById: PropTypes.func,
  fetchAllConnects: PropTypes.func,
  deleteCustomerConnect: PropTypes.func,
  setAllConnectedMemberAction: PropTypes.func,
  navigation: PropTypes.instanceOf(Object).isRequired,
  token: PropTypes.string,
  meta: PropTypes.instanceOf(Object),
  userProfile: PropTypes.instanceOf(Object),
  connectedList: PropTypes.instanceOf(Object),
  relationList: PropTypes.instanceOf(Object),
  profilePictureBase64: PropTypes.object,
};

ManageProfile.defaultProps = {
  updateProfileDetail: () => {},
  fetchUserDetail: () => {},
  getRelationList: () => {},
  getRelatedMembers: () => {},
  deleteCustomerRelation: () => {},
  deleteCustomerConnect: () => {},
  setAllConnectedMemberAction: () => {},
  token: "",
  meta: [],
};
