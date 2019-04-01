import { TabNavigator, createStackNavigator } from "react-navigation";
import { Platform } from "react-native";
import LoginScreen from "./Login";
import ManageProfile from "./ManageProfile";
import ProfileRequests from "./ProfileRequests";
import ProfileSearch from "./ProfileSearch";
import Settings from "./Settings";
import ProfileConnect from "./Connect/ProfileConnect";
import AddProfile from "./Connect/AddProfile";
import ContactList from "./Connect/ContactsList";
import AIME from "./AIME/AIMEContainer";
import HelpScreen from "./HelpScreen/HelpScreen";
import ChangePassword from "./ChangePassword/ChangePassword";
import TourPage from "./TourPage";
import Aboutus from "./Aboutus";
import Termsandconditions from "./Aboutus/Termsandconditions";
import Privacy from "./Aboutus/Privacy";
import Common from "./Aboutus/Common";
import SocialRegistrationEmail from "./SocialRegistrationEmail/SocialRegistrationEmail";
import MainTab from "./Navigation/MainTab";
import NavigatorStack from "./MapNavigator";
import DocRegister from "./DocOnCall/DocRegister";
import ConsultDoctor from "./ConsultDoctor";
import ConsultationStatus from "./ConsultationStatus";
import ConsultationFeedback from "./ConsultationFeedback";
import AIMERegister from "../containers/AIME/AIMERegister";
import RegisterScreen from "../containers/Register";
import ForgotScreen from "../containers/ForgotPassword";
import EmailRegisterScreen from "../containers/EmailRegister";
import NewPassScreen from "../containers/NewPassword";
import Profile from "../containers/Profile";
import Account from "../containers/Account";
import ChangeLanguage from "../containers/ChangeLanguage";
import Feedback from "../containers/Feedback";
import Notification from "../containers/Notification";
import App from "../App";
import Introduction from "./DocOnCall";
import {
  CoreComponents,
  CoreConfig,
  metaHelpers,
  CoreConstants,
} from "@pru-rt-internal/rnmobile-app-core-framework";


const {
  FingerprintPreferences,
  HealthTipDetails,
  TermsAndConditionsComponent,
  TrackActivityDetails,
} = CoreComponents;
const { colors } = CoreConfig;

const {
  SCREEN_KEY_PROFILE_LIST,
  DOC_SERVICE,
  DOC_SERVICE_INTRO,
  DOC_SERVICE_REGISTER,
  DOC_SERVICE_LANDING,
  DOC_SERVICE_CONSULTATION,
  DOC_SERVICE_FEEDBACK,
  PROFILE,
} = CoreConstants;
const KEY_PROFILE_TAB = "profilestab";
const KEY_REQUEST_TAB = "requeststab";

const ManageProfileTab = TabNavigator(
  {
    ManageProfile: {
      screen: ManageProfile,
      navigationOptions: () => {
        return {
          tabBarLabel: metaHelpers.findElement(
            SCREEN_KEY_PROFILE_LIST,
            KEY_PROFILE_TAB
          ).label,
        };
      },
    },
    Request: {
      screen: ProfileRequests,
      navigationOptions: () => {
        return {
          tabBarLabel: metaHelpers.findElement(
            SCREEN_KEY_PROFILE_LIST,
            KEY_REQUEST_TAB
          ).label,
        };
      },
    },
  },
  {
    ...TabNavigator.Presets.AndroidTopTabs,
    tabBarOptions: {
      indicatorStyle: {
        opacity: 1,
        backgroundColor: "#efefef",
        height: 7,
        padding: 0,
      },
      activeTintColor: colors.nevada,
      showIcon: false,
      // showLabel: true,
      upperCaseLabel: false,
      inactiveTintColor: "#a8a8a8", // Color of tab when not pressed
      labelStyle: {
        fontSize: 21.7,
        // lineHeight: 28,
        marginTop: 0,
        paddingTop: 0,
        color: colors.nevada,
        fontFamily: Platform.OS == "ios" ? "PruSansNormal-Demi" : "pruSansBold",
      },
      tabStyle: {
        height: 40,
        padding: 4,
      },
      style: {
        // borderBottomColor: '#29000000',
        // borderBottomWidth: 2,
        marginTop: 0,
        paddingTop: 0,
        height: 50,
        backgroundColor: colors.white, // Makes Android tab bar white instead of standard blue
      },
    },
    tabBarPosition: "top",
    lazy: true,
    swipeEnabled: false,
  }
);

