import { StyleSheet, Platform } from 'react-native';

import { CoreConfig } from "@pru-rt-internal/rnmobile-app-core-framework";

const { colors, width } = CoreConfig;

export default StyleSheet.create({
  fontStyle: {
    fontSize: 20,
    marginTop: '6%',
    marginBottom: '6%',
  },
  np: {
    fontSize: 20,
  },
  backCloseBtnWrapper: {
    width: 35,
    marginLeft: '5%',
    height: 35,
    marginTop: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  getStart: {
    width: width - 40,
    padding: 10,
    borderRadius: 8,
    //color: colors.white,
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18.6,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
    textAlign: 'center',
    alignSelf: 'center',
  },
  label: {
    fontSize: 15.3,
    lineHeight: 18.3,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    color: colors.nevada,
    marginTop: 18,
    // marginBottom: Platform.OS === "ios" ? 15 : 0
  },
  title: {
    width: '100%',
    marginTop: 16.7,
    paddingBottom: 10,
    fontSize: 21.7,
    lineHeight: 25,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
    alignSelf: 'flex-start',
    color: colors.nevada,
    // borderBottomWidth: 1,
    // borderBottomColor: colors.silver,
  },
  subTitle: {
    width: '100%',
    marginTop: 20,
    paddingBottom: 12,
    fontSize: 15.3,
    lineHeight: 18.3,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
    alignSelf: 'flex-start',
    color: colors.nevada,
    borderBottomWidth: 1,
    borderBottomColor: colors.silver,
  },
  visibilityBtn: {
    position: 'absolute',
    right: 3,
    height: 40,
    width: 35,
    padding: 5,
  },
  inputWithLabel: {
    borderStyle: 'solid',
    borderBottomWidth: 0.7,
    borderColor: '#a8a8a8',
    padding: Platform.OS === 'ios' ? 10 : 0,
  },
  btnImage: {
    resizeMode: 'contain',
    height: '100%',
    width: '100%',
  },
  textBoxBtnHolder: {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  textInput: {
    paddingTop: 10,
    paddingRight: 10,
    fontSize: 15.3,
    lineHeight: 18.3,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#68737a',
    marginBottom: Platform.OS === 'ios' ? 5 : 0,
    justifyContent: 'center',
  },
  textBox: {
    paddingTop: 10,
    paddingRight: 10,
  },
});
