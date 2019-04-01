import { StyleSheet, Platform } from "react-native";
import colors from "./config";

export default StyleSheet.create({
  buttonText: {
    justifyContent: "center",
    color: "white",
  },
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: colors.appbackgroundColor,
  },
  navItemStyle: {
    padding: 10,
  },
  navSectionStyle: {
    backgroundColor: colors.appbackgroundColor,
  },
  sectionHeadingStyle: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  footerContainer: {
    padding: 20,
    backgroundColor: "lightgrey",
  },
  rightText: {
    textAlign: "right",
  },
  headerLeftText: {
    marginTop: 20,
    textAlign: "left",
    color: colors.textColor,
  },
  currentSettingsLeftText: {
    marginTop: 20,
    textAlign: "left",
    color: colors.textColor,
  },
  horizontalLine: {
    backgroundColor: "lightgrey",
    height: 1,
    flex: 1,
    alignSelf: "center",
    marginTop: 10,
  },
  dividerText: {
    alignSelf: "center",
    paddingHorizontal: 5,
    fontSize: 10.7,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
    color: colors.nevada,
  },
  switchTotext: {
    paddingLeft: 25,
    textAlign: "left",
    marginBottom: 20,
  },
  switchToImg: {
    textAlign: "left",
    width: 20,
    height: 20,
    marginLeft: 1.0,
    marginBottom: 20,
  },
  text: {
    padding: 10,
    fontSize: 14,
  },
  radioButtonTextStyle: {
    textAlign: "left",
    color: colors.textColor,
  },
  btnText: {
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  primary: {
    backgroundColor: "rgba(229,0,35,1.0)",
    marginTop: 40,
    justifyContent: "center",
    borderRadius: 10,
    color: "#fff",
  },
});
