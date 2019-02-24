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
        }
        this.back=this.back.bind(this)
        this.save=this.save.bind(this)
        this.Change_Name=this.Change_Name.bind(this)
        this.Change=this.Change.bind(this)  

    }
  back(){
      this.props.navigation.navigate('Manage_Account')
  }
  Change_Name(New_name){
      this.setState({
        New_name:New_name
      })
  }
  Change(){
    SInfo.getItem(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address,{sharedPreferencesName:'Polkawallet',keychainService: 'PolkawalletKey'}).then(
        (result)=>{
            // alert(result)
            loadPair = keyring.addFromJson(JSON.parse(result))
            loadPair.setMeta({'name':this.state.New_name})
            // this.json = loadPair.toJson()
            // this.json.meta = loadPair.getMeta()
            // alert(JSON.stringify(this.json))
            // this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].account = this.state.New_name
            // JSON.parse(change).setMeta({'name':this.state.New_name})
            // JSON.parse(change).meta.name = '111'
            // alert(JSON.parse(change).meta.name)
            // // alert(change)
        })
    // SInfo.setItem('k1','v1',{sharedPreferencesName:'sy',keychainService: 'sy'})
    // SInfo.setItem('k2','v2',{sharedPreferencesName:'sy',keychainService: 'sy'})
    // SInfo.setItem('k3','v3',{sharedPreferencesName:'sy',keychainService: 'sy'})
    // SInfo.setItem('k2','v4',{sharedPreferencesName:'sy',keychainService: 'sy'})
    // SInfo.getAllItems({sharedPreferencesName:'sy',keychainService:'sy'}).then(
    //     (result) => {
    //       alert(JSON.stringify(result))
    //     }
    // );
  }
  componentWillMount(){
    // let key = mnemonicGenerate()
    // this.pair = keyring.addFromMnemonic(key)
  }
  save(){
      AsyncStorage.getItem('Addresses').then(
          (result)=>{
              if(result==null)
              {
                AsyncStorage.setItem('Addresses',JSON.stringify([{Name:this.state.name,Memo:this.state.memo,Address:this.state.address}])).then(
                    alert('Save success')
                )
              }else{
                  if(this.state.address==''&&this.props.rootStore.stateStore.iscamera==0)
                  {
                      alert('The address cannot be empty')
                  }else{
                    a=JSON.parse(result)
                    a.push({Name:this.state.name,Memo:this.state.memo,Address:(this.props.rootStore.stateStore.iscamera==0)?this.state.address:this.props.rootStore.stateStore.QRaddress})
                    AsyncStorage.setItem('Addresses',JSON.stringify(a)).then(()=>{
                      this.props.rootStore.stateStore.iscamera=0
                      this.props.navigation.navigate('Tabbed_Navigation')}
                    )
                  }
              }
          }
      )
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
          {
              
                    <View style={[styles.view]}>
                        <Text style={[styles.text]}>New name</Text>
                        <TextInput style = {[styles.textInputStyle]}  
                            autoCorrect={false}          
                            underlineColorAndroid="#ffffff00"
                            onChangeText ={this.Change_Name}
                        />
                    </View>
             
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