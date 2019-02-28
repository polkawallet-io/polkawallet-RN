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
    Picker,
  } from 'react-native';
  import Api from '@polkadot/api/promise';
  import WsProvider from '@polkadot/rpc-provider/ws';
  import formatBalance from '../../../../util/formatBalance'
  import BN from 'bn.js'

  let ScreenWidth = Dimensions.get("screen").width;
  let ScreenHeight = Dimensions.get("screen").height;
  const t=[
      {text1:'to the recipient address',text2:''},
      {text1:'send a value of',text2:'0'},
      
  ]
  const fees=['creationFee','existentialDeposit','transactionBaseFee','transactionByteFee','transferFee']
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
              isModel:false,
              way:'DOT',
              way_change:'DOT',
              multiple:1000000000000000,
              fees:{},
          }
          this.Make_transfer=this.Make_transfer.bind(this)
          this.back=this.back.bind(this)
          this.ChangeAddress=this.ChangeAddress.bind(this)
          this.ChangeValue=this.ChangeValue.bind(this)
          this.addresses=this.addresses.bind(this)
          this.camera=this.camera.bind(this)
          this.Modify_way = this.Modify_way.bind(this)
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
      Modify_way(){
        this.setState({
            isModel:false,
            way:this.state.way_change,
        })
        if(this.state.way_change == 'femto'){this.setState({multiple:1})}
        if(this.state.way_change == 'pico'){this.setState({multiple:1000})}
        if(this.state.way_change == 'nano'){this.setState({multiple:1000000})}
        if(this.state.way_change == 'micro'){this.setState({multiple:1000000000})}
        if(this.state.way_change == 'milli'){this.setState({multiple:1000000000000})}
        if(this.state.way_change == 'DOT'){this.setState({multiple:1000000000000000})}
        if(this.state.way_change == 'Kilo'){this.setState({multiple:1000000000000000000})}
        if(this.state.way_change == 'Mega'){this.setState({multiple:1000000000000000000000})}
        if(this.state.way_change == 'Giga'){this.setState({multiple:1000000000000000000000000})}
        if(this.state.way_change == 'Tera'){this.setState({multiple:1000000000000000000000000000})}
        if(this.state.way_change == 'Peta'){this.setState({multiple:1000000000000000000000000000000})}
        if(this.state.way_change == 'Exa'){this.setState({multiple:1000000000000000000000000000000000})}
        if(this.state.way_change == 'Zeta'){this.setState({multiple:1000000000000000000000000000000000000})}
        if(this.state.way_change == 'Yotta'){this.setState({multiple:1000000000000000000000000000000000000000})}
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
            this.props.rootStore.stateStore.value=new BN(this.state.value*this.state.multiple)
            this.props.rootStore.stateStore.inaddress=(this.props.rootStore.stateStore.isaddresses==0&&this.props.rootStore.stateStore.iscamera==0)?this.state.address:this.props.rootStore.stateStore.t_address
            this.props.rootStore.stateStore.isaddresses=0
            this.props.rootStore.stateStore.transfer_address=0
            this.props.rootStore.stateStore.iscamera=0
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
                this.setState({
                  balance:balance
                });
            });
            this.setState({fees:await api.derive.balances.fees()})
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
                        source={require('../../../../images/Assets/Create_Account/back.png')}
                        />
                    </TouchableOpacity>
                    <Text style={styles.text_title}>Transfer DOT</Text>
                    <TouchableOpacity
                      onPress={this.camera}
                    >
                        <Image 
                        style={styles.image_title}
                        source={require('../../../../images/Assets/transfer/camera.png')}
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
                                    <Text style={{fontSize:ScreenWidth/30,color:'#0981d0'}}>{'Balance :'+formatBalance(String(this.state.balance))}</Text>:<View/>
                                }
                            </View>
                            <View style={{flexDirection:'row',marginTop:ScreenHeight/70,alignItems:'center'}}>
                                <TextInput style = {[styles.textInputStyle,{fontSize:ScreenHeight/50}]}
                                    placeholder = {(index==0)?this.props.rootStore.stateStore.t_address:item.text2}
                                    placeholderTextColor = "#666666"
                                    underlineColorAndroid="#ffffff00"
                                    // editable={index==3?false:true}
                                    onChangeText = {(changeText)=>{
                                        if(index==0){this.ChangeAddress(changeText)}
                                        if(index==1){this.ChangeValue(changeText)}
                                    }}
                                />
                                {
                                    (index==0)
                                    ?
                                        <TouchableOpacity
                                        onPress={this.addresses}
                                        >
                                            <Image
                                                style={styles.image}
                                                source={require('../../../../images/Assets/transfer/address.png')}
                                            />
                                        </TouchableOpacity>
                                    :
                                        (index==1)?
                                        //  选择方式 
                                        <TouchableOpacity style={styles.Choose_way}
                                            onPress={()=>{
                                                this.setState({
                                                isModel:true
                                                })
                                            }}
                                        >
                                            <View style={[styles.middle,{flex:1}]}>
                                                <Text style={{fontSize:ScreenWidth/25,color:'white'}}>{this.state.way}</Text>
                                            </View>
                                            <Image
                                                style={{backgroundColor:'white',marginRight:1,height:ScreenHeight/23-2,width:ScreenHeight/35,resizeMode:'center'}}
                                                source={require('../../../../images/Assets/Create_Account/next.png')}
                                            />
                                        </TouchableOpacity>
                                    :<View/>
                                }
                            </View>
                          </View>
                        )
                    })
                }
                
                <View style={styles.feesView}>
                    <Text style={styles.feesText}>{'creationFee : '+formatBalance(String(this.state.fees.creationFee))}</Text>
                </View>
                <View style={styles.feesView}>
                    <Text style={styles.feesText}>{'existentialDeposit : '+formatBalance(String(this.state.fees.existentialDeposit))}</Text>
                </View>
                <View style={styles.feesView}>
                    <Text style={styles.feesText}>{'transactionBaseFee : '+formatBalance(String(this.state.fees.transactionBaseFee))}</Text>
                </View>
                <View style={styles.feesView}>
                    <Text style={styles.feesText}>{'transactionByteFee : '+formatBalance(String(this.state.fees.transactionByteFee))}</Text>
                </View>
                <View style={styles.feesView}>
                    <Text style={styles.feesText}>{'transferFee : '+formatBalance(String(this.state.fees.transferFee))}</Text>
                </View>
                  
                  
                
                <TouchableOpacity style={styles.maket}
                  onPress={this.Make_transfer}
                >
                  <Text style={{color:'white',fontSize:ScreenWidth/26,fontWeight:'400'}}>Make Transfer</Text>
                </TouchableOpacity>
               
                <Modal
                    animationType={'slide'}
                    transparent={true}
                    visible={this.state.isModel}
                >
                    <View style={{flex:1}}/>
                    <View style={styles.chooses}>
                        <TouchableOpacity
                          onPress={()=>{
                            this.setState({
                            isModel:false,
                          })
                        }}
                        > 
                          <Text style={styles.choose_Text}>cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={this.Modify_way}
                        > 
                          <Text style={styles.choose_Text}>confirm</Text>
                        </TouchableOpacity>
                    </View>
                    <Picker
                        style={{width:ScreenWidth,backgroundColor:'#C0C0C0'}}
                        selectedValue={this.state.way_change}
                        onValueChange={(value) => this.setState({way_change: value})}
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
        paddingVertical: 0
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
    },
    Choose_way:{
        alignItems:'center',
        marginLeft:ScreenWidth/70,
        width:ScreenWidth*0.25,
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
    },
    feesView:{
        height:ScreenHeight/35,
        width:ScreenWidth,
        justifyContent:'center',
        marginLeft:ScreenWidth/20
    },
    feesText:{
        color:'#696969',
        fontSize:ScreenHeight/60
    }
})