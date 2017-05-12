import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { MapView } from 'expo';

import Layout from '../constants/Layout';

export default class MapsScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Maps',
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      isGoogleMap: false,
    };
  }

  render() {
    let providerProps = this.state.isGoogleMap ? { provider: 'google' } : {};
    return (
      <ScrollView style={StyleSheet.absoluteFill}>
        <MapView
          style={{ width: Layout.window.width, height: 300 }}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          {...providerProps}
        />
        <View style={{ flexDirection: 'row' }}>
          <Switch
            style={{ margin: 10, flex: 1 }}
            onValueChange={isGoogleMap => {
              this.setState({ isGoogleMap });
            }}
            value={this.state.isGoogleMap}
          />
          <Text style={{ margin: 10, flex: 5 }}>
            Use Google maps
          </Text>
        </View>
      </ScrollView>
    );
  }
}
