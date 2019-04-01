import React from 'react';
import { Text, View } from 'react-native';
import styles from './style';

class ClinicPage extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Clinic Page</Text>
      </View>
    );
  }
}

export default ClinicPage;
