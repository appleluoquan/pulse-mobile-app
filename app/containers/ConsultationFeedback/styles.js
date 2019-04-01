import { StyleSheet, Platform } from "react-native";

import { CoreConfig } from "@pru-rt-internal/rnmobile-app-core-framework";

const { colors } = CoreConfig;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  heading: {
    fontSize: 22,
    lineHeight: 25,
    color: colors.nevada,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
    paddingBottom: 22,
    paddingRight: 22,
  },
  headerSection: {
    paddingTop: 3,
    paddingLeft: 14,
    paddingBottom: 3,
  },
  consultationSubhead: {
    //padding: 10,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 14,
    lineHeight: 15,
    color: colors.darkGrey,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    paddingBottom: 0,
  },
  titleContainer: {
    alignItems: "center",
    flexDirection: "column",
    flex: 0.95,
    paddingTop: 5,
    paddingBottom: 20,
  },
  title: {
    fontSize: 17,
    lineHeight: 17,
    color: colors.darkGrey,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
    paddingBottom: 5,
    textAlign: "center",
  },
  consultationBtnContainer: {
    //marginLeft: 15,
    marginBottom: 15,
    //marginRight: 10,
    //flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  icons: {
    height: 50,
    width: 50,
  },
  iconContainer: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  requestFailed: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 0.3,
    borderColor: "#6b6a6d",
    backgroundColor: "#6b6a6d",
    marginTop: 20,
    marginBottom: 20,
  },
  info: {
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  labelBold: {
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
  },
  textCenter: {
    textAlign: "center",
  },
  contentCenter: {
    justifyContent: "center",
  },
  btn: {
    margin: 10,
    borderRadius: 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  btnTextStyle: {
    color: "#ed1b2e",
  },
  primary: {
    backgroundColor: "#ed1b2e",
  },
  default: {
    borderColor: "#ed1b2e",
    borderWidth: 0.7,
  },
  success: {
    fontSize: 15,
    lineHeight: 17.3,
  },
  nameLabel: {
    paddingBottom: 10,
  },
  contentContainer: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    paddingTop: 23,
    paddingBottom: 23,
    justifyContent: "center",
  },
  imageContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    borderColor: "#ffffff",
    backgroundColor: colors.deepGrey,
  },
  star: {
    color: colors.yellow,
    backgroundColor: "transparent",
    paddingVertical: 10,
  },
  emptyStar: {
    color: colors.black,
  },
});
