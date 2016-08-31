import {
  createRouter,
} from '@exponent/ex-navigation';

import HomeScreen from '../screens/HomeScreen';
import ExponentScreen from '../screens/ExponentScreen';

export default createRouter(() => ({
  home: () => HomeScreen,
  exponent: () => ExponentScreen,
}));
