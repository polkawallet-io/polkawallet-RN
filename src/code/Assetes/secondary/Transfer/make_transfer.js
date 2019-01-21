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
  import { observer, inject } from "mobx-react";
  @inject('rootStore')
  @observer
  export default class Transfer extends Component{
      constructor(props){
          super(props)
          this.state={
            ispwd:true,
            password:''
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
        this.props.navigation.navigate('Transfer')
      }
      Sign_and_Submit(){
        SInfo.getItem(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address,{sharedPreferencesName:'Polkawallet',keychainService: 'PolkawalletKey'}).then(
            (result)=>{
              loadPair = keyring.addFromJson(JSON.parse(result))
              try{
                loadPair.decodePkcs8(this.state.password)
              }catch(error){
                alert(error)
              }
              loadPair.isLocked()?'':
               (async()=>{
                  const provider = new WsProvider(ENDPOINT);
                  const api = await Api.create(provider);
                  const accountNonce = await api.query.system.accountNonce(loadPair.address());
                  alert(J)
                  // Do the transfer and track the actual status
                  api.tx.balances.transfer('5DYnksEZFc7kgtfyNM1xK2eBtW142gZ3Ho3NQubrF2S6B2fq',3000)
                //   .transfer('5DYnksEZFc7kgtfyNM1xK2eBtW142gZ3Ho3NQubrF2S6B2fq', 3369)
                //   alert('1')
                //   .sign(loadPair, accountNonce)
                //   .send(({ events = [], status, type }) => {
                //     console.log('Transaction status:', type);
                //     alert('2')
                //     if (type === 'Finalised') {
                //     console.log('Completed at block hash', status.value.toHex());
                //     console.log('Events:');

                    
                //     }
                //   });
               })()
            //    alert('1')
            }
        )
      }
      componentWillMount(){
        
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
                    You are about to sugn a message from 
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
                        <Text style={styles.grey_t}>staking.transfer</Text>
                    </View>
                    <Text style={{fontSize:ScreenWidth/25,color:'black'}}> with an index of </Text>
                    <View style={styles.grey_text}>
                        <Text style={styles.grey_t}>42</Text>
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
                            source={require('../../../../images/Assetes/transfer/eye.png')}
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
                      <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#97BEC7',marginLeft:ScreenWidth/100,height:ScreenHeight/20,width:ScreenWidth*0.3}}
                        onPress={this.Sign_and_Submit}
                      >
                    
                        <Text style={{fontWeight:'500',fontSize:ScreenWidth/33,color:'white'}}>
                          Sign and Submit
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