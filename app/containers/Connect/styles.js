import { StyleSheet, Platform } from 'react-native';

import { CoreConfig } from "@pru-rt-internal/rnmobile-app-core-framework";

const { colors, width } = CoreConfig;

export const AddProfileStyles = StyleSheet.create({
  screenTitle: {
    fontSize: 21.7,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
    color: colors.nevada,
    marginBottom: 21.3,
    lineHeight: 25,
  },
  screenDescription: {
    fontSize: 15.3,
    lineHeight: 18.3,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    color: colors.nevada,
  },
  screenImage: {
    marginTop: 9.3,
    marginBottom: 33.6,
    width: 111.4,
    padding: 30,
    height: 111.4,
    alignSelf: 'center',
  },
  textInput: {
    flexDirection: 'row',
    borderBottomWidth: 0.7,
    borderColor: colors.nevada,
    alignItems: 'center',
  },
});

export const ContactListStyles = StyleSheet.create({
  screenTitle: {
    fontSize: 21.7,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
    color: colors.nevada,
    marginBottom: 21.3,
    lineHeight: 25,
    flex: 0.9,
  },
  seacrhIcon: {
    flex: 0.1,
  },
});

export const ProfileConnectStyles = StyleSheet.create({
  screenTitle: {
    fontSize: 21.7,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
    color: colors.nevada,
    marginBottom: 21.3,
    lineHeight: 25,
  },
  horizontalLine: {
    borderBottomWidth: 1,
    marginVertical: 16.5,
    borderBottomColor: colors.silver,
  },
  add: {
    color: colors.crimson,
    fontSize: 13.3,
    lineHeight: 16.7,
    marginTop: 15.8,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
  },
  flexRow: {
    flexDirection: 'row',
  },
  connectionName: {
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
    fontSize: 18.3,
    lineHeight: 15,
    color: colors.nevada,
    paddingTop: 10,
  },
  connectionTagLine: {
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    fontSize: 13.3,
    lineHeight: 18.3,
    color: colors.nevada,
    marginTop: 2.7,
  },
  connectionRelationship: {
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    fontSize: 13.3,
    lineHeight: 15,
    color: colors.crimson,
    marginTop: 8.3,
  },
  imageContainer: {
    width: 50,
    height: 50,
    marginRight: 15.8,
  },
  profileImage: {
    width: 47.3,
    height: 47.3,
  },
  notification: {
    position: 'absolute',
    top: 0,
    backgroundColor: colors.nevada,
    padding: 18,
    width: width,
    flexDirection: 'row',
  },
  notificationText: {
    color: colors.white,
    fontSize: 13.3,
    lineHeight: 15.3,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
    flex: 0.9,
  },
  checkIcon: {
    marginRight: 9,
    width: 16.7,
    height: 16.7,
  },
  close: {
    textAlign: 'right',
    color: colors.white,
    fontSize: 13.3,
    lineHeight: 15.3,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
