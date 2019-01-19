import React, { Component } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import {StackNavigator} from 'react-navigation'
import Tabbed_Navigation from './src/code/Tabbed_Navigation.js'
import Create_Account from './src/code/Assetes/secondary/Create_Account'
import Backup_Account from './src/code/Assetes/secondary/Backup_Account'
import QR_Code from './src/code/Assetes/secondary/QR_Code'
import Coin_details from './src/code/Assetes/secondary/coin_details'
import Manage_Account from './src/code/Profile/secondary/Manage_Account'

const Polkawallet_App =  StackNavigator({
  Tabbed_Navigation:{screen:Tabbed_Navigation,navigationOptions:{header:null}},
  Create_Account:{screen:Create_Account,navigationOptions:{header:null}},
  Backup_Account:{screen:Backup_Account,navigationOptions:{header:null}},
  QR_Code:{screen:QR_Code,navigationOptions:{header:null}},
  Coin_details:{screen:Coin_details,navigationOptions:{header:null}},
  Manage_Account:{screen:Manage_Account,navigationOptions:{header:null}},
 })
export default class Polkawallet extends Component {
  render() {
    return (
      <Polkawallet_App/>
    );
  }
}

