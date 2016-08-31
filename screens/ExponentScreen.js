import React, {
  PropTypes,
} from 'react';
import {
  Alert,
  ActivityIndicator,
  Animated,
  DeviceEventEmitter,
  Image,
  ListView,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  random,
  range,
} from 'lodash';

import Exponent, {
  Components,
  Constants,
  Contacts,
  Font,
  Location,
  Permissions,
} from 'exponent';

import {
  withNavigation,
} from '@exponent/ex-navigation';

import {
  VictoryChart,
  VictoryLine,
} from 'victory-chart-native';

import {
  MaterialIcons,
} from '@exponent/vector-icons';

import Alerts from '../constants/Alerts';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';

export default class HomeScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Built into Exponent',
      translucent: true,
    },
  }

  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: () => false,
      sectionHeaderHasChanged: () => false,
    }),
  }

  componentDidMount() {
    let dataSource = this.state.dataSource.cloneWithRowsAndSections({
      ...Platform.select({
        ios: {
          'BlurView': [this._renderBlurView],
        },
        android: {

        },
      }),
      'Constants': [this._renderConstants],
      'Contacts': [this._renderContacts],
      'Facebook': [this._renderFacebook],
      'Font': [this._renderFont],
      'PushNotification': [this._renderPushNotification],
      'LinearGradient': [this._renderLinearGradient],
      'Location': [this._renderLocation],
      'Svg': [this._renderSvg],
      'TouchID': [this._renderTouchID],
      'Video': [this._renderVideo],
    });

    this.setState({dataSource});
  }

  _renderSvg = () => {
    return (
      <VictoryChart>
        <VictoryLine
          style={{data:
            {stroke: "red", strokeWidth: 4}
          }}
          y={(data) =>
            Math.sin(2 * Math.PI * data.x)
          }
        />
        <VictoryLine
          style={{data:
            {stroke: "blue", strokeWidth: 4}
          }}
          y={(data) =>
            Math.cos(2 * Math.PI * data.x)
          }
        />
      </VictoryChart>
    );
  }

  _renderSvgAnimated = () => {
    return <AnimatedSvgExample />;
  }

  _renderBlurView = () => {
    return <BlurViewExample />;
  }

  _renderConstants = () => {
    const ExponentConstant = ({name}) => {
      return (
        <View style={{flexDirection: 'row', flex: 1}}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={{flex: 1}}><Text style={{fontWeight: 'bold'}}>{name}</Text>: {Constants[name]}</Text>
        </View>
      );
    }

    return (
      <View style={{padding: 10}}>
        <ExponentConstant name="exponentVersion" />
        <ExponentConstant name="deviceId" />
        <ExponentConstant name="deviceName" />
        <ExponentConstant name="deviceYearClass" />
        <ExponentConstant name="sessionId" />
        <ExponentConstant name="linkingUri" />
      </View>
    );
  }

  _renderContacts = () => {
    return <ContactsExample />;
  }

  _renderFacebook = () => {
    return <FacebookLoginExample />;
  }

  _renderFont = () => {
    return (
      <View style={{flex: 1}}>
        <View style={{paddingVertical: 10, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
          <MaterialIcons name="airplay" size={25} />
          <MaterialIcons name="airport-shuttle" size={25} />
          <MaterialIcons name="alarm" size={25} />
          <MaterialIcons name="alarm-add" size={25} />
          <MaterialIcons name="alarm-off" size={25} />
          <MaterialIcons name="all-inclusive" size={25} />
        </View>

        <View style={{paddingVertical: 10, paddingHorizontal: 15}}>
          <Text style={[Font.style('space-mono'), {fontSize: 16}]}>
            Font icons sets and other custom fonts can be loaded from the web
          </Text>
        </View>
      </View>
    );
  }

  _renderLinearGradient = () => {
    return <LinearGradientExample />;
  }

  _renderPushNotification = () => {
    return <PushNotificationExample />;
  }

  _renderTouchID = () => {
    return <TouchIDExample />;
  }

  _renderLocation = () => {
    return <LocationExample />;
  }

  _renderVideo = () => {
    return (
      <View style={{flex: 1, padding: 10, alignItems: 'center', justifyContent: 'center'}}>
        <Components.Video
          source={require('../assets/videos/ace.mp4')}
          rate={1.0}
          volume={1.0}
          muted={false}
          resizeMode="cover"
          repeat
          style={{ width: 300, height: 300 }}
        />
      </View>
    );
  }

  render() {
    return (
      <ListView
        removeClippedSubviews={false}
        keyboardShouldPersistTaps
        keyboardDismissMode="on-drag"
        style={this.props.route.getContentContainerStyle()}
        contentContainerStyle={{backgroundColor: '#fff'}}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
        renderSectionHeader={this._renderSectionHeader}
      />
    );
  }

  _renderRow = (renderRowFn) => {
    return (
      <View>
        {renderRowFn && renderRowFn()}
      </View>
    );
  }

  _renderSectionHeader = (_, sectionTitle) => {
    return (
      <View style={styles.sectionHeader}>
        <Text>{sectionTitle}</Text>
      </View>
    );
  }
}

class ContactsExample extends React.Component {
  state = {
    contacts: null,
  }

  _findContacts = async () => {
    let result = await Contacts.getContactsAsync([
      Contacts.EMAIL,
    ]);

    let contacts = result.map(contact => {
      return {
        name: (contact && contact.name && contact.name.split(' ')[0]) || '',
        email: 'hidden for demo',
        phone: '-',
      };
    });

    this.setState({contacts: contacts.slice(0, 4)});
  }

  render() {
    if (this.state.contacts) {
      return (
        <View style={{padding: 10}}>
          <Text>{JSON.stringify(this.state.contacts)}</Text>
        </View>
      );
    }

    return (
      <View style={{padding: 10}}>
        <Button onPress={this._findContacts}>
          Find my contacts
        </Button>
      </View>
    );
  }
}

class LocationExample extends React.Component {
  state = {
    location: null,
    searching: false,
  };

  _findLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      return;
    }

    try {
      this.setState({searching: true});
      let result = await Location.getCurrentPositionAsync({enableHighAccuracy: false});
      this.setState({location: result});
    } finally {
      this.setState({searching: false});
    }
  }

  render() {
    if (this.state.searching) {
      return (
        <View style={{padding: 10}}>
          <ActivityIndicator />
        </View>
      );
    }

    if (this.state.location) {
      return (
        <View style={{padding: 10}}>
          <Text>Latitude: {this.state.location.coords.latitude + Math.random() * 5}</Text>
          <Text>Longitude: {this.state.location.coords.latitude - Math.random() * 5}</Text>
        </View>
      );
    }

    return (
      <View style={{padding: 10}}>
        <Button onPress={this._findLocation}>
          Find my location
        </Button>
      </View>
    );
  }
}

