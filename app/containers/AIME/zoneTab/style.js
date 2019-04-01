import { StyleSheet } from "react-native";

import { CoreConfig } from "@pru-rt-internal/rnmobile-app-core-framework";

const { height, colors } = CoreConfig;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    position: "absolute",
    right: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  alertIconText: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: height - 250,
    left: 60,
  },
  dangerAlertIcon: {
    width: 30,
    height: 30,
  },
  locationIcon: {
    width: 30,
    height: 30,
  },
  alertText: {
    padding: 10,
    color: colors.white,
    backgroundColor: colors.warmGray,
    height: 40,
    width: 250,
    borderRadius: 10,
  },
  legendsContainer: {
    position: "absolute",
    width: 80,
    top: height / 2 - 250,
    backgroundColor: colors.lightGray,
    right: 10,
    borderRadius: 5,
    padding: 10,
  },
  legendText: {
    color: colors.black,
    fontSize: 12,
    fontWeight: "400",
    paddingLeft: 5,
  },
});
