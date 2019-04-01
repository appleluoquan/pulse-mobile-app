import { StyleSheet, Platform } from "react-native";

import { CoreConfig } from "@pru-rt-internal/rnmobile-app-core-framework";

const { colors } = CoreConfig;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10,
  },
  heading: {
    width: "100%",
    paddingBottom: 17,
    fontSize: 21.7,
    lineHeight: 25,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
    color: colors.nevada,
  },
  screenTitle: {
    color: colors.nevada,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
    marginVertical: 16.7,
    fontSize: 21.7,
    lineHeight: 25,
    textAlign: "center",
    flexWrap: "wrap",
    flexDirection: "column",
    flex:1,
  },
  text: {
    fontSize: 15.3,
    lineHeight: 18.3,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    color: colors.nevada,
  },
  horizontalLine: {
    borderBottomWidth: 3,
    borderBottomColor: colors.grey91,
  },
  scroll: {
    flex: 0.9,
  },
  contentViewItems: {
    paddingBottom: 24,
    paddingTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fixedIcon: {
    alignItems: "flex-end",
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});

export default styles;
