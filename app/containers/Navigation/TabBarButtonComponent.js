import React from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import { connect } from "react-redux";

import { CoreConfig } from "@pru-rt-internal/rnmobile-app-core-framework";

import { OfflineImage } from "react-native-image-offline";
const { PointerIcon } = CoreConfig;

import * as WindowProperties from "../../config";

class TabBarButtonComponent extends React.Component {
  render() {
    const {
      onPress,
      onLongPress,
      testID,
      accessibilityLabel,
      identifier,
      touring,
      currentTour,
      style,
      index,
      ...props
    } = this.props;

    const highlighted = {
      padding: 10,
      borderWidth: 1,
      borderColor: "transparent",
      borderRadius: 45,
      backgroundColor: "#fff",
      opacity: 1,
      zIndex: 99,
    };

    const tabStyle =
      touring && currentTour !== undefined && currentTour === identifier
        ? [...style, highlighted]
        : style;

    return (
      <React.Fragment>
        {touring && currentTour !== undefined && currentTour === identifier && (
          <OfflineImage
            style={{
              position: "absolute",
              top: 10,
              left: WindowProperties.width * index + 10,
              right: 0,
              bottom: 0,
              width: 25,
              height: 25,
              zIndex: 105,
            }}
            source={{ uri: "" }}
            key="pointerIcon"
            fallbackSource={PointerIcon}
          />
        )}
        <TouchableWithoutFeedback
          onPress={onPress}
          onLongPress={onLongPress}
          testID={testID}
          hitSlop={{
            left: 15,
            right: 15,
            top: 5,
            bottom: 5,
          }}
          accessibilityLabel={accessibilityLabel}
          disabled={touring}
        >
          <View style={tabStyle} {...props} />
        </TouchableWithoutFeedback>
      </React.Fragment>
    );
  }
}

export default connect(
  state => ({
    currentTour: state.tour.currentTour,
    touring: state.tour.touring,
  }),
  null
)(TabBarButtonComponent);
