import React, { PropTypes } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  AppState,
  Image,
  ListView,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Expo, {
  Constants,
  Contacts,
  MapView,
  BlurView,
  LinearGradient,
  Font,
  Location,
  Notifications,
  Permissions,
  Video,
} from 'expo';

import { withNavigation } from '@expo/ex-navigation';

import { MaterialIcons } from '@expo/vector-icons';

import Alerts from '../constants/Alerts';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import registerForPushNotificationsAsync
  from '../api/registerForPushNotificationsAsync';

export default class HomeScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Built into Expo',
      translucent: true,
    },
  };

  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: () => false,
      sectionHeaderHasChanged: () => false,
    }),
  };

  componentWillMount() {
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  _handleNotification = notification => {
    let { data, origin, remote } = notification;
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    /**
     * Currently on Android this will only fire when selected for local
     * notifications, and there is no way to distinguish between local
     * and remote notifications
     */

    let message;
    if (Platform.OS === 'android') {
      message = `Notification ${origin} with data: ${JSON.stringify(data)}`;
    } else {
      if (remote) {
        message = `Push notification ${origin} with data: ${JSON.stringify(data)}`;
      } else {
        message = `Local notification ${origin} with data: ${JSON.stringify(data)}`;
      }
    }

    this.props.navigator.showLocalAlert(message, Alerts.notice);
  };

  componentDidMount() {
    let dataSource = this.state.dataSource.cloneWithRowsAndSections({
      ...Platform.select({
        ios: {
          BlurView: [this._renderBlurView],
        },
        android: {},
      }),
      BarCodeScanner: [this._renderBarCodeScanner],
      Constants: [this._renderConstants],
      Contacts: [this._renderContacts],
      WebGL: [this._renderWebGL],
      FacebookAds: [this._renderFacebookAds],
      Facebook: [this._renderFacebook],
      Google: [this._renderGoogle],
      Font: [this._renderFont],
      KeepAwake: [this._renderKeepAwake],
      Lottie: [this._renderLottie],
      Map: [this._renderMap],
      NotificationBadge: [this._renderNotificationBadge],
      PushNotification: [this._renderPushNotification],
      LocalNotification: [this._renderLocalNotification],
      LinearGradient: [this._renderLinearGradient],
      Location: [this._renderLocation],
      'navigator.geolocation Polyfill (using Location)': [this._renderLocationPolyfill],
      Sensors: [this._renderSensors],
      Svg: [this._renderSvg],
      TouchID: [this._renderTouchID],
      Util: [this._renderUtil],
      Video: [this._renderVideo],
    });

    this.setState({ dataSource });
  }

  _renderMap = () => {
    return (
      <MapView
        style={{ width: Layout.window.width, height: 300 }}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    );
  };

  _renderSvg = () => {
    return (
      <View style={{ padding: 10 }}>
        <Button
          onPress={() => {
            this.props.navigator.push('svg');
          }}>
          Open Svg example
        </Button>
      </View>
    );
  };

  _renderLottie = () => {
    return (
      <View style={{ padding: 10 }}>
        <Button
          onPress={() => {
            this.props.navigator.push('lottie');
          }}>
          Open Lottie example
        </Button>
      </View>
    );
  };

  _renderBarCodeScanner = () => {
    let _maybeNavigateToBarCodeScanner = async () => {
      let { status } = await Permissions.askAsync(Permissions.CAMERA);

      if (status === 'granted') {
        this.props.navigator.push('barCodeScanner');
      } else {
        alert('Denied access to camera!');
      }
    };

    return (
      <View style={{ padding: 10 }}>
        <Button onPress={_maybeNavigateToBarCodeScanner}>
          Open bar code scanner
        </Button>
      </View>
    );
  };

  _renderWebGL = () => {
    return (
      <View style={{ padding: 10 }}>
        <Button onPress={() => this.props.navigator.push('glView')}>
          Open WebGL Example
        </Button>
      </View>
    );
  };

  _renderFacebookAds = () => {
    return (
      <View style={{ padding: 10 }}>
        <Button onPress={() => this.props.navigator.push('facebookAds')}>
          Open Facebook Ads Example
        </Button>
      </View>
    );
  };

  _renderBlurView = () => {
    return <BlurViewExample />;
  };

  _renderConstants = () => {
    const ExponentConstant = ({ name, object }) => {
      let value = Constants[name];

      if (object) {
        value = JSON.stringify(value);
      } else if (typeof value === 'boolean') {
        value = value ? 'true' : 'false';
      }

      return (
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{name}</Text>: {value}
          </Text>
        </View>
      );
    };

    return (
      <View style={{ padding: 10 }}>
        <ExponentConstant name="exponentVersion" />
        <ExponentConstant name="deviceId" />
        <ExponentConstant name="deviceName" />
        <ExponentConstant name="deviceYearClass" />
        <ExponentConstant name="sessionId" />
        <ExponentConstant name="linkingUri" />
        <ExponentConstant name="statusBarHeight" />
        <ExponentConstant name="isDevice" />
        <ExponentConstant name="appOwnership" />
        {Platform.OS === 'ios' && <ExponentConstant name="platform" object />}
      </View>
    );
  };

  _renderContacts = () => {
    return <ContactsExample />;
  };

  _renderFacebook = () => {
    return <FacebookLoginExample />;
  };

  _renderGoogle = () => {
    return <GoogleLoginExample />;
  };

  _renderFont = () => {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <MaterialIcons name="airplay" size={25} />
          <MaterialIcons name="airport-shuttle" size={25} />
          <MaterialIcons name="alarm" size={25} />
          <MaterialIcons name="alarm-add" size={25} />
          <MaterialIcons name="alarm-off" size={25} />
          <MaterialIcons name="all-inclusive" size={25} />
        </View>

        <View style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
          <Text style={[Font.style('space-mono'), { fontSize: 16 }]}>
            Font icons sets and other custom fonts can be loaded from the web
          </Text>
        </View>
      </View>
    );
  };

  _renderKeepAwake = () => {
    return <KeepAwakeExample />;
  };

  _renderLinearGradient = () => {
    return <LinearGradientExample />;
  };

  _renderNotificationBadge = () => {
    return <NotificationBadgeExample />;
  };

  _renderPushNotification = () => {
    return <PushNotificationExample />;
  };

  _renderLocalNotification = () => {
    return <LocalNotificationExample />;
  };

  _renderSensors = () => {
    return <SensorsExample />;
  };

  _renderTouchID = () => {
    return <TouchIDExample />;
  };

  _renderLocation = () => {
    return <LocationExample />;
  };

  _renderLocationPolyfill = () => {
    return <LocationExample polyfill={true} />;
  };

  _renderVideo = () => {
    return (
      <View
        style={{
          flex: 1,
          padding: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Video
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
  };

  _renderUtil = () => {
    return <UtilExample />;
  };

  render() {
    return (
      <ListView
        removeClippedSubviews={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        style={this.props.route.getContentContainerStyle()}
        contentContainerStyle={{ backgroundColor: '#fff' }}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
        renderSectionHeader={this._renderSectionHeader}
      />
    );
  }

  _renderRow = renderRowFn => {
    return (
      <View>
        {renderRowFn && renderRowFn()}
      </View>
    );
  };

  _renderSectionHeader = (_, sectionTitle) => {
    return (
      <View style={styles.sectionHeader}>
        <Text>{sectionTitle}</Text>
      </View>
    );
  };
}

class ContactsExample extends React.Component {
  state = {
    contacts: null,
  };

  _findContacts = async () => {
    let permission = await Permissions.askAsync(Permissions.CONTACTS);
    if (permission.status !== 'granted') {
      setTimeout(
        () => Alert.alert('Contacts permission was not granted.'),
        100
      );
      return;
    }
    let result = await Contacts.getContactsAsync([
      Contacts.EMAILS,
      Contacts.PHONE_NUMBERS,
      Contacts.ADDRESSES,
    ]);

    let contacts = result.map(contact => {
      return {
        firstName: contact.firstName,
        name: contact.name,
        emails: contact.emails,
        phoneNumbers: contact.phoneNumbers,
        addresses: contact.addresses,
      };
    });

    this.setState({ contacts: contacts.slice(0, 4) });
  };

  render() {
    if (this.state.contacts) {
      return (
        <View style={{ padding: 10 }}>
          <Text>{JSON.stringify(this.state.contacts)}</Text>
        </View>
      );
    }

    return (
      <View style={{ padding: 10 }}>
        <Button onPress={this._findContacts}>
          Find my contacts
        </Button>
      </View>
    );
  }
}

class LocationExample extends React.Component {
  state = {
    singleLocation: null,
    searching: false,
    watchLocation: null,
    subscription: null,
  };

  _findSingleLocationWithPolyfill = () => {
    this.setState({ searching: true });
    navigator.geolocation.getCurrentPosition(
      location => {
        this.setState({ singleLocation: location, searching: false });
      },
      err => {
        console.log({ err });
        this.setState({ searching: false });
      },
      { enableHighAccuracy: true }
    );
  };

  _startWatchingLocationWithPolyfill = () => {
    let watchId = navigator.geolocation.watchPosition(
      location => {
        console.log(`Got location: ${JSON.stringify(location.coords)}`);
        this.setState({ watchLocation: location });
      },
      err => {
        console.log({ err });
      },
      {
        enableHighAccuracy: true,
        timeInterval: 1000,
        distanceInterval: 1,
      }
    );

    let subscription = {
      remove() {
        navigator.geolocation.clearWatch(watchId);
      },
    };

    this.setState({ subscription });
  };

  _findSingleLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      return;
    }

    try {
      this.setState({ searching: true });
      let result = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });
      this.setState({ singleLocation: result });
    } finally {
      this.setState({ searching: false });
    }
  };

  _startWatchingLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      return;
    }

    let subscription = await Location.watchPositionAsync(
      {
        enableHighAccuracy: true,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      location => {
        console.log(`Got location: ${JSON.stringify(location.coords)}`);
        this.setState({ watchLocation: location });
      }
    );

    this.setState({ subscription });
  };

  _stopWatchingLocation = async () => {
    this.state.subscription.remove();
    this.setState({ subscription: null, watchLocation: null });
  };

  renderSingleLocation() {
    if (this.state.searching) {
      return (
        <View style={{ padding: 10 }}>
          <ActivityIndicator />
        </View>
      );
    }

    if (this.state.singleLocation) {
      return (
        <View style={{ padding: 10 }}>
          <Text>{this.props.polyfill ? "navigator.geolocation.getCurrentPosition" : "Location.getCurrentPositionAsync"}:</Text>
          <Text>Latitude: {this.state.singleLocation.coords.latitude}</Text>
          <Text>Longitude: {this.state.singleLocation.coords.longitude}</Text>
        </View>
      );
    }

    return (
      <View style={{ padding: 10 }}>
        <Button onPress={this.props.polyfill ? this._findSingleLocationWithPolyfill : this._findSingleLocation}>
          Find my location once
        </Button>
      </View>
    );
  }

  renderWatchLocation() {
    if (this.state.watchLocation) {
      return (
        <View style={{ padding: 10 }}>
          <Text>{this.props.polyfill ? "navigator.geolocation.watchPosition" : "Location.watchPositionAsync"}:</Text>
          <Text>Latitude: {this.state.watchLocation.coords.latitude}</Text>
          <Text>Longitude: {this.state.watchLocation.coords.longitude}</Text>
          <View style={{ padding: 10 }}>
            <Button onPress={this._stopWatchingLocation}>
              Stop Watching
            </Button>
          </View>
        </View>
      );
    } else if (this.state.subscription) {
      return (
        <View style={{ padding: 10 }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={{ padding: 10 }}>
        <Button onPress={this.props.polyfill ? this._startWatchingLocationWithPolyfill : this._startWatchingLocation}>
          Watch my location
        </Button>
      </View>
    );
  }

  render() {
    return (
      <View>
        {this.renderSingleLocation()}
        {this.renderWatchLocation()}
      </View>
    );
  }
}

@withNavigation class SensorsExample extends React.Component {
  render() {
    return (
      <View style={{ padding: 10 }}>
        <Button onPress={() => this.props.navigator.push('sensor')}>
          Try out sensors (Gyroscope, Accelerometer)
        </Button>
      </View>
    );
  }
}

class TouchIDExample extends React.Component {
  state = {
    waiting: false,
  };

  render() {
    let authFunction;

    if (Platform.OS === 'android') {
      authFunction = async () => {
        this.setState({ waiting: true });
        try {
          let result = await NativeModules.ExponentFingerprint.authenticateAsync();
          if (result.success) {
            alert('Authenticated!');
          } else {
            alert('Failed to authenticate');
          }
        } finally {
          this.setState({ waiting: false });
        }
      };
    } else if (Platform.OS === 'ios') {
      authFunction = async () => {
        let result = await NativeModules.ExponentFingerprint.authenticateAsync(
          'Show me your finger!'
        );
        if (result.success) {
          alert('Success!');
        } else {
          alert('Cancel!');
        }
      };
    }

    return (
      <View style={{ padding: 10 }}>
        <Button onPress={authFunction}>
          {this.state.waiting
            ? 'Waiting for fingerprint... '
            : 'Authenticate with fingerprint'}
        </Button>
      </View>
    );
  }
}

class NotificationBadgeExample extends React.Component {
  render() {
    return (
      <View style={{ padding: 10 }}>
        <Button onPress={this._incrementIconBadgeNumberAsync}>
          Increment the app icon's badge number
        </Button>

        <View style={{ height: 10 }} />

        <Button onPress={this._clearIconBadgeAsync}>
          Clear the app icon's badge number
        </Button>
      </View>
    );
  }

  _incrementIconBadgeNumberAsync = async () => {
    let currentNumber = await Notifications.getBadgeNumberAsync();
    await Notifications.setBadgeNumberAsync(currentNumber + 1);
    let actualNumber = await Notifications.getBadgeNumberAsync();
    global.alert(`Set the badge number to ${actualNumber}`);
  };

  _clearIconBadgeAsync = async () => {
    await Notifications.setBadgeNumberAsync(0);
    global.alert(`Cleared the badge`);
  };
}

class PushNotificationExample extends React.Component {
  render() {
    return (
      <View style={{ padding: 10 }}>
        <Button onPress={this._sendNotification}>
          Send me a push notification!
        </Button>
      </View>
    );
  }

  _sendNotification = async () => {
    registerForPushNotificationsAsync();
  };
}

class KeepAwakeExample extends React.Component {
  _activate = () => {
    KeepAwake.activate();
  };

  _deactivate = () => {
    KeepAwake.deactivate();
  };

  render() {
    return (
      <View style={{ padding: 10 }}>
        <Button style={{ marginBottom: 10 }} onPress={this._activate}>
          Activate
        </Button>
        <Button onPress={this._deactivate}>Deactivate</Button>
      </View>
    );
  }
}

class LocalNotificationExample extends React.Component {
  render() {
    return (
      <View style={{ padding: 10 }}>
        <Button onPress={this._presentLocalNotification}>
          Present a notification immediately
        </Button>

        <View style={{ height: 10 }} />

        <Button onPress={this._scheduleLocalNotification}>
          Schedule notification for 10 seconds from now
        </Button>
      </View>
    );
  }

  _presentLocalNotification = () => {
    Notifications.presentLocalNotificationAsync({
      title: 'Here is a local notifiation!',
      body: 'This is the body',
      data: {
        hello: 'there',
      },
      ios: {
        sound: true,
      },
      android: {
        vibrate: true,
      },
    });
  };

  _scheduleLocalNotification = () => {
    Notifications.scheduleLocalNotificationAsync(
      {
        title: 'Here is a scheduled notifiation!',
        body: 'This is the body',
        data: {
          hello: 'there',
          future: 'self',
        },
        ios: {
          sound: true,
        },
        android: {
          vibrate: true,
        },
      },
      {
        time: new Date().getTime() + 10000,
      }
    );
  };
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
class BlurViewExample extends React.Component {
  state = {
    intensity: new Animated.Value(0),
  };

  componentDidMount() {
    this._animate();
  }

  _animate = () => {
    let { intensity } = this.state;
    let animateInConfig = {
      duration: 2500,
      toValue: 100,
      isInteraction: false,
    };
    let animateOutconfig = { duration: 2500, toValue: 0, isInteraction: false };

    Animated.timing(intensity, animateInConfig).start(value => {
      Animated.timing(intensity, animateOutconfig).start(this._animate);
    });
  };

  render() {
    const uri = 'https://s3.amazonaws.com/exp-brand-assets/ExponentEmptyManifest_192.png';

    return (
      <View
        style={{
          flex: 1,
          padding: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image style={{ width: 180, height: 180 }} source={{ uri }} />

        <AnimatedBlurView
          tint="default"
          intensity={this.state.intensity}
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }
}

class FacebookLoginExample extends React.Component {
  render() {
    let permissions = ['public_profile', 'email', 'user_friends'];

    return (
      <View style={{ padding: 10 }}>
        <Button
          onPress={() =>
            this._testFacebookLogin('1201211719949057', permissions)}>
          Authenticate with Facebook
        </Button>
      </View>
    );
  }

  _testFacebookLogin = async (id, perms, behavior = 'web') => {
    try {
      if (
        Platform.OS === 'android' || Constants.appOwnership === 'standalone'
      ) {
        // iOS supports system too, native jumps over to the app though and people
        // seem to like that effect. I maybe prefer system.
        behavior = Platform.OS === 'ios' ? 'native' : 'system';
      }

      const result = await Expo.Facebook.logInWithReadPermissionsAsync(id, {
        permissions: perms,
        behavior,
      });

      const { type, token } = result;

      if (type === 'success') {
        Alert.alert('Logged in!', JSON.stringify(result), [
          {
            text: 'OK!',
            onPress: () => {
              console.log({ type, token });
            },
          },
        ]);
      }
    } catch (e) {
      Alert.alert('Error!', e.message, [{ text: 'OK', onPress: () => {} }]);
    }
  };
}

class GoogleLoginExample extends React.Component {
  render() {
    return (
      <View style={{ padding: 10 }}>
        <Button onPress={() => this._testGoogleLogin()}>
          Authenticate with Google
        </Button>
      </View>
    );
  }

  _testGoogleLogin = async () => {
    try {
      const result = await Expo.Google.logInAsync({
        androidStandaloneAppClientId: '603386649315-87mbvgc739sec2gjtptl701ha62pi98p.apps.googleusercontent.com',
        androidClientId: '603386649315-9rbv8vmv2vvftetfbvlrbufcps1fajqf.apps.googleusercontent.com',
        iosStandaloneAppClientId: '603386649315-1b2o2gole94qc6h4prj6lvoiueq83se4.apps.googleusercontent.com',
        iosClientId: '603386649315-vp4revvrcgrcjme51ebuhbkbspl048l9.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      const { type } = result;

      if (type === 'success') {
        // Avoid race condition with the WebView hiding when using web-based sign in
        setTimeout(
          () => {
            Alert.alert('Logged in!', JSON.stringify(result), [
              {
                text: 'OK!',
                onPress: () => {
                  console.log({ result });
                },
              },
            ]);
          },
          1000
        );
      }
    } catch (e) {
      Alert.alert('Error!', e.message, [{ text: 'OK :(', onPress: () => {} }]);
    }
  };
}

function incrementColor(color, step) {
  const intColor = parseInt(color.substr(1), 16);
  const newIntColor = (intColor + step).toString(16);
  return `#${'0'.repeat(6 - newIntColor.length)}${newIntColor}`;
}

class UtilExample extends React.Component {
  state = {
    locale: null,
  };

  componentWillMount() {
    this._updateLocale();
    AppState.addEventListener('change', this._updateLocale);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._updateLocale);
  }

  _updateLocale = async () => {
    let locale = await Expo.Util.getCurrentLocaleAsync();
    this.setState({ locale });
  };

  render() {
    return (
      <View style={{ padding: 10 }}>
        <Text>Locale: {this.state.locale}</Text>
      </View>
    );
  }
}

class LinearGradientExample extends React.Component {
  state = {
    count: 0,
    colorTop: '#000000',
    colorBottom: '#cccccc',
  };

  componentDidMount() {
    this._interval = setInterval(
      () => {
        this.setState({
          count: this.state.count + 1,
          colorTop: incrementColor(this.state.colorTop, 1),
          colorBottom: incrementColor(this.state.colorBottom, -1),
        });
      },
      20
    );
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 10,
        }}>
        <LinearGradient
          colors={[this.state.colorTop, this.state.colorBottom]}
          style={{ width: 200, height: 200 }}
        />
        <Text style={{ color: this.state.colorTop }}>
          {this.state.colorTop}
        </Text>
        <Text style={{ color: this.state.colorBottom }}>
          {this.state.colorBottom}
        </Text>
      </View>
    );
  }
}

function Button(props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.button, props.style]}>
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
