import { StyleSheet, Platform } from "react-native";
import { CoreConfig } from "@pru-rt-internal/rnmobile-app-core-framework";
const { height, width } = CoreConfig;

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  tourOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: "#000",
    opacity: 0.8,
    // zIndex: 9999
  },
  tourOverlayTransparent: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 9999,
  },
  tourOverlayHidden: {
    width: 0,
    height: 0,
  },

  tourBackground: {
    width: width,
    height: height,
    opacity: 0.9,
    position: "absolute",
    left: 0,
    top: 0,
    // top: -40,
  },
  closeBtn: {
    width: 60,
    height: 60,
    paddingRight: 11,
    alignItems: "flex-end",
    alignContent: "flex-end",
  },
  close: {
    width: 40,
    height: 40,
  },
  wrapper: {
    // backgroundColor: 'transparent',
    // zIndex: 9999
  },
  firstTourContainer: {
    flex: 1,
    justifyContent: "center",
  },
  secondTourContainer: {
    flex: 1,
    paddingLeft: width / 4,
    paddingRight: width * 0.25,
    paddingTop: (height - 70) * 0.25,
  },
  thirdTourContainer: {
    flex: 1,
    paddingLeft: width / 4,
    paddingRight: width * 0.25,
    paddingTop: (height - 180) * (3.75 / 5),
    //justifyContent: "flex-end",
  },
  fourthTourContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: width / 2,
    paddingTop: (height - 70) * (3.75 / 5),
  },
  fifthTourContainer: {
    paddingLeft: width / 6,
    paddingRight: width / 4,
    paddingTop: (height - 80) * (3.75 / 5),
  },
  sixthTourContainer: {
    flex: 1,
    marginRight: 5,
    paddingRight: 20,
    paddingLeft: width / 2,
    paddingTop: (height - 70) * (3.75 / 5),
    //justifyContent: "flex-end",
  },
  seventhTourContainer: {
    flex: 1,
    marginRight: 5,
    paddingRight: width / 14,
    paddingLeft: width * (3 / 7),
    paddingTop: (height - 70) * (3.75 / 5),
  },
  tapIcon: {
    width: 50,
    height: 50,
    marginTop: 20,
    alignSelf: "center",
  },
  sliderIcon: {
    width: 50,
    height: 50,
    marginTop: 50,
    alignSelf: "center",
  },
  headFirst: {
    fontSize: 17,
    lineHeight: 20,
    color: "#ffffff",
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
    textAlign: "center",
    paddingBottom: 11,
  },
  contentFirst: {
    fontSize: 14,
    lineHeight: 17,
    color: "#ffffff",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
  },
  head: {
    fontSize: 16,
    lineHeight: 18,
    color: "#ffffff",
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
    textAlign: "center",
    paddingBottom: 11,
  },
  hide: {
    opacity: 0,
  },
  highlighted: {
    zIndex: 100,
    backgroundColor: "#fff",
  },
  absoluteOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  pointerIcon: {
    top: 25,
    width: 25,
    height: 25,
    zIndex: 105,
  },
});
