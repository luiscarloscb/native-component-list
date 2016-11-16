import {
  createRouter,
} from '@exponent/ex-navigation';

import BarCodeScannerScreen from '../screens/BarCodeScannerScreen';
import ExponentScreen from '../screens/ExponentScreen';
import SensorScreen from '../screens/SensorScreen';
import GLViewScreen from '../screens/GLViewScreen';
import HomeScreen from '../screens/HomeScreen';

export default createRouter(() => ({
  barCodeScanner: () => BarCodeScannerScreen,
  exponent: () => ExponentScreen,
  glView: () => GLViewScreen,
  home: () => HomeScreen,
  sensor: () => SensorScreen,
}));
