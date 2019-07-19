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
/** @format */
import './shim'
import 'node-libs-react-native/globals'
import { AppRegistry } from 'react-native'
import Api from '@polkadot/api/promise'
import WsProvider from '@polkadot/rpc-provider/ws'
import App from './App'
import { name as appName } from './app.json'
import AppState from './src/mobx/mobx'

console.ignoredYellowBox = [
  'Warning: BackAndroid is deprecated. Please use BackHandler instead.',
  'source.uri should not be an empty string',
  'Invalid props.style key'
]

console.disableYellowBox = true
;(async () => {
  const provider = new WsProvider(AppState.stateStore.ENDPOINT)
  const api = await Api.create(provider)
  AppState.stateStore.API = api
})()
AppRegistry.registerComponent(appName, () => App)
