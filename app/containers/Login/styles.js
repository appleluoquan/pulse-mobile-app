import { StyleSheet, Platform, Dimensions } from "react-native";

export default (loginStyles = StyleSheet.create({
  container:{
    flex:1, 
    backgroundColor: 'white',
  },
  emailRegister: {
    marginBottom: 10,
  },
  subContainers: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subContainer3: {
    flex: 0.50,
    marginLeft:20,
    marginRight:20,
    justifyContent: 'flex-start'
  },
  subContainer2: {
    flex: 0.30,
    marginLeft:20,
    marginRight:20,
    marginTop:20,
    justifyContent: 'flex-end',
  },
  subContainer1: {
    paddingTop: 20,
    flex: 0.2,
    marginLeft:20,
    marginRight:20,
  },
  orDivider: {
    ...Platform.select({
      android: {
        marginTop: 0,
      },
    }),
  },
  brandImage: {
    flex: 3,
    alignSelf: "flex-start",
    width: Dimensions.get("window").width / 3,
    height: Dimensions.get("window").width / 3,
  },
  emailRegisterText: {
    fontSize: 13.3,
    lineHeight: 15.6,
    letterSpacing: 1.01,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    lineHeight: 14.3,
  },
  forgotPassword: {
    marginTop: Platform.OS === "ios" ? 0 : 10,
    marginBottom: 20,
    width: 100
  },
  forgotPasswordText: {
    fontSize: 13.3,
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    color: "#4E4E4E",
  },
  errorText: {
    fontSize: 15,
    lineHeight: 18,
    color: "#ed1b2e",
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    paddingBottom: 8,
  },
  errorPadding: {
    paddingTop: 10,
  },
  headerButton: {
    justifyContent: "center",
    marginLeft: Platform.OS == "ios" ? 2 : 2,
  },
  headerButtonText: {
    fontFamily: Platform.OS == "ios" ? "PruSansNormal-Demi" : "pruSansBold",
    fontSize: 13.3,
    lineHeight: 15.6,
    letterSpacing: 1.01,
    textAlign: "left",
    color: "#68737a",
    //justifyContent:'center',
  },
  screenSwitch: {
    flexDirection: "row",
    alignItems: "center",
  },
  registerContainer: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    justifyContent:'center',
    bottom:10,
    left:20,
    right:20,
  },
  newText: {
    fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    fontSize: 13.3,
    lineHeight: 15.6,
    letterSpacing: 1.01,
    textAlign: "left",
    color: "#707070",
    justifyContent: "center",
  },
  fingerprintContainer:{
    marginTop:5,
    marginBottom: 5,
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
}));