import { StyleSheet, Platform, Dimensions } from "react-native";

import { CoreConfig } from "@pru-rt-internal/rnmobile-app-core-framework";

const { colors } = CoreConfig;
const window = Dimensions.get("window");

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
    //paddingBottom: 22,
    paddingRight: 22,
  },
  timing: {
    fontSize: 14,
    fontStyle:'italic',
    color:colors.black,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
  },
  publicHoidayText:{
    fontSize: 14,
    color: colors.nevada,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
    paddingBottom:10,
    fontStyle:'italic',
  },
  closeIcon: {
    width: 20,
    height: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerContainer: {
    width: window.width,
    height: 52,
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingLeft: 11,
    paddingRight: 11,
    flexDirection: "row",
    // marginBottom:10
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
  headerSection: {
    paddingTop: 3,
    paddingLeft: 14,
    paddingBottom: 3,
  },
  consultationSubhead: {
    padding: 2,
    fontSize: 14,
    lineHeight: 15,
    color: colors.darkGrey,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    paddingBottom: 0,
  },
  titleContainer: {
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
    paddingRight: 22,
  },
  consultationBtnContainer: {
    marginLeft: 15,
    marginBottom: 15,
    marginRight: 10,
    flex: 0.95,
  },
  extraCondItemContainer: {
    marginTop: 10,
    borderLeftWidth: 3.5,
    borderLeftColor: colors.nevada,
  },
  consultationDataContainer: {
    flexDirection: "row",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 0.7,
    borderRadius: 5,
    backgroundColor: colors.solidGray,
    borderColor: colors.solidGray,
  },
  icons: {
    height: 50,
    width: 50,
  },
  access_icons: {
    height: 18,
    width: 18,
    marginRight: 3.4,
  },
  info: {
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  footerNotes: {
    marginLeft: 10,
    marginRight: 10,
  },
  profileModalContent: {
    //flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  modalStyle: {
    backgroundColor: colors.white,
    alignItems: "flex-start",
    height: window.height * 0.5,
    width: window.width * 0.8,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.nevada,
    padding: 10,
  },
  modalButtonContainer: {
    // flexDirection: "row",
    // paddingLeft: 10,
  },
  modalLabel: {
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    fontSize: 15,
    lineHeight: 17,
    padding: 20,
    paddingLeft: 27,
    paddingRight: 30,
    letterSpacing: 0.5,
  },
  modalButton: {
    padding: 8,
    paddingTop: 15,
    paddingLeft: 0,
    paddingBottom: 15,
    flexDirection: "row",
  },
  modalButtonLabel: {
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    fontSize: 13.3,
    lineHeight: 16.7,
    paddingLeft: 18,
    letterSpacing: 0.5,
  },
  mic: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  labelBold: {
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
  },
  textLeft: {
    textAlign: "left",
  },
  textRight: {
    textAlign: "right",
  },
  contentCenter: {
    justifyContent: "center",
  },
  modalFooterBtnContainer: {
    flex: 1,
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  modalFooterBtn: {
    flex: 0.5,
  },
  modalFooterLabel: {
    fontSize: 13.3,
    lineHeight: 15.3,
  },
});
