import { StyleSheet, Platform } from "react-native";

import { CoreConfig } from "@pru-rt-internal/rnmobile-app-core-framework";

const { colors } = CoreConfig;

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  labelStyle: {
    fontSize: 21.7,
    lineHeight: 25,
    color: "#68737a",
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pruSansBold",
    paddingLeft: 5,
  },
  contentContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 5,
    // borderRadius: 10,
    // borderWidth: 0.3,
  },
  textinput: {
    flex: 1,
    borderColor: "#707070",
    backgroundColor: "#ffffff",
    borderWidth: 0.3,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 15,
    color: "#6d6d6d",
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
  },
  contentCenter: {
    justifyContent: "center",
    backgroundColor: "#a1a1a1",
    borderColor: "#707070",
    borderWidth: 0.3,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  clearImage: {
    width: 30,
    height: 30,
  },
  resultContainer: {
    paddingTop: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  resultMessage: {
    width: "90%",
    paddingBottom: 30,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    fontSize: 13.3,
    lineHeight: 15,
    color: "#6b6a6d",
    textAlign: "center",
  },
  resultProfilePic: {
    width: 100,
    height: 100,
    marginBottom: 12.3,
  },
  userPic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  noImage: {
    backgroundColor: "#a1a1a1",
    opacity: 0.39,
    borderWidth: 0.3,
    borderRadius: 50,
  },
  resultEmail: {
    width: "90%",
    paddingBottom: 19,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    fontSize: 16.7,
    lineHeight: 18.7,
    color: "#6b6a6d",
    textAlign: "center",
  },
  resultName: {
    width: "90%",
    paddingBottom: 5,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pruSansBold",
    fontSize: 16.7,
    lineHeight: 18.7,
    color: "#6b6a6d",
    textAlign: "center",
  },
  resultProfileLabel: {
    width: "90%",
    paddingBottom: 30,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
    fontSize: 16.7,
    lineHeight: 18.7,
    color: "#6b6a6d",
    textAlign: "center",
  },
  buttonContainer: {
    padding: 9.3,
    paddingLeft: 40,
    paddingRight: 40,
    borderRadius: 18,
    borderWidth: 0.3,
    borderColor: colors.nevada,
  },
  activeButton: {
    backgroundColor: "#ed1b2e",
  },
  activeButtonText: {
    color: colors.white,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pruSansBold",
    letterSpacing: 1,
    fontSize: 15.3,
    lineHeight: 17.3,
    textAlign: "center",
  },
  noBorder: {
    borderWidth: 0,
  },
});
