import React, { Component } from "react";
import { connect } from "react-redux";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  View,
  Image,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  Alert,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import ModalDropdown from "react-native-modal-dropdown";
import Modal from "react-native-modal";
import moment from "moment";
import Icons from "react-native-vector-icons/FontAwesome";
import PropTypes from "prop-types";
import {
  CoreComponents,
  CoreConfig,
  CoreUtils,
  CoreActions,
  metaHelpers,
} from "@pru-rt-internal/rnmobile-app-core-framework";
import styles from "./styles";
const {
  colors,
  SCREEN_KEY_MANAGE_PROFILE,
  SCREEN_KEY_PROFILE,
  SCREEN_KEY_PROFILE_LIST,
  SCREEN_KEY_CHAT_REPORT,
  KEY_CAMERA_PERMISSION,
  KEY_GALLERY_PERMISSION,
  ElementErrorManager,
} = CoreConfig;
const {
  changeBabylonDobDate,
  babylonDobDatePicked,
  babylonCountryChange,
  updateProfilePic,
  updateProfileDetail,
  setError,
  deleteCustomerRelation,
} = CoreActions;

const { Header, Label, Button, DatePickerWrapper } = CoreComponents;
const { isNilOrEmpty, isValidAlphabetString, isValidNumber } = CoreUtils;
const helpers = metaHelpers;
import { path } from "ramda";
import OpenSettings from "react-native-open-settings";

