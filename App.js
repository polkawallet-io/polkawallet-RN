import React, { Component } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import {StackNavigator} from 'react-navigation'
import Tabbed_Navigation from './src/code/Tabbed_Navigation.js'

const Polkawallet_App =  StackNavigator({
  Tabbed_Navigation:{screen:Tabbed_Navigation,navigationOptions:{header:null}},
 })
export default class Polkawallet extends Component {
  render() {
    return (
      <Polkawallet_App/>
    );
  }
}

