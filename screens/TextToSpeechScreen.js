import React from 'react';
import { Text, Button, Platform, StyleSheet, View } from 'react-native';

import { Speech } from 'expo';

const EXAMPLES = [
  { language: 'en', text: 'Hello world' },
  { language: 'es', text: 'Hola mundo' },
  { language: 'en', text: 'Charlie Cheever chased a chortling choosy child' },
  { language: 'en', text: 'Adam Perry ate a pear in pairs in Paris' },
];

export default class TextToSpeechScreen extends React.Component {
  static navigationOptions = {
    title: 'Speech',
  };

  state = {
    selectedExample: EXAMPLES[0],
    inProgress: false,
    pitch: 1,
    rate: 0.5,
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Select a phrase</Text>
        </View>

        <View style={styles.examplesContainer}>
          {EXAMPLES.map(this._renderExample)}
        </View>

        <View style={styles.separator} />

        <View style={styles.controlRow}>
          <Button
            disabled={this.state.inProgress}
            onPress={this._speak}
            title="Speak"
          />

          <Button
            disabled={!this.state.inProgress}
            onPress={this._stop}
            title="Stop"
          />
        </View>

        <View style={styles.controlRow}>
          <Text style={styles.controlText}>
            Pitch: {this.state.pitch.toFixed(2)}
          </Text>
          <Button
            onPress={this._increasePitch}
            title="+"
            disabled={this.state.inProgress}
          />

          <Text>/</Text>

          <Button
            onPress={this._decreasePitch}
            title="-"
            disabled={this.state.inProgress}
          />
        </View>

        <View style={styles.controlRow}>
          <Text style={styles.controlText}>
            Rate: {this.state.rate.toFixed(2)}
          </Text>
          <Button
            onPress={this._increaseRate}
            title="+"
            disabled={this.state.inProgress}
          />

          <Text>/</Text>
          <Button
            onPress={this._decreaseRate}
            title="-"
            disabled={this.state.inProgress}
          />
        </View>
      </View>
    );
  }

  _speak = () => {
    const start = () => {
      this.setState({ inProgress: true });
    };
    const complete = () => {
      this.state.inProgress && this.setState({ inProgress: false });
    };

    Speech.speak(this.state.selectedExample.text, {
      language: this.state.selectedExample.language,
      pitch: this.state.pitch,
      rate: this.state.rate,
      onStart: start,
      onDone: complete,
      onStopped: complete,
      onError: complete,
    });
  };

  _stop = () => {
    Speech.stop();
  };

  _increasePitch = () => {
    this.setState(state => ({
      ...state,
      pitch: state.pitch + 0.1,
    }));
  };

  _increaseRate = () => {
    this.setState(state => ({
      ...state,
      rate: state.rate + 0.1,
    }));
  };

  _decreasePitch = () => {
    this.setState(state => ({
      ...state,
      pitch: state.pitch - 0.1,
    }));
  };

  _decreaseRate = () => {
    this.setState(state => ({
      ...state,
      rate: state.rate - 0.1,
    }));
  };

  _renderExample = (example, i) => {
    let { selectedExample } = this.state;
    let isSelected = selectedExample === example;

    return (
      <Text
        key={i}
        onPress={() => this._selectExample(example)}
        style={[styles.exampleText, isSelected && styles.selectedExampleText]}>
        {example.text} ({example.language})
      </Text>
    );
  };

  _selectExample = example => {
    this.setState({ selectedExample: example });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginTop: 0,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginHorizontal: 20,
    marginBottom: 0,
    marginTop: 20,
  },
  exampleText: {
    fontSize: 15,
    color: '#ccc',
    marginBottom: 10,
  },
  examplesContainer: {
    padding: 20,
  },
  selectedExampleText: {
    color: 'black',
  },
  resultText: {
    padding: 20,
  },
  errorResultText: {
    padding: 20,
    color: 'red',
  },
  button: {
    ...Platform.select({
      android: {
        marginBottom: 10,
      },
    }),
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});
