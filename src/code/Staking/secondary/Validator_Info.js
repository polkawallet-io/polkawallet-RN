import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  Clipboard
} from 'react-native';
import Echarts from 'native-echarts';
import Api from '@polkadot/api/promise';
import WsProvider from '@polkadot/rpc-provider/ws';
import Identicon from 'polkadot-identicon-react-native';
import formatBalance from '../../../util/formatBalance'
import moment from "moment/moment";
let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
import { observer, inject } from "mobx-react";
@inject('rootStore')
@observer
export default class IntegralMall extends Component {
  constructor(props){
    super(props)
    this.state={
      address:this.props.navigation.state.params.address,
      titlebottomAA:1,
      nominators:[],
      nominatorsBalance:[],
      validatorBalances:0,
      StakingNextPage:false,
      StakingRecords:{},
      pageNum:1,
      inNominators:false,
      StakingOption:this.props.navigation.state.params.StakingOption,
      // StakingOption: {
      //   title: {
      //     show:false
      //   },
      //   tooltip: {},
      //   legend: {
      //       data: ['']
      //   },
      //   xAxis: {
      //       data: []
      //   },
      //   yAxis: {},
      //   series: [{
      //       type: 'line',
      //       data: []
      //   }]
      // },
    }
    this.back=this.back.bind(this)
    this.nominate=this.nominate.bind(this)
    this.Unnominate=this.Unnominate.bind(this)
    this.copy=this.copy.bind(this)
    this.Loadmore=this.Loadmore.bind(this)
  }  
  back(){
    this.props.navigation.navigate('Tabbed_Navigation')
  }  
  nominate(){
    this.props.rootStore.stateStore.tonominate=1
    this.props.navigation.navigate('Nominate',{address:this.state.address})
  }
  Unnominate(){
    this.props.navigation.navigate('Unnominate')
  }
  async copy(){
    Clipboard.setString(this.state.address);
    alert('Copy success')
  }
  Loadmore(){
    let REQUEST_URL = 'http://107.173.250.124:8080/staking_list_alexander'
    let map = {
      method:'POST'
    }
    let privateHeaders = {
      'Content-Type':'application/json'
    }
    map.headers = privateHeaders;
    map.follow = 20;
    map.timeout = 0;
    map.body = '{"user_address":"'+this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address+'","pageNum":"'+this.state.pageNum+'","pageSize":"10"}';
    // map.body = '{"user_address":"'+'5Enp67VYwLviZWuyf2XfM5mJXgTWHaa45podYXhUhDCUeQUM'+'","pageNum":"'+(++this.state.pageNum)+'","pageSize":"10"}';
    fetch(REQUEST_URL,map).then(
      (result)=>{
          this.state.StakingNextPage=JSON.parse(result._bodyInit).staking_list_alexander.hasNextPage
          _StakingRecords = this.state.StakingRecords
          JSON.parse(result._bodyInit).staking_list_alexander.list.map((item,index)=>{
            _StakingRecords.staking_list_alexander.list.push(item)
          })
          this.setState({
            StakingRecords:_StakingRecords
          })
      }
    ).catch()
  }
  componentWillMount(){
      (async()=>{
        //获取选中账户的Staking Records
        let REQUEST_URL = 'http://107.173.250.124:8080/staking_list_alexander'
        let map = {
              method:'POST'
            }
        let privateHeaders = {
              'Content-Type':'application/json'
            }
            map.headers = privateHeaders;
            map.follow = 20;
            map.timeout = 0;
            map.body = '{"user_address":"'+this.state.address+'","pageNum":"1","pageSize":"10"}';
            fetch(REQUEST_URL,map).then(
              (result)=>{
                this.state.StakingNextPage=JSON.parse(result._bodyInit).staking_list_alexander.hasNextPage
                this.state.StakingRecords=JSON.parse(result._bodyInit)
              }
        ).catch()

       

        const api = await Api.create(new WsProvider(this.props.rootStore.stateStore.ENDPOINT));
        nominators = await api.query.staking.nominatorsFor(this.state.address)
        nominatorsBalance = await Promise.all(
            nominators.map(authorityId =>
              api.query.balances.freeBalance(authorityId)
            )
        );
        //查询validator额度
        validatorBalances = await api.query.balances.freeBalance(this.state.address)
        //查询本地账户是否在所选账户的nominators里面
        nominators.filter((address) =>{
          if(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address.includes(address)){
            this.setState({inNominators:true})
          }
        })
        // alert(validatorBalances)
        this.setState({
            nominators: nominators,
            nominatorsBalance: nominatorsBalance,
            validatorBalances: validatorBalances,
        })
      })()
  }
    render() {
        return (
          
            <View style={styles.container}>
              {/* 标题栏 */}
              <View style={styles.title}>
                <TouchableOpacity
                    onPress={this.back}
                >
                    <Image
                    style={styles.image_title}
                    source={require('../../../images/Staking/back.png')}
                    />
                </TouchableOpacity>
                <Text style={styles.text_title}>Validator Info</Text>
                <TouchableOpacity>
                    <Image 
                      style={styles.image_title}
                    />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {/* *********************** 点线图 *********************** */}
                <View style={{height:ScreenHeight/3,width:ScreenWidth,borderBottomWidth:2,borderBottomColor:'#DCDCDC'}}>
                  <Echarts 
                    option={this.state.StakingOption}
                    height={ScreenHeight/3}/>                
                </View>
                <View style={{height:ScreenHeight*0.45,width:ScreenWidth,alignItems:'center'}}>
                  <View style={{alignItems:'center',justifyContent:'space-between',width:ScreenWidth,flexDirection:'row',height:ScreenHeight*0.4/3}}>
                    {/* 灰色尖锐 */}
                    <Image
                      style={{marginLeft:ScreenWidth/4,marginBottom:ScreenHeight/29-ScreenHeight/40,height:ScreenHeight/35,width:ScreenHeight/35,resizeMode:'cover'}}
                      // source={require('../../images/Staking/greysharp.png')}
                    />
                    {/* 头像 */}
                    <TouchableOpacity
                      onPress={this.copy}
                    >
                      <Identicon
                          style={{marginTop:ScreenHeight/40}}
                          value={this.state.address}
                          size={ScreenHeight/14.5}
                          theme={'polkadot'}
                      />
                    </TouchableOpacity>
                    <View style={{marginRight:ScreenWidth/4,height:ScreenHeight/35,width:ScreenHeight/35}}></View>
                  </View>
                  {/* 地址 */}
                  <Text 
                    style={{width:ScreenWidth/2,marginBottom:ScreenHeight/40,fontSize:ScreenHeight/45,color:'black'}}
                    ellipsizeMode={"middle"}
                    numberOfLines={1}
                  >
                    {this.state.address}
                  </Text>
                  {/* 余额 */}
                  <Text style={{marginBottom:ScreenHeight/80,fontSize:ScreenHeight/47.65,color:'#4B4B4B'}}>
                    {'balance  '+formatBalance(String(this.state.validatorBalances))}
                  </Text>
                  {/* transactions */}
                  {/* <Text style={{fontSize:ScreenHeight/47.65,color:'#4B4B4B'}}>47 transactions</Text> */}
                  {/* nominate */}
                  <View style={{flexDirection:'row',flex:1,alignItems:'center',justifyContent:'center',width:ScreenWidth}}>
                    <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:this.state.inNominators?'#FF4081C7':'#4eacd1',height:ScreenHeight/16,width:ScreenWidth*0.5}}
                      onPress={this.state.inNominators?this.Unnominate:this.nominate}
                    >
                      <Image
                        style={{height:ScreenHeight/32,width:ScreenHeight/32,resizeMode:'contain'}}
                        source={require('../../../images/Staking/branch.png')}
                      />
                      <Text style={{marginLeft:ScreenWidth/30,fontWeight:'bold',fontSize:ScreenHeight/40,color:'white'}}>
                        {this.state.inNominators?'Unnominate':'Nominate'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* 次标题 */}
                  <View style={{borderBottomWidth:1,padding:1,borderBottomColor:'grey',height:ScreenHeight/20,width:ScreenWidth,flexDirection:'row',justifyContent:'space-around'}}>
                    <TouchableOpacity 
                      style={{justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderBottomColor:this.state.titlebottomAA==1?'#005baf':'#ffffff00'}}
                      onPress={()=>{
                        this.setState({
                          titlebottomAA:1
                        })
                      }}
                      >
                      <Text style={{color:this.state.titlebottomAA==1?'#005bae':'#696969',fontSize:ScreenWidth/30}}>
                        Nominators
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={{justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderBottomColor:this.state.titlebottomAA==2?'#005baf':'#ffffff00'}}
                      onPress={()=>{
                        this.setState({
                          titlebottomAA:2
                        })
                      }}
                      >
                      <Text style={{color:this.state.titlebottomAA==2?'#005bae':'#696969',fontSize:ScreenWidth/30}}>
                        Staking Records
                      </Text>
                    </TouchableOpacity>
                    <View 
                      style={{width:ScreenWidth*0.25,justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderBottomColor:this.state.titlebottomAA==3?'#005baf':'#ffffff00'}}
                    >
                    </View>
                  </View>
                </View>
                {
                      (this.state.titlebottomAA==1)?
                        //Nominators
                        (this.state.nominators[0]==null)
                        ?
                            <View style={{borderTopWidth:1,borderTopColor:'grey',alignItems:'center',height:ScreenHeight/2.5}}>
                                <Text style={{marginTop:20,color:'#696969'}}>- Not have Nominator.</Text>
                            </View>
                        :
                        this.state.nominators.map((item,index)=>{
                            return(
                                <View style={{alignItems:'center',flexDirection:'row',height:ScreenHeight/13,borderBottomWidth:1,borderColor:'grey'}} key={index}>
                                        {/* 头像 */}
                                        <Identicon
                                            style={{marginLeft:ScreenWidth/20}}
                                            value={item}
                                            size={ScreenHeight/21}
                                            theme={'polkadot'}
                                        />
                                        {/* 地址 */}
                                        <View style={{marginLeft:ScreenWidth/40,flex:1}}>
                                        <Text
                                            style={{width:ScreenWidth/3.5,fontSize:ScreenHeight/47.64}}
                                            ellipsizeMode={"middle"}
                                            numberOfLines={1}
                                        >
                                            {String(item)}
                                        </Text>
                                        </View>
                                        {/* 余额 */}
                                        <Text
                                          style={{marginRight:ScreenWidth/20,fontSize:ScreenWidth/32,color:'#666666'}}
                                        >
                                          {formatBalance(String(this.state.nominatorsBalance[index]))}
                                        </Text>
                                </View>
                            )
                        })
                      :
                      //Staking Records
                      <View>
                        {
                          this.state.StakingRecords.staking_list_alexander.list.map((item,index)=>{
                            return(
                              <View style={{alignItems:'center',flexDirection:'row',height:ScreenHeight/13,borderTopWidth:(index==0)?1:0,borderBottomWidth:1,borderColor:'grey'}} key={index}>
                                <Image
                                  style={{marginLeft:ScreenWidth/20,height:ScreenHeight/21,width:ScreenHeight/21,resizeMode:'cover'}}
                                  source={(item.st_type=="slashed")?require('../../../images/Staking/loss.png'):require('../../../images/Staking/profit.png')}
                                />
                                <View style={{marginLeft:ScreenWidth/16.30,flex:1}}>
                                  <Text
                                    style={{fontSize:ScreenHeight/47.64,color:'black'}}
                                  >
                                    {'Staking '+item.st_type}
                                  </Text>
                                  <Text
                                    style={{marginTop:ScreenHeight/120,fontSize:ScreenHeight/51.31,color:'#666666'}}
                                  >
                                    {moment(item.st_timestamp).format('DD/MM/YYYY HH:mm:ss')}
                                  </Text>
                                </View>
                                <Text
                                  style={{marginRight:ScreenWidth/20,fontSize:ScreenHeight/41.69,color:'black'}}
                                >
                                  {(item.st_type=="slashed")?"- "+formatBalance(String(item.st_balance)):"+ "+formatBalance(String(item.st_balance))} 
                                </Text>
                              </View>
                            )
                          })
                        }
                        {
                          this.state.StakingNextPage?
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
                      </View>
                }


                  
                {/* </View> */}
              </ScrollView>
            </View>
        )}
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
    justifyContent:'space-between'
  },
  text_title:{
      fontSize:ScreenHeight/37,
      fontWeight:'bold',
      color:'black'
  },
  image_title:{
      height:ScreenHeight/35,
      width:ScreenHeight/35,
      resizeMode:'contain'
  },
})