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
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import moment from "moment/moment";
import Identicon from 'polkadot-identicon-react-native';
import Api from '@polkadot/api/promise';
import WsProvider from '@polkadot/rpc-provider/ws';
import formatBalance from '../../util/formatBalance'
import Echarts from 'native-echarts';
let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
// const Staking_Records=[
//   {Staking_Record:'Staking Reward',time:'12/12/2018 09:17:31',num:35},
//   {Staking_Record:'Staking Slashed',time:'12/12/2018 09:17:31',num:1000},
//   {Staking_Record:'Staking Reward',time:'12/12/2018 09:17:31',num:30},
//   {Staking_Record:'Staking Reward',time:'12/12/2018 09:17:31',num:26}
// ]
import { observer, inject } from "mobx-react";
@inject('rootStore')
@observer
export default class IntegralMall extends Component {
  constructor(props)
  {
      super(props)
      this.state={
        validatorNum:0,
        validatorCount:0,
        intentionNum:0,
        sessionProgress:0,
        sessionLength:0,
        eraProgress:0,
        eraLength:0,
        nominating: [],
        nominatingBalance: [],
        mynominators:[],
        mynominatorsBalance:[],
        validators:[],
        intentions:[],
        next_up:[],
        validatorBalances:[],
        next_upBalances:[],
        sumnominatingBalance:0,
        sumnominatorsBalance:[],
        sumnominatorsBalance2:[],
        title:1,
        titlebottomAA:1,
        titlebottomSO:1,
        isrefresh:false,
        pageNum:1,
        StakingOption: {
          title: {
            text: 'Staking slash record, Unit(xxx)',
            textStyle:{
              color:'grey',
              fontSize:16,
            },
          },
          tooltip: {},
          legend: {
              data: ['']
          },
          xAxis: {
              data: []
          },
          yAxis: {},
          series: [{
              type: 'line',
              data: []
          }]
        },
        text: 'text'
      }
      this.refresh=this.refresh.bind(this)
      this.loding=this.loding.bind(this)
      this.stake=this.stake.bind(this)
      this.nominate=this.nominate.bind(this)
      this.Unstake=this.Unstake.bind(this)
      this.OffClick=this.OffClick.bind(this)
      this.Unnominate=this.Unnominate.bind(this)
      this.Set_Prefs=this.Set_Prefs.bind(this)
      this.Loadmore=this.Loadmore.bind(this)
  }
  //加载信息
  loding(){
    (async()=>{
      const api = await Api.create(new WsProvider(this.props.rootStore.stateStore.ENDPOINT));

      //查询all
      [validatorCount,sessionLength,eraLength] = await Promise.all([
        api.query.staking.validatorCount(),
        api.query.session.sessionLength(),
        api.derive.session.eraLength(),
      ]);
      await api.query.session.validators((validators)=>{
        this.setState({
          validators: validators,
          validatorNum: validators.length
        })
      })
      await api.query.staking.intentions((intentions)=>{
        this.setState({
          intentions: intentions,
          intentionNum: intentions.length
        })
      })
      

      //查询Staking状态
      this.state.intentions.filter((address) =>{
        if(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address.includes(address)){
          this.props.rootStore.stateStore.StakingState=2
        }
      })
      this.state.validators.filter((address) =>{
        if(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address.includes(address)){
          this.props.rootStore.stateStore.isvalidators=1
        }
      })
      
      // console.log('****************************\n'+JSON.stringify(validators))
      await api.derive.session.sessionProgress((sessionProgress)=>{
        this.setState({
          sessionProgress: sessionProgress,
        })
      })
      await api.derive.session.eraProgress((eraProgress)=>{
        this.setState({
          eraProgress: eraProgress,
        })
      })
      this.setState({
        validatorCount: validatorCount,
        sessionLength: sessionLength,
        eraLength: eraLength,
      })


      //Account Actions
      mynominators = await api.query.staking.nominatorsFor(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address)
      mynominatorsBalance = await Promise.all(
        mynominators.map(authorityId =>
          api.query.balances.freeBalance(authorityId)
        )
      );
      this.setState({
          mynominators: mynominators,
          mynominatorsBalance: mynominatorsBalance,
      })
      //查询nominating  //查询Staking状态
      nominating = await api.query.staking.nominating(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address)
      nominatingBalance = await api.query.balances.freeBalance(nominating)
      if (String(nominating)!=''&&String(nominating)!='5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUppTZ')
      {
        this.props.rootStore.stateStore.StakingState=3
      }
      this.setState({
        nominating: String(nominating),
        nominatingBalance: nominatingBalance,
      })
      if(this.props.rootStore.stateStore.StakingState==0){
        this.props.rootStore.stateStore.StakingState=1
      }      
      //求出给nominating的提名者们nominatingNominators的额度总和sumnominatingBalance
      nominatingNominators = await api.query.staking.nominatorsFor(nominating)
      nominatingBalances = await Promise.all(
        nominatingNominators.map(authorityId =>
          api.query.balances.freeBalance(authorityId)
        )
      );
      sumnominatingBalance = 0
      for(i=0;i<nominatingBalances.length;i++){
        sumnominatingBalance = sumnominatingBalance + Number(nominatingBalances[i])
      }
      
      

      //求出给validators的提名者们
      nominators = await Promise.all(
        this.state.validators.map(authorityId =>
          api.query.staking.nominatorsFor(authorityId)
        )
      );
      //求出给validators的提名者们nominators的额度总和
      sumnominatorsBalance=[]
      for(i=0;i<nominators.length;i++){
        nominatorsBalance = await Promise.all(
          nominators[i].map(authorityId =>
            api.query.balances.freeBalance(authorityId)
          )
        );
        sum=0
        for(j=0;j<nominatorsBalance.length;j++){
          sum=sum+Number(nominatorsBalance[j])
        }
        sumnominatorsBalance.push(sum)
      }

    // 找出Next up
    _intentions=[]
    _validators=[]
    _next_up=[]
    this.state.intentions.map((item,index)=>{
      _intentions.push(String(item))
    })
    this.state.validators.map((item,index)=>{
      _validators.push(String(item))
    })
    _intentions.filter((address) =>{
       if(!_validators.includes(address)){
         _next_up.push(address)
       }
    })

    
    //找到next_up的提名者
    nominators2 = await Promise.all(
      _next_up.map(authorityId =>
        api.query.staking.nominatorsFor(authorityId)
      )
    );
    //求出给next_up的提名者们nominators的额度总和
    
    sumnominatorsBalance2=[]
    for(i=0;i<nominators2.length;i++){
      nominatorsBalance2 = await Promise.all(
        nominators2[i].map(authorityId =>
          api.query.balances.freeBalance(authorityId)
        )
      );
      sum2=0
      for(j=0;j<nominatorsBalance2.length;j++){
        sum2=sum2+Number(nominatorsBalance2[j])
      }
      sumnominatorsBalance2.push(sum2)
    }
      
      
        
      
      if (this.state.validators && this.state.validators.length > 0) {
        //查询validators额度
        validatorBalances = await Promise.all(
          this.state.validators.map(authorityId =>
            api.query.balances.freeBalance(authorityId)
          )
        );
        //查询next_up额度
        next_upBalances = await Promise.all(
          _next_up.map(authorityId =>
            api.query.balances.freeBalance(authorityId)
          )
        );
        this.setState({
          // validatorNum: validators.length,
          // intentionNum: intentions.length,
          // validatorCount: validatorCount,
          // sessionLength: sessionLength,
          // eraLength: eraLength,
          // validators: validators,
          validatorBalances: validatorBalances,
          next_up: _next_up,
          next_upBalances: next_upBalances,
          sumnominatingBalance:sumnominatingBalance,
          sumnominatorsBalance: sumnominatorsBalance,
          sumnominatorsBalance2: sumnominatorsBalance2
        })
      }
    })()
  }
  //刷新
  refresh(){
    this.setState({
      isrefresh:true
    })
    setTimeout(()=>{
      this.props.rootStore.stateStore.isvalidators=0
      this.props.rootStore.stateStore.StakingState=0
      this.loding()
      this.setState({
        isrefresh:false
      })
    },2000)
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
      // map.body = '{"user_address":"'+this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address+'","pageNum":"'+this.state.pageNum+'","pageSize":"10"}';
      map.body = '{"user_address":"'+'5Enp67VYwLviZWuyf2XfM5mJXgTWHaa45podYXhUhDCUeQUM'+'","pageNum":"'+(++this.state.pageNum)+'","pageSize":"10"}';
      fetch(REQUEST_URL,map).then(
        (result)=>{
            this.props.rootStore.stateStore.StakingNextPage=JSON.parse(result._bodyInit).staking_list_alexander.hasNextPage
            JSON.parse(result._bodyInit).staking_list_alexander.list.map((item,index)=>{
              this.props.rootStore.stateStore.StakingRecords.staking_list_alexander.list.push(item)
            })
        }
      ).catch()
  }
    
