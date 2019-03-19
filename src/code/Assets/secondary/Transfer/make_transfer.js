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
            password:'',
            isModal:false,
            accountNonce:'',
            onlyone:0,
            type:'pending...'
          }
          this.lookpwd=this.lookpwd.bind(this)
          this.onChangepasswore=this.onChangepasswore.bind(this)
          this.Cancel=this.Cancel.bind(this)
          this.Sign_and_Submit=this.Sign_and_Submit.bind(this)
      }   
      lookpwd()
      {
          this.setState({
              ispwd:!this.state.ispwd
          })
      }
      onChangepasswore(Changepasswore){
          this.setState({
              password:Changepasswore
          })
      }
      Cancel(){
        this.props.rootStore.stateStore.t_address=''
        this.props.navigation.navigate('Transfer')
      }
      componentWillMount(){
        (async()=>{
            const provider = new WsProvider(this.props.rootStore.stateStore.ENDPOINT);
            const api = await Api.create(provider);
            const accountNonce = await api.query.system.accountNonce(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address)
                this.setState({
                    accountNonce:JSON.stringify(accountNonce)
                });
           
        })()
        
        
      }
      Sign_and_Submit(){
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
                //   setTimeout(()=>{
                //     if(this.state.type=='pending...'){
                //         Alert.alert(
                //             '',
                //             'Long time no response, please try again.',
                //             [
                //                 {text:'OK',onPress:()=>{
                //                     this.props.rootStore.stateStore.t_address=''
                //                     this.props.navigation.navigate('Transfer')
                //                     this.setState({
                //                         isModal:false
                //                     })
                //                 }}
                //             ],
                //             { cancelable: false }
                //         )
                //     }
                //   },30000)
                  const provider = new WsProvider(this.props.rootStore.stateStore.ENDPOINT);
                  const api = await Api.create(provider);
                  const accountNonce = await api.query.system.accountNonce(loadPair.address());
                  // Do the transfer and track the actual status
                  api.tx.balances
                  .transfer(this.props.rootStore.stateStore.inaddress, this.props.rootStore.stateStore.value)
                //   .transfer('5DYnksEZFc7kgtfyNM1xK2eBtW142gZ3Ho3NQubrF2S6B2fq', this.props.rootStore.stateStore.value)
                  .sign(loadPair, accountNonce)
                  .send(({ status, type }) => {
                      this.setState({
                          type:type
                      })
                    if (type === 'Ready'||type==='Broadcast') {
                       
                    }else{
                        if (type === 'Finalised') {
                        this.setState({
                            isModal:false
                        })
                        setTimeout(() => {
                            Alert.alert(
                                'Alert',
                                'Transfer success',
                                [
                                  {text: 'OK', onPress: () => {
                                        //清除缓存
                                        let REQUEST_URL = 'http://107.173.250.124:8080/tx_list_for_redis'
                                        let map = {
                                            method:'POST'
                                            }
                                            let privateHeaders = {
                                            'Content-Type':'application/json'
                                            }
                                            map.headers = privateHeaders;
                                            map.follow = 20;
                                            map.timeout = 0;
                                            map.body = '{"user_address":"'+this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address+'","pageNum":"1","pageSize":"10"}';
                                            fetch(REQUEST_URL,map).then().catch()
                                        //获取网络订单
                                        REQUEST_URL = 'http://107.173.250.124:8080/tx_list'
                                        map = {
                                            method:'POST'
                                            }
                                            privateHeaders = {
                                            'Content-Type':'application/json'
                                            }
                                            map.headers = privateHeaders;
                                            map.follow = 20;
                                            map.timeout = 0;
                                            map.body = '{"user_address":"'+this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address+'","pageNum":"1","pageSize":"10"}';
                                            fetch(REQUEST_URL,map).then(
                                            (result)=>{
                                                this.props.rootStore.stateStore.hasNextPage=JSON.parse(result._bodyInit).hasNextPage
                                                this.props.rootStore.stateStore.transactions=JSON.parse(result._bodyInit)
                                            }
                                            ).catch()
                                      this.props.navigation.navigate('Coin_details')
                                  }},
                                ],
                                { cancelable: false }
                            )
                        }, 500);
                        
                        // process.exit(0);
                    // console.log('Completed at block hash', status.value.toHex());
                    }else{
                        this.setState({
                            isModal:false
                        })
                        setTimeout(()=>{
                            alert('Transfer Failed!')
                        },500)
                        
                    }
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
                    <Text style={styles.text_title}>Transfer DOT</Text>
                </View>
                <View style={styles.submit_view}>
                  <Text style={styles.title_b}>Submit Transaction</Text>
                  <Text style={{fontSize:ScreenWidth/25,color:'black',marginTop:ScreenHeight/50}}>
                    You are about to sign a message from 
                  </Text>
                  <View style={[styles.grey_text,{marginTop:ScreenHeight/100,width:ScreenWidth*0.8}]}>
                    {/* address */}
                    <Text 
                      style={{fontSize:ScreenHeight/55,fontWeight:'500',width:ScreenWidth*0.76}}
                      ellipsizeMode={"middle"}
                      numberOfLines={1}
                    >
                      {this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address}
                    </Text>
                  </View>
                  <View style={{height:ScreenHeight/25,flexDirection:'row',alignItems:'center',marginTop:ScreenHeight/100}}>
                    <Text style={{fontSize:ScreenWidth/25,color:'black'}}>calling </Text>
                    <View style={styles.grey_text}>
                        <Text style={styles.grey_t}>balances.transfer</Text>
                    </View>
                    <Text style={{fontSize:ScreenWidth/25,color:'black'}}> with an index of </Text>
                    <View style={styles.grey_text}>
                        <Text style={styles.grey_t}>{this.state.accountNonce}</Text>
                    </View>
                  </View>
                  {/* password */}
                  <View style={[styles.NandP,{marginTop:ScreenHeight/30}]}>
                    <View style={{flexDirection:'row',width:ScreenWidth*0.65}}>
                        <Text style={{fontSize:ScreenWidth/26,color:'#696969'}}>unlock account using password</Text>
                        <View style={{flex:1}}/>
                    </View>
                    <View style={{flexDirection:'row',marginTop:ScreenHeight/70,alignItems:'center'}}>
                        <TextInput style = {[styles.textInputStyle,{fontSize:ScreenHeight/50}]}
                            placeholder = ''
                            placeholderTextColor = "#666666"
                            underlineColorAndroid="#ffffff00"
                            secureTextEntry={this.state.ispwd}
                            onChangeText = {this.onChangepasswore}
                        />
                        <TouchableOpacity 
                          style={styles.eye}
                          onPress={this.lookpwd}
                        >
                          <Image
                            style={styles.image}
                            source={require('../../../../images/Assets/transfer/eye.png')}
                          />
                        </TouchableOpacity>
                    </View>
                  </View>

                  {/* Reset or Save */}
                  <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                    <View style={{flexDirection:'row',height:ScreenHeight/20,width:ScreenWidth*0.7,alignItems:'center',justifyContent:'center'}}>
                      <View style={{height:ScreenHeight/20,width:ScreenWidth*0.1}}/>
                      <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#FF4081',height:ScreenHeight/20,width:ScreenWidth*0.2}}
                        onPress={this.Cancel}
                        >
                        
                          <Text style={{fontWeight:'500',fontSize:ScreenWidth/33,color:'white'}}>
                            Cancel
                          </Text>
                      </TouchableOpacity>
                      {this.state.onlyone==0?
                        <TouchableOpacity 
                            style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#97BEC7',marginLeft:ScreenWidth/100,height:ScreenHeight/20,width:ScreenWidth*0.3}}
                            onPress={this.Sign_and_Submit}
                        >
                        
                            <Text style={{fontWeight:'500',fontSize:ScreenWidth/33,color:'white'}}>
                            Sign and Submit
                            </Text>
                        </TouchableOpacity>
                        :
                        <View 
                            style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#97BEC7',marginLeft:ScreenWidth/100,height:ScreenHeight/20,width:ScreenWidth*0.3}}
                        >
                        
                            <Text style={{fontWeight:'500',fontSize:ScreenWidth/33,color:'white'}}>
                            Sign and Submit
                            </Text>
                        </View>
                      }
                      <View style={{borderRadius:ScreenHeight/24/14*4,backgroundColor:'white',position:'absolute',height:ScreenHeight/24/7*4,width:ScreenHeight/24/7*4,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:ScreenHeight/70}}>
                            or
                        </Text>
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
    submit_view:{
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