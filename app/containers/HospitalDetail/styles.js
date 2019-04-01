import { StyleSheet } from "react-native";

import { CoreConfig } from "@pru-rt-internal/rnmobile-app-core-framework";

const { colors } = CoreConfig;

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: colors.white,
    // marginTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    top: 0,
    left: 0,
    zIndex: 0,
  },
  icon: {
    width: 50,
    height: 50,
  },
  closeImageEncloser: {
    width: 35,
    height: 35,
    top: 0,
    left: 0,
    zIndex: 99,
    elevation: 99,
    marginTop: 10,
    marginLeft: 20,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  closeImage: {
    width: 20,
    height: 20,
  },
});
