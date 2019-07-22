/** @format */
import 'node-libs-react-native/globals'
import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'

console.ignoredYellowBox = [
  'Warning: BackAndroid is deprecated. Please use BackHandler instead.',
  'source.uri should not be an empty string',
  'Invalid props.style key'
]

console.disableYellowBox = true
if (!__DEV__) {
  global.console = {
    info: () => {},
    log: () => {},
    warn: () => {},
    debug: () => {},
    error: () => {}
  }
}
AppRegistry.registerComponent(appName, () => App)
