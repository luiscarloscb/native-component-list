import {
  createRouter,
} from '@exponent/ex-navigation';

import BarCodeScannerScreen from '../screens/BarCodeScannerScreen';
import ExponentScreen from '../screens/ExponentScreen';
import SensorScreen from '../screens/SensorScreen';
import GLViewScreen from '../screens/GLViewScreen';
import FacebookAdsScreen from '../screens/FacebookAdsScreen';
import HomeScreen from '../screens/HomeScreen';
import SVGScreen from '../screens/SVGScreen';
import LottieScreen from '../screens/LottieScreen';

export default createRouter(() => ({
  barCodeScanner: () => BarCodeScannerScreen,
  exponent: () => ExponentScreen,
  glView: () => GLViewScreen,
  facebookAds: () => FacebookAdsScreen,
  home: () => HomeScreen,
  sensor: () => SensorScreen,
  svg: () => SVGScreen,
  lottie: () => LottieScreen,
}));
