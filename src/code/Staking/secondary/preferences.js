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
    Picker,
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
            isModalunit:false,
            onlyone:0,
            type:'pending...',
            queryPref:'',
            unstakeThreshold:0,
            validatorPayment:0,
            unit:'DOT',
            unit_change:'DOT',
            multiple:1000000000000000,
          }
          this.lookpwd=this.lookpwd.bind(this)
          this.Cancel=this.Cancel.bind(this)
          this.Set_Prefs=this.Set_Prefs.bind(this)
          this.onChangetext1=this.onChangetext1.bind(this)
          this.onChangetext2=this.onChangetext2.bind(this)
          this.onChangepassword=this.onChangepassword.bind(this)
          this.Modify_unit = this.Modify_unit.bind(this)
      }  
      Modify_unit(){
        this.setState({
            unit:this.state.unit_change,
            isModalunit:false,
        })
        if(this.state.unit_change == 'femto'){this.setState({multiple:1})}
        if(this.state.unit_change == 'pico'){this.setState({multiple:1000})}
        if(this.state.unit_change == 'nano'){this.setState({multiple:1000000})}
        if(this.state.unit_change == 'micro'){this.setState({multiple:1000000000})}
        if(this.state.unit_change == 'milli'){this.setState({multiple:1000000000000})}
        if(this.state.unit_change == 'DOT'){this.setState({multiple:1000000000000000})}
        if(this.state.unit_change == 'Kilo'){this.setState({multiple:1000000000000000000})}
        if(this.state.unit_change == 'Mega'){this.setState({multiple:1000000000000000000000})}
        if(this.state.unit_change == 'Giga'){this.setState({multiple:1000000000000000000000000})}
        if(this.state.unit_change == 'Tera'){this.setState({multiple:1000000000000000000000000000})}
        if(this.state.unit_change == 'Peta'){this.setState({multiple:1000000000000000000000000000000})}
        if(this.state.unit_change == 'Exa'){this.setState({multiple:1000000000000000000000000000000000})}
        if(this.state.unit_change == 'Zeta'){this.setState({multiple:1000000000000000000000000000000000000})}
        if(this.state.unit_change == 'Yotta'){this.setState({multiple:1000000000000000000000000000000000000000})}
      } 
      lookpwd()
      {
          this.setState({
              ispwd:!this.state.ispwd
          })
      }
      onChangepassword(Changepassword){
        this.setState({
            password:Changepassword
        })
      }
      onChangetext1(onChangetext){
          this.setState({
            unstakeThreshold:Number(onChangetext)
          })
      }
      onChangetext2(onChangetext){
        this.setState({
            validatorPayment:Number(onChangetext)
        })
      }
      
      Cancel(){
        this.props.navigation.navigate('Tabbed_Navigation')
      }
      
     
      Set_Prefs(){
        registerPreferences = {"unstakeThreshold":this.state.unstakeThreshold,"validatorPayment":this.state.validatorPayment * this.state.multiple};
        // alert(typeof(this.state.unstakeThreshold)+','+this.state.validatorPayment*this.state.multiple)
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
                  intentions = await api.query.staking.intentions()
                  stakeIndex = intentions.indexOf(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address)
                  await api.tx.staking.registerPreferences(stakeIndex,registerPreferences).signAndSend(loadPair,({ status, type }) => {
                    //   console.warn(type)
                        this.setState({
                            type:type
                        })
                        if(status.isFinalized){
                            this.setState({
                                isModal:false
                            })
                            setTimeout(() => {
                                Alert.alert(
                                    'Alert',
                                    'Set Prefs success',
                                    [
                                      {text: 'OK', onPress: () => {
                                            this.props.rootStore.stateStore.StakingState=0
                                            
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
      componentWillMount(){
        (async()=>{
            const provider = new WsProvider(this.props.rootStore.stateStore.ENDPOINT);
            const api = await Api.create(provider);
            queryPref = await api.query.staking.validatorPreferences(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address)
            this.setState({
                queryPref:JSON.stringify(queryPref)
            })
        })()
      }
      render(){
          return(
              <View style={styles.container}>
                {/* 标题栏 */}
                <View style={styles.title}>
                    <Text style={styles.text_title}>Preferences</Text>
                </View>
                <View style={styles.nominate_view}>
                  <Text style={styles.title_b}>Validator.Preferences</Text>
                  <Text style={{fontSize:ScreenWidth/25,color:'black',marginTop:ScreenHeight/50}}>
                    Present state:
                  </Text>
                  <View style={[styles.grey_text,{marginTop:ScreenHeight/100,width:ScreenWidth*0.9}]}>
                    {/* queryPref */}
                    <Text 
                      style={{fontSize:ScreenHeight/55,fontWeight:'500',width:ScreenWidth*0.8}}
                    >
                      {this.state.queryPref}
                    </Text>
                  </View>
                  
                  
                  {/* unstake threshold */}
                  <View style={[styles.NandP,{marginTop:ScreenHeight/50}]}>
                    <View style={{flexDirection:'row',width:ScreenWidth*0.65}}>
                        <Text style={{fontSize:ScreenWidth/26,color:'#696969'}}>unstake threshold</Text>
                        <View style={{flex:1}}/>
                    </View>
                    <View style={{flexDirection:'row',marginTop:ScreenHeight/70,alignItems:'center'}}>
                        <TextInput style = {[styles.textInputStyle,{marginTop:ScreenHeight/70,fontSize:ScreenHeight/50,width:ScreenWidth*0.9,borderColor:this.props.rootStore.stateStore.tonominate==0?'#97BEC7':'grey'}]}
                            autoCapitalize = 'none'
                            placeholder = {this.state.address}
                            placeholderTextColor = "#666666"
                            underlineColorAndroid="#ffffff00"
                            onChangeText = {this.onChangetext1}
                        />
                    </View>
                  </View>
                  {/* payment prefere */}
                  <View style={[styles.NandP,{marginTop:ScreenHeight/50}]}>
                    <View style={{flexDirection:'row',width:ScreenWidth*0.65}}>
                        <Text style={{fontSize:ScreenWidth/26,color:'#696969'}}>payment prefere</Text>
                        <View style={{flex:1}}/>
                    </View>
                    <View style={{flexDirection:'row',marginTop:ScreenHeight/70,alignItems:'center'}}>
                        <TextInput style = {[styles.textInputStyle,{marginTop:ScreenHeight/70,fontSize:ScreenHeight/50,width:ScreenWidth*0.675,borderColor:this.props.rootStore.stateStore.tonominate==0?'#97BEC7':'grey'}]}
                            placeholder = {this.state.address}
                            placeholderTextColor = "#666666"
                            underlineColorAndroid="#ffffff00"
                            onChangeText = {this.onChangetext2}
                        />
                      <View style={{width:ScreenWidth*0.225,alignItems:'flex-end'}}>
                        {/* 选择单位  */}
                        <TouchableOpacity style={styles.Choose_unit}
                            onPress={()=>{
                                this.setState({
                                isModalunit:true
                                })
                            }}
                        >
                            <View style={[styles.middle,{flex:1}]}>
                                <Text style={{fontSize:ScreenWidth/25,color:'white'}}>{this.state.unit}</Text>
                            </View>
                            <Image
                                style={{backgroundColor:'white',marginRight:1,height:ScreenHeight/23-2,width:ScreenHeight/40,resizeMode:'center'}}
                                source={require('../../../images/Assets/Create_Account/next.png')}
                            />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
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

                  {/* Cancel or Set */}
                  <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                    <View style={{marginRight:ScreenWidth*0.08-ScreenWidth/40,flexDirection:'row',height:ScreenHeight/20,width:ScreenWidth*0.7,alignItems:'center',justifyContent:'flex-end'}}>
                     <View style={{alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
                      <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#FF4081',height:ScreenHeight/20,width:ScreenWidth*0.2}}
                        onPress={this.Cancel}
                        >
                        
                          <Text style={{fontWeight:'500',fontSize:ScreenWidth/28,color:'white'}}>
                            Cancel
                          </Text>
                      </TouchableOpacity>
                      {this.state.onlyone==0?
                        <TouchableOpacity 
                            style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#97BEC7',marginLeft:ScreenWidth/100,height:ScreenHeight/20,width:ScreenWidth*0.2}}
                            onPress={this.Set_Prefs}
                        >
                        
                            <Text style={{fontWeight:'500',fontSize:ScreenWidth/28,color:'white'}}>
                              Set Prefs
                            </Text>
                        </TouchableOpacity>
                        :
                        <View 
                            style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#97BEC7',marginLeft:ScreenWidth/100,height:ScreenHeight/20,width:ScreenWidth*0.2}}
                        >
                        
                            <Text style={{fontWeight:'500',fontSize:ScreenWidth/28,color:'white'}}>
                              Set Prefs
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
                  <Modal
                    animationType={'slide'}
                    transparent={true}
                    visible={this.state.isModalunit}
                  >
                    <View style={{flex:1}}/>
                    <View style={styles.chooses}>
                        <TouchableOpacity
                          onPress={()=>{
                            this.setState({
                              isModalunit:false,
                            })
                          }}
                        > 
                          <Text style={styles.choose_Text}>cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={this.Modify_unit}
                        > 
                          <Text style={styles.choose_Text}>confirm</Text>
                        </TouchableOpacity>
                    </View>
                    <Picker
                        style={{width:ScreenWidth,backgroundColor:'#C0C0C0'}}
                        selectedValue={this.state.unit_change}
                        onValueChange={(value) => this.setState({unit_change: value})}
                    >
                        <Picker.Item label="femto" value="femto" />
                        <Picker.Item label="pico" value="pico" />
                        <Picker.Item label="nano" value="nano" />
                        <Picker.Item label="micro" value="micro" />
                        <Picker.Item label="milli" value="milli" />
                        <Picker.Item label="DOT" value="DOT" />
                        <Picker.Item label="Kilo" value="Kilo" />
                        <Picker.Item label="Mega" value="Mega" />
                        <Picker.Item label="Giga" value="Giga" />
                        <Picker.Item label="Tera" value="Tera" />
                        <Picker.Item label="Peta" value="Peta" />
                        <Picker.Item label="Exa" value="Exa" />
                        <Picker.Item label="Zeta" value="Zeta" />
                        <Picker.Item label="Yotta" value="Yotta" />
                    </Picker>
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
        height:ScreenHeight/1.5,
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
        padding:ScreenHeight/100,
        backgroundColor:'#F0EFEF',
        // height:ScreenHeight/25,
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
    },
    Choose_unit:{
        marginTop:ScreenHeight/70,
        justifyContent:'center',
        alignItems:'center',
        width:ScreenWidth*0.20,
        height:ScreenHeight/23,
        borderWidth:1,
        borderRadius:ScreenHeight/200,
        borderColor:'#4dabd0',
        flexDirection:'row',
        backgroundColor:'#4dabd0'
    },
    middle:{
        justifyContent:'center',
        alignItems:'center'
    },
    chooses:{
        paddingLeft:ScreenWidth/20,
        paddingRight:ScreenWidth/20,
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:'row',
        height:ScreenHeight/18,
        backgroundColor:'#DCDCDC'
    },
    choose_Text:{
        fontWeight:'500',
        fontSize:ScreenHeight/50,
        color:'#4169E1'
    }
    
})