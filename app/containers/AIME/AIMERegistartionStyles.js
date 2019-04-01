import { StyleSheet, Platform } from "react-native";

import { CoreConfig } from "@pru-rt-internal/rnmobile-app-core-framework";

const { colors } = CoreConfig;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flexDirection: "row",
  },
  termsWrapper: {
   justifyContent :'flex-end',
   flex: 0.7,
   margin:10
 
  },
  checkBox: {
    padding: 10,
    paddingBottom :40,
  },
  label: {
    fontSize: 14,
    lineHeight: 16,
    color: colors.silver,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
  },
  contentContainer: {
    backgroundColor: colors.white,
  },
});

export default styles;
