import { StyleSheet, Platform } from 'react-native';

import { CoreConfig } from "@pru-rt-internal/rnmobile-app-core-framework";

const { colors } = CoreConfig;

export default (srestyles = StyleSheet.create({
  grayBox: {
    backgroundColor: colors.solidGray,
    padding: 13,
  },
  grayBoxTitle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
    fontSize: 15.3,
    lineHeight: 18.3,
    marginTop: 7,
    marginBottom: 20,
  },
  grayBoxDescriptionTitle: {
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
    fontSize: 13.3,
    lineHeight: 18.3,
    textAlign: 'left',
    color: colors.nevada,
    marginBottom: 6.7,
  },
  grayBoxContent: {
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    fontSize: 13.3,
    lineHeight: 16.7,
    textAlign: 'left',
    color: colors.nevada,
    marginBottom: 13.3,
  },
  redBlock: {
    color: colors.red,
  },
  wrapper: {
    padding: 10,
    backgroundColor: colors.white,
  },
  login: {
    marginBottom: 20,
  },
}));
