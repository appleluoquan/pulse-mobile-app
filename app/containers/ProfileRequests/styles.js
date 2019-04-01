import { StyleSheet, Platform } from 'react-native';

import { CoreConfig } from "@pru-rt-internal/rnmobile-app-core-framework";

const { colors } = CoreConfig;

export default StyleSheet.create({
  container: {
    padding: 15,
  },
  userView: {
    paddingLeft: 16,
    borderBottomColor: colors.silver,
    borderBottomWidth: 0.5,
    paddingBottom: 12,
    marginBottom: 15,
    flexDirection: 'row',
  },
  userPic: {
    width: 60,
    height: 60,
  },
  username: {
    // paddingTop: 10,
    // paddingBottom: 10,
    fontSize: 16.7,
    lineHeight: 19,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pruSansBold',
    color: colors.nevada,
  },
  email: {
    fontSize: 15,
    lineHeight: 18.3,
    paddingBottom: 9,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    color: colors.silver,
  },
  message: {
    fontSize: 13.3,
    lineHeight: 18.3,
    paddingBottom: 9,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    color: colors.nevada,
  },
  date: {
    fontSize: 13.3,
    lineHeight: 18.3,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    color: colors.silver,
    flex: 0.38,
  },
  buttonContainer: {
    flex: 0.3,
    borderRadius: 13.3,
    borderWidth: 0.3,
    borderColor: colors.nevada,
  },
  activeButton: {
    backgroundColor: '#ed1b2e',
  },
  inactiveButton: {
    marginRight: 10,
  },
  activeButtonText: {
    color: colors.white,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    fontSize: 13.3,
    lineHeight: 26.7,
    textAlign: 'center',
  },
  inactiveButtonText: {
    color: colors.nevada,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    fontSize: 13.3,
    lineHeight: 26.7,
    textAlign: 'center',
  },
  cancelButton: {
    flex: 0.5,
    alignContent: 'flex-end',
  },
  dateContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  errorColor: {
    borderColor: '#ed1b2e',
  },
  nameContainer: {
    // paddingLeft: 16,
    justifyContent: 'center',
    flex: 1,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#ed1b2e',
    borderColor: '#ed1b2e',
    borderWidth: 1,
    borderRadius: 8,
    height: 40,
    margin: 15,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 13,
    lineHeight: 15,
    color: '#ffffff',
    letterSpacing: 1.07,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
  },
});
