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
    Clipboard,
    ScrollView,
    RefreshControl,
    SafeAreaView
  } from 'react-native';
  import Echarts from 'native-echarts';
  import moment from "moment/moment";
  import formatBalance from '../../../util/formatBalance'
  
  
  const titlebottoms=['All','Out','In']
  let ScreenWidth = Dimensions.get("screen").width;
  let ScreenHeight = Dimensions.get("screen").height;

import { observer, inject } from "mobx-react";
@inject('rootStore')
@observer
  export default class Polkawallet extends Component{
      constructor(props){
          super(props)
          this.state={
            isrefresh:false,
            isfirst:0,
            titlebottom:1,
            
            pageNum:1
          }
          this.back=this.back.bind(this)
          this.Send=this.Send.bind(this)
          this.Receive=this.Receive.bind(this)
          this.Loadmore=this.Loadmore.bind(this)
          this.refresh=this.refresh.bind(this)
          this.Load=this.Load.bind(this)
      }  
      
      back(){
        this.props.navigation.navigate('Tabbed_Navigation')
      }
      //加载信息
      Load(){
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
      }
      // 刷新
      refresh(){
        this.setState({
          isrefresh:true
        })
        setTimeout(()=>{
            this.Load()
          }, 200);
          this.setState({
            isrefresh:false
          })
        
      }
      Loadmore(){
        let REQUEST_URL = 'http://107.173.250.124:8080/tx_list'
        let map = {
          method:'POST'
        }
        let privateHeaders = {
          'Content-Type':'application/json'
        }
        map.headers = privateHeaders;
        map.follow = 20;
        map.timeout = 0;
        map.body = '{"user_address":"'+this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address+'","pageNum":"'+(++this.state.pageNum)+'","pageSize":"10"}';
        fetch(REQUEST_URL,map).then(
          (result)=>{
              this.props.rootStore.stateStore.hasNextPage=JSON.parse(result._bodyInit).tx_list.hasNextPage
              JSON.parse(result._bodyInit).tx_list.list.map((item,index)=>{
              this.props.rootStore.stateStore.transactions.tx_list.list.push(item)
            })
            
          }
        ).catch()
        

      }
      
      Send(){
        this.props.navigation.navigate('Transfer')
      }
      Receive(){
        this.props.navigation.navigate('QR_Code')
      }
      componentWillMount(){
        this.Load()
      }
      render(){
          return(
            // <SafeAreaView style={{flex:1,ba}}>
              <View style={styles.container}>
                {/* 标题栏 */}
                <View style={styles.title}>
                    <TouchableOpacity
                        onPress={this.back}
                    >
                        <Image
                        style={styles.image_title}
                        source={require('../../../images/Assets/Create_Account/back.png')}
                        />
                    </TouchableOpacity>
                    <Text style={styles.text_title}>DOT</Text>
                    <TouchableOpacity>
                        <Image 
                        style={styles.image_title}
                        //Need Open
                        // source={require('../../../images/Assets/coin_details/books.png')}
                        />
                    </TouchableOpacity>
                </View>
                {/* The line chart */}
                <View style={{height:ScreenHeight/3,borderBottomWidth:2,borderColor:'#DCDCDC'}}>
                  <Echarts 
                    option={this.props.rootStore.stateStore.option}
                    height={ScreenHeight/3}/>   
                </View>
                {/* The secondary title */}
                <View style={{height:ScreenHeight/20}}>
                  {/* 次标题 */}
                  <View style={{borderBottomColor:'grey',height:ScreenHeight/20,width:ScreenWidth,flexDirection:'row',justifyContent:'space-around'}}>
                    {
                        titlebottoms.map((item,index)=>{
                            return(
                                <TouchableOpacity 
                                    style={{width:ScreenWidth/3,justifyContent:'center',alignItems:'center',borderBottomWidth:2,borderBottomColor:this.state.titlebottom==index+1?'#005baf':'#DCDCDC'}}
                                    onPress={()=>{
                                    this.setState({
                                        titlebottom:index+1
                                    })
                                    }}
                                    key={index}
                                    >
                                    <Text style={{color:this.state.titlebottom==index+1?'#005bae':'#696969',fontSize:ScreenWidth/30,fontWeight:'500'}}>
                                      {item}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                  </View>
                </View>
                {/* Sliding table */}
                <View style={{marginTop:0,width:ScreenWidth,flex:1,backgroundColor:'white'}}>
                  <ScrollView 
                    style={{flex:1}}
                    refreshControl={<RefreshControl
                      refreshing={this.state.isrefresh}
                      onRefresh={this.refresh}/>}
                  >
                    {
                        this.props.rootStore.stateStore.transactions.tx_list.list.map((item,index)=>{
                          return(
                            (this.state.titlebottom==1)
                            ?
                            //All
                            <TouchableOpacity style={{alignItems:'center',flexDirection:'row',height:ScreenHeight/13,borderBottomWidth:1,borderColor:'grey'}} key={index}
                              onPress={()=>{
                                this.props.navigation.navigate('Transfer_details',{data:item})
                              }}
                            >
                              <Image
                                style={{marginLeft:ScreenWidth/20,height:ScreenHeight/25,width:ScreenHeight/25,resizeMode:'contain'}}
                                source={(item.tx_type=="Receive")?require('../../../images/Assets/coin_details/down.png'):require('../../../images/Assets/coin_details/up.png')}
                              />
                              <View style={{marginLeft:ScreenWidth/16.30,flex:1}}>
                                <Text
                                  ellipsizeMode={"middle"}
                                  numberOfLines={1}
                                  style={{fontSize:ScreenWidth/25,color:'black',width:ScreenWidth*0.4}}
                                >
                                  {item.tx_address}
                                </Text>
                                <Text
                                  style={{marginTop:ScreenHeight/120,fontSize:ScreenWidth/30,color:'#666666'}}
                                >
                                  {moment(item.tx_timestamp).format('DD/MM/YYYY HH:mm:ss')}
                                  {/* {item.tx_timestamp} */}
                                </Text>
                              </View>
                              {/* 余额 */}
                              <Text
                                style={styles.value}
                              >
                                {(item.tx_type=="Receive")?"+ "+formatBalance(String(item.tx_value)):"- "+formatBalance(String(item.tx_value))}
                              </Text>
                            </TouchableOpacity>
                            :(this.state.titlebottom==2&&item.tx_type=="Send")
                            ?
                            // Out
                            <TouchableOpacity style={{alignItems:'center',flexDirection:'row',height:ScreenHeight/13,borderBottomWidth:1,borderColor:'grey'}} key={index}
                                onPress={()=>{
                                  this.props.navigation.navigate('Transfer_details',{data:item})
                                }}
                            >
                              <Image
                                style={{marginLeft:ScreenWidth/20,height:ScreenHeight/25,width:ScreenHeight/25,resizeMode:'contain'}}
                                source={(item.tx_type=="Receive")?require('../../../images/Assets/coin_details/down.png'):require('../../../images/Assets/coin_details/up.png')}
                              />
                              <View style={{marginLeft:ScreenWidth/16.30,flex:1}}>
                                <Text
                                  ellipsizeMode={"middle"}
                                  numberOfLines={1}
                                  style={{fontSize:ScreenWidth/25,color:'black',width:ScreenWidth*0.4}}
                                >
                                  {item.tx_address}
                                </Text>
                                <Text
                                  style={{marginTop:ScreenHeight/120,fontSize:ScreenWidth/30,color:'#666666'}}
                                >
                                  {moment(item.tx_timestamp).format('DD/MM/YYYY HH:mm:ss')}
                                </Text>
                              </View>
                              <Text
                                style={styles.value}
                              >
                                {(item.tx_type=="Receive")?"+ "+formatBalance(String(item.tx_value)):"- "+formatBalance(String(item.tx_value))}
                              </Text>
                            </TouchableOpacity>
                            :(this.state.titlebottom==3&&item.tx_type=="Receive")?
                            // in
                            <TouchableOpacity style={{alignItems:'center',flexDirection:'row',height:ScreenHeight/13,borderBottomWidth:1,borderColor:'grey'}} key={index}
                                onPress={()=>{
                                  this.props.navigation.navigate('Transfer_details',{data:item})
                                }}
                            >
                              <Image
                                style={{marginLeft:ScreenWidth/20,height:ScreenHeight/25,width:ScreenHeight/25,resizeMode:'contain'}}
                                source={(item.tx_type=="Receive")?require('../../../images/Assets/coin_details/down.png'):require('../../../images/Assets/coin_details/up.png')}
                              />
                              <View style={{marginLeft:ScreenWidth/16.30,flex:1}}>
                                <Text
                                  ellipsizeMode={"middle"}
                                  numberOfLines={1}
                                  style={{fontSize:ScreenWidth/25,color:'black',width:ScreenWidth*0.4}}
                                >
                                  {item.tx_address}
                                </Text>
                                <Text
                                  style={{marginTop:ScreenHeight/120,fontSize:ScreenWidth/30,color:'#666666'}}
                                >
                                  {moment(item.tx_timestamp).format('DD/MM/YYYY HH:mm:ss')}
                                </Text>
                              </View>
                              {/* 余额 */}
                              <Text
                                style={styles.value}
                              >
                                {(item.tx_type=="Receive")?"+ "+formatBalance(String(item.tx_value)):"- "+formatBalance(String(item.tx_value))}
                              </Text>
                            </TouchableOpacity>
                            :<View key={index}/>
                          )
                        })
                    }
                    {
                      this.props.rootStore.stateStore.hasNextPage?
                        <TouchableOpacity style={{height:ScreenHeight/10,width:ScreenWidth,justifyContent:'center',alignItems:'center'}}
                          onPress={this.Loadmore}
                        >
                          <Text style={{color:'#696969',fontSize:ScreenHeight/45}}>To load more ~</Text>
                        </TouchableOpacity>
                      :
                      <View style={{height:ScreenHeight/10,width:ScreenWidth,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'#A9A9A9',fontSize:ScreenHeight/52}}>~ Bottom</Text>
                      </View>
                    }
                    
                  </ScrollView>
                </View>
                <View style={{height:ScreenHeight/100,backgroundColor:'white'}}/>
                {/* Send or Receive  */}
                <View style={{height:ScreenHeight/15,flexDirection:'row'}}>
                  <TouchableOpacity style={[styles.SorR_View,{backgroundColor:'#4dabd0'}]}
                    onPress={this.Send}
                  >
                    <Image 
                      style={styles.SorR_Image}
                      source={require('../../../images/Assets/coin_details/send.png')}
                    />
                    <Text style={styles.SorR_Text}>Send</Text>
                  </TouchableOpacity>
                  <View style={{flex:1}}/>
                  <TouchableOpacity style={[styles.SorR_View,{backgroundColor:'#90cd49'}]}
                    onPress={this.Receive}
                  >
                    <Image 
                      style={styles.SorR_Image}
                      source={require('../../../images/Assets/coin_details/receive.png')}
                    />
                    <Text style={styles.SorR_Text}>Receive</Text>
                  </TouchableOpacity>
                </View>
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
    SorR_View:{
        height:ScreenHeight/15,
        width:ScreenWidth/2.015,
        borderRadius:ScreenHeight/150,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    SorR_Image:{
        height:ScreenHeight/33,
        width:ScreenHeight/33,
        resizeMode:'contain'    
    },
    SorR_Text:{
        color:'white',
        fontSize:ScreenWidth/25,
        fontWeight:'500',
        marginLeft:ScreenWidth/30
    },
    value:{
        marginRight:ScreenWidth/20,fontSize:ScreenWidth/28,color:'black'
    }
})