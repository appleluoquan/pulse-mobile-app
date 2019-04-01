import { StyleSheet, Platform } from 'react-native';

import { CoreConfig } from "@pru-rt-internal/rnmobile-app-core-framework";

const { colors } = CoreConfig;

export default npStyles = StyleSheet.create({
  login: { marginBottom: 20 },
  backBtnWrapper: {
    paddingHorizontal: 20,
    width: 50
  },
  container: {
    paddingVertical: 20,
  },
  leftSpacing: {
    paddingHorizontal: 20,
  },
  textContainer: {
    marginVertical: Platform.OS === 'ios' ? 10 : 10,
  },
  label: {
    fontSize: 15.3,
    lineHeight: 18.3,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    color: colors.nevada,
  },
  errorLabel: {
    fontSize: 15.3,
    lineHeight: 18.3,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    color: 'red',
    marginTop: 4, 
  },
  inputWithLabel: {
    borderStyle: 'solid',
    borderBottomWidth: 0.7,
    borderColor: '#a8a8a8',
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
  appButton: {
    marginTop: 20
  },
  visibilityBtn: {
    position: 'absolute',
    right: 3,
    height: 40,
    width: 35,
    padding: 5,
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
