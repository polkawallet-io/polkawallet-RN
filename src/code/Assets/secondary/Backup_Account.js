import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Picker,
  Clipboard
} from 'react-native';
import Api from '@polkadot/api/promise';
import WsProvider from '@polkadot/rpc-provider/ws';
import {NavigationActions, StackActions} from "react-navigation";

let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
import { observer, inject } from "mobx-react";
@inject('rootStore')
@observer
export default class Polkawallet extends Component{
  constructor(props)
  {
    super(props)
    this.state={
        text:this.props.navigation.state.params.key,
        address:this.props.navigation.state.params.address
    }
    this.copy=this.copy.bind(this)
    this.Cancel=this.Cancel.bind(this)
    this.Continue=this.Continue.bind(this)
  }
  Cancel(){
    //创建查询每个账户的进程
    (async()=>{
      const api = await Api.create(new WsProvider(this.props.rootStore.stateStore.ENDPOINT));
      await api.query.balances.freeBalance(this.state.address,(balance)=>{
        let _address=this.state.address
        this.props.rootStore.stateStore.have=0
        this.props.rootStore.stateStore.balances.map((item,index)=>{
          if(item.address!=_address){}else{
            this.props.rootStore.stateStore.have=1
            this.props.rootStore.stateStore.balances[index].balance=balance
          }
        })
        if(this.props.rootStore.stateStore.have==0){this.props.rootStore.stateStore.balances.push({address:_address,balance:balance})}
      })
    })()
    this.props.navigation.navigate('Create_Account')
  }
  Continue(){
    //创建查询每个账户的进程
    (async()=>{
      const api = await Api.create(new WsProvider(this.props.rootStore.stateStore.ENDPOINT));
      await api.query.balances.freeBalance(this.state.address,(balance)=>{
        let _address=this.state.address
        this.props.rootStore.stateStore.have=0
        this.props.rootStore.stateStore.balances.map((item,index)=>{
          if(item.address!=_address){}else{
            this.props.rootStore.stateStore.have=1
            this.props.rootStore.stateStore.balances[index].balance=balance
          }
        })
        if(this.props.rootStore.stateStore.have==0){this.props.rootStore.stateStore.balances.push({address:_address,balance:balance})}
      })
    })()
    this.props.rootStore.stateStore.isvalidators=0
    this.props.rootStore.stateStore.StakingState=0
    let resetAction = StackActions.reset({
      index: 0,
      actions: [
          NavigationActions.navigate({ routeName: 'Tabbed_Navigation'})
      ]
    })
    this.props.navigation.dispatch(resetAction)
  }
  async copy(){
    alert('Copy success')
    Clipboard.setString(this.state.text);
  }
  
  render(){
      return(
        <View style={styles.container}>
          {/* 标题栏 */}
          <View style={styles.title}>
            <Text style={{fontSize:ScreenHeight/37,fontWeight:'bold',color:'#e6e6e6'}}>Backup Account</Text>
          </View>
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <View style={styles.Warning_View}>
                <Text style={styles.text}>Warning</Text>
                <Text style={{fontSize:ScreenWidth/33}}>
                  <Text>Before you continue,make sure you have properly backed up your seed in a safe place as</Text>
                  <Text style={{fontWeight:'bold'}}> It is needed ro restore your account.</Text>
                </Text>
                <View style={styles.textInput}>
                    {/* The key */}
                    <TextInput style = {styles.textInputStyle}
                        placeholder = {this.state.text}
                        placeholderTextColor = "black"
                        underlineColorAndroid="#ffffff00"
                        multiline={true}
                        // onChangeText = {this.onChangePh}
                    />
                    {/* copy */}
                    <TouchableOpacity
                      onPress={this.copy}
                    >
                      <Image 
                        style={styles.image}
                        source={require('../../../images/Assets/Create_Account/copy.png')}
                      />
                    </TouchableOpacity>
                </View>
                {/* Reset or Save */}
                <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                  <View style={{flexDirection:'row',height:ScreenHeight/20,width:ScreenWidth*0.5,alignItems:'center',justifyContent:'center'}}>
                    <TouchableOpacity style={[styles.chooseView,{backgroundColor:'#696969'}]}
                       onPress={this.Cancel}
                    >
                      <Text style={[styles.chooseText,{marginLeft:0}]}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.chooseView,{backgroundColor:'#FF4081',marginLeft:ScreenWidth/80}]}
                      onPress={this.Continue}
                    >
                      <Text style={styles.chooseText}>
                        Continue
                      </Text>
                    </TouchableOpacity>
                    <View style={{borderRadius:ScreenHeight/24/14*4,backgroundColor:'white',position:'absolute',height:ScreenHeight/24/7*4,width:ScreenHeight/24/7*4,alignItems:'center',justifyContent:'center'}}>
                      <Text style={{fontSize:ScreenHeight/70}}>
                        or
                      </Text>
                    </View>
                  </View>
                </View>

              </View>
          </View>
        </View>

      )
  } 
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'white'
    },
    title:{
        padding:ScreenHeight/50,
        height:ScreenHeight/9,
        backgroundColor:'#776f71',
        flexDirection:'row',
        alignItems:'flex-end',
        justifyContent:'center',
    },
    middle:{
        justifyContent:'center',
        alignItems:'center'
    },
    Warning_View:{
        height:ScreenHeight/3,
        width:ScreenWidth*0.97,
        borderWidth:2,
        borderRadius:ScreenHeight/70,
        borderColor:'#A9A9A9',
        paddingLeft:ScreenWidth/40,
    },
    text:{
        marginTop:ScreenHeight/40,
        marginBottom:ScreenHeight/70,
        fontSize:ScreenHeight/40,
        fontWeight:'500',
        color:'black',
    },
    textInput:{
        height:ScreenHeight/8,
        flexDirection:'row',
        alignItems:'center',
    },
    textInputStyle:{
        paddingVertical: 0,
        height:ScreenHeight/10,
        width:ScreenWidth*0.75,
        borderWidth:1,
        borderColor:'grey',
        borderRadius:ScreenHeight/100,
        paddingLeft:ScreenHeight/100,
        fontSize:ScreenHeight/40,
        paddingVertical: 0
    },
    image:{
        marginLeft:ScreenWidth*0.025,
        height:ScreenWidth*0.07,
        width:ScreenWidth*0.07,
        resizeMode:'contain'
    },
    chooseText:{
        marginLeft:ScreenWidth/80,
        fontWeight:'600',
        fontSize:ScreenWidth/30,
        color:'white'
    },
    chooseView:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        height:ScreenHeight/24,
        width:ScreenWidth*0.18
    }
    
})