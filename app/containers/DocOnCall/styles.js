import { StyleSheet, Platform, Dimensions } from "react-native";

import { CoreConfig } from "@pru-rt-internal/rnmobile-app-core-framework";

const { colors, width } = CoreConfig;
const dimensions = {
  fullHeight: Dimensions.get("window").height,
  fullWidth: Dimensions.get("window").width,
};

const otpModalHeight = 229.3;
const otpModalWidth = 319;
const fontFamily =
  Platform.OS === "ios"
    ? {
        bold: "PruSansNormal-Demi",
        normal: "PruSansNormal",
      }
    : {
        bold: "pru-bold",
        normal: "pru-regular",
      };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 10.3,
    paddingVertical: 9,
  },
  scrollContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 10.3,
    paddingVertical: 9,
  },
  closeIcon: {
    width: 28.3,
    height: 28.3,
    marginBottom: 16.7,
  },
  doclogo: {
     
    paddingTop:5,
    width: 50,
    height: 30,
    marginLeft: 2,
    marginRight: 2,
    justifyContent:'center',
    paddingBottom:2,
    resizeMode :'contain',
  },
  doctorImage: {
    height: 197,
    width: "100%",
  },
  title: {
    fontSize: 16.7,
    textAlign: "center",
    color: colors.warmGray,
    lineHeight: 22.3,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
  },
  subTitle: {
    fontSize: 13.3,
    textAlign: "center",
    color: colors.warmGray,
    lineHeight: 17.7,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    marginTop: 13.3,
  },
  btn: {
    borderRadius: 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  primary: {
    backgroundColor: colors.crimson,
  },
  flexRow: {
    flex: 1,
    flexDirection: "row",
    // flexWrap: "wrap",
  },
  phoneField: {
    flex: 1,
    flexDirection: "row",
  },
  profileLink: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: 20,
  },
  doctorImgaeWrapper: {
    flex: 0.3,
    justifyContent:'center',
  },
  textWrapper: {
    flex: 0.4,
    marginBottom:40,
  },
  termsWrapper: {
    flex: 0.35,
    justifyContent: "center",
  },
  checkBox: {
    flex: 1,
    padding: 10,
  },
  heading: {
    fontSize: 22,
    lineHeight: 25,
    color: colors.nevada,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
    paddingBottom: 22,
    paddingRight: 22,
  },
  subhead: {
    fontSize: 15,
    lineHeight: 18,
    color: colors.nevada,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    paddingBottom: 8,
  },
  label: {
    fontSize: 14,
    lineHeight: 16,
    color: colors.silver,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
  },
  textinput: {
    fontSize: 14,
    lineHeight: 20,
    height: 38,
    marginBottom: 20.2,
    color: colors.deepGrey,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
  },
  phone: {
    width: "100%",
  },
  headerSection: {
    paddingLeft: 7,
    marginLeft: 10,
  },
  formSection: {
    paddingLeft: 7,
    marginLeft: 10,
    paddingRight: 7,
    paddingTop: 20,
  },
  contentContainer: {
    backgroundColor: colors.white,
  },
  verifyBtn: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.nevada,
    alignItems: "center",
    justifyContent: "center",
    height: 25,
    width: 80,
    borderRadius: 5,
    position:'relative',
    right:0,
  },
  verifiedIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  verifyText: {
    // right: 100,
    fontFamily: fontFamily.normal,
    color: colors.nevada,
    fontSize: 12,
  },
  iAccept: { marginBottom: 22, color: colors.nevada },
  iAcceptText: {
    color: colors.nevada,
  },
  mainContainer: {
    backgroundColor: colors.white,
    position: "absolute",
    top: (dimensions.fullHeight - otpModalHeight) / 2,
    left: (dimensions.fullWidth - 41.2 - otpModalWidth) / 2,
    height: otpModalHeight,
    width: otpModalWidth,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
  },
  otpHeading: {
    paddingTop: 12.3,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
    fontSize: 21.7,
    color: colors.nevada,
  },
  otpInput: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.white,
    borderBottomColor: colors.nevada,
    color: colors.nevada,
    backgroundColor: colors.white,
    fontSize: 30,
    fontWeight: "700",
    fontFamily: fontFamily.bold,
    marginLeft: 5,
    height: 60,
  },
  otpInputContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  otpInputNotEmpty: {
    backgroundColor: colors.white,
  },
  resendOTPContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  resendOTPLink: {
    textAlign: "center",
    fontSize: 14,
    color: colors.crimson,
    fontFamily: fontFamily.bold,
  },
  cancelOTPContainer: {
    flex: 1,
  },
  cancelOTP: {
    alignSelf: "stretch",
    textAlign: "right",
    color: colors.nevada,
    marginBottom: 10,
    fontSize: 12.7,
    fontFamily: fontFamily.bold,
  },
  countryContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.silver,
    marginBottom: 20.2,
  },
  country: {
    width: width - 10,
    height: 32,
    color: colors.deepGrey,
  },
  labelTitle: {
    fontSize: 13.3,
    lineHeight: 15.3,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
    color: colors.silver,
    paddingTop: 12,
    paddingLeft: 5,
  },
  dropbox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textStyle: {
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    fontSize: 13.3,
    lineHeight: 26.7,
    letterSpacing: 0,
    textAlign: "left",
    color: colors.nevada,
  },
  dropDownButton: {
    marginTop: 10,
    //fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    marginBottom: 5,
    width: Dimensions.get("window").width * 0.9,
    paddingLeft: 5,
  },
  countryDropdownStyle: Platform.select({
    ios: {
      width: Dimensions.get("window").width * 0.9,
      backgroundColor: "#f2f2f2",
      marginTop: 10,
      height: 80,
    },
    android: {
      width: Dimensions.get("window").width * 0.9,
      backgroundColor: "#f2f2f2",
      marginTop: -15,
      height: 80,
    },
  }),
  dropdownTextStyle: {
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    fontSize: 13.3,
    lineHeight: 18.3,
    letterSpacing: 0,
    textAlign: "left",
    paddingLeft: 15,
    backgroundColor: colors.concrete,
    color: colors.nevada,
  },
  dropDownIcon: {
    position: "absolute",
    right: 10,
  },
  error: {
    color: colors.crimson,
    fontFamily: fontFamily.normal,
    fontSize: 13.3,
    lineHeight: 18.3,
    textAlign: "left",
    padding: 20,
  },
  errorText: {
    fontSize: 15,
    lineHeight: 18,
    color: colors.red,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    paddingBottom: 8,
  },
  errorPadding: {
    paddingTop: 5,
    textAlign: "center",
  },
  countryCode: {
    fontSize: 13.3,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    color: colors.nevada,
  },
  phoneText: {
    paddingLeft: 20,
    flex:0.8,
  },
  textLogo: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop:5,
  },
  docOnCallImage: {
    width: 36,
    height: 18,
    marginLeft: 2,
    marginRight: 2,
  },
  poweredByText: {
    textAlign: "left",
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    color: "#6d6d6d",
    fontSize: 11,
  },
});

export default styles;
