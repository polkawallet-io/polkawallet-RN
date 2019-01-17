import React, { Component } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import {StackNavigator} from 'react-navigation'
import Tabbed_Navigation from './src/code/Tabbed_Navigation.js'
import Create_Account from './src/code/Assetes/secondary/Create_Account'
import Create_Wallet from './src/code/Assetes/secondary/Create_Wallet'
import QR_Code from './src/code/Assetes/secondary/QR_Code'
import Coin_details from './src/code/Assetes/secondary/coin_details'

const Polkawallet_App =  StackNavigator({
  Tabbed_Navigation:{screen:Tabbed_Navigation,navigationOptions:{header:null}},
  Create_Account:{screen:Create_Account,navigationOptions:{header:null}},
  Create_Wallet:{screen:Create_Wallet,navigationOptions:{header:null}},
  QR_Code:{screen:QR_Code,navigationOptions:{header:null}},
  Coin_details:{screen:Coin_details,navigationOptions:{header:null}},
 })
export default class Polkawallet extends Component {
  render() {
    return (
      <Polkawallet_App/>
    );
  }
}

