import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Clipboard,
} from 'react-native';
import Identicon from 'polkadot-identicon-react-native';
import SInfo from 'react-native-sensitive-info';
import Keyring from '@polkadot/keyring'
const keyring = new Keyring();

let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
import { observer, inject } from "mobx-react";
@inject('rootStore')
@observer
export default class Manage_Account extends Component {
  constructor(props)
  {
    super(props)
    this.state={
      password:'',
      address:this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address,
      isModal1:false,
      isModal2:false,
      msg:'',
    }
    this.ExportKey=this.ExportKey.bind(this)
    this.onChangepassword=this.onChangepassword.bind(this)
    this.cancel=this.cancel.bind(this)
    this.delete_account=this.delete_account.bind(this)
    this.Continue=this.Continue.bind(this)
    this.Copy=this.Copy.bind(this)
  }
  ExportKey(){
    this.setState({
      isModal1:true
    })
  }
  onChangepassword(changepassword){
    this.setState({
      password:changepassword
    })
  }
  cancel(){
    this.setState({
      password:'',
      isModal1:false
    })
  }
  ok(){
    SInfo.getItem(this.state.address,{sharedPreferencesName:'Polkawallet',keychainService: 'PolkawalletKey'}).then(
      (result)=>{
        // alert(result)
        loadPair = keyring.addFromJson(JSON.parse(result))
        try{
          loadPair.decodePkcs8(this.state.password)
        }catch(error){
          alert(error)
        }
  
        loadPair.isLocked()?console.log('error'):
        this.setState({
          isModal1:false,
          isModal2:true
        })
      }
    )
    
  }
  Continue(){
    this.setState({
      password:'',
      isModal2:false
    })
  }
  async Copy(){
    Clipboard.setString(this.state.msg);
    alert('Copy success')
  }
  delete_account(){
    Alert.alert(
      'Alert',
      'Confirm deleting this account ？',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => {
          SInfo.deleteItem(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address,{sharedPreferencesName:'Polkawallet',keychainService: 'PolkawalletKey'}).then(
            Alert.alert(
              'Alert',
              'Delete the success',
              [
                {text: 'OK', onPress: () => {
                  this.props.rootStore.stateStore.Account=1
                  SInfo.getAllItems({sharedPreferencesName:'Polkawallet',keychainService: 'PolkawalletKey'}).then(
                    (result)=>{
                      if(JSON.stringify(result).length<10 )
                      {
                        this.props.rootStore.stateStore.Account=0
                        this.props.rootStore.stateStore.Accountnum=0
                        this.props.navigation.navigate('Create_Account')
                      }else{                        
                        this.props.rootStore.stateStore.Account=0
                        this.props.rootStore.stateStore.Accountnum=0
                        this.props.rootStore.stateStore.Accounts=[{account:'AliceAccount',address:'5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ'}]
                      
                        // this.props.rootStore.stateStore.isfirst=1
                        result.map((item,index)=>{
                          item.map((item,index)=>{
                            // alert(item.key)//地址
                            // alert(JSON.parse(item.value).meta.name)//用户名
                            // 添加用户到mobx
                            this.props.rootStore.stateStore.Accounts.push({account:JSON.parse(item.value).meta.name,address:item.key})
                            this.props.rootStore.stateStore.Account=1
                            this.props.rootStore.stateStore.Accountnum++
                            
                            
                          })
                        })
                        this.props.navigation.navigate('Tabbed_Navigation')
                      }
                    }
                  )
                }},
              ],
              { cancelable: false }
            )
          )
        }},
      ],
      { cancelable: false }
    )
  }
  componentWillMount(){
    SInfo.getItem(this.state.address,{sharedPreferencesName:'Polkawallet',keychainService: 'PolkawalletKey'}).then(
        (result)=>{
          loadPair = keyring.addFromJson(JSON.parse(result))
          this.setState({
            msg:result
          })          
        }
      )
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:'#F5F5F5',}}>
        {/* The title */}
        <View style={styles.title}>
          <TouchableOpacity
            onPress={()=>{
              this.props.navigation.navigate('Tabbed_Navigation')
            }}
          >
            <Image
              style={{height:ScreenHeight/33.35,width:ScreenHeight/33.35,resizeMode:'contain'}}
              source={require('../../../images/Assetes/Create_Account/back.png')}
              />
          </TouchableOpacity>
          <Text style={styles.text_title}>Manage Account</Text>
          <View style={{height:ScreenHeight/33.35,width:ScreenHeight/33.35}}/>
    
        </View>
          <View style={{height:ScreenHeight/4.5,backgroundColor:'#FF4081C7',alignItems:'center'}}>
              <View style={styles.head}>
                {/* head */}
                <Identicon
                  value={this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.isfirst==0?0:this.props.rootStore.stateStore.Account].address}
                  size={ScreenHeight/14}
                  theme={'polkadot'}
                />
              </View>
              <View style={styles.adderss}>
                {/* address */}
                <Text 
                  style={{width:ScreenWidth*0.5,fontWeight:'200',fontSize:ScreenHeight/45,color:'white'}}
                  ellipsizeMode={"middle"}
                  numberOfLines={1}
                >
                  {this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address}
                </Text>
              </View>
          </View>
          {/* Export Keystore */}
          <View style={{alignItems:'center'}}>
            <TouchableOpacity
                  style={styles.export}
                  onPress={this.ExportKey}
                >
                  <Text style={{marginLeft:ScreenWidth/50,fontSize:ScreenHeight/40}}>Export Keystore</Text>
                  <View style={{flex:1}}/>
                  <Image
                    style={styles.next}
                    source={require('../../../images/Profile/next.png')}
                  />
            </TouchableOpacity>
          </View>
          <View style={{flex:1}}/>
          {/* delete account */}
          <View style={{}}>
            <TouchableOpacity
                  style={styles.delete}
                  onPress={this.delete_account}
                >
                  <Text style={{fontSize:ScreenHeight/40,fontWeight:'700',color:'white'}}>Delete Account</Text>
            </TouchableOpacity>
          </View>
          {/* Please enter your password */}
          <Modal
            animationType={'fade'}
            transparent={true}
            visible={this.state.isModal1}
          >
            <View style={styles.modal}>
              <View style={styles.chooseview}>
                <Text style={styles.prompt}>Please enter your password to unlock</Text>
                <TextInput style = {[styles.textInputStyle,{borderColor:(this.state.password=='')?'red':'#4169E1'}]}
                  autoCapitalize={'none'}
                  placeholder = "Please enter your password"
                  placeholderTextColor = "#DC143CA5"
                  underlineColorAndroid="#ffffff00"
                  secureTextEntry={true}
                  onChangeText = {this.onChangepassword}
                  
                />
                <View style={{flex:1}}/>
                <View style={styles.yorn}>
                  <TouchableOpacity 
                    style={[styles.choose,{borderRightWidth:1}]}
                    onPress={this.cancel}
                  >
                    <Text style={styles.textchoose}>cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.choose}
                    onPress={()=>{
                      (this.state.password=='')?alert('Please enter your password'):this.ok()
                    }}
                  >
                    <Text style={styles.textchoose}>ok</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {/* Please save your information */}
          <Modal
            animationType={'fade'}
            transparent={true}
            visible={this.state.isModal2}
          >
            <View style={styles.modal}>
              <View style={[styles.chooseview,{height:ScreenHeight/2}]}>
                <Text style={styles.prompt}>Please save your information</Text>
                <Text 
                  style={{marginTop:ScreenHeight/30,width:ScreenWidth*0.7,fontSize:ScreenHeight/50}}
                  selectable={true}
                >
                  {this.state.msg}
                </Text>
                <View style={{flex:1}}/>
                <View style={styles.yorn}>
                  <TouchableOpacity 
                    style={[styles.choose,{borderRightWidth:1}]}
                    onPress={this.Continue}
                  >
                    <Text style={styles.textchoose}>Continue</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.choose}
                    onPress={this.Copy}
                  >
                    <Text style={styles.textchoose}>Copy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  title:{
    padding:ScreenHeight/50,
    height:ScreenHeight/9,
    backgroundColor:'#776f71',
    flexDirection:'row',
    alignItems:'flex-end',
    justifyContent:'space-between'
  },
  text_title:{
    fontSize:ScreenHeight/37,
    fontWeight:'bold',
    color:'#e6e6e6'
  },
  title1:{
    height:ScreenHeight/9,
    backgroundColor:'#776f71',
    flexDirection:'row',
    alignItems:'flex-end'
  },
  title2:{
    height:ScreenHeight/10.6/1.6,
    flex:1,
    justifyContent:'flex-end',
    alignItems:'center'
  },
  titletext:{
    marginBottom:ScreenHeight/50,
    fontSize:ScreenHeight/37,
    fontWeight:'bold',
    color:'white'
  },
  head:{
    marginTop:ScreenHeight/55,
    width:ScreenWidth,
    height:ScreenHeight/3.81/2.5,
    alignItems:'center',
    justifyContent:'center'
  },
  image:{
    marginTop:ScreenHeight/30,
    backgroundColor:'white',
    borderRadius:ScreenHeight/28,
    height:ScreenHeight/14,
    width:ScreenHeight/14,
    resizeMode:'contain'
  },
  adderss:{
    marginTop:ScreenHeight/50,
    height:ScreenHeight/3.81/6,
    width:ScreenWidth,
    alignItems:'center',
    justifyContent:'center'
  },
  export:{
    width:ScreenWidth*0.95,
    backgroundColor:'white',
    marginTop:ScreenHeight/35,
    flexDirection:'row',
    alignItems:'center',
    height:ScreenHeight/13,
    borderWidth:0.5,
    borderColor:'#C0C0C0',
    borderRadius:ScreenHeight/100,
    marginHorizontal:1,
    borderBottomWidth:1
  },
  delete:{
    height:ScreenHeight/13,
    width:ScreenWidth,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'red',
    borderRadius:ScreenHeight/100,
  },
  next:{
    marginRight:ScreenWidth/28,
    height:ScreenHeight/60,
    width:ScreenHeight/60/1.83,
    resizeMode:'cover'
  },
  modal:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#00000066'
  },
  chooseview:{
    alignItems:'center',
    height:ScreenHeight/4,
    width:ScreenWidth*0.8,
    backgroundColor:'white',
    borderRadius:ScreenHeight/35
  },
  prompt:{
    marginTop:ScreenHeight/35,
    fontSize:ScreenWidth/25,
    fontWeight:'500',
    color:'black'
  },
  textInputStyle:{
    height:ScreenHeight/18,
    width:ScreenWidth*0.6,
    borderWidth:1,
    fontSize:ScreenHeight/45,
    borderRadius:ScreenHeight/100,
    paddingLeft:ScreenHeight/100,
    marginTop:ScreenHeight/30,
    
  },
  choose:{
    height:ScreenHeight/20,
    width:ScreenWidth*0.4-1,
    borderTopWidth:1,
    borderColor:'#DCDCDC',
    justifyContent:'center',
    alignItems:'center'
  },
  yorn:{
    width:ScreenWidth*0.8,
    alignItems:'center',
    height:ScreenHeight/15,
    flexDirection:'row',
    justifyContent:'space-around'
  },
  textchoose:{
    fontSize:ScreenWidth/20,
    color:'#4169E1'
  }
})