class TouchIDExample extends React.Component {
  state = {
    waiting: false,
  }

  render() {
    let authFunction;

    if (Platform.OS === 'android') {
      authFunction = async () => {
        this.setState({waiting: true});
        try {
          let result = await NativeModules.ExponentFingerprint.authenticateAsync();
          if (result.success) {
            alert('Authenticated!');
          } else {
            alert('Failed to authenticate');
          }
        } finally {
          this.setState({waiting: false});
        }
      }
    } else if (Platform.OS === 'ios') {
      authFunction = async () => {
        let result = await NativeModules.ExponentFingerprint.authenticateAsync('Show me your finger!');
        if (result.success) {
          alert('Success!');
        } else {
          alert('Cancel!');
        }
      }
    }

    return (
      <View style={{padding: 10}}>
        <Button onPress={authFunction}>
          { this.state.waiting ? 'Waiting for fingerprint... ' : 'Authenticate with fingerprint' }
        </Button>
      </View>
    );
  }
}

@withNavigation
class PushNotificationExample extends React.Component {
  render() {
    return (
      <View style={{padding: 10}}>
        <Button onPress={this._sendNotification}>
          Send me a push notification!
        </Button>
      </View>
    );
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  _sendNotification = async () => {
    registerForPushNotificationsAsync();

    // Handle notifications that come in while the app is open
    if (!this._notificationSubscription) {
      this._notificationSubscription = DeviceEventEmitter.
        addListener('Exponent.notification', this._handleNotification);
    }
  }

  _handleNotification = ({origin, data}) => {
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    this.props.navigator.showLocalAlert(
      `Push notification ${origin} with data: ${JSON.stringify(data)}`,
      Alerts.notice
    );
  }
}

const AnimatedBlurView = Animated.createAnimatedComponent(Components.BlurView);
class BlurViewExample extends React.Component {
  state = {
    opacity: new Animated.Value(0),
  }