  stake(){
    this.props.navigation.navigate('Stake')
  }
  Unstake(){
    this.props.navigation.navigate('Unstake')
  }
  Set_Prefs(){
    this.props.navigation.navigate('Preferences')
  }
  Unnominate(){
    this.props.navigation.navigate('Unnominate')
  }
  nominate(){
    this.props.rootStore.stateStore.tonominate=0
    this.props.navigation.navigate('Nominate',{address:''})
  }

  OffClick(){}
  componentWillMount(){
    this.loding()
  }
  render() {
    return (
      <SafeAreaView style={{flex:1,backgroundColor:'white'}}>
        <View style={{flex:1,backgroundColor:'white'}}>
          <View style={{height:ScreenHeight/20,width:ScreenWidth,flexDirection:'row',justifyContent:'center'}}>
            <TouchableOpacity 
              style={{justifyContent:'center',alignItems:'center',height:ScreenHeight/20,width:ScreenWidth*0.49,borderWidth:1,borderColor:'#0076ff',borderTopLeftRadius:8,borderBottomLeftRadius:8,backgroundColor:this.state.title==1?'#0076ff':'white'}}
              onPress={()=>{
                this.setState({
                  title:1
                })
              }}
              >
              <Text style={{color:this.state.title==1?'white':'#0076ff',fontSize:ScreenWidth/23.44,marginRight:ScreenWidth/28.85}}>Account Actions</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{justifyContent:'center',alignItems:'center',height:ScreenHeight/20,width:ScreenWidth*0.49,borderWidth:1,borderColor:'#0076ff',borderTopRightRadius:8,borderBottomRightRadius:8,backgroundColor:this.state.title!=1?'#0076ff':'white'}}
              onPress={()=>{
                this.setState({
                  title:2
                })
              }}
              >
              <Text style={{color:this.state.title!=1?'white':'#0076ff',fontSize:ScreenWidth/23.44,marginRight:ScreenWidth/28.85}}>Staking Overview</Text>
            </TouchableOpacity>
          </View>
          {   
              (this.state.title==1)
              ?
              // ***********************AliceAccount************************
              <ScrollView
                refreshControl={<RefreshControl
                  refreshing={this.state.isrefresh}
                  onRefresh={this.refresh}/>}
              >
                {/* *********************** 点线图 *********************** */}
                <View style={{height:ScreenHeight/3,width:ScreenWidth,borderBottomWidth:2,borderBottomColor:'#DCDCDC'}}>
                  <Echarts 
                    option={this.props.rootStore.stateStore.StakingOption}
                    height={ScreenHeight/3}/>                
                </View>
                <View style={{height:ScreenHeight*0.45,width:ScreenWidth,alignItems:'center'}}>
                  <View style={{alignItems:'center',justifyContent:'space-between',width:ScreenWidth,flexDirection:'row',height:ScreenHeight*0.4/3}}>
                    {/* 灰色尖锐 */}
                    <Image
                      style={{tintColor:(this.props.rootStore.stateStore.isvalidators==1)?'#FF4081C7':'#C0C0C0',marginLeft:ScreenWidth/4,marginBottom:ScreenHeight/29-ScreenHeight/40,height:ScreenHeight/35,width:ScreenHeight/35,resizeMode:'cover'}}
                      source={require('../../images/Staking/greysharp.png')}
                    />
                    {/* 头像 */}
                    <Identicon
                        style={{marginTop:ScreenHeight/40}}
                        value={this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address}
                        size={ScreenHeight/14.5}
                        theme={'polkadot'}
                    />
                    
                    <View style={{marginRight:ScreenWidth/4,height:ScreenHeight/35,width:ScreenHeight/35}}></View>
                  </View>
                  {/* 用户名 */}
                  <Text style={{color:'#4B4B4B',marginBottom:ScreenHeight/40,fontSize:ScreenHeight/47.65}}>
                    {this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].account}
                  </Text>
                  {/* 地址 */}
                  <Text 
                    style={{width:ScreenWidth/2,marginBottom:ScreenHeight/40,fontSize:ScreenHeight/45,color:'black'}}
                    ellipsizeMode={"middle"}
                    numberOfLines={1}
                  >
                    {this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address}
                  </Text>
                  {/* 余额 */}
                  <Text style={{marginBottom:ScreenHeight/80,fontSize:ScreenHeight/47.65,color:'#4B4B4B'}}>
                    {'balance  '+formatBalance(this.props.rootStore.stateStore.balance)}
                  </Text>
                  {/* transactions */}
                  {/* <Text style={{fontSize:ScreenHeight/47.65,color:'#4B4B4B'}}>47 transactions</Text> */}
                  
                  {/* Stake or nominate */}
                  {
                    (this.props.rootStore.stateStore.StakingState==3)
                    ?
                      <View style={{flexDirection:'row',flex:1,alignItems:'center',justifyContent:'center',width:ScreenWidth}}>
                        <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#FF4081C7',height:ScreenHeight/16,width:ScreenWidth*0.5}}
                          onPress={this.Unnominate}
                        >
                          <Image
                            style={{height:ScreenHeight/32,width:ScreenHeight/32,resizeMode:'contain'}}
                            source={require('../../images/Staking/branch.png')}
                          />
                          <Text style={{marginLeft:ScreenWidth/30,fontWeight:'bold',fontSize:ScreenHeight/40,color:'white'}}>
                            Unnominate
                          </Text>
                        </TouchableOpacity>
                        
                      </View>
                    :
                      <View style={{flexDirection:'row',flex:1,alignItems:'center',justifyContent:'center',width:ScreenWidth}}>
                      
                        <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:this.props.rootStore.stateStore.StakingState==2?'#FF4081C7':(this.props.rootStore.stateStore.StakingState==1)?'#4eacd1':'#D3D3D3',height:ScreenHeight/16,width:ScreenWidth*0.4}}
                          onPress={(this.props.rootStore.stateStore.StakingState==2)?this.Unstake:(this.props.rootStore.stateStore.StakingState==1)?this.stake:this.OffClick}
                        >
                          <Image
                            style={{height:ScreenHeight/30,width:ScreenHeight/30,resizeMode:'cover'}}
                            source={require('../../images/Staking/whitesharp.png')}
                          />
                          <Text style={{marginLeft:ScreenWidth/40,fontWeight:'bold',fontSize:ScreenWidth/20,color:'white'}}>
                            {this.props.rootStore.stateStore.StakingState==2?'Unstake':'Stake'}
                            
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:this.props.rootStore.stateStore.StakingState==0?'#D3D3D3':'#4eacd1',marginLeft:ScreenWidth/80,height:ScreenHeight/16,width:ScreenWidth*0.4}}
                          onPress={(this.props.rootStore.stateStore.StakingState==2)?this.Set_Prefs:(this.props.rootStore.stateStore.StakingState==1)?this.nominate:this.OffClick}
                        >
                          <Image
                            style={{marginLeft:ScreenWidth/60,height:ScreenHeight/32,width:ScreenHeight/32,resizeMode:'contain'}}
                            source={require('../../images/Staking/branch.png')}
                          />
                          <Text style={{marginLeft:ScreenWidth/40,fontWeight:'bold',fontSize:ScreenWidth/20,color:'white'}}>
                            {(this.props.rootStore.stateStore.StakingState==2)?'Set Prefs':'nominate'}
                          </Text>
                        </TouchableOpacity>
                        {/* <View style={{height:ScreenHeight/16,width:ScreenWidth*0.05,}}/> */}
                        <View style={{borderRadius:ScreenHeight/16/14*4,backgroundColor:'white',position:'absolute',height:ScreenHeight/16/7*4,width:ScreenHeight/16/7*4,alignItems:'center',justifyContent:'center'}}>
                          <Text style={{fontSize:ScreenHeight/48}}>
                            or
                          </Text>
                        </View>
                      </View>

                  }
                  
                </View>
                {/* 次标题 */}
                <View style={{padding:1,borderBottomColor:'grey',height:ScreenHeight/20,width:ScreenWidth,flexDirection:'row',justifyContent:'space-around'}}>
                  <TouchableOpacity 
                    style={{justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderBottomColor:this.state.titlebottomAA==1?'#005baf':'#ffffff00'}}
                    onPress={()=>{
                      this.setState({
                        titlebottomAA:1
                      })
                    }}
                    >
                    <Text style={{color:this.state.titlebottomAA==1?'#005bae':'#696969',fontSize:ScreenWidth/30}}>
                      Staking Records
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
                      Nominating
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderBottomColor:this.state.titlebottomAA==3?'#005baf':'#ffffff00'}}
                    onPress={()=>{
                      this.setState({
                        titlebottomAA:3
                      })
                    }}
                    >
                    <Text style={{color:this.state.titlebottomAA==3?'#005bae':'#696969',fontSize:ScreenWidth/30}}>
                      MyNominstors
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {
                    (this.state.titlebottomAA==1)?
                    // Staking Records
                    <View>
                      {
                        this.props.rootStore.stateStore.StakingRecords.staking_list_alexander.list.map((item,index)=>{
                          return(
                            <View style={{alignItems:'center',flexDirection:'row',height:ScreenHeight/13,borderTopWidth:(index==0)?1:0,borderBottomWidth:1,borderColor:'grey'}} key={index}>
                              <Image
                                style={{marginLeft:ScreenWidth/20,height:ScreenHeight/21,width:ScreenHeight/21,resizeMode:'cover'}}
                                source={(item.st_type=="slashed")?require('../../images/Staking/loss.png'):require('../../images/Staking/profit.png')}
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
                                {(item.st_type=="slashed")?"- "+item.st_balance:"+ "+item.st_balance} 
                              </Text>
                            </View>
                          )
                        })
                      }
                      {
                      this.props.rootStore.stateStore.StakingNextPage?
                        <TouchableOpacity style={{height:ScreenHeight/10,width:ScreenWidth,justifyContent:'center',alignItems:'center'}}
                          onPress={this.Loadmore}
                        >
                          <Text style={{color:'#696969',fontSize:ScreenHeight/45}}>To load more ~</Text>
                        </TouchableOpacity>
                      :
                        
                        <View style={{borderColor:'grey',borderTopWidth:1,height:ScreenHeight/10,width:ScreenWidth,justifyContent:'center',alignItems:'center'}}>
                          <Text style={{color:'#A9A9A9',fontSize:ScreenHeight/52}}>~ Bottom</Text>
                        </View>
                      }
                    </View>
                    :(this.state.titlebottomAA==2)?
                      // Nominating
                      (this.state.nominating[0]==null||String(this.state.nominating)=='5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUppTZ')?
                        <View style={{borderTopWidth:1,borderTopColor:'grey',alignItems:'center',height:ScreenHeight/2.5}}>
                          <Text style={{marginTop:20,color:'#696969'}}>-You are not nominating.</Text>
                        </View>
                      :
                            <View style={{alignItems:'center',flexDirection:'row',height:ScreenHeight/13,borderTopWidth:1,borderBottomWidth:1,borderColor:'grey'}}>
                              <Identicon
                                  style={{marginLeft:ScreenWidth/20}}
                                  value={String(this.state.nominating)}
                                  size={ScreenHeight/21}
                                  theme={'polkadot'}
                              />
                              <View style={{marginLeft:ScreenWidth/20,flex:1}}>
                                <Text
                                  style={{width:ScreenWidth/4,fontSize:ScreenHeight/47.64,color:'black'}}
                                  ellipsizeMode={"middle"}
                                  numberOfLines={1}
                                >
                                  {String(this.state.nominating)}
                                </Text>
                              </View>
                              <Text
                                style={{marginRight:ScreenWidth/20,fontSize:ScreenWidth/32,color:'#666666'}}
                              >
                                {formatBalance(this.state.nominatingBalance)+'('+formatBalance(this.state.sumnominatingBalance)+')'} 
                              </Text>
                            </View>
                      :
                      // MyNominstors
                      <View>
                        {
                          (this.state.mynominators[0]==null)
                          ?
                          <View style={{borderTopWidth:1,borderTopColor:'grey',alignItems:'center',height:ScreenHeight/2.5}}>
                            <Text style={{marginTop:20,color:'#696969'}}>-You don't have nominee.</Text>
                          </View>
                          :
                          this.state.mynominators.map((item,index)=>{
                            return(
                              <View style={{alignItems:'center',flexDirection:'row',height:ScreenHeight/13,borderTopWidth:(index==0)?1:0,borderBottomWidth:1,borderColor:'grey'}} key={index}>
                                <Identicon
                                  style={{marginLeft:ScreenWidth/20}}
                                  value={String(item)}
                                  size={ScreenHeight/21}
                                  theme={'polkadot'}
                                />
                                <View style={{marginLeft:ScreenWidth/20,flex:1}}>
                                  <Text
                                    style={{width:ScreenWidth/4,fontSize:ScreenHeight/47.64,color:'black'}}
                                    ellipsizeMode={"middle"}
                                    numberOfLines={1}
                                  >
                                    {String(item)}
                                  </Text>
                                </View>
                                <Text
                                  style={{marginRight:ScreenWidth/20,fontSize:ScreenWidth/32,color:'#666666'}}
                                >
                                  {formatBalance(this.state.mynominatorsBalance[index])} 
                                </Text>
                              </View>
                            )
                          })
                        }
                      </View>
                }
                
              </ScrollView>
              :
              //***************************************   */Staking Overview     ****************************
              <ScrollView
                refreshControl={<RefreshControl
                  refreshing={this.state.isrefresh}
                  onRefresh={this.refresh}/>}
              >
                {/* <View style={{marginTop:6,marginLeft:2,marginRight:2,height:ScreenHeight/5,borderWidth:2,borderColor:'grey',borderRadius:ScreenHeight/100}}> */}
                <View style={{justifyContent:'center',marginTop:6,marginLeft:2,marginRight:2,height:ScreenHeight/8,borderWidth:2,borderColor:'grey',borderRadius:ScreenHeight/100}}>
                  <View style={{flexDirection:'row',height:ScreenHeight/12}}>
                    {/* validators */}
                    <View style={{alignItems:'center',justifyContent:'center',height:ScreenHeight/12,width:ScreenWidth/4}}>
                      <Text style={{fontSize:ScreenHeight/51.31,color:'#696969'}}>validators</Text>
                      <Text style={{fontSize:ScreenHeight/51.31}}>{this.state.validatorNum+'/'+this.state.validatorCount}</Text>
                    </View>
                    {/* intentions */}
                    <View style={{alignItems:'center',justifyContent:'center',height:ScreenHeight/12,width:ScreenWidth/4}}>
                      <Text style={{fontSize:ScreenHeight/51.31,color:'#696969'}}>intentions</Text>
                      <Text style={{fontSize:ScreenHeight/51.31}}>{this.state.intentionNum}</Text>
                    </View>
                    {/* session */}
                    <View style={{alignItems:'center',justifyContent:'center',height:ScreenHeight/12,width:ScreenWidth/4}}>
                      <Text style={{fontSize:ScreenHeight/51.31,color:'#696969'}}>session</Text>
                      <Text style={{fontSize:ScreenHeight/51.31}}>{this.state.sessionProgress+'/'+this.state.sessionLength}</Text>
                    </View>
                    {/* era */}
                    <View style={{alignItems:'center',justifyContent:'center',height:ScreenHeight/12,width:ScreenWidth/4}}>
                      <Text style={{fontSize:ScreenHeight/51.31,color:'#696969'}}>era</Text>
                      <Text style={{fontSize:ScreenHeight/51.31}}>{this.state.eraProgress+'/'+this.state.eraLength}</Text>
                    </View>
                  </View>
                  {/* <Text style={{marginLeft:ScreenWidth/40,fontSize:ScreenHeight/51.31,height:ScreenHeight/10/3,color:'#696969'}}>balance</Text>
                  <Text style={{marginLeft:ScreenWidth/40,fontSize:ScreenHeight/51.31,height:ScreenHeight/10/3}}>lowest vailidator 2,181,791(+1,570,443)</Text>
                  <Text style={{marginLeft:ScreenWidth/40,fontSize:ScreenHeight/51.31,height:ScreenHeight/10/3}}>highest intention unknown</Text> */}
                </View>
                {/* validators and Next_up */}
                <View style={{padding:1,borderBottomColor:'grey',height:ScreenHeight/20,width:ScreenWidth,flexDirection:'row',borderBottomWidth:1,borderBottomColor:'black'}}>
                  <TouchableOpacity 
                    style={{justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderBottomColor:this.state.titlebottomSO==1?'blue':'#ffffff00'}}
                    onPress={()=>{
                      this.setState({
                        titlebottomSO:1
                      })
                    }}
                    >
                    <Text style={{marginHorizontal:ScreenWidth/40,color:this.state.titlebottom==1?'blue':'#696969',fontSize:ScreenWidth/30}}>
                      Validators
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderBottomColor:this.state.titlebottomSO==2?'blue':'#ffffff00'}}
                    onPress={()=>{
                      this.setState({
                        titlebottomSO:2
                      })
                    }}
                    >
                    <Text style={{marginHorizontal:ScreenWidth/40,color:this.state.titlebottom==2?'blue':'#696969',fontSize:ScreenWidth/30}}>
                      Next up
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  {
                    (this.state.titlebottomSO==1)?
                    //Validators
                    (this.state.validators[0]==null)
                    ?
                      <View style={{borderTopWidth:1,borderTopColor:'grey',alignItems:'center',height:ScreenHeight/2.5}}>
                        <Text style={{marginTop:20,color:'#696969'}}>- Not have Validator.</Text>
                      </View>
                    :
                    this.state.validators.map((item,index)=>{
                      return(
                          <TouchableOpacity style={{alignItems:'center',flexDirection:'row',height:ScreenHeight/13,borderBottomWidth:1,borderColor:'grey'}} key={index}
                            onPress={()=>{
                              //获取选中账户staking折线图数据
                              let REQUEST_URL ='http://107.173.250.124:8080/staking_chart_alexander'
                              let map = {
                                    method:'POST'
                                  }
                              let privateHeaders = {
                                'Content-Type':'application/json'
                              }
                              map.headers = privateHeaders;
                              map.follow = 20;
                              map.timeout = 0;
                              map.body = '{"user_address":"'+String(item)+'","UTCdate":"'+moment((new Date()).getTime()).format('YYYY-MM-DD HH:mm:ss')+'"}';
                              fetch(REQUEST_URL,map).then(
                                (result)=>{
                                  _StakingOption=this.state.StakingOption
                                  JSON.parse(result._bodyInit).map((item,index)=>{
                                    _StakingOption.xAxis.data.push(item.time.substring(5,7)+'/'+item.time.substring(8,10))
                                    _StakingOption.series[0].data.push((item.slash_balance/1000000).toFixed(1))
                                  })
                                  max=0
                                  for(i=0;i<_StakingOption.series[0].data.length;i++)
                                  {
                                    if(_StakingOption.series[0].data[i]>max){
                                      max=_StakingOption.series[0].data[i]
                                    }
                                  }
                                  power = formatBalance.calcSi(String(max),formatBalance.getDefaults().decimals).power+formatBalance.getDefaults().decimals
                                  unit = formatBalance.calcSi(String(max),formatBalance.getDefaults().decimals).text
                                  for(i=0;i<_StakingOption.series[0].data.length;i++)
                                  {
                                    _StakingOption.series[0].data[i]=(_StakingOption.series[0].data[i]/Number(Math.pow(10,power))).toFixed(3)
                                    
                                  }
                                  _StakingOption.title.text = 'Staking slash record, Unit ( '+unit+' )'
                                  this.setState({
                                    StakingOption:_StakingOption
                                  })
                                  this.props.navigation.navigate('Validator_Info',{address:String(item),StakingOption:this.state.StakingOption})
                                }
                              ).catch()

                              
                            }}
                          >
                                {/* 头像 */}
                                <Identicon
                                  style={{marginLeft:ScreenWidth/20}}
                                  value={String(item)}
                                  size={ScreenHeight/21}
                                  theme={'polkadot'}
                                />
                                {/* <Image
                                  style={{marginLeft:ScreenWidth/20,height:ScreenHeight/21,width:ScreenHeight/21,resizeMode:'cover'}}
                                  source={require('../../images/Staking/accountIMG.png')}
                                /> */}
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
                                  {this.state.validatorBalances[0]==null?0:formatBalance(String(Number(this.state.validatorBalances[index])+this.state.sumnominatorsBalance[index]))+'(+'+formatBalance(String(this.state.sumnominatorsBalance[index]))+')'}
                                </Text>
                          </TouchableOpacity>
                      )
                    })
                    :
                    // Next_up
                    (this.state.next_up[0]==null)
                    ?
                      <View style={{borderTopWidth:1,borderTopColor:'grey',alignItems:'center',height:ScreenHeight/2.5}}>
                        <Text style={{marginTop:20,color:'#696969'}}>Not have Next up.</Text>
                      </View>
                    :
                    this.state.next_up.map((item,index)=>{
                      return(
                          <TouchableOpacity style={{alignItems:'center',flexDirection:'row',height:ScreenHeight/13,borderBottomWidth:1,borderColor:'grey'}} key={index}
                            onPress={()=>{
                              //获取选中账户staking折线图数据
                              let REQUEST_URL ='http://107.173.250.124:8080/staking_chart_alexander'
                              let map = {
                                    method:'POST'
                                  }
                              let privateHeaders = {
                                'Content-Type':'application/json'
                              }
                              map.headers = privateHeaders;
                              map.follow = 20;
                              map.timeout = 0;
                              map.body = '{"user_address":"'+item+'","UTCdate":"'+moment((new Date()).getTime()).format('YYYY-MM-DD HH:mm:ss')+'"}';
                              fetch(REQUEST_URL,map).then(
                                (result)=>{
                                  _StakingOption=this.state.StakingOption
                                  JSON.parse(result._bodyInit).map((item,index)=>{
                                    _StakingOption.xAxis.data.push(item.time.substring(5,7)+'/'+item.time.substring(8,10))
                                    _StakingOption.series[0].data.push((item.slash_balance/1000000).toFixed(1))
                                  })
                                  this.setState({
                                    StakingOption:_StakingOption
                                  })
                                  this.props.navigation.navigate('Validator_Info',{address:item,StakingOption:this.state.StakingOption})
                                }
                              ).catch()

                            }}
                          >
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
                                    {/* String类型 */}
                                    {item}
                                  </Text>
                                </View>
                                {/* 余额 */}
                                <Text
                                  style={{marginRight:ScreenWidth/20,fontSize:ScreenHeight/51.31,color:'#666666'}}
                                >
                                  {formatBalance(String(Number(this.state.next_upBalances[index])+this.state.sumnominatorsBalance2[index]))+'(+'+formatBalance(String(this.state.sumnominatorsBalance2[index]))+')'}
                                </Text>
                          </TouchableOpacity>
                      )
                    })
                  }
                </View>
              </ScrollView>

          }
        </View>
      </SafeAreaView>
    );
  }
}