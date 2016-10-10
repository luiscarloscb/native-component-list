import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import {
  Components,
} from 'exponent';

const { BarCodeScanner } = Components;

export default class BarcodeScannerExample extends React.Component {
  static route = {
    navigationBar: {
      visible: false,
    },
  }

  render() {
    return (
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeRead={this._handleBarCodeRead}
          style={styles.preview}
        />
      </View>
    );
  }

  _handleBarCodeRead = (data) => {
    this.props.navigator.pop();
    requestAnimationFrame(() => {
      alert(JSON.stringify(data));
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    ...StyleSheet.absoluteFillObject,
  },
});
