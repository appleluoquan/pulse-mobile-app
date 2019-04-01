import { StyleSheet, Platform } from "react-native";

import { CoreConfig } from "@pru-rt-internal/rnmobile-app-core-framework";

const { colors, width, height } = CoreConfig;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  carouselContainer: {
    flex: 2.3,
  },
  pickerContainer: Platform.select({
    ios: {
      flex: 1.7,
      alignItems: 'center',
    },
    android: {
      flex: 1.4,
      alignItems: 'center',
    },
  }),
  sliderContainer: {
    flex: 1,
    padding: 10,
  },
  banner: {
    width: width,
    height: (width * 62) / 100,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  textStyle: {
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    fontSize: 18,
    lineHeight: 18.3,
    textAlign: 'left',
    color: '#4E4E4E',
  },
  headerText: {
    textAlign: 'center',
    color: '#4E4E4E',
    letterSpacing: 0,
    fontSize: 18.3,
    padding: 30,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
  },
  twoPickerItems: {
    height: 105,
  },
  picker: Platform.select({
    ios: {
      color: '#68737a',
    },
    android: {
      // width: width - 70,
      height: 40,
      // borderWidth: 1,
      // borderColor: '#a8a8a8',
      // borderRadius: 6,
      // backgroundColor: '#f8f8f8',
      // paddingLeft: 10,
      color: '#68737a',
    },
  }),
  assessBtn: {
    borderWidth: 1,
    borderColor: colors.borderGrey,
    alignItems: 'center',
    borderRadius: 5,
    width: '80%',
    padding: 10,
    alignSelf: 'center',
    marginTop: 30,
  },
  servicesImg: {
    resizeMode: 'contain',
    width: 38.7,
    height: 38.7,
  },
  serviceName: {
    fontSize: 13.3,
    lineHeight: 15,
    color: colors.nevada,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
  },
  flx_rw: {
    // height: Platform.OS === 'ios' ? '18%' : '6%',
    // flexDirection: 'row',
    // flex: 0.2,
    // justifyContent: 'flex-start',
    // alignItems: 'center',
    // alignSelf: "center",
    width: width,
    //backgroundColor: 'yellow',
  },
  flx_Col: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  reviewServices: {
    backgroundColor: colors.solidGray,
    borderRadius: 5,
    width: 139.9,
    marginRight: 10,
    padding: 10,
  },
  reviewHead: {
    color: colors.crimson,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
    fontSize: 15,
    lineHeight: 16,
    marginBottom: 5,
  },
  descp: {
    color: colors.deepGrey,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    fontSize: 13.3,
    lineHeight: 14,
  },
  horizontalView: {
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
  },
  bannerSign: {
    position: 'absolute',
    top: 10,
    left: width / 2.3,
    width: 27.7,
    height: 26,
  },
  assessText: {
    color: colors.deepGrey,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    fontSize: 13.3,
    lineHeight: 16.7,
  },
  sidebarBack: {
    // backgroundColor: colors.nevada,
    backgroundColor: colors.white,
    flex: 1,
  },
  sideBarText: {
    color: colors.deepGrey,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
    fontSize: 13.3,
    lineHeight: 15.3,
  },
  icon: {
    marginRight: 20,
    width: 24,
    height: 26,
    marginLeft: 20,
  },
  flx_rw_icn: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  menuBar: {
    // borderBottomWidth: 1,
    // borderBottomColor: colors.white,
    backgroundColor: colors.white,
  },
  offerBar: {
    marginBottom: 80,
  },
  userDetail: {
    padding: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.sidebarPrimary,
  },
  // userPic: {
  //   marginBottom: 10,
  //   width: 85.2,
  //   height: 85.2
  //   // borderWidth: 2,
  //   // borderColor: colors.white,
  //   // borderRadius: 50,
  // },
  username: {
    marginBottom: 10,
    color: colors.white,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
    fontSize: 14.7,
    lineHeight: 17,
    paddingTop: 10,
  },
  userView: {
    alignItems: 'center',
    padding: 10,
  },
  userPic: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderColor: '#ffffff',
    borderWidth: 2,
  },
  flx_col: {
    flexDirection: 'column',
    position: 'absolute',
    top: 120,
    left: 10,
  },
  bannerTextRed: {
    color: colors.crimson,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
    fontSize: 21.7,
    lineHeight: 21.7,
  },
  bannerTextWhite: {
    color: colors.deepGrey,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    fontSize: 13.3,
    lineHeight: 15,
  },
  tourModal: {
    width: width,
    height: height,
    padding: 0,
    margin: 0,
    // zIndex: 1
  },
  dropDownIcon: {
    position: 'absolute',
    right: 0,
   
  },
  pickerBorder: Platform.select({
    ios: {},
    android: {
      width: 298,
      height: 40,
      marginTop: 15,
      // borderWidth: 1,
      // borderColor: '#a8a8a8',
      // borderRadius: 6,
      marginTop: 40,
      backgroundColor: '#f8f8f8',
      paddingLeft: 10,
    },
  }),
  pickerHeading: {
    color: '#6b6a6d',
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
    fontSize: 18.3,
    lineHeight: 21,
  },
  pickerContent: {
    color: '#6b6a6d',
    marginTop: 15,
    lineHeight: 15,
    fontSize: 13.3,
  },
  dropDownButton: {
    width: 80,
    height: 50,
    paddingTop :4,
   
  },
  dropdownStyle: Platform.select({
    ios: {
      width:  200,
      height : 400,
      backgroundColor: '#f2f2f2',
      marginTop: 10,
      marginLeft: -12,
      fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    },
    android: {
      width:  200,
      height : 400,
      backgroundColor: '#f2f2f2',
      marginTop: -15,
      marginLeft: -12,
      
      fontFamily: Platform.OS === "ios" ? "PruSansNormal" : "pru-regular",
    },
  }),
  dropdownTextStyle: {
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    fontSize: 18,
    lineHeight: 30,
    letterSpacing: 0,
    textAlign: 'left',
    paddingLeft: 15,
    backgroundColor: '#f2f2f2',
    color: '#4E4E4E',
    flexWrap :'wrap',
    
  },
  dropbox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 6.7,
    borderStyle: 'solid',
    borderWidth: 0.3,
    borderColor: '#a8a8a8',
    //fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
  },
  pickerDropDown: {
    width: width - 50,
   // fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
  },
  loaderProfile: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.5,
    backgroundColor: '#404040',
    zIndex: 9,
  },
  lineStyle:{
   
    borderColor:'grey',
    margin:10,
    height:2
}
});
