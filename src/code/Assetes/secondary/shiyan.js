import React, { Component } from 'react'; 
import {
    AppRegistry,
    StyleSheet,
    View,
    TextInput,
    Dimensions,
    Text,
    TouchableOpacity,
    Image,
  } from 'react-native';
  import WsProvider from '@polkadot/rpc-provider/ws';
  import Api from '@polkadot/api/promise';
  import SInfo from 'react-native-sensitive-info';
  import Keyring from '@polkadot/keyring'
  const keyring = new Keyring();

  const ENDPOINT = 'ws://127.0.0.1:9944/';

  let ScreenWidth = Dimensions.get("screen").width;
  let ScreenHeight = Dimensions.get("screen").height;
//   import { observer, inject } from "mobx-react";
//   @inject('rootStore')
//   @observer
  export default class Transfer extends Component{
//      
      componentWillMount(){
        (async()=>{
            const provider = new WsProvider(ENDPOINT);
            const api = await Api.create(provider);

            console.warn(api.tx.balances.transfer('5DYnksEZFc7kgtfyNM1xK2eBtW142gZ3Ho3NQubrF2S6B2fq',3000))

         })()
      }
      render(){
          return(
              <View>
                
              </View>
          )
      }
  }