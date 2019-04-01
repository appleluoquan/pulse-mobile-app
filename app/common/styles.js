import { StyleSheet, Platform } from "react-native";
import { colors } from "@pru-rt-internal/rnmobile-app-core-framework";

export default StyleSheet.create({
  btn: {
    borderRadius: 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    height: 52,
    paddingLeft: 14,
    paddingTop: 15.1,
    paddingBottom: 23.2,
  },
  textCenter: {
    textAlign: "center",
  },
  primary: {
    backgroundColor: "#ed1b2e",
  },
  brandImage: {
    alignSelf: "flex-start",
    width: Platform.OS === "ios" ? 160 : 180,
    height: Platform.OS === "ios" ? 130 : 150,
    justifyContent: "flex-start",
    // marginBottom: 0,
    // marginLeft: -20,
    paddingLeft: 30,
    marginBottom: 20,
  },
  whiteBackground: {
    backgroundColor: colors.white,
  },
  topOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backCloseBtnWrapper: {
    width: 35,
    height: 35,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  rightText: {
    textAlign: "right",
  },
  wrapper: {
    padding: 20,
    flex: 1,
  },
  leftText: {
    textAlign: "left",
  },
  closeBtn: {
    width: 28.3,
    height: 28.3,
    marginLeft: -5,
    marginTop: 15,
  },
  screenTitle: {
    textAlign: "left",
    fontSize: 21.7,
    lineHeight: 25,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pruSansBold",
    color: colors.nevada,
    marginTop: 16.7,
    marginBottom: 10,
  },
  screenDescription: {
    textAlign: "left",
    fontSize: 15.3,
    lineHeight: 18.3,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    color: colors.nevada,
    marginTop: 10,
    marginBottom: 30,
  },
  passType: {
    fontSize: 13.3,
    lineHeight: 18,
    alignSelf: "flex-start",
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    textAlign: "left",
    marginBottom: 10,
  },
  headerButton: {
    backgroundColor: "#68737a",
    width: 98,
    height: 23,
    borderRadius: 12,
    borderWidth: 0.3,
    borderColor: "#68737a",
    justifyContent: "center",
  },
  headerButtonText: {
    fontSize: 12.7,
    lineHeight: 14.3,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pruSansBold",
    letterSpacing: 1.01,
    color: "#ffffff",
    textAlign: "center",
  },
  resendText: {
    textAlign: "center",
    textDecorationLine: "underline",
    textDecorationColor: colors.crimson,
    color: colors.crimson,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pruSansBold",
    fontSize: 13.3,
    lineHeight: 15.6,
  },
});