const KEY_FIRSTNAME = "firstname";
const KEY_LASTNAME = "lastname";
const KEY_EMAIL = "email";
const KEY_BIRTHDAY = "birthday";
const KEY_PHONE_NUMBER = "phonenumber";
const KEY_STREET = "street";
const KEY_CITY = "city";
const KEY_ZIPCODE = "zipcode";
const KEY_GENDER_MALE = "male";
const KEY_GENDER_FEMALE = "female";
const KEY_GENDER_LABEL = "gender";
const KEY_OK = "ok";
const KEY_COUNTRY = "country";
const KEY_PROFILE = "profile";
const KEY_WHO_ARE_YOU = "whoareyou";
const KEY_RELATIONSHIP = "relationship";
const KEY_SAVE = "save";
const KEY_CAMERA = "camera";
const KEY_GALLERY = "gallery";
const KEY_SELECT = "selectphoto";
const KEY_SUCCESS = "updatesuccess";
const KEY_CANCEL = "cancel";
const KEY_PLEASE_SELECT = "pleaseSelect";
const KEY_PLEASE_SELECT_REL_MSG = "relationselectmessage";
const KEY_PLEASE_ENTER_FIRST_NAME = "enterfirstnamemessage";
const ALPHABET = "alphabets";
const NUMBERS = "numbers";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      relation: "",
      firstname: "",
      lastname: "",
      street: "",
      city: "",
      zipcode: "",
      phone: "",
      gender: "",
      genderFemaleArr: ["MOTHER", "SISTER"],
      genderMaleArr: ["FATHER", "BROTHER"],
      genderEditable: true,
      image: "",
      imageFileName: "",
      imageFormat: "",
      modalVisible: false,
      dobError: "",
      dobModalVisible: false,
      addressChecked: false,
      saveLoader: false,
    };
    this.dobNewDialog = React.createRef();
    this.showCamera = this.showCamera.bind(this);
    this.showGallery = this.showGallery.bind(this);
    this.updateUserDetail = this.updateUserDetail.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.onDOBPress = this.onDOBPress.bind(this);
    this.onDOBDatePicked = this.onDOBDatePicked.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.changePhone = this.changePhone.bind(this);
    this.navigateToMainScreen = this.navigateToMainScreen.bind(this);
    this.validateData = this.validateData.bind(this);
    this.getUserFormData = this.getUserFormData.bind(this);
    this.validateUpdateUserDetail = this.validateUpdateUserDetail.bind(this);
    this.pickerValue = this.pickerValue.bind(this);
    this.setUserRelation = this.setUserRelation.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.checkboxSelected = this.checkboxSelected.bind(this);
    this.addressCheckbox = this.addressCheckbox.bind(this);
    this.renderSaveBtn = this.renderSaveBtn.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick.bind(this)
    );
    const { navigation } = this.props;
    const { userData } = navigation.state.params;
    this.updateProfile(userData);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick.bind(this)
    );
  }
  onDOBPress() {
    let { dobDate: dobDateValue } = this.props;
    const { changeBabylonDobDate: changeBabylonDobDateFunc } = this.props;
    if (!dobDateValue || dobDateValue == null) {
      dobDateValue = new Date();
      changeBabylonDobDateFunc(dobDateValue);
    }
    this.setState({
      dobModalVisible: true,
    });
    // To open the dialog
    /* this.dobNewDialog.current.open({
      date: dobDateValue,
      maxDate: new Date(), // To restirct future date
    });*/
  }
  onDOBDatePicked(date) {
    const { babylonDobDatePicked: babylonDobDatePickedFunc } = this.props;
    babylonDobDatePickedFunc(date);
  }

  onCountryChange(index, key) {
    const { babylonCountryChange: babylonCountryChangeFunc } = this.props;
    const { countryList: CountryList } = this.props;
    const itemValue = CountryList.find(x => x.countryName === key);
    babylonCountryChangeFunc(itemValue);
  }
  closeModal(date) {
    if (!isNilOrEmpty(date)) {
      const { babylonDobDatePicked: babylonDobDatePickedFunc } = this.props;
      babylonDobDatePickedFunc(date);
    }
    this.setState({
      dobModalVisible: false,
    });
  }
  user() {
    const { navigation } = this.props;
    const { image } = this.state;
    const { editable, newProfile } = navigation.state.params;
    const profile = helpers.findElement(SCREEN_KEY_MANAGE_PROFILE, KEY_PROFILE)
      .label;
    const whoareyou = helpers.findElement(SCREEN_KEY_PROFILE, KEY_WHO_ARE_YOU)
      .label;
    return (
      <View>
        <Text style={styles.title}>{profile}</Text>
        <View style={styles.userView}>
          <TouchableOpacity
            onPress={e => {
              e.preventDefault();
              if (editable) {
                this.setState({ modalVisible: true });
              }
            }}
          >
            {image === "" && (
              <View style={[styles.userPic, styles.noUserPic]}>
                <Icons name="camera" size={30} color="#68737a" />
              </View>
            )}
            {image !== "" && (
              <Image
                style={styles.userPic}
                source={{ uri: `data:image/jpeg;base64,${image}` }}
              />
            )}
          </TouchableOpacity>
          {!newProfile && <Text style={styles.username} />}
          {newProfile && <Text style={styles.username}>{whoareyou}</Text>}
        </View>
      </View>
    );
  }

  imageCallbackHandler(image) {
    this.setState({
      image: image.data,
      imageFileName: image.path.split("/").pop() || "",
      imageFormat: image.mime || null,
      modalVisible: false,
    });
  }

  showGallery() {
    const galleryPermission = helpers.findElement(
      SCREEN_KEY_MANAGE_PROFILE,
      KEY_GALLERY_PERMISSION
    ).label;
    const ok = helpers
      .findElement(SCREEN_KEY_CHAT_REPORT, KEY_OK)
      .label.toUpperCase();
    const cancel = helpers.findElement(SCREEN_KEY_MANAGE_PROFILE, KEY_CANCEL)
      .label;
    ImagePicker.openPicker({
      mediaType: "photo",
      width: 200,
      height: 200,
      includeBase64: true,
      compressImageMaxWidth: 200,
      compressImageMaxHeight: 200,
      compressImageQuality: 0.8,
      photo: "photo",
    })
      .then(this.imageCallbackHandler.bind(this))
      .catch(error => {
        if (error.code !== "E_PICKER_CANCELLED" && Platform.OS === "ios") {
          Alert.alert(
            "",
            galleryPermission,
            [
              { text: ok, onPress: () => OpenSettings.openSettings() },
              { text: cancel, style: "cancel" },
            ],
            { cancelable: false }
          );
        }
      });
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  showCamera() {
    const cameraPermission = helpers.findElement(
      SCREEN_KEY_MANAGE_PROFILE,
      KEY_CAMERA_PERMISSION
    ).label;
    const ok = helpers
      .findElement(SCREEN_KEY_CHAT_REPORT, KEY_OK)
      .label.toUpperCase();
    const cancel = helpers.findElement(SCREEN_KEY_MANAGE_PROFILE, KEY_CANCEL)
      .label;

    ImagePicker.openCamera({
      width: 200,
      height: 200,
      compressImageMaxWidth: 200,
      compressImageMaxHeight: 200,
      useFrontCamera: true,
      includeBase64: true,
      compressImageQuality: 0.8,
      photo: "photo",
    })
      .then(this.imageCallbackHandler.bind(this))
      .catch(error => {
        if (error.code !== "E_PICKER_CANCELLED" && Platform.OS === "ios") {
          Alert.alert(
            "",
            cameraPermission,
            [
              { text: ok, onPress: () => OpenSettings.openSettings() },
              { text: cancel, style: "cancel" },
            ],
            { cancelable: false }
          );
        }
      });
  }

  updateProfile(data) {
    const { navigation } = this.props;
    const { related } = navigation.state.params;
    if (data) {
      this.setState({
        //relation: path(["relation"], data),
        firstname: path(["firstName"], data),
        lastname: path(["surName"], data),
        street: path(["address1"], data),
        city: path(["address2"], data),
        zipcode: path(["address3"], data),
        phone: path(["phone"], data),
        gender: path(["gender"], data),
        image: path(["profilePicture"], data),
      });
      if (!related) {
        this.setState({ email: path(["email"], data) });
      }
      if (path(["relation"], data)) {
        this.setUserRelation(data.relation);
      }
      if (data.dob && data.dob != "" && data.dob != null) {
        const date = moment(data.dob, "DD-MM-YYYY");
        this.onDOBDatePicked(new Date(date));
      } else {
        this.onDOBDatePicked(new Date());
      }
    } else {
      this.onDOBDatePicked(new Date());
    }
  }

  navigateToMainScreen() {
    const { navigation } = this.props;
    const { related, updateConnectedMembers } = navigation.state.params;
    const success = helpers.findElement(SCREEN_KEY_MANAGE_PROFILE, KEY_SUCCESS)
      .label;
    const {
      navigation: { goBack: goBackFunction },
    } = this.props;
    Alert.alert(success);
    goBackFunction();
    this.setState({
      saveLoader: false,
    });
    if (related) {
      updateConnectedMembers();
    }
  }

  onChangeTextForName = (name, text, inputType) => {
    if (inputType) {
      if (
        (inputType === ALPHABET && isValidAlphabetString(text)) ||
        (inputType === NUMBERS && isValidNumber(text))
      ) {
        this.setState({ [name]: text });
      }
    } else {
      this.setState({ [name]: text });
    }

    if (this.state.addressChecked) {
      if (
        (name === "street" && this.props.userProfile.address1 !== text) ||
        (name === "city" && this.props.userProfile.address2 !== text) ||
        (name === "zipcode" && this.props.userProfile.address3 !== text)
      ) {
        this.setState({
          addressChecked: false,
        });
      }
    }
  };

  inputValue(label, name, inputType) {
    const { navigation } = this.props;
    const { editable, related } = navigation.state.params;
    const { email: Email } = this.props;
    const { [name]: NameValue } = this.state;
    return (
      <View>
        <Text style={styles.labelTitle}>{label}</Text>
        <TextInput
          editable={
            name === "email" && editable && !related ? !editable : editable
          }
          style={styles.inputBox}
          onChangeText={text => this.onChangeTextForName(name, text, inputType)}
          value={name === "email" && editable && !related ? Email : NameValue}
          underlineColorAndroid="transparent"
        />
      </View>
    );
  }

  genderType(genderLabel, gender) {
    const { navigation } = this.props;
    const { editable } = navigation.state.params;
    const { gender: Gender, genderEditable } = this.state;
    return (
      <Button
        text={genderLabel}
        wrapper={[
          styles.genderView,
          {
            backgroundColor: Gender === gender ? colors.nevada : "transparent",
          },
        ]}
        style={[
          styles.gender,
          {
            color: Gender === gender ? colors.white : colors.silver,
          },
        ]}
        onClick={() => {
          if (editable && genderEditable) {
            this.setState({ gender });
          }
        }}
      />
    );
  }

  genderView() {
    const male = helpers.findElement(SCREEN_KEY_MANAGE_PROFILE, KEY_GENDER_MALE)
      .label;
    const female = helpers.findElement(
      SCREEN_KEY_MANAGE_PROFILE,
      KEY_GENDER_FEMALE
    ).label;
    const gender = helpers.findElement(
      SCREEN_KEY_MANAGE_PROFILE,
      KEY_GENDER_LABEL
    ).label;
    return (
      <View>
        <Text style={styles.labelTitle}>{gender}</Text>
        <View style={styles.flx_rw}>
          {this.genderType(male, "MALE")}
          {this.genderType(female, "FEMALE")}
        </View>
      </View>
    );
  }

  changePhone(number) {
    const regex = /^[0-9]*$/;
    const isValid = regex.test(number);
    if (isValid) {
      this.setState({
        phone: number,
      });
    }
  }

  phoneDetail() {
    const { navigation, country } = this.props;
    const { editable } = navigation.state.params;
    const phonenumber = helpers.findElement(
      SCREEN_KEY_MANAGE_PROFILE,
      KEY_PHONE_NUMBER
    ).label;
    const { phone: phoneValue } = this.state;
    return (
      <View style={[styles.userDetailView, styles.noBottomMargin]}>
        <Text style={styles.labelTitle}>{phonenumber}</Text>
        <View style={styles.phoneDetail}>
          <Text style={styles.countryCode}>{country.countryPhoneCode}</Text>
          <TextInput
            editable={editable}
            keyboardType="numeric"
            style={[
              styles.inputBox,
              styles.noBottomMargin,
              styles.noBorderBottom,
            ]}
            onChangeText={text => this.changePhone(text)}
            value={phoneValue}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>
    );
  }

  setUserRelation(val) {
    const { relationList: RelationList } = this.props;
    const itemValue = RelationList.find(x => x.name === val);
    this.pickerValue(itemValue.key);
  }

  pickerValue(val) {
    const { genderFemaleArr, genderMaleArr } = this.state;
    const { relationList: RelationList } = this.props;
    const itemValue = RelationList.find(x => x.key === val);
    if (genderFemaleArr.indexOf(itemValue.name) !== -1) {
      this.setState({
        relation: itemValue,
        gender: "FEMALE",
        genderEditable: false,
      });
    } else if (genderMaleArr.indexOf(itemValue.name) !== -1) {
      this.setState({
        relation: itemValue,
        gender: "MALE",
        genderEditable: false,
      });
    } else {
      this.setState({
        relation: itemValue,
        genderEditable: true,
      });
    }
  }

  relationDetail() {
    const { relationList } = this.props;
    const relation = helpers.findElement(SCREEN_KEY_PROFILE, KEY_RELATIONSHIP)
      .label;
    const pleaseSelect = helpers.findElement(
      SCREEN_KEY_PROFILE_LIST,
      KEY_PLEASE_SELECT
    ).label;
    return (
      <View style={[styles.userDetailView, styles.noBottomMargin]}>
        <Text style={styles.labelTitle}>{relation}</Text>
        <View style={styles.relationDetail}>
          <View style={styles.dropbox}>
            <ModalDropdown
              textStyle={styles.textStyle}
              style={styles.dropDownButton}
              dropdownStyle={styles.relationDropdownStyle}
              dropdownTextStyle={styles.dropdownTextStyle}
              defaultValue={
                this.state.relation.key ? this.state.relation.key : pleaseSelect
              }
              options={relationList.map(rel => rel.key)}
              onSelect={(index, key) => this.pickerValue(key)}
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
        </View>
      </View>
    );
  }

  countryDetail() {
    const { meta, countryList } = this.props;
    const countryLabel = helpers.findElement(
      SCREEN_KEY_MANAGE_PROFILE,
      KEY_COUNTRY
    ).label;

    const dropDownOptions = countryList.map(x => x.countryName);

    return (
      <View style={styles.countryContainer}>
        <Label value={countryLabel} style={styles.labelTitle} />
        <View style={styles.dropbox}>
          <ModalDropdown
            textStyle={styles.textStyle}
            style={styles.dropDownButton}
            dropdownStyle={styles.countryDropdownStyle}
            dropdownTextStyle={styles.dropdownTextStyle}
            defaultValue={dropDownOptions[0]}
            options={dropDownOptions}
            onSelect={(index, key) => this.onCountryChange(index, key)}
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
      </View>
    );
  }

  birthDayView() {
    const { navigation } = this.props;
    const { editable, related } = navigation.state.params;
    const { dobErr: DobErr } = this.state;
    const birthday = helpers.findElement(
      SCREEN_KEY_MANAGE_PROFILE,
      KEY_BIRTHDAY
    ).label;
    const dateValue =
      moment(new Date()).format("DD-MM-YYYY") === this.props.dobText
        ? "DD-MM-YYYY"
        : this.props.dobText;
    return (
      <View>
        <Text style={styles.labelTitle}>{birthday}</Text>
        <TouchableOpacity
          onPress={() => {
            if (editable) {
              this.onDOBPress();
            }
          }}
        >
          <View
            style={
              !isNilOrEmpty(DobErr) && !related
                ? [styles.datePickerBox, styles.errorBorderColor]
                : [styles.datePickerBox]
            }
          >
            <Label value={dateValue} style={styles.datePickerText} />
          </View>
          {!isNilOrEmpty(DobErr) && (
            <Label
              value={DobErr}
              style={[styles.datePickerText, styles.errorLabelColor]}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  }

  // eslint-disable-next-line complexity
  validateData() {
    const { dobErrorMessage, navigation } = this.props;
    const { related } = navigation.state.params;
    const { relation, firstname } = this.state;
    const pleaseSelectRelMsg = helpers.findElement(
      SCREEN_KEY_PROFILE_LIST,
      KEY_PLEASE_SELECT_REL_MSG
    ).label;

    const firstNameErrMessage = "Please enter first name.";

    if (
      moment(this.props.dobText, "DD-MM-YYYY") >
        moment().subtract(18, "years") &&
      !related
    ) {
      this.setState({
        dobErr: dobErrorMessage,
      });
    } else if (related && !relation) {
      Alert.alert("", pleaseSelectRelMsg);
      this.setState({
        dobErr: "",
      });
    } else if (related && !firstname) {
      Alert.alert("", firstNameErrMessage);
      this.setState({
        dobErr: "",
      });
    } else if (
      moment(this.props.dobText, "DD-MM-YYYY") > moment().subtract(1, "day") &&
      related
    ) {
      this.setState({
        dobErr: "Please enter birthday",
      });
    } else {
      this.setState({
        dobErr: "",
        saveLoader: true,
      });
      this.validateUpdateUserDetail();
    }
  }

  getUserFormData() {
    const {
      phone,
      firstname,
      lastname,
      street,
      city,
      zipcode,
      gender,
      image,
      imageFileName,
      imageFormat,
    } = this.state;
    const { email: Email, dobText: DobText, navigation } = this.props;
    const {
      country: { countryName: CountryName },
    } = this.props;
    const { related, userData } = navigation.state.params;
    const structUserData = {};
    structUserData["firstName"] = firstname;
    structUserData["surName"] = lastname;
    structUserData["addressDetails"] = {};
    structUserData["addressDetails"]["address"] = {
      line1: street,
      city,
      zipcode,
      country: CountryName,
    };
    structUserData["dob"] = DobText;
    structUserData["sex"] = gender;
    structUserData["contactDetails"] = {};
    if (!related && !isNilOrEmpty(phone)) {
      structUserData["contactDetails"]["phone"] = {
        channel: "PHONE",
        value: phone,
      };
    }
    if (!related) {
      structUserData["contactDetails"]["email"] = {
        channel: "EMAIL",
        value: Email,
      };
    }
    if (!isNilOrEmpty(image)) {
      structUserData["documents"] = [
        {
          content: image.toString(),
          contentType: "Image",
          filename: imageFileName,
          format: imageFormat,
        },
      ];
      if (path(["documents"], userData)) {
        structUserData["documents"][0]["id"] =
          userData.documents[userData.documents.length - 1]["id"];
      }
    }
    return structUserData;
  }

  relationCheck(relation) {
    return (
      relation.toLowerCase() !== "spouse" &&
      relation.toLowerCase() !== "children"
    );
  }

  getRelation(relation) {
    return relation ? relation : "BROTHER";
  }

  validateUpdateUserDetail() {
    const { relation: Relation } = this.state;
    const { userData, newProfile } = this.props.navigation.state.params;
    if (userData && userData.relation !== Relation.name && !newProfile) {
      this.updateMemberRelationShip(userData, Relation.name);
    } else {
      this.updateUserDetail(userData, Relation.name);
    }
  }

  updateMemberRelationShip(userData, Relation) {
    const { deleteCustomerRelation, sessionId } = this.props;
    const { userProfile: pastUserDetails } = this.props;
    const relation = this.getRelation(Relation);
    const formData = this.getUserFormData();
    deleteCustomerRelation(userData.id, sessionId, () => {
      this.newFamilyMember(relation, pastUserDetails, formData);
    });
  }

  updateUserDetail(userData, Relation) {
    const { related, newProfile } = this.props.navigation.state.params;
    //Read user details to get the user id from the profile object
    const { userProfile: pastUserDetails } = this.props;
    const relation = this.getRelation(Relation);
    const formData = this.getUserFormData();
    if (newProfile) {
      // new family members
      this.newFamilyMember(relation, pastUserDetails, formData);
    } else if (!newProfile && related) {
      // update family members
      this.updateFamilyMember(relation, pastUserDetails, formData, userData);
    } else {
      // update Self members
      this.updateSelfProfile(formData, pastUserDetails);
    }
  }

  updateSelfProfile(formData, pastUserDetails) {
    let userProfile = {};
    const {
      sessionId: SessionID,
      updateProfileDetail: updateProfileDetailFunc,
    } = this.props;
    formData["id"] = pastUserDetails.id;
    userProfile = formData;
    if (!isNilOrEmpty(SessionID)) {
      updateProfileDetailFunc(
        userProfile,
        SessionID,
        this.navigateToMainScreen
      );
    }
  }

  updateFamilyMember(relation, pastUserDetails, formData, userData) {
    const userProfile = {};
    const {
      sessionId: SessionID,
      updateProfileDetail: updateProfileDetailFunc,
    } = this.props;
    if (this.relationCheck(relation)) {
      userProfile["id"] = pastUserDetails.id;
      formData["id"] = userData.id;
      userProfile["relatesTo"] = {};
      userProfile["relatesTo"][relation.toLowerCase()] = [];
      userProfile["relatesTo"][relation.toLowerCase()].push(formData);
    } else {
      formData["id"] = userData.id;
      this.checkRelationSpouse(
        relation,
        userProfile,
        pastUserDetails,
        formData
      );
    }
    if (!isNilOrEmpty(SessionID)) {
      updateProfileDetailFunc(
        userProfile,
        SessionID,
        this.navigateToMainScreen
      );
    }
  }

  newFamilyMember(relation, pastUserDetails, formData) {
    const userProfile = {};
    const {
      sessionId: SessionID,
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
    if (!isNilOrEmpty(SessionID)) {
      updateProfileDetailFunc(
        userProfile,
        SessionID,
        this.navigateToMainScreen
      );
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

  checkboxSelected() {
    const { userProfile } = this.props;
    if (!this.state.addressChecked) {
      this.setState({
        addressChecked: true,
        street: userProfile.address1 ? userProfile.address1 : "",
        city: userProfile.address2 ? userProfile.address2 : "",
        zipcode: userProfile.address3 ? userProfile.address3 : "",
      });
    } else {
      this.setState({
        addressChecked: false,
      });
    }
  }

  addressCheckbox() {
    return (
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.flx_rw}
          onPress={() => this.checkboxSelected()}
        >
          {this.state.addressChecked && (
            <Icons name="check-square-o" size={25} color={colors.nevada} />
          )}
          {!this.state.addressChecked && (
            <Icons name="square-o" size={25} color={colors.nevada} />
          )}
          <Label
            value="Same address as mine"
            style={styles.addressCheckboxLabel}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderSaveBtn(save) {
    const { saveLoader } = this.state;
    const { navigation } = this.props;
    const { editable } = navigation.state.params;
    return (
      <View>
        {editable && !saveLoader && (
          <Button
            text={save}
            wrapper={styles.save}
            style={styles.saveText}
            onClick={this.validateData}
          />
        )}
        {editable && saveLoader && (
          <View style={styles.save}>
            <ActivityIndicator size="large" color={colors.white} />
          </View>
        )}
      </View>
    );
  }

  // eslint-disable-next-line complexity
  userDetails() {
    const { navigation, userProfile } = this.props;
    const { related } = navigation.state.params;
    const firstName = helpers.findElement(
      SCREEN_KEY_MANAGE_PROFILE,
      KEY_FIRSTNAME
    ).label;
    const lastname = helpers.findElement(
      SCREEN_KEY_MANAGE_PROFILE,
      KEY_LASTNAME
    ).label;
    const email = helpers.findElement(SCREEN_KEY_MANAGE_PROFILE, KEY_EMAIL)
      .label;
    const city = helpers.findElement(SCREEN_KEY_MANAGE_PROFILE, KEY_CITY).label;
    const address = helpers.findElement(SCREEN_KEY_MANAGE_PROFILE, KEY_STREET)
      .label;
    const zipcode = helpers.findElement(SCREEN_KEY_MANAGE_PROFILE, KEY_ZIPCODE)
      .label;
    const save = helpers.findElement(SCREEN_KEY_PROFILE, KEY_SAVE).label;
    const selectfrom = helpers.findElement(SCREEN_KEY_PROFILE, KEY_SELECT)
      .label;
    const camera = helpers.findElement(SCREEN_KEY_PROFILE, KEY_CAMERA).label;
    const gallery = helpers.findElement(SCREEN_KEY_PROFILE, KEY_GALLERY).label;
    const { modalVisible: ModalVisible } = this.state;
    return (
      <View style={styles.userDetailView}>
        {related && this.relationDetail()}
        {this.inputValue(firstName, KEY_FIRSTNAME, ALPHABET)}
        {this.inputValue(lastname, KEY_LASTNAME, ALPHABET)}
        {this.genderView()}
        {!related && this.inputValue(email, KEY_EMAIL)}
        {this.birthDayView()}
        {!related && this.phoneDetail()}
        {this.countryDetail()}
        {related &&
          ((userProfile.address1 !== "" &&
            userProfile.address1 !== undefined) ||
            (userProfile.address2 !== "" &&
              userProfile.address2 !== undefined) ||
            (userProfile.address3 !== "" &&
              userProfile.address3 !== undefined)) &&
          this.addressCheckbox()}
        {this.inputValue(address, KEY_STREET)}
        {this.inputValue(city, KEY_CITY)}
        {this.inputValue(zipcode, KEY_ZIPCODE, NUMBERS)}
        {this.renderSaveBtn(save)}
        <Modal
          isVisible={ModalVisible}
          onBackdropPress={() => this.setState({ modalVisible: false })}
          hideModalContentWhileAnimating
        >
          <TouchableOpacity
            style={styles.profileModalContent}
            onPress={() => {
              this.setState({ modalVisible: false });
            }}
          >
            <View style={styles.modalStyle}>
              <Text style={styles.modalLabel}>{selectfrom}</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalLeftButton}
                  onPress={e => {
                    e.preventDefault();
                    this.showCamera();
                  }}
                >
                  <View style={styles.link}>
                    <Icons name="camera" size={50} color="#ed1b2e" />
                  </View>
                  <Text style={styles.modalButtonLabel}>{camera}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalRightButton}
                  onPress={e => {
                    e.preventDefault();
                    this.showGallery();
                  }}
                >
                  <View style={styles.link}>
                    <Icons name="photo" size={50} color="#ed1b2e" />
                  </View>
                  <Text style={styles.modalButtonLabel}>{gallery}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }

  render() {
    const { updatingUser } = this.props;
    ElementErrorManager.setCurrentScreen(SCREEN_KEY_MANAGE_PROFILE);
    const ok = helpers
      .findElement(SCREEN_KEY_CHAT_REPORT, KEY_OK)
      .label.toUpperCase();
    const cancel = helpers
      .findElement(SCREEN_KEY_CHAT_REPORT, KEY_CANCEL)
      .label.toUpperCase();
    return (
      <View style={[styles.container, styles.loaderContainer]}>
        {updatingUser && (
          <View style={styles.loaderProfile}>
            <ActivityIndicator
              size="large"
              color={Platform.OS === "ios" ? colors.white : colors.crimson}
            />
          </View>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          backdropColor={colors.black}
          backdropOpacity={0.6}
          isVisible={this.state.dobModalVisible}
          onBackButtonPress={this.closeModal.bind(this, this.props.dobDate)}
          onBackdropPress={this.closeModal.bind(this, this.props.dobDate)}
        >
          <DatePickerWrapper
            date={
              new Date(
                this.props.dobText
                  .split("-")
                  .reverse()
                  .join("-")
              )
            }
            onDateChange={date => this.onDOBDatePicked(date)}
            onSelect={this.closeModal.bind(this, "")}
            onCancel={this.closeModal.bind(this, this.props.dobDate)}
            cancelText={cancel}
            selectText={ok}
            fadeToColor={colors.white}
            mode="date"
            maximumDate={new Date()}
          />
        </Modal>
        <Header
          leftIconType="back"
          onLeftPress={e => {
            e.preventDefault();
            this.handleBackButtonClick();
          }}
          onRightPress={() => {}}
          showRightIcon={false}
        />
        <KeyboardAvoidingView behavior="padding">
          <ScrollView style={styles.container}>
            {this.user()}
            {this.userDetails()}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  dobText: state.babylonAuth.dobText,
  dobDate: state.profile.dob
    ? new Date(
        state.profile.dob
          .split("-")
          .reverse()
          .join("-")
      )
    : new Date(),
  dobErrorMessage: state.babylonAuth.dobErrorMessage,
  dobErr: state.babylonAuth.dobErr,
  showError: state.babylonAuth.showError,
  country: state.babylonAuth.country,
  countryList: state.meta.countryList,
  meta: state.meta,
  sessionId: state.auth.token,
  email: state.profile.email,
  userProfile: state.profile,
  updatingUser: state.profile.updatingUser,
  updateUser: state.profile.updateUser,
  profilePictureBase64: state.documents.profilePicture,
  relationList: state.relationData.relationList,
});

export default connect(
  mapStateToProps,
  {
    changeBabylonDobDate,
    babylonDobDatePicked,
    babylonCountryChange,
    updateProfilePic,
    updateProfileDetail,
    setError,
    deleteCustomerRelation,
  }
)(Profile);

Profile.propTypes = {
  updatingUser: PropTypes.bool,
  country: PropTypes.instanceOf(Object),
  babylonDobDatePicked: PropTypes.func,
  updateProfileDetail: PropTypes.func,
  dobText: PropTypes.string,
  dobDate: PropTypes.instanceOf(Object),
  email: PropTypes.string,
  changeBabylonDobDate: PropTypes.func,
  babylonCountryChange: PropTypes.func,
  updateProfilePic: PropTypes.func,
  deleteCustomerRelation: PropTypes.func,
  navigation: PropTypes.instanceOf(Object).isRequired,
  sessionId: PropTypes.string,
  countryList: PropTypes.instanceOf(Object),
  meta: PropTypes.instanceOf(Object),
  userProfile: PropTypes.instanceOf(Object),
  relationList: PropTypes.instanceOf(Object),
  dobErrorMessage: PropTypes.string,
};

Profile.defaultProps = {
  updatingUser: false,
  country: [],
  dobErr: false,
  babylonDobDatePicked: () => {},
  updateProfileDetail: () => {},
  changeBabylonDobDate: () => {},
  babylonCountryChange: () => {},
  updateProfilePic: () => {},
  deleteCustomerRelation: () => {},
  dobText: "",
  email: "",
  dobDate: "",
  sessionId: "",
  countryList: [],
  meta: [],
};
