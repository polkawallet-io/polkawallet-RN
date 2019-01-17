import React, { Component } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import {StackNavigator} from 'react-navigation'
import Tabbed_Navigation from './src/code/Tabbed_Navigation.js'
import Create_Account from './src/code/Assetes/secondary/Create_Account'

const Polkawallet_App =  StackNavigator({
  Tabbed_Navigation:{screen:Tabbed_Navigation,navigationOptions:{header:null}},
  Create_Account:{screen:Create_Account,navigationOptions:{header:null}},
 })
export default class Polkawallet extends Component {
  render() {
    return (
      <Polkawallet_App/>
    );
  }
}

