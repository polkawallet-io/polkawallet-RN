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
} from 'react-native';
import Identicon from 'polkadot-identicon-react-native';
import Api from '@polkadot/api/promise';
import WsProvider from '@polkadot/rpc-provider/ws';

let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;

import { observer, inject } from "mobx-react";
@inject('rootStore')
@observer
export default class New extends Component {
    constructor(props)
    {
        super(props)
        this.state = {
            Account: this.props.rootStore.stateStore.Account+1
        }
        this.Create_Account=this.Create_Account.bind(this)
        this.Switch_Account=this.Switch_Account.bind(this)
        this.camera=this.camera.bind(this)

    }
    camera(){
      this.props.t.setState({
        is:false
      })
      this.props.p.rootStore.stateStore.tocamera=0
      this.props.p.navigation.navigate('Camera')
    }
    Create_Account()
    {
      this.props.t.setState({
        is:false
      })
      this.props.p.navigation.navigate('Create_Account')
    }
    Switch_Account(){
      // Query Balance
      (async()=>{
        this.props.rootStore.stateStore.isvalidators=0
        this.props.rootStore.stateStore.StakingState=0
        this.props.rootStore.stateStore.balances.map((item,index)=>{
          if(item.address == this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address){
            this.props.rootStore.stateStore.balanceIndex=(index)
          }
        })
        const api = await Api.create(new WsProvider(this.props.rootStore.stateStore.ENDPOINT));
        // balance = await api.query.balances.freeBalance(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address);
        // this.props.rootStore.stateStore.balance=String(balance)
        
        //查询Staking状态
        intentions = await api.query.staking.intentions()
        validators = await api.query.session.validators()
        nominating = (await api.query.staking.nominating(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address)).unwrapOr(null)
        intentions.filter((address) =>{
          if(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address.includes(address)){
            this.props.rootStore.stateStore.StakingState=2
          }
        })
        validators.filter((address) =>{
          if(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address.includes(address)){
            this.props.rootStore.stateStore.isvalidators=1
          }
        })
        if (nominating)
        {
          this.props.rootStore.stateStore.StakingState=3
        }
        if(this.props.rootStore.stateStore.StakingState!=2&&this.props.rootStore.stateStore.StakingState!=3){
          this.props.rootStore.stateStore.StakingState=1
        }
      })()
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
  componentWillMount(){
    
  }
  render() {
        return (
            <View style={[styles.container]}>
              <TouchableOpacity style={{width:ScreenWidth*0.43,flex:1}}
                onPress={()=>{
                  this.props.t.setState({
                    is:false
                  })
                }}
              />
              <View style={{backgroundColor:'#7582C9'}}>
                <View style={{height:ScreenHeight/14*3,marginTop:ScreenHeight/14}}>
                  <ScrollView>
                    {
                      this.props.rootStore.stateStore.Accounts.map((item,index)=>{
                        if(index!=0)
                        return(
                          <TouchableOpacity style={[styles.account,{backgroundColor:(this.props.rootStore.stateStore.Account==index)?'#5c67a6':'#7582C9'}]} key={index}
                            onPress={()=>{
                              this.props.rootStore.stateStore.Account=index
                              this.setState({
                                Account:index
                              })
                              this.Switch_Account()
                            }}
                          >
                            {/* 账户头像 */}
                            <Identicon
                              style={styles.image}
                              value={item.address}
                              size={ScreenHeight/22}
                              theme={'polkadot'}
                            />
                            {/* 账户名 and 地址 */}
                            <View style={{marginLeft:ScreenWidth/30,flex:1}}>
                              <Text
                                style={{fontSize:ScreenHeight/44.47,color:'white'}}
                              >
                                {item.account}</Text>
                              <Text
                                style={{marginTop:ScreenHeight/200,fontSize:ScreenHeight/51.31,width:ScreenWidth/3,color:'#EEEEEE'}}
                                ellipsizeMode={"middle"}
                                numberOfLines={1}
                              >
                                {item.address}</Text>
                            </View>
                          </TouchableOpacity>
                        )
                      })
                    }
                  </ScrollView>
                </View>
                {/* 上线 */}
                <View style={styles.line}/>
                <View style={styles.SandC}>
                  {/* 摄像头 */} 
                  {/* //Need Open */}
                  <TouchableOpacity style={[styles.middle,{width:ScreenWidth*0.57*0.45-0.5}]}
                    onPress={this.camera}
                  >
                    <Image
                      style={[{height:ScreenHeight/38,width:ScreenHeight/38,resizeMode:'contain'}]}
                      source={require('../../../images/Assets/right_menu/Scan.png')}
                    />
                    <Text style={{marginTop:ScreenHeight/200,fontSize:ScreenWidth/25,color:'#333333'}}>Scan</Text>
                  </TouchableOpacity>
                  <View style={{width:1,height:ScreenHeight/40,backgroundColor:'#A9A9A9'}}/>
                  {/* 创建钱包 */}
                  {/* //Need Open */}
                  <TouchableOpacity style={[styles.middle,{width:ScreenWidth*0.57*0.55-0.5}]}
                  // <TouchableOpacity style={[styles.middle,{width:ScreenWidth*0.57}]}
                    onPress={()=>{this.Create_Account()}}
                  >
                    <Image
                      style={[{height:ScreenHeight/38,width:ScreenHeight/38,resizeMode:'contain'}]}
                      source={require('../../../images/Assets/right_menu/Create_Account.png')}
                    />
                    <Text style={{marginTop:ScreenHeight/200,fontSize:ScreenWidth/25,color:'#333333'}}>Create Account</Text>
                  </TouchableOpacity>
                </View>
                <View style={{flex:1}}/>
                {/* 下线 */}
                {/* //Need Open */}
                {/* <View style={styles.line}/> */}
                {/* 帮助 */}
                {/* //Need Open */}
                {/* <TouchableOpacity style={[styles.middle,{height:ScreenHeight/13,flexDirection:'row'}]}>
                  <Image
                    style={[{height:ScreenHeight/48,width:ScreenHeight/48,resizeMode:'contain'}]}
                    source={require('../../../images/Assets/right_menu/help.png')}
                  />
                  <Text style={{fontWeight:'500',color:'white',marginLeft:ScreenWidth/70,fontSize:ScreenWidth/38}}>Can I help you?</Text>
                </TouchableOpacity> */}
              </View>
            </View>
            
        )
}
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#ffffff00',
    flexDirection:'row'
  },
  account: {
    height:ScreenHeight/14,
    flexDirection:'row',
    alignItems:'center',
  },
  image: {
    height:ScreenHeight/20,
    width:ScreenHeight/20,
    resizeMode:'contain',
    marginLeft:ScreenWidth/35
  },
  line:{
    marginTop:ScreenHeight/70,
    height:1,
    backgroundColor:'#D3D3D3'
  },
  SandC:{
    flexDirection:'row',
    marginTop:ScreenHeight/70,
    height:ScreenHeight/11.5,
    backgroundColor:'white',
    alignItems:'center',
  },
  middle:{
    justifyContent:'center',
    alignItems:'center'
  }
});