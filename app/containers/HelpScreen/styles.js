import { StyleSheet, Platform, Dimensions } from 'react-native';

import { CoreConfig } from "@pru-rt-internal/rnmobile-app-core-framework";

const { colors } = CoreConfig;

export default (helpStyles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    backgroundColor: colors.white,
    paddingVertical: 10,
    height: '100%',
  },
  Header: {
    paddingBottom: 17,
    fontSize: 21.7,
    lineHeight: 25,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
    color: colors.nevada,
  },
  closeBtn: {
    width: 28.3,
    height: 28.3,
  },
  ruler: {
    borderBottomColor: '#68737a',
    borderBottomWidth: 1,
    marginTop: 35,
    marginBottom: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    letterSpacing: 1.12,
    lineHeight: 16,
    paddingHorizontal: 20,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
  },
  twoPickerItems: {
    height: 105,
  },
  picker: {
    height: 31,
    color: '#68737a',
  },
  button: {
    marginTop: 25,
    marginBottom: 20,
    backgroundColor: '#ed1b2e',
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    borderRadius: 10,
  },
  heading: {
    fontSize: 15.3,
    marginLeft: 20,
    color: '#68737a',
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
  },
  mailId: {
    color: '#a8a8a8',
    fontSize: 13.3,
    marginTop: 3,
    marginLeft: 20,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-regular',
  },
  description: {
    marginLeft: 20,
    fontSize: 10.7,
    color: '#636363',
    marginTop: 5,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
  },
  pickerBorder: {
    width: 298,
    height: 31,
    marginTop: 15,
    marginLeft: 25,
    borderWidth: 1,
    borderColor: '#a8a8a8',
    borderRadius: 6,
    backgroundColor: '#f8f8f8',
    marginBottom: 21,
  },
  pickerHeading: {
    color: '#6b6a6d',
    fontSize: 18.3,
    lineHeight: 21,
    marginBottom: 16.7,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
  },
  pickerContent: {
    color: '#6b6a6d',
    marginTop: 15,
    lineHeight: 15,
    fontSize: 13.3,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
  },
  dropDownButton: {
    width:
      Platform.OS === 'ios'
        ? Dimensions.get('window').width - 50
        : Dimensions.get('window').width - 60,
    height: 31,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    fontSize: 13.3,
    lineHeight: 18.3,
    letterSpacing: 0,
    textAlign: 'left',
    paddingTop: 8,
    paddingLeft: 15,
    color: '#d2d2d2',
  },
  dropdownStyle: Platform.select({
    ios: {
      width: Dimensions.get('window').width - 50,
      backgroundColor: '#f2f2f2',
      marginTop: 10,
      marginLeft: -12,
    },
    android: {
      width: Dimensions.get('window').width - 65,
      backgroundColor: '#f2f2f2',
      marginTop: -15,
      marginLeft: -12,
    },
  }),
  textStyle: {
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    textAlign: 'left',
    fontSize: 13.3,
    lineHeight: 18.3,
  },
  dropdownTextStyle: {
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    fontSize: 13.3,
    lineHeight: 18.3,
    letterSpacing: 0,
    textAlign: 'left',
    paddingLeft: 15,
    backgroundColor: '#f2f2f2',
    color: colors.battleship_grey,
  },
  dropDownIcon: {
    position: 'absolute',
    right: 10,
  },
  dropbox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 6.7,
    borderStyle: 'solid',
    borderWidth: 0.3,
    borderColor: '#a8a8a8',
    width: '100%', // Platform.OS === 'ios' ? Dimensions.get('window').width - 50 : Dimensions.get('window').width - 60,
    // marginLeft: 4,
    textAlign: 'center',
    marginBottom: 21,
  },
  leftSpacing: {
    paddingHorizontal: 20,
  },
}));
