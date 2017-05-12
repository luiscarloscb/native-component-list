/**
 * React Native CLI configuration file
 */
'use strict';

const blacklist = require('react-native/packager/blacklist');

module.exports = {
  getBlacklistRE() {
    return blacklist([/__internal__\/.*/]);
  },
};
