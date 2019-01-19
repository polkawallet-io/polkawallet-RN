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
  Clipboard
} from 'react-native';
import SInfo from 'react-native-sensitive-info';
import Keyring from '@polkadot/keyring'
const keyring = new Keyring();

let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;

export default class Manage_Account extends Component {
  constructor(props)
  {
    super(props)
    this.state={
      password:'',
      address:'5DYnksEZFc7kgtfyNM1xK2eBtW142gZ3Ho3NQubrF2S6B2fq',
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
    // Alert.alert(
    //   'Alert Title',
    //   'My Alert Msg',
    //   [
    //     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
    //     {text: 'OK', onPress: () => console.log('OK Pressed')},
    //   ],
    //   { cancelable: false }
    // )
    this.setState({
      isModal1:true
    })
    // SInfo.getItem(this.state.address,{sharedPreferencesName:'Polkawallet',keychainService: 'PolkawalletKey'}).then(
    //   (result)=>{
    //     loadPair = keyring.addFromJson(JSON.parse(result))
    //     // alert(loadPair.address())
    //     alert(result)
    //   }
    // )
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
        loadPair = keyring.addFromJson(JSON.parse(result))
        try{
          loadPair.decodePkcs8(this.state.password)
        }catch(error){
          alert(error)
        }
  
        // alert(this.state.password)
        loadPair.isLocked()?'':
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
    alert('Delete_Account')
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
        <View style={styles.title1}>
          <View style={styles.title2}>
              <Text style={styles.titletext}>Profile</Text>
          </View>
        </View>
          <View style={{height:ScreenHeight/4.5,backgroundColor:'#FF4081C7',alignItems:'center'}}>
              <View style={styles.head}>
                {/* head */}
                <Image
                  style={styles.image}
                  source={require('../../../images/Profile/accountIMG.png')}
                />
              </View>
              <View style={styles.adderss}>
                {/* address */}
                <Text 
                  style={{width:ScreenWidth*0.5,fontWeight:'200',fontSize:ScreenHeight/45,color:'white'}}
                  ellipsizeMode={"middle"}
                  numberOfLines={1}
                >{this.state.address}</Text>
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
                    style={styles.choose}
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
                    <Text style={[styles.textchoose,{borderRightWidth:0}]}>ok</Text>
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
                    style={styles.choose}
                    onPress={this.Continue}
                  >
                    <Text style={styles.textchoose}>Continue</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.choose}
                    onPress={this.Copy}
                  >
                    <Text style={[styles.textchoose,{borderRightWidth:0}]}>Copy</Text>
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
    borderRightWidth:1,
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