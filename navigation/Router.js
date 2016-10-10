import {
  createRouter,
} from '@exponent/ex-navigation';

import BarCodeScannerScreen from '../screens/BarCodeScannerScreen';
import ExponentScreen from '../screens/ExponentScreen';
import HomeScreen from '../screens/HomeScreen';

export default createRouter(() => ({
  barCodeScanner: () => BarCodeScannerScreen,
  exponent: () => ExponentScreen,
  home: () => HomeScreen,
}));
