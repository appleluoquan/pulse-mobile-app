import { StyleSheet, Platform } from 'react-native';

import { CoreConfig } from "@pru-rt-internal/rnmobile-app-core-framework";

const { colors } = CoreConfig;

export default (notificationStyles = StyleSheet.create({
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
  horizontalLine: {
    borderBottomWidth: 1,
    marginVertical: 16.5,
    borderBottomColor: colors.silver,
  },
  flexRow: {
    flexDirection: 'row',
  },
  notificationTitle: {
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
    fontSize: 13.7,
    lineHeight: 15,
    color: colors.nevada,
    marginVertical: 3,
  },
  notificationDate: {
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    fontSize: 11.7,
    lineHeight: 16.7,
    color: colors.nevada,
  },
  notificationDescription: {
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    fontSize: 13.3,
    lineHeight: 16.7,
    color: colors.nevada,
    marginVertical: 13,
  },
  notificationIcon: {
    width: 26.7,
    height: 26.7,
    marginRight: 13.5,
  },
  square: {
    width: 5,
    height: 5,
    backgroundColor: 'red',
  },
}));
