import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    right: 10,
    bottom: 10,
    zIndex: 1,
    elevation: 1,
  },
  filterTouchableContainer: {
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "#ddd",
    borderBottomWidth: 0,
    // TODO : style with shadow
    padding: 15,
    backgroundColor: "#fff",
  },
  filterIcon: {
    width: 25,
    height: 25,
  },
  backIconContainer: {
    marginRight: 10,
  },
  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: "transparent",
    padding: 10,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  filterTitle: {
    fontFamily: Platform.OS === "ios" ? "PruSansNormal-Demi" : "pru-bold",
    fontSize: 20,
    color: "#68737a",
    flex: 3,
  },
  clearButton: {
    backgroundColor: "#68737a",
    borderRadius: 7,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  clearText: {
    fontSize: 14,
    lineHeight: 15,
    color: "#fff",
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
  },
  closeImageEncloser: {
    width: 35,
    height: 35,
    top: 0,
    left: 0,
    position: "absolute",
    zIndex: 1,
    backgroundColor: "transparent",
    marginTop: 20,
    marginLeft: 20,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  closeImage: {
    width: 20,
    height: 20,
  },
  slideUpPanel: {
    zIndex: 2,
  },
});