const DocServiceCallStack = createStackNavigator(
  {
    [DOC_SERVICE_INTRO]: {
      screen: Introduction,
      navigationOptions: {
        header: null,
        tabBarVisible: false,
        gesturesEnabled: false,
      },
    },
    [DOC_SERVICE_REGISTER]: {
      screen: DocRegister,
      navigationOptions: {
        header: null,
      },
    },
    [DOC_SERVICE_LANDING]: {
      screen: ConsultDoctor,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      },
    },
    [DOC_SERVICE_CONSULTATION]: {
      screen: ConsultationStatus,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      },
    },
    [DOC_SERVICE_FEEDBACK]: {
      screen: ConsultationFeedback,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      },
    },
  },
  {
    initialRouteName: DOC_SERVICE_INTRO,
  }
);

const LoginStack = createStackNavigator({
  App: {
    screen: App,
    navigationOptions: {
      header: null, // this will hide the header
      gesturesEnabled: false,
    },
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: {
      header: null, // this will hide the header
      gesturesEnabled: false,
    },
  },
  EmailRegister: {
    screen: EmailRegisterScreen,
    navigationOptions: {
      header: null, // this will hide the header
      gesturesEnabled: false,
    },
  },
  Forgot: {
    screen: ForgotScreen,
    navigationOptions: {
      header: null, // this will hide the header
      gesturesEnabled: false,
    },
  },
  NewPass: {
    screen: NewPassScreen,
    navigationOptions: {
      header: null, // this will hide the header
      gesturesEnabled: false,
    },
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      header: null, // this will hide the header
      gesturesEnabled: false,
    },
  },
  MainTermsAndConditions: {
    screen: TermsAndConditionsComponent,
    navigationOptions: {
      header: null, // this will hide the header
      gesturesEnabled: false,
    },
  },
  MainTab: {
    screen: MainTab,
    navigationOptions: {
      header: null,
    },
  },
  ManageProfile: {
    screen: ManageProfileTab,
    navigationOptions: {
      headerForceInset: {},
      gesturesEnabled: false,
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
      },
    },
  },
  [PROFILE]: {
    screen: Profile,
    navigationOptions: {
      gesturesEnabled: false,
      header: null,
    },
  },
  ProfileSearch: {
    screen: ProfileSearch,
  },
  Settings: {
    screen: Settings,
    navigationOptions: {
      gesturesEnabled: false,
      header: null,
    },
  },
  AIME: {
    screen: AIME,
    navigationOptions: {
      gesturesEnabled: false,
      header: null,
    },
  },
  AIMERegister: {
    screen: AIMERegister,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  ProfileConnect: {
    screen: ProfileConnect,
  },
  AddProfile: {
    screen: AddProfile,
  },
  ContactList: {
    screen: ContactList,
  },
  Account: {
    screen: Account,
    navigationOptions: {
      gesturesEnabled: false,
      header: null,
    },
  },
  ChangeLanguage: {
    screen: ChangeLanguage,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  HelpScreen: {
    screen: HelpScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  ChangePassword: {
    screen: ChangePassword,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  Notification: {
    screen: Notification,
  },
  TourPage: {
    screen: TourPage,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  Feedback: {
    screen: Feedback,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  Aboutus: {
    screen: Aboutus,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  AboutTerms: {
    screen: Termsandconditions,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  Privacy: {
    screen: Privacy,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  Common: {
    screen: Common,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  SocialRegistrationEmail: {
    screen: SocialRegistrationEmail,
    navigationOptions: {
      header: null, // this will hide the header
      gesturesEnabled: false,
    },
  },
  TrackActivityDetails: {
    screen: TrackActivityDetails,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  Navigator: {
    screen: NavigatorStack,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  FingerprintPreferences: {
    screen: FingerprintPreferences,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  Healthtips: {
    screen: HealthTipDetails,
    navigationOptions: {
      header: null, // this will hide the header
      gesturesEnabled: false,
    },
  },
  [DOC_SERVICE]: {
    screen: DocServiceCallStack,
    navigationOptions: {
      header: null,
      tabBarVisible: false,
    },
  },
});
export default LoginStack;
