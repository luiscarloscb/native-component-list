import React from 'react';
import { Button, StyleSheet, View } from 'react-native';

import { Components } from 'expo';

const { BarCodeScanner } = Components;

export default class BarcodeScannerExample extends React.Component {
  static route = {
    navigationBar: {
      visible: false,
    },
  };

  state = {
    torchMode: 'off',
    type: 'back',
  };

  render() {
    return (
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeRead={this._handleBarCodeRead}
          torchMode={this.state.torchMode}
          type={this.state.type}
          style={styles.preview}
        />

        <View style={styles.toolbar}>
          <Button title="Toggle Flashlight" onPress={this._toggleTorch} />
          <Button title="Toggle Direction" onPress={this._toggleType} />
        </View>
      </View>
    );
  }

  _toggleTorch = () => {
    this.setState({ torchMode: this.state.torchMode === 'off' ? 'on' : 'off' });
  };

  _toggleType = () => {
    this.setState({ type: this.state.type === 'back' ? 'front' : 'back' });
  };

  _handleBarCodeRead = data => {
    this.props.navigator.pop();
    requestAnimationFrame(() => {
      alert(JSON.stringify(data));
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    ...StyleSheet.absoluteFillObject,
  },
  toolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
