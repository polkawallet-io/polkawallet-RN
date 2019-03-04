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
  Alert,
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
            New_name:'',
            Current_password:'',
            ispwd1:0,
            ispwd2:0
        }
        this.back=this.back.bind(this)
        this.Change_Name=this.Change_Name.bind(this)
        this.Change=this.Change.bind(this)  
        this.Current_password=this.Current_password.bind(this)

    }
  back(){
      this.props.navigation.navigate('Manage_Account')
  }
  Current_password(Current_password){
    if(Current_password!=''){
        this.setState({ispwd1:1})
    }
    if(Current_password==''){
        this.setState({ispwd1:0})
    }
    this.setState({
        Current_password:Current_password
      })
  }
  Change_Name(New_name){
      if(New_name!=''){
        this.setState({ispwd2:1})
      }
      if(New_name==''){
        this.setState({ispwd2:0})
      }
      this.setState({
        New_name:New_name
      })
  }
  Change(){

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
                loadPair.setMeta({'name':this.state.New_name})
                this.json = loadPair.toJson(this.state.Current_password)
                this.json.meta = loadPair.getMeta()
                SInfo.setItem(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address, JSON.stringify(this.json),{sharedPreferencesName:'Polkawallet',keychainService: 'PolkawalletKey'}); 
                this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].account=this.state.New_name
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
  componentWillMount(){
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
                source={require('../../../../images/Assets/Create_Account/back.png')}
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
            <View style={[styles.view]}>
                <Text style={[styles.text]}>Current password</Text>
                <TextInput style = {[styles.textInputStyle,{borderColor:this.state.ispwd1==0?'red':'#4169E1'}]}  
                    secureTextEntry={true}
                    autoCorrect={false}          
                    underlineColorAndroid="#ffffff00"
                    onChangeText ={this.Current_password}
                />
            </View>
            <View style={[styles.view]}>
                <Text style={[styles.text]}>New name</Text>
                <TextInput style = {[styles.textInputStyle,{borderColor:this.state.ispwd2==0?'red':'#4169E1'}]}  
                    autoCorrect={false}          
                    underlineColorAndroid="#ffffff00"
                    onChangeText ={this.Change_Name}
                />
            </View>
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
        backgroundColor:'#4dabd0',
        borderRadius:ScreenHeight/100,
        alignItems:'center',
        justifyContent:'center'
        
    }
})