import React, { Component } from 'react';
import {
    StyleSheet,
    Platform,
    Text,
    View,
    Alert,
    TouchableOpacity,
    Linking,  
} from "react-native";
import Api from '@polkadot/api/promise';
import WsProvider from '@polkadot/rpc-provider/ws';
import {
  isFirstTime,
  isRolledBack,
  packageVersion,
  currentVersion,
  checkUpdate,
  downloadUpdate,
  switchVersion,
  switchVersionLater,
  markSuccess,
} from 'react-native-update';


import _updateConfig from '../../../../update.json';
const {appKey} = _updateConfig[Platform.OS];
const ENDPOINT = 'wss://poc3-rpc.polkadot.io/';
export default class AppDelegate extends Component {
  constructor(props) {
      super(props);
      this.state = {
          balance:'0'
      }
      this.balance=this.balance.bind(this)
  }
  componentWillMount(){
    
    // checkUpdate(appKey).then(info => {
    //     alert(JSON.stringify(info))
    //     if (info.upToDate) {} else {
    //       Alert.alert('提示', '检查到新的版本'+info.name+',是否下载? \n'+ info.description, [
    //         {text: '是', onPress: ()=>{this.doUpdate(info)}},
    //         {text: '否',}, ]);
    //       }
    // }).catch(err => {
    //   Alert.alert('提示', '更新失败.'); 
    // });
        if(isFirstTime){
            Alert.alert(
                '提示', 
            '这是当前版本第一次启动,是否要模拟启动失败?失败将回滚到上一版本', 
            [
                {text: '是', onPress: ()=>{throw new Error('模拟启动失败,请 重启应用')}},
                {text: '否', onPress: ()=>{markSuccess()}}, 
            ]);
        }else if (isRolledBack) {
            Alert.alert('提示', '刚刚更新失败了,版本被回滚.');
        }
        this.balance()
  }
  balance(){
    (async()=>{
        const provider = new WsProvider(ENDPOINT);
        const api = await Api.create(provider);
        api.query.balances.freeBalance('5Dn8F1SUX6SoLt1BTfKEPL5VY9wMvG1A6tEJTSCHpLsinThm', (balance) => {
            this.setState({
              balance:String(balance)
            });
        });
    })()
  }
  doUpdate = info => {
    downloadUpdate(info).then(hash => {
    Alert.alert('提示', '下载完毕,是否重启应用?', [
            {text: '是', onPress: ()=>{switchVersion(hash);}},
            {text: '否',},
            {text: '下次启动时', onPress: ()=>{switchVersionLater(hash);}},
        ]);
    }).catch(err => {
        Alert.alert('提示', '更新失败.'); 
    });
  };
  checkUpdate = () => {
    checkUpdate(appKey).then(info => {
      if (info.expired) {
        Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
        {text: '确定', onPress: ()=>{info.downloadUrl && Linking.openURL(info.downloadUrl)}},
                ]);
              } else if (info.upToDate) {
        Alert.alert('提示', '您的应用版本已是最新.'); } else {
        Alert.alert('提示', '检查到新的版本'+info.name+',是否下载? \n'+ info.description, [
        {text: '是', onPress: ()=>{this.doUpdate(info)}},
        {text: '否',}, ]);
              }
            }).catch(err => {
                Alert.alert('提示', '更新失败.'); 
            });
  };

    
  render() {
      return (
        //   <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              
        //       <Text style={{fontSize:50}}>HotUpdate2</Text>
        //       <Text style={{fontSize:20}}>{appKey}</Text>
        //   </View>
        <View style={styles.container}>
          <Text style={styles.welcome}> 
            欢迎使用热更新服务
          </Text>
          <Text style={{fontSize:30}}>HotUpdate7</Text>
          <Text style={{fontSize:15}}>{'balance: '+this.state.balance}</Text>
          <Text style={styles.instructions}>
            这是版本三 {'\n'}
            当前包版本号: {packageVersion}{'\n'}
            当前版本Hash: {currentVersion||'(空)'}{'\n'}
          </Text>
          <TouchableOpacity onPress={this.checkUpdate}>
            <Text style={styles.instructions}> 
              点击这里检查更新
            </Text>
          </TouchableOpacity>
        </View>
      )
  }

}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
  }, welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
  },
});