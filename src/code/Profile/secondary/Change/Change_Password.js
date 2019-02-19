import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  AsyncStorage,
  Alert
} from 'react-native';
import SInfo from 'react-native-sensitive-info';
import Keyring from '@polkadot/keyring'
const keyring = new Keyring();

let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
import { observer, inject } from "mobx-react";
const msg=['Current password','New password','Reprat password']
@inject('rootStore')
@observer
export default class New extends Component {
  constructor(props)
    {
        super(props)
        this.json
        this.state = {
            Current_password:'',
            New_password:'',
            Reprat_password:'',
        }
        this.back=this.back.bind(this)
        this.Current_password=this.Current_password.bind(this)
        this.New_password=this.New_password.bind(this)
        this.Reprat_password=this.Reprat_password.bind(this) 
        this.Change=this.Change.bind(this)    
    }
  back(){
      this.props.navigation.navigate('Manage_Account')
  }
  Current_password(Current_password){
      this.setState({
        Current_password:Current_password
      })
  }
  New_password(New_password){
    this.setState({
        New_password:New_password
    })
  }
  Reprat_password(Reprat_password){
    this.setState({
        Reprat_password:Reprat_password
    })
  }
  Change(){
    if(this.state.New_password != this.state.Reprat_password){
        alert('The two passwords are different')
    }else{
        SInfo.getItem(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address,{sharedPreferencesName:'Polkawallet',keychainService: 'PolkawalletKey'}).then(
            (result)=>{
                loadPair = keyring.addFromJson(JSON.parse(result))
                try{
                    loadPair.decodePkcs8(this.state.Current_password)
                }catch(error){
                    Alert.alert(
                        'Alert',
                        'Password mistake.',
                        [
                        {text: 'OK', onPress: () => {
                        }},
                        ],
                        { cancelable: false }
                    )
                }
                loadPair.isLocked()?'':
                    this.json = loadPair.toJson(this.state.New_password)
                    SInfo.setItem(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address, JSON.stringify(this.json),{sharedPreferencesName:'Polkawallet',keychainService: 'PolkawalletKey'}); 
                    Alert.alert(
                        'Alert',
                        'Modify the success.',
                        [
                        {text: 'OK', onPress: () => {
                            this.props.navigation.navigate('Manage_Account')
                        }},
                        ],
                        { cancelable: false }
                    ) 
            })
    }
  }
  
  
  render() {
    return (
      <View style={{flex:1,backgroundColor:'white',}}>
        {/* 标题栏 */}
        <View style={styles.title}>
            {/* 返回 */}
            <TouchableOpacity
                style={{flexDirection:'row'}}
                onPress={this.back}
            >
                <Image
                style={styles.image_title}
                source={require('../../../../images/Assetes/Create_Account/back.png')}
                />
                <View style={{width:ScreenWidth*0.0}}/>
            </TouchableOpacity>
            {/* 标题 */}
            <Text style={styles.text_title}>Addresses</Text>
            {/* 保存 */}
            <TouchableOpacity
              style={styles.save_touch}
              onPress={this.save}
            >
                {/* <Text style={styles.save_text}>Save</Text> */}
            </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          behavior="padding"
        >
          {
              msg.map((item,index)=>{
                  return(
                    <View style={[styles.view]} key={index}>
                        <Text style={[styles.text]}>{item}</Text>
                        {
                                <TextInput style = {[styles.textInputStyle]}  
                                  autoCorrect={false}          
                                  underlineColorAndroid="#ffffff00"
                                  onChangeText = {(index==0)?this.Current_password:(index==1)?this.New_password:this.Reprat_password}
                                />
                        }
                    </View>
                  )
              })
          }
        </KeyboardAvoidingView>
        <TouchableOpacity
          style={styles.Change}
          onPress={this.Change}
        >
          <Text style={{color:'white',fontSize:ScreenWidth/23,fontWeight:'bold'}}>Change</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
    title:{
        padding:ScreenHeight/50,
        height:ScreenHeight/9,
        flexDirection:'row',
        alignItems:'flex-end',
        justifyContent:'space-between',
        backgroundColor:'#776f71'
    },
    text_title:{
        fontSize:ScreenHeight/37,
        fontWeight:'bold',
        color:'#e6e6e6'
    },
    image_title:{
        height:ScreenHeight/33.35,
        width:ScreenHeight/33.35,
        resizeMode:'contain'
    },
    save_touch:{
        width:ScreenHeight/33.35+ScreenWidth*0.06,
        justifyContent:'center',
        alignItems:'center',
    },
    save_text:{
        color:'white',
        fontSize:ScreenWidth/28,
    },
    view:{
        alignItems:'center',
        justifyContent:'center',
        height:ScreenHeight/8,
    },
    text:{
        fontSize:ScreenWidth/25,
        width:ScreenWidth*0.8,
        color:'#696969',
        fontWeight:'400'
    },
    textInputStyle:{
        paddingVertical: 0,
        marginTop:ScreenHeight/70,
        color:'#696969',
        height:ScreenHeight/24,
        width:ScreenWidth*0.8,
        borderWidth:1,
        borderColor:'red',
        fontSize:ScreenHeight/45,
        borderRadius:ScreenHeight/150,
        paddingLeft:ScreenHeight/100,
        paddingVertical: 0
    },
    inputview:{
        marginTop:ScreenHeight/70,
        flexDirection:'row',
        alignItems:'center'
    },
    inputimage:{
        marginLeft:ScreenWidth*0.02,
        height:ScreenWidth*0.04,
        width:ScreenWidth*0.04,
        resizeMode:'contain'
    },
    Change:{
        alignSelf:'center',
        height:ScreenHeight/17,
        width:ScreenWidth*0.8,
        marginTop:ScreenHeight/30,
        backgroundColor:'#40E0D0',
        borderRadius:ScreenHeight/100,
        alignItems:'center',
        justifyContent:'center'
        
    }
})