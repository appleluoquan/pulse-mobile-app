import React from "react";
import PropTypes from "prop-types";
import { ActivityIndicator, View } from "react-native";
import { connect } from "react-redux";
import {
  CoreComponents,
  CoreConfig,
  AddressUtils,
} from "@pru-rt-internal/rnmobile-app-core-framework";
const { NavigatorInfo } = CoreComponents;
const { SCREEN_KEY_HOSPITAL_DETAIL_INFO_TAB, colors } = CoreConfig;

class Info extends React.Component {
  render() {
    const { meta, contactDetails, address, timings, loading } = this.props;
    const contactInformation = Object.keys(contactDetails).map(detail => ({
      name: contactDetails[detail]["channel"],
      value: contactDetails[detail]["value"],
    }));

    const phoneNo =
      contactInformation.length !== 0
        ? contactInformation.find(info => info.name === "phone")
        : undefined;

    const websiteAddress =
      contactInformation.length !== 0
        ? contactInformation.find(info => info.name === "website")
        : undefined;

    if (loading) {
      return (
        <View>
          <ActivityIndicator size="large" color={colors.crimson} />
        </View>
      );
    }
    return (
      <NavigatorInfo
        meta={meta}
        screenKey={SCREEN_KEY_HOSPITAL_DETAIL_INFO_TAB}
        phoneNo={phoneNo && phoneNo.value}
        workingDays={timings}
        websiteAddress={websiteAddress && websiteAddress.value}
        address={AddressUtils.formAddress(address)}
      />
    );
  }
}

Info.propTypes = {
  meta: PropTypes.objectOf(PropTypes.any).isRequired,
  loading: PropTypes.bool.isRequired,
  contactDetails: PropTypes.objectOf(PropTypes.any).isRequired,
  address: PropTypes.objectOf(PropTypes.any).isRequired,
  timings: PropTypes.string.isRequired,
};

export default connect(state => ({
  meta: state.meta,
  loading: state.hospitalDetail.details.loading,
  contactDetails: state.hospitalDetail.details.contactDetails,
  address: state.hospitalDetail.details.address,
  timings: state.hospitalDetail.details.timing,
}))(Info);
