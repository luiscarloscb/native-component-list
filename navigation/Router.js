import { createRouter } from '@expo/ex-navigation';

import BarCodeScannerScreen from '../screens/BarCodeScannerScreen';
import ExpoScreen from '../screens/ExpoScreen';
import SensorScreen from '../screens/SensorScreen';
import GLViewScreen from '../screens/GLViewScreen';
import FacebookAdsScreen from '../screens/FacebookAdsScreen';
import HomeScreen from '../screens/HomeScreen';
import SVGScreen from '../screens/SVGScreen';
import LottieScreen from '../screens/LottieScreen';
import MapsScreen from '../screens/MapsScreen';

export default createRouter(() => ({
  barCodeScanner: () => BarCodeScannerScreen,
  expo: () => ExpoScreen,
  glView: () => GLViewScreen,
  facebookAds: () => FacebookAdsScreen,
  home: () => HomeScreen,
  sensor: () => SensorScreen,
  svg: () => SVGScreen,
  lottie: () => LottieScreen,
  maps: () => MapsScreen,
}));