  componentDidMount() {
    this._animate();
  }

  _animate = () => {
    let { opacity } = this.state;
    Animated.timing(opacity, {duration: 2500, toValue: 1}).start((value) => {
      Animated.timing(opacity, {duration: 2500, toValue: 0}).start(this._animate);
    });
  }

  render() {
    const uri = 'https://s3.amazonaws.com/exp-brand-assets/ExponentEmptyManifest_192.png';

    return (
      <View style={{flex: 1, margin: 30}}>
        <View style={{flex: 1, padding: 55, paddingTop: 60}}>
          <Image style={{width: 180, height: 180}} source={{uri}} />

          <AnimatedBlurView
            tintEffect="default"
            style={[StyleSheet.absoluteFill, {opacity: this.state.opacity}]} />
        </View>
      </View>
    );
  }
}

class FacebookLoginExample extends React.Component {
  render() {
    let permissions = ['public_profile', 'email', 'user_friends'];

    return (
      <View style={{padding: 10}}>
        <Button onPress={() => this._testFacebookLogin('1201211719949057', permissions)}>
          Authenticate with Facebook
        </Button>
      </View>
    );
  }

  _testFacebookLogin = async (id, perms, behavior = 'web') => {
    try {
      const result = await Exponent.Facebook.logInWithReadPermissionsAsync(id, {
        permissions: perms,
        behavior,
      });

      const { type, token } = result;

      if (type === 'cancel') {
      } else {
        Alert.alert('Logged in!', JSON.stringify(result), [{
          text: 'OK!',
          onPress: () => { console.log({type, token}); },
        }]);
      }
    } catch (e) {
      Alert.alert(
        'Error!',
        e.message,
        [{ text: 'OK', onPress: () => {} }],
      );
    }
  }

}
function incrementColor(color, step) {
  const intColor = parseInt(color.substr(1), 16);
  const newIntColor = (intColor + step).toString(16);
  return `#${'0'.repeat(6 - newIntColor.length)}${newIntColor}`;
};

class LinearGradientExample extends React.Component {

  state = {
    count: 0,
    colorTop: '#000000',
    colorBottom: '#cccccc',
  }

  componentDidMount() {
    this._interval = setInterval(() => {
      this.setState({
        count: this.state.count + 1,
        colorTop: incrementColor(this.state.colorTop, 1),
        colorBottom: incrementColor(this.state.colorBottom, -1),
      });
    }, 20);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10,}}>
        <Components.LinearGradient
          colors={[this.state.colorTop, this.state.colorBottom]}
          style={{width: 200, height: 200}} />
        <Text style={{color: this.state.colorTop}}>{this.state.colorTop}</Text>
        <Text style={{color: this.state.colorBottom}}>{this.state.colorBottom}</Text>
      </View>
    );
  }
}

function Button(props) {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.button}>
      <Text style={styles.buttonText}>{props.children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
  sectionHeader: {
    backgroundColor: 'rgba(245,245,245,1)',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 3,
    backgroundColor: Colors.tintColor,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
  },
});

