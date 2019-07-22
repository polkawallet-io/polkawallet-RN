/*	
 * @Description: COPYRIGHT © 2018 POLKAWALLET (HK) LIMITED 	
 *  This file is part of Polkawallet. 	
 	
 It under the terms of the GNU General Public License as published by 	
 the Free Software Foundation, either version 3 of the License. 	
 You should have received a copy of the GNU General Public License 	
 along with Polkawallet. If not, see <http://www.gnu.org/licenses/>. 	
  * @Autor: POLKAWALLET LIMITED	
 * @Date: 2019-06-18 21:08:00	
 */
import React, { Component } from 'react'
import { StackNavigator } from 'react-navigation'
import { Provider } from 'mobx-react'
import Tabbed_Navigation from './src/page/TabbedNavigation'
import Create_Account from './src/page/Assets/secondary/CreateAccount'
import Backup_Account from './src/page/Assets/secondary/BackupAccount'
import MnemonicWord_1 from './src/page/Assets/secondary/MnemonicWord_1'
import MnemonicWord_2 from './src/page/Assets/secondary/MnemonicWord_2'
import MnemonicWord_3 from './src/page/Assets/secondary/MnemonicWord_3'
import QR_Code from './src/page/Assets/secondary/QRCode'
import Coin_details from './src/page/Assets/secondary/CoinDetails'
import Manage_Account from './src/page/Profile/secondary/ManageAccount'
import Transfer from './src/page/Assets/secondary/Transfer/Transfer'
import Make_transfer from './src/page/Assets/secondary/Transfer/MakeTransfer'
import Transfer_details from './src/page/Assets/secondary/Transfer/TransferDetails'
import Addresses from './src/page/Profile/secondary/Addresses'
import Add_address from './src/page/Profile/secondary/AddAddress'
import Address_information from './src/page/Profile/secondary/AddressInformation'
import Camera from './src/page/Assets/secondary/Camera'
import Validator_Info from './src/page/Staking/secondary/ValidatorInfo'
import Stake from './src/page/Staking/secondary/Stake'
import BondFunds from './src/page/Staking/secondary/BondFunds'
import Unbond from './src/page/Staking/secondary/Unbond'
import BondAdditional from './src/page/Staking/secondary/BondAdditional'
import SetSessionKey from './src/page/Staking/secondary/SetSessionKey'
import Nominate from './src/page/Staking/secondary/Nominate'
import Unstake from './src/page/Staking/secondary/Unstake'
import Unnominate from './src/page/Staking/secondary/Unnominate'
import Change_Password from './src/page/Profile/secondary/Change/ChangePassword'
import Change_Name from './src/page/Profile/secondary/Change/ChangeName'
import Vote from './src/page/Democracy/secondary/Vote'
import Settings from './src/page/Profile/secondary/Settings'
import Set_Node from './src/page/Profile/secondary/Settings/SetNode'
import About from './src/page/Profile/secondary/About'
import Gesture from './src/page/Profile/secondary/Settings/Gesture'
import { setJSExceptionHandler } from './src/util/error_guard'
// 获取store实例 | Get store instance
import AppState from './src/mobx/mobx'

const Polkawallet_App = StackNavigator({
  Tabbed_Navigation: {
    screen: Tabbed_Navigation,
    navigationOptions: { header: null }
  },
  Create_Account: { screen: Create_Account, navigationOptions: { header: null } },
  Backup_Account: { screen: Backup_Account, navigationOptions: { header: null } },
  QR_Code: { screen: QR_Code, navigationOptions: { header: null } },
  Coin_details: { screen: Coin_details, navigationOptions: { header: null } },
  Manage_Account: { screen: Manage_Account, navigationOptions: { header: null } },
  Transfer: { screen: Transfer, navigationOptions: { header: null } },
  Make_transfer: { screen: Make_transfer, navigationOptions: { header: null } },
  Transfer_details: {
    screen: Transfer_details,
    navigationOptions: { header: null }
  },
  Addresses: { screen: Addresses, navigationOptions: { header: null } },
  Add_address: { screen: Add_address, navigationOptions: { header: null } },
  Address_information: {
    screen: Address_information,
    navigationOptions: { header: null }
  },
  Camera: { screen: Camera, navigationOptions: { header: null } },
  Validator_Info: { screen: Validator_Info, navigationOptions: { header: null } },
  Stake: { screen: Stake, navigationOptions: { header: null } },
  BondFunds: { screen: BondFunds, navigationOptions: { header: null } },
  Unbond: { screen: Unbond, navigationOptions: { header: null } },
  BondAdditional: { screen: BondAdditional, navigationOptions: { header: null } },
  SetSessionKey: { screen: SetSessionKey, navigationOptions: { header: null } },
  Nominate: { screen: Nominate, navigationOptions: { header: null } },
  Unstake: { screen: Unstake, navigationOptions: { header: null } },
  Unnominate: { screen: Unnominate, navigationOptions: { header: null } },
  Change_Password: { screen: Change_Password, navigationOptions: { header: null } },
  Change_Name: { screen: Change_Name, navigationOptions: { header: null } },
  Vote: { screen: Vote, navigationOptions: { header: null } },
  Settings: { screen: Settings, navigationOptions: { header: null } },
  Set_Node: { screen: Set_Node, navigationOptions: { header: null } },
  About: { screen: About, navigationOptions: { header: null } },
  Gesture: { screen: Gesture, navigationOptions: { header: null } },
  MnemonicWord_1: { screen: MnemonicWord_1, navigationOptions: { header: null } },
  MnemonicWord_2: { screen: MnemonicWord_2, navigationOptions: { header: null } },
  MnemonicWord_3: { screen: MnemonicWord_3, navigationOptions: { header: null } }
})

setJSExceptionHandler(() => {}, true)

export default class Polkawallet extends Component {
  render() {
    return (
      <Provider rootStore={AppState}>
        <Polkawallet_App />
      </Provider>
    )
  }
}
