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
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 14,
    lineHeight: 15,
    color: colors.darkGrey,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    paddingBottom: 0,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    flex: 0.95,
    paddingTop: 5,
    paddingBottom: 5,
  },
  title: {
    fontSize: 15,
    lineHeight: 17,
    color: colors.darkGrey,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
    paddingBottom: 5,
    textAlign: "center",
  },
  consultationBtnContainer: {
    marginLeft: 15,
    marginBottom: 15,
    marginRight: 10,
    flex: 1,
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
  btn: {
    margin: 20,
    borderRadius: 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  btnTextStyle: {
    color: "#4e4e4e",
  },
  primary: {
    backgroundColor: "#ed1b2e",
  },
  default: {
    borderColor: "#4e4e4e",
    borderWidth: 0.7,
  },
  success: {
    color: "#1aa200",
    fontSize: 15,
    lineHeight: 17.3,
  },
});
