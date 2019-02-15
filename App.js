import React, { Component } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import Start from './src/code/Start'
import {StackNavigator} from 'react-navigation'
import Tabbed_Navigation from './src/code/Tabbed_Navigation.js'
import Create_Account from './src/code/Assetes/secondary/Create_Account'
import Backup_Account from './src/code/Assetes/secondary/Backup_Account'
import QR_Code from './src/code/Assetes/secondary/QR_Code'
import Coin_details from './src/code/Assetes/secondary/coin_details'
import Manage_Account from './src/code/Profile/secondary/Manage_Account'
import Transfer from './src/code/Assetes/secondary/Transfer/transfer'
import Make_transfer from './src/code/Assetes/secondary/Transfer/make_transfer'
import Transfer_details from './src/code/Assetes/secondary/Transfer/Transfer_details'
import Addresses from './src/code/Profile/secondary/Addresses'
import Add_address from './src/code/Profile/secondary/add_address'
import Address_information from './src/code/Profile/secondary/address_information'
import Camera from './src/code/Assetes/secondary/camera'
import Validator_Info from './src/code/Staking/secondary/Validator_Info'
import Stake from './src/code/Staking/secondary/stake'
import Nominate from './src/code/Staking/secondary/nominate'
import Unstake from './src/code/Staking/secondary/unstake'
import Unnominate from './src/code/Staking/secondary/unnominate'
import Preferences from './src/code/Staking/secondary/preferences'



import {Provider} from 'mobx-react'
 //获取store实例
import AppState from './src/mobx/mobx'

const Polkawallet_App =  StackNavigator({
  // Start:{screen:Start,navigationOptions:{header:null}},
  Tabbed_Navigation:{screen:Tabbed_Navigation,navigationOptions:{header:null}},
  Create_Account:{screen:Create_Account,navigationOptions:{header:null}},
  Backup_Account:{screen:Backup_Account,navigationOptions:{header:null}},
  QR_Code:{screen:QR_Code,navigationOptions:{header:null}},
  Coin_details:{screen:Coin_details,navigationOptions:{header:null}},
  Manage_Account:{screen:Manage_Account,navigationOptions:{header:null}},
  Transfer:{screen:Transfer,navigationOptions:{header:null}},
  Make_transfer:{screen:Make_transfer,navigationOptions:{header:null}},
  Transfer_details:{screen:Transfer_details,navigationOptions:{header:null}},
  Addresses:{screen:Addresses,navigationOptions:{header:null}},
  Add_address:{screen:Add_address,navigationOptions:{header:null}},
  Address_information:{screen:Address_information,navigationOptions:{header:null}},
  Camera:{screen:Camera,navigationOptions:{header:null}},
  Validator_Info:{screen:Validator_Info,navigationOptions:{header:null}},
  Stake:{screen:Stake,navigationOptions:{header:null}},
  Nominate:{screen:Nominate,navigationOptions:{header:null}},
  Unstake:{screen:Unstake,navigationOptions:{header:null}},
  Unnominate:{screen:Unnominate,navigationOptions:{header:null}},
  Preferences:{screen:Preferences,navigationOptions:{header:null}},

 })
 
 

export default class Polkawallet extends Component {
  render() {
    return (
      <Provider rootStore={AppState}>
        <Polkawallet_App/>
      </Provider>
      
    );
  }
}

