/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import Polkawallet from './program/code/Polkawallet'

export default class polkawallet extends Component {
  render() {
    return (
      <Polkawallet/>
    );
  }
}

AppRegistry.registerComponent('polkawallet', () => polkawallet);
