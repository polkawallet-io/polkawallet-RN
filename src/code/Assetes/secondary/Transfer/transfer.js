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
  import Api from '@polkadot/api/promise';
  import WsProvider from '@polkadot/rpc-provider/ws';
  
  let ScreenWidth = Dimensions.get("screen").width;
  let ScreenHeight = Dimensions.get("screen").height;
  const t=[
      {text1:'to the recipient address',text2:''},
      {text1:'send a value of',text2:'0'},
      {text1:'witn fees totalling',text2:'0'},
      {text1:'total transaction amount(fees + value)',text2:'4.06m'},
  ]

  import { observer, inject } from "mobx-react";
  @inject('rootStore')
  @observer
  export default class Transfer extends Component{
      constructor(props){
          super(props)
          this.state={
              balance:0,
              address:'',
              value:0,
          }
          this.Make_transfer=this.Make_transfer.bind(this)
          this.back=this.back.bind(this)
          this.ChangeAddress=this.ChangeAddress.bind(this)
          this.ChangeValue=this.ChangeValue.bind(this)
          this.addresses=this.addresses.bind(this)
          this.camera=this.camera.bind(this)
      }  
      back(){
        this.props.rootStore.stateStore.t_address=''
        this.props.rootStore.stateStore.isaddresses=0
        this.props.rootStore.stateStore.transfer_address=0
        this.props.rootStore.stateStore.iscamera=0
        if(this.props.rootStore.stateStore.tocamera==0){
            this.props.navigation.navigate('Tabbed_Navigation')
        }else{
            this.props.navigation.navigate('Coin_details')
        }
      } 
      camera(){
        this.props.rootStore.stateStore.tocamera=1
        this.props.navigation.navigate('Camera')
      }
      addresses(){
        this.props.rootStore.stateStore.transfer_address=1
        this.props.navigation.navigate('Addresses')
      }
      Make_transfer()
      {
        if(this.state.address==''&&this.props.rootStore.stateStore.transfer_address==0&&this.props.rootStore.stateStore.iscamera==0){alert('Please enter address')}
        else{
            this.props.rootStore.stateStore.value=this.state.value
            this.props.rootStore.stateStore.inaddress=(this.props.rootStore.stateStore.isaddresses==0)?this.state.address:this.props.rootStore.stateStore.t_address
            this.props.rootStore.stateStore.isaddresses=0
            this.props.rootStore.stateStore.transfer_address=0
            this.props.rootStore.stateStore.iscamera=0
            // alert(this.props.rootStore.stateStore.inaddress)
            this.props.navigation.navigate('Make_transfer')
        }
      }
      ChangeAddress(changeAddress){
          if(changeAddress!=''){
            this.props.rootStore.stateStore.isaddresses=0
          }else{
              if(this.props.rootStore.stateStore.transfer_address==1)
              {
                this.props.rootStore.stateStore.isaddresses=1
              }
          }
          this.setState({
              address:changeAddress
          })
      }
      ChangeValue(changeValue){
        this.setState({
            value:changeValue
        })
      }
      componentWillMount(){
        (async()=>{
            this.props.rootStore.stateStore.tocamera=1
            const provider = new WsProvider(this.props.rootStore.stateStore.ENDPOINT);
            const api = await Api.create(provider);
            api.query.balances.freeBalance(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address, (balance) => {
                // alert(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address)
                this.setState({
                  balance:balance
                });
            });
        })()
        
      }
      render(){
          return(
              <View style={styles.container}>
                {/* 标题栏 */}
                <View style={styles.title}>
                    <TouchableOpacity
                        onPress={this.back}
                    >
                        <Image
                        style={styles.image_title}
                        source={require('../../../../images/Assetes/Create_Account/back.png')}
                        />
                    </TouchableOpacity>
                    <Text style={styles.text_title}>Transfer DOT</Text>
                    <TouchableOpacity
                      onPress={this.camera}
                    >
                        <Image 
                        style={styles.image_title}
                        source={require('../../../../images/Assetes/transfer/camera.png')}
                        />
                    </TouchableOpacity>
                </View>
                {
                    t.map((item,index)=>{
                        return(
                          <View style={[styles.NandP,{marginTop:(index==0)?ScreenHeight/40:0}]} key={index}>
                            <View style={{flexDirection:'row',width:ScreenWidth*0.9}}>
                                <Text style={{fontSize:ScreenWidth/26,color:'black'}}>{item.text1}</Text>
                                <View style={{flex:1}}/>
                                {
                                    (index==1)?
                                    <Text style={{fontSize:ScreenWidth/30,color:'#0981d0'}}>{'Balance :'+this.state.balance}</Text>:<View/>
                                }
                            </View>
                            <View style={{flexDirection:'row',marginTop:ScreenHeight/70,alignItems:'center'}}>
                                <TextInput style = {[styles.textInputStyle,{fontSize:ScreenHeight/50}]}
                                    placeholder = {(index==0)?this.props.rootStore.stateStore.t_address:(index==3)?(this.state.value).toString():item.text2}
                                    placeholderTextColor = "#666666"
                                    underlineColorAndroid="#ffffff00"
                                    editable={index==3?false:true}
                                    onChangeText = {(changeText)=>{
                                        if(index==0){this.ChangeAddress(changeText)}
                                        if(index==1){this.ChangeValue(changeText)}
                                    }}
                                />
                                {
                                    (index==0)?
                                    <TouchableOpacity
                                      onPress={this.addresses}
                                    >
                                         <Image
                                            style={styles.image}
                                            // Need Open
                                            source={require('../../../../images/Assetes/transfer/address.png')}
                                          />
                                    </TouchableOpacity>
                                    :<View/>
                                }
                            </View>
                          </View>
                        )
                    })
                }
                <TouchableOpacity style={styles.maket}
                  onPress={this.Make_transfer}
                >
                  <Text style={{color:'white',fontSize:ScreenWidth/26,fontWeight:'400'}}>Make Transfer</Text>
                </TouchableOpacity>
               
              </View>
          )
      }
  }
  const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white'
    },
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
    NandP:{
        justifyContent:'center',
        paddingLeft:ScreenWidth/20,
        height:ScreenHeight/7,
    },
    textInputStyle:{
        paddingVertical:0,
        height:ScreenHeight/23,
        width:ScreenWidth*0.65,
        borderWidth:1,
        borderColor:'grey',
        borderRadius:ScreenHeight/100,
        paddingLeft:ScreenHeight/100,
    },
    image:{
        marginLeft:ScreenWidth/32,
        height:ScreenHeight/32,
        width:ScreenHeight/32,
        resizeMode:'contain'
    },
    maket:{
        height:ScreenHeight/20,
        width:ScreenWidth*0.35,
        marginTop:ScreenHeight/10,
        marginLeft:ScreenWidth*0.6,
        borderRadius:ScreenHeight/100,
        backgroundColor:'#4dabd0',
        justifyContent:'center',
        alignItems:'center'
    }
})