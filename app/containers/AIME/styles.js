import { StyleSheet, Dimensions, Platform } from 'react-native';

import { CoreConfig } from "@pru-rt-internal/rnmobile-app-core-framework";

const { colors } = CoreConfig;

const window = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  backIcnWrapper: {
    width: 50,
    height: 42,
  },
  backIcn: {
    width: 20,
    height: 20,
    marginTop: 12
  },
  title: {
    width: '100%',
    paddingBottom: 17,
    fontSize: 21.7,
    lineHeight: 25,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
    color: colors.nevada,
    borderBottomWidth: 3,
    borderBottomColor: colors.grey91,
  },
  settingType: {
    fontSize: 21.7,
    lineHeight: 25,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    color: colors.nevada,
    paddingVertical: 23.7,
  },
  badge: {
    fontSize: 13.3,
    lineHeight: 18.3,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    color: colors.crimson,
    marginRight: 10,
  },
  contentView: {
    width: '100%',
    marginTop: 12,
  },
  contentViewItems: {
    paddingBottom: 24,
    paddingTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 15.3,
    lineHeight: 18.3,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    color: colors.nevada,
  },
  borderBottom: {
    borderBottomWidth: 3,
    borderBottomColor: colors.grey91,
  },
  loaderProfile: {
    width: window.width,
    height: window.height,
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.5,
    backgroundColor: '#404040',
    zIndex: 9,
  },
  lineStyle:{
    paddingTop:0,
    borderWidth: 0.5,
    borderColor:'black',
    margin:10,
    backgroundColor:'#404040',
    
    
}
});
