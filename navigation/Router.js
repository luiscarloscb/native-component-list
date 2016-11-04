import {
  createRouter,
} from '@exponent/ex-navigation';

import BarCodeScannerScreen from '../screens/BarCodeScannerScreen';
import ExponentScreen from '../screens/ExponentScreen';
import GLViewScreen from '../screens/GLViewScreen';
import HomeScreen from '../screens/HomeScreen';

export default createRouter(() => ({
  barCodeScanner: () => BarCodeScannerScreen,
  glView: () => GLViewScreen,
  exponent: () => ExponentScreen,
  home: () => HomeScreen,
}));
