import { StyleSheet, Platform } from 'react-native';
import { CoreConfig } from "@pru-rt-internal/rnmobile-app-core-framework";
const { colors } = CoreConfig;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10,
  },
  closeImageEncloser: {
    width: 35,
    height: 35,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  closeImage: {
    width: 28.3,
    height: 28.3,
  },
  heading: {
    color: colors.nevada,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal-Demi' : 'pru-bold',
    marginLeft: 10.3,
    marginTop: 16.7,
    marginBottom: 16.7,
    height: 25,
    fontSize: 21.7,
    lineHeight: 25,
    textAlign: 'left',
  },
  text: {
    color: colors.nevada,
    fontFamily: Platform.OS === 'ios' ? 'PruSansNormal' : 'pru-regular',
    marginLeft: 13.3,
    fontSize: 15.3,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    lineHeight: 18.3,
    textAlign: 'left',
    marginVertical: 23.7,
    height: 20,
  },
  radioButton: {
    marginLeft: 10.3,
    height: 55,
    marginRight: 10.3,
    borderBottomWidth: 2,
    borderBottomColor: colors.silver,
  },
  radioBtnTop: {
    marginTop: 23.7,
    marginLeft: 5.1,
    borderTopWidth: 2,
    borderTopColor: colors.silver,
  },
  alignWithAbove: {
    marginLeft: 5.1,
  },
});

export default styles;
