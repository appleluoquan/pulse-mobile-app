import { StyleSheet, Platform } from "react-native";

import { CoreConfig } from "@pru-rt-internal/rnmobile-app-core-framework";

const { colors } = CoreConfig;

export default StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  backIcn: {
    width: 20,
    height: 19.7,
  },
  title: {
    width: '100%',
    marginTop: 10,
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
    fontSize: 13.3,
    lineHeight: 15.3,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
    alignSelf: 'flex-start',
    color: colors.nevada,
    borderBottomWidth: 1,
    borderBottomColor: colors.silver,
  },
  firstContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  imageStyle: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  changePassContainer: {
    marginTop: 13,
    marginLeft: 30,
  },
  changePassLabel: {
    width: '30%',
    paddingTop: 10,
  },
  actionButton: {
    marginTop: 10,
    color: '#ed1b2e',
  },
  label: {
    fontSize: 15.3,
    lineHeight: 18.3,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    color: colors.nevada,
  },
  passwordLabel: {
    fontSize: 15,
    height: 40,
    width: '100%',
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'Regular',
    color: colors.nevada,
  },
  settings: {
    width: '100%',
    marginTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.silver,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    fontSize: 21.7,
    lineHeight: 25,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    color: colors.crimson,
  },
  contentView: {
    width: '100%',
    padding: 10,
    paddingLeft: 15,
  },
});
