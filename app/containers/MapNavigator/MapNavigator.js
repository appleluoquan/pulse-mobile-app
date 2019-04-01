import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { StyleSheet, Image, Platform } from "react-native";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";

import {
  CoreConfig,
  metaHelpers,
} from "@pru-rt-internal/rnmobile-app-core-framework";

const helpers = metaHelpers;
const { SCREEN_KEY_NAVIGATION_MAIN_SCREEN } = CoreConfig;

const KEY_MAP_NAVIGATOR_YOUR_LOCATION = "navigationmainyourlocation";

const styles = StyleSheet.create({
  map: {
    height: 100,
    flex: 1,
  },
  marker: {
    width: 28,
    height: 28,
  },
});

// TODO : Refactor mapnavigator to get values from parent : Current onclick, userLocationChange handler
class MapNavigator extends React.PureComponent {
  renderMarker = (marker, index) => {
    const markerId = "Marker-" + index;
    const { onMarkerPress } = this.props;
    if (marker.shape === "CIRCLE") {
      return (
        <Circle
          key={markerId}
          center={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          radius={marker.radius || 400}
          fillColor={marker.fillColor}
          strokeColor={marker.strokeColor || "rgba(255,0,0,1)"}
          strokeWidth={1}
          zIndex={2}
          miterLimit={0}
        />
      );
    }
    return (
      <Marker
        key={marker.title}
        identifier={marker.id}
        coordinate={marker.coordinate}
        onPress={event => onMarkerPress(marker)}
        description={Platform.OS === "ios" ? undefined :markerId}
      >
        <Image source={marker.icon} style={styles.marker} />
      </Marker>
    );
  };

  render() {
    const {
      location,
      onRegionChangeComplete,
      initialRegion,
      refHandler,
    } = this.props;
    const markers = this.props.markers;
    return (
      <MapView
        // provider={PROVIDER_GOOGLE}
        style={styles.map}
        {...(location ? { region: location } : undefined)} //TODO: Pass as props from parent
        {...(initialRegion ? { initialRegion } : undefined)}
        showsUserLocation
        userLocationAnnotationTitle={
          helpers.findElement(
            SCREEN_KEY_NAVIGATION_MAIN_SCREEN,
            KEY_MAP_NAVIGATOR_YOUR_LOCATION
          ).label
        }
        zoomEnabled
        zoomControlEnabled
        onRegionChangeComplete={onRegionChangeComplete}
        ref={refHandler}
        // onUserLocationChange={onUserLocationChange}
      >
        {markers &&
          markers.length > 0 &&
          markers.map((marker, index) => this.renderMarker(marker, index))}
      </MapView>
    );
  }
}

MapNavigator.propTypes = {
  location: PropTypes.instanceOf(Object),
  initialRegion: PropTypes.instanceOf(Object),
  onUserLocationChange: PropTypes.func,
  markers: PropTypes.instanceOf(Array),
  onMarkerPress: PropTypes.func,
  meta: PropTypes.instanceOf(Object).isRequired,
  circularMarker: PropTypes.bool,
  refHandler: PropTypes.func,
  onRegionChangeComplete: PropTypes.func,
};

MapNavigator.defaultProps = {
  markers: [],
  circularMarker: false,
  onRegionChangeComplete: () => {},
  refHandler: () => {},
};

const mapStateToProps = state => ({
  meta: state.meta,
});

export default connect(
  mapStateToProps,
  {}
)(MapNavigator);
