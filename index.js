/** @format */
import 'node-libs-react-native/globals';
import {AppRegistry} from 'react-native';
import App from './App';
import Shiyan from './src/code/Assetes/secondary/shiyan'
import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent(appName, () => Shiyan);

