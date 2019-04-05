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
    Modal,
    Alert,
  } from 'react-native';
  import WsProvider from '@polkadot/rpc-provider/ws';
  import Api from '@polkadot/api/promise';
  import SInfo from 'react-native-sensitive-info';
  import Keyring from '@polkadot/keyring'
  const keyring = new Keyring();


  let ScreenWidth = Dimensions.get("screen").width;
  let ScreenHeight = Dimensions.get("screen").height;
  import { observer, inject } from "mobx-react";
import { set } from 'mobx';
  @inject('rootStore')
  @observer
  export default class Transfer extends Component{
      constructor(props){
          super(props)
          this.state={
            ispwd:true,
            address:'',
            password:'',
            isModal:false,
            onlyone:0,
            type:'pending...'
          }
          this.lookpwd=this.lookpwd.bind(this)
          this.onChangepassword=this.onChangepassword.bind(this)
          this.onChangeAddress=this.onChangeAddress.bind(this)
          this.Cancel=this.Cancel.bind(this)
          this.Nominate=this.Nominate.bind(this)
      }   
      lookpwd()
      {
          this.setState({
              ispwd:!this.state.ispwd
          })
      }
      onChangeAddress(ChangeAddress){
          this.setState({
              address:ChangeAddress
          })
      }
      onChangepassword(Changepassword){
          this.setState({
              password:Changepassword
          })
      }
      Cancel(){
        this.props.navigation.navigate('Tabbed_Navigation')
      }
      componentWillMount(){

      }
      Nominate(){
        //   alert(this.state.address+','+this.state.password)
        this.setState({
            onlyone:1,
            isModal:true
        })
        SInfo.getItem(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address,{sharedPreferencesName:'Polkawallet',keychainService: 'PolkawalletKey'}).then(
            (result)=>{
              loadPair = keyring.addFromJson(JSON.parse(result))
              try{
                loadPair.decodePkcs8(this.state.password)
              }catch(error){
                Alert.alert(
                    'Alert',
                    'Password mistake.',
                    [
                      {text: 'OK', onPress: () => {
                        this.setState({
                            onlyone:0,
                            isModal:false
                        })
                      }},
                    ],
                    { cancelable: false }
                )
              }
              loadPair.isLocked()?'':
               (async()=>{
                  const provider = new WsProvider(this.props.rootStore.stateStore.ENDPOINT);
                  const api = await Api.create(provider);
                  nominating = await api.query.staking.nominating(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address)
                  intentions = await api.query.staking.intentions()
                  stakeIndex = intentions.indexOf(String(nominating))
                  await api.tx.staking.unnominate(stakeIndex).signAndSend(loadPair,({ status, type }) => {
                    //   console.warn(type)
                        this.setState({
                            type:type
                        })
                        if(status.isFinalized){
                            setTimeout(() => {
                                Alert.alert(
                                    'Alert',
                                    'Nominate success',
                                    [
                                      {text: 'OK', onPress: () => {
                                            this.props.rootStore.stateStore.StakingState=0
                                            this.setState({
                                                isModal:false
                                            })
                                            this.props.navigation.navigate('Tabbed_Navigation')
                                      }},
                                    ],
                                    { cancelable: false }
                                )
                            }, 500);
                        }
                  })
               })()
            }
        )
      }
      
      render(){
          return(
              <View style={styles.container}>
                {/* 标题栏 */}
                <View style={styles.title}>
                    <Text style={styles.text_title}>Unnominate</Text>
                </View>
                <View style={styles.nominate_view}>
                  <Text style={styles.title_b}>staking.unnominate</Text>
                  <Text style={{fontSize:ScreenWidth/25,color:'black',marginTop:ScreenHeight/50}}>
                    Will panic if called when source isn't currently nominating target. Updates Nominating, NominatorsFor and NominationBalance.
                  </Text>
                  
                  {/* password */}
                  <View style={[styles.NandP,{marginTop:ScreenHeight/30}]}>
                    <View style={{flexDirection:'row',width:ScreenWidth*0.65}}>
                        <Text style={{fontSize:ScreenWidth/26,color:'#696969'}}>unlock account using password</Text>
                        <View style={{flex:1}}/>
                    </View>
                    <View style={{flexDirection:'row',marginTop:ScreenHeight/70,alignItems:'center'}}>
                        <TextInput style = {[styles.textInputStyle,{fontSize:ScreenHeight/50,borderTopRightRadius:0,borderBottomRightRadius:0}]}
                            placeholder = ''
                            placeholderTextColor = "#666666"
                            underlineColorAndroid="#ffffff00"
                            secureTextEntry={this.state.ispwd}
                            onChangeText = {this.onChangepassword}
                        />
                        <TouchableOpacity 
                          style={[styles.eye,{borderTopRightRadius:ScreenHeight/200,borderBottomRightRadius:ScreenHeight/200}]}
                          onPress={this.lookpwd}
                        >
                          <Image
                            style={styles.image}
                            source={require('../../../images/Assets/transfer/eye.png')}
                          />
                        </TouchableOpacity>
                    </View>
                  </View>

                  {/* Cancel or nominate */}
                  <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                    <View style={{marginRight:ScreenWidth*0.08-ScreenWidth/40,flexDirection:'row',height:ScreenHeight/20,width:ScreenWidth*0.7,alignItems:'center',justifyContent:'flex-end'}}>
                     <View style={{alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
                      <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#FF4081',height:ScreenHeight/20,width:ScreenWidth*0.25}}
                        onPress={this.Cancel}
                        >
                        
                          <Text style={{fontWeight:'500',fontSize:ScreenWidth/28,color:'white'}}>
                            Cancel
                          </Text>
                      </TouchableOpacity>
                      {this.state.onlyone==0?
                        <TouchableOpacity 
                            style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#97BEC7',marginLeft:ScreenWidth/100,height:ScreenHeight/20,width:ScreenWidth*0.25}}
                            onPress={this.Nominate}
                        >
                        
                            <Text style={{fontWeight:'500',fontSize:ScreenWidth/28,color:'white'}}>
                              Unnominate
                            </Text>
                        </TouchableOpacity>
                        :
                        <View 
                            style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#97BEC7',marginLeft:ScreenWidth/100,height:ScreenHeight/20,width:ScreenWidth*0.25}}
                        >
                        
                            <Text style={{fontWeight:'500',fontSize:ScreenWidth/28,color:'white'}}>
                              Unnominate
                            </Text>
                        </View>
                      }
                      <View style={{borderRadius:ScreenHeight/24/14*4,backgroundColor:'white',position:'absolute',height:ScreenHeight/24/7*4,width:ScreenHeight/24/7*4,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:ScreenHeight/60}}>
                            or
                        </Text>
                      </View>
                     </View>
                    </View>
                  </View>
                  <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.isModal}
                  >
                    <View style={{flex:1,alignItems:'flex-end'}}>
                      <View style={{borderRadius:ScreenHeight/100,marginTop:ScreenHeight/5.2,marginRight:ScreenWidth*0.06,width:ScreenWidth*0.3,height:ScreenHeight/20,backgroundColor:'#8bc34a',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'white',fontSize:ScreenWidth/25,fontWeight:'bold'}}>{this.state.type}</Text>
                      </View>
                    </View>
                  </Modal>
                </View>
              </View>
          )
      }
  }
  const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white',
    },
    title:{
        padding:ScreenHeight/50,
        height:ScreenHeight/9,
        flexDirection:'row',
        alignItems:'flex-end',
        justifyContent:'center',
        backgroundColor:'#776f71'
    },
    text_title:{
        fontSize:ScreenHeight/37,
        fontWeight:'bold',
        color:'#e6e6e6'
    },
    nominate_view:{
        marginTop:ScreenHeight/15,
        alignSelf:'center',
        height:ScreenHeight/2,
        borderWidth:1,
        width:ScreenWidth*0.98,
        borderRadius:ScreenHeight/100,
        borderColor:'grey',
        paddingLeft:ScreenWidth/40,
    },
    title_b:{
        color:'black',
        fontSize:ScreenHeight/40,
        marginTop:ScreenHeight/50,
        fontWeight:'500'
    },
    grey_text:{
        backgroundColor:'#F0EFEF',
        height:ScreenHeight/25,
        justifyContent:'center',
        alignItems:'center'
    },
    grey_t:{
        marginHorizontal:ScreenWidth*0.02,
        color:'black',
        fontSize:ScreenHeight/50,
        fontWeight:'500'
    },
    textInputStyle:{
        paddingVertical: 0,
        height:ScreenHeight/23,
        width:ScreenWidth*0.65,
        borderWidth:1,
        borderColor:'#97BEC7',
        borderRadius:ScreenHeight/200,
        paddingLeft:ScreenHeight/100,
    },
    image:{
        height:ScreenHeight/38,
        width:ScreenHeight/38,
        resizeMode:'contain',
    },
    eye:{
        height:ScreenHeight/23,
        width:ScreenHeight/23,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#97BEC7'
    }
    
})