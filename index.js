/** @format */
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
