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
  RefreshControl,
  SafeAreaView,
  StatusBar,
  AsyncStorage,
  AppState,
  Alert,
  Linking,
} from 'react-native';
import {
  isFirstTime,
  isRolledBack,
  packageVersion,
  currentVersion,
  checkUpdate,
  downloadUpdate,
  switchVersion,
  switchVersionLater,
  markSuccess,
} from 'react-native-update';
import _updateConfig from '../../../update.json';

import {NavigationActions, StackActions} from "react-navigation";

import Identicon from 'polkadot-identicon-react-native';
import moment from "moment/moment";
import SInfo from 'react-native-sensitive-info';
import Drawer from 'react-native-drawer'
import Right_menu from './secondary/right_menu'

import Api from '@polkadot/api/promise';
import WsProvider from '@polkadot/rpc-provider/ws';
import formatBalance from '../../util/formatBalance'


let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
let Platform = require('Platform');
const {appKey} = _updateConfig[Platform.OS];
import { observer, inject } from "mobx-react";
@inject('rootStore')
@observer
export default class Assets extends Component {
  constructor(props)
    {
        super(props)
        this.state = {
            is: false,
            name:'0',
            address:'0',
            isfirst:0,
            isrefresh:false,
            color:'rgb(0,255,0)'
        }
        this.QR_Code=this.QR_Code.bind(this)
        this.Coin_details=this.Coin_details.bind(this)
        this.refresh=this.refresh.bind(this)
        this.Loading=this.Loading.bind(this)
        this.handleAppStateChange=this.handleAppStateChange.bind(this)
        this.doUpdate=this.doUpdate.bind(this)
    }


  QR_Code(){
    this.props.navigation.navigate('QR_Code')
  }
  Coin_details(){
    let REQUEST_URL ='http://107.173.250.124:8080/tx_money_date'
        let map = {
              method:'POST'
            }
        let privateHeaders = {
          'Content-Type':'application/json'
        }
        map.headers = privateHeaders;
        map.follow = 20;
        map.timeout = 0;
        map.body = '{"user_address":"'+this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address+'","UTCdate":"'+moment((new Date()).getTime()).format('YYYY-MM-DD HH:mm:ss')+'"}';
        fetch(REQUEST_URL,map).then(
          (result)=>{
            this.props.rootStore.stateStore.option.xAxis.data=[]
            this.props.rootStore.stateStore.option.series[0].data=[]
            JSON.parse(result._bodyInit).map((item,index)=>{
              this.props.rootStore.stateStore.option.xAxis.data.push(item.time.substring(5,7)+'/'+item.time.substring(8,10))
              this.props.rootStore.stateStore.option.series[0].data.push(item.money)
            })
            max=0
            for(i=0;i<this.props.rootStore.stateStore.option.series[0].data.length;i++)
            {
              if(this.props.rootStore.stateStore.option.series[0].data[i]>max){
                max=this.props.rootStore.stateStore.option.series[0].data[i]
              }
            }
            power = formatBalance.calcSi(String(max),formatBalance.getDefaults().decimals).power+formatBalance.getDefaults().decimals
            unit = formatBalance.calcSi(String(max),formatBalance.getDefaults().decimals).text
            for(i=0;i<this.props.rootStore.stateStore.option.series[0].data.length;i++)
            {
              this.props.rootStore.stateStore.option.series[0].data[i]=(this.props.rootStore.stateStore.option.series[0].data[i]/Number(Math.pow(10,power))).toFixed(3)
               
            }
            this.props.rootStore.stateStore.option.title.text = 'Assets change record, Unit ( '+unit+' )'
            this.props.navigation.navigate('Coin_details')
          }
        ).catch()
    
  }
  Loading(){
      
    SInfo.getAllItems({sharedPreferencesName:'Polkawallet',keychainService: 'PolkawalletKey'}).then(
      (result)=>{
        if(JSON.stringify(result).length<10 )
        {
          let resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Create_Account'},{t:this})
            ]
          })
          this.props.navigation.dispatch(resetAction)
        }else{
          this.setState({
            isfirst:1
          })
          this.props.rootStore.stateStore.refreshBefore=this.props.rootStore.stateStore.Account
          this.props.rootStore.stateStore.balanceIndex=0
          this.props.rootStore.stateStore.Account=0
          this.props.rootStore.stateStore.Accountnum=0
          this.props.rootStore.stateStore.isfirst=1
          this.props.rootStore.stateStore.Accounts=[{account:'NeedCreate',address:'xxxxxxxxxxxxxxxxxxxxxxxxxxx'}]
          this.props.rootStore.stateStore.balances=[{address:'xxxxxxxxxxxxxxxxxxxxxxxxxxx',balance:0}]
          if (Platform.OS === 'android') {
            //android
            //android
            for(var o in result){
              this.props.rootStore.stateStore.Accounts.push({account:JSON.parse(result[o]).meta.name,address:JSON.parse(result[o]).address})
              this.props.rootStore.stateStore.Account++
              this.props.rootStore.stateStore.Accountnum++
              //创建查询每个账户的进程
              (async()=>{
                  let _address = o
                  const api = await Api.create(new WsProvider(this.props.rootStore.stateStore.ENDPOINT));
                  await api.query.balances.freeBalance(_address,(balance)=>{
                    this.props.rootStore.stateStore.have=0
                    this.props.rootStore.stateStore.balances.map((item,index)=>{
                      if(item.address!=_address){}else{
                        this.props.rootStore.stateStore.have=1
                        this.props.rootStore.stateStore.balances[index].balance=balance
                      }
                    })
                    if(this.props.rootStore.stateStore.have==0){
                      this.props.rootStore.stateStore.balances.push({address:_address,balance:balance})}
                  })
              })()
            }
          }else{
            //ios
            result.map((item,index)=>{
              item.map((item,index)=>{
                // alert(item.key)//地址
                // alert(JSON.parse(item.value).meta.name)//用户名
                // 添加用户到mobx
                this.props.rootStore.stateStore.Accounts.push({account:JSON.parse(item.value).meta.name,address:item.key})
                this.props.rootStore.stateStore.Account++
                this.props.rootStore.stateStore.Accountnum++
                //创建查询每个账户的进程
                (async()=>{
                  const api = await Api.create(new WsProvider(this.props.rootStore.stateStore.ENDPOINT));
                  await api.query.balances.freeBalance(item.key,(balance)=>{
                    let _address=item.key
                    this.props.rootStore.stateStore.have=0
                    this.props.rootStore.stateStore.balances.map((item,index)=>{
                      if(item.address!=_address){}else{
                        this.props.rootStore.stateStore.have=1
                        this.props.rootStore.stateStore.balances[index].balance=balance
                      }
                    })
                    if(this.props.rootStore.stateStore.have==0){this.props.rootStore.stateStore.balances.push({address:_address,balance:balance})}
                  })
                })()
              })
            })
            
          }
        }
      }
    )
    setTimeout ( () => {
      if(this.props.rootStore.stateStore.isfirst==1){this.props.rootStore.stateStore.Account=1}
      this.props.rootStore.stateStore.Account=(this.props.rootStore.stateStore.refreshBefore==0&&this.props.rootStore.stateStore.isfirst==1)?1:this.props.rootStore.stateStore.refreshBefore
      if(this.props.rootStore.stateStore.Account!=0){
        // Query Balance
        (async()=>{
          const api = await Api.create(new WsProvider(this.props.rootStore.stateStore.ENDPOINT));
          const props = await api.rpc.system.properties();
          fees = await api.derive.balances.fees()
          this.props.rootStore.stateStore.balances.map((item,index)=>{
            if(item.address == this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address){
              this.props.rootStore.stateStore.balanceIndex=(index)
              
            }
          })
          // balance = await api.query.balances.freeBalance(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address);
          // this.props.rootStore.stateStore.balance=String(balance)

          
          formatBalance.setDefaults({
            decimals: props.get('tokenDecimals'),
            unit: props.get('tokenSymbol')
          });     
          //获取本地账户staking折线图数据
          REQUEST_URL ='http://107.173.250.124:8080/staking_chart_alexander'
          map = {
                method:'POST'
              }
          privateHeaders = {
            'Content-Type':'application/json'
          }
          map.headers = privateHeaders;
          map.follow = 20;
          map.timeout = 0;
          map.body = '{"user_address":"'+this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address+'","UTCdate":"'+moment((new Date()).getTime()).format('YYYY-MM-DD HH:mm:ss')+'"}';
          // map.body = '{"user_address":"'+'5Enp67VYwLviZWuyf2XfM5mJXgTWHaa45podYXhUhDCUeQUM'+'","UTCdate":"'+moment((new Date()).getTime()).format('YYYY-MM-DD HH:mm:ss')+'"}';
          fetch(REQUEST_URL,map).then(
            (result)=>{
              this.props.rootStore.stateStore.StakingOption.xAxis.data=[]
              this.props.rootStore.stateStore.StakingOption.series[0].data=[]
              JSON.parse(result._bodyInit).map((item,index)=>{
                this.props.rootStore.stateStore.StakingOption.xAxis.data.push(item.time.substring(5,7)+'/'+item.time.substring(8,10))
                this.props.rootStore.stateStore.StakingOption.series[0].data.push(item.slash_balance)
              })
              max=0
              for(i=0;i<this.props.rootStore.stateStore.StakingOption.series[0].data.length;i++)
              {
                if(this.props.rootStore.stateStore.StakingOption.series[0].data[i]>max){
                  max=this.props.rootStore.stateStore.StakingOption.series[0].data[i]
                }
              }
              power = formatBalance.calcSi(String(max),formatBalance.getDefaults().decimals).power+formatBalance.getDefaults().decimals
              unit = formatBalance.calcSi(String(max),formatBalance.getDefaults().decimals).text
              
              for(i=0;i<this.props.rootStore.stateStore.StakingOption.series[0].data.length;i++)
              {
                this.props.rootStore.stateStore.StakingOption.series[0].data[i]=(this.props.rootStore.stateStore.StakingOption.series[0].data[i]/Number(Math.pow(10,power))).toFixed(3)
                
              }
              this.props.rootStore.stateStore.StakingOption.title.text = 'Staking slash record, Unit ( '+unit+' )'
            }
          ).catch() 
          setInterval(async()=>{
            myDate=new Date()
            blockdate = await api.query.timestamp.now()
            lastBlockTime=Number(myDate)-Number(blockdate)
            if(lastBlockTime>120000){
              a=192,b=192,c=192
            }else{
              colorPara = (lastBlockTime / 1000) * (255 / 18)
              a=0;
              b=255;
              c=0;
              for(i=0;i<colorPara;i++){
                if(b>=255&&a<255)
                {
                    a++;
                }
                if(a>=255)b--;
                if(a>=255&&b<=0){
                    a=255;b=0;
                }
              }
            }
            
            this.setState({
              color:'rgb('+a+','+b+','+c+')'
            })
           
          },500);
        })()
      }
   
  

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
            this.props.rootStore.stateStore.hasNextPage=JSON.parse(result._bodyInit).tx_list.hasNextPage
            this.props.rootStore.stateStore.transactions=JSON.parse(result._bodyInit)
          }
        ).catch()
      }, 100);
      //获取本地账户的Staking Records
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
          map.body = '{"user_address":"'+this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address+'","pageNum":"1","pageSize":"10"}';
          // map.body = '{"user_address":"'+'5Enp67VYwLviZWuyf2XfM5mJXgTWHaa45podYXhUhDCUeQUM'+'","pageNum":"1","pageSize":"10"}';
          fetch(REQUEST_URL,map).then(
            (result)=>{
              this.props.rootStore.stateStore.StakingNextPage=JSON.parse(result._bodyInit).staking_list_alexander.hasNextPage
              this.props.rootStore.stateStore.StakingRecords=JSON.parse(result._bodyInit)
            }
      ).catch()

      
  }
  // 刷新
  refresh(){
    this.setState({
      isrefresh:true
    })
    this.Loading()
    setTimeout(()=>{
      this.setState({
        isrefresh:false
      })
    },2000)
    
  }
  handleAppStateChange(appState){
    if(appState=='background'&&this.props.rootStore.stateStore.GestureState==2){
      let resetAction = StackActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName: 'Gesture'})
        ]
      })
      this.props.navigation.dispatch(resetAction)
    }
  }
  doUpdate(info){
    downloadUpdate(info).then(hash => {
    Alert.alert('Alert', 'Download finished, whether to restart the application?', [
            {text: 'Yes', onPress: ()=>{switchVersion(hash);}},
            {text: 'No',},
            {text: 'Next startup time', onPress: ()=>{switchVersionLater(hash);}},
        ]);
    }).catch(err => {
        Alert.alert('Alert', 'Update failed.'); 
    });
  };
  componentWillMount(){
    if(isFirstTime){
      markSuccess()
    }
    // checkUpdate(appKey).then(info => {
    //   if (info.upToDate) {} else {
    //     Alert.alert('Alert', 'Check the new version:'+info.name+',whether to download? \n'+ info.description, [
    //       {text: 'Yes', onPress: ()=>{this.doUpdate(info)}},
    //       {text: 'No',}, ]);
    //     }
    // }).catch(err => {
    //   Alert.alert('Alert', 'Update failed.'); 
    // });
    setInterval(()=>{
      this.props.rootStore.stateStore.balances.map((item,index)=>{
        if(item.address == this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address){
          this.props.rootStore.stateStore.balanceIndex=(index)
        }
      })
    },5000)
    AppState.addEventListener('change', this.handleAppStateChange)
    AsyncStorage.getItem('Gesture').then(
      (result)=>{
          if(result==null){
              this.props.rootStore.stateStore.GestureState=0
          }else{
            if(this.props.rootStore.stateStore.GestureState!=2){
              this.props.rootStore.stateStore.Gesture=result
              this.props.rootStore.stateStore.GestureState=2
              let resetAction = StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'Gesture'})
                ]
              })
              this.props.navigation.dispatch(resetAction)
            }
          }
      }
    )
    
    this.Loading()
  }
  
  render() {
    return (
      <SafeAreaView style={{flex:1,backgroundColor:'#776f71'}}>
        {
          (Platform.OS === 'android')?
            <StatusBar
              backgroundColor={'transparent'} //状态栏背景颜色
              translucent={true}
              // backgroundColor={'white'} //状态栏背景颜色
              barStyle={'dark-content'} //状态栏样式（黑字）
            />
          :<View/>
        }
      <Drawer
        type='overlay'
        side='right'
        content={<Right_menu p={this.props} t={this}/>}
        open={this.state.is}
        tapToClose={true}//点底层可关闭
        // openDrawerOffset={0.43} // 左边留0.336
        openDrawerOffset={0} // 左边留0.336
        closedDrawerOffset={0}//左边留0
        panOpenMask={0.1}
      >
       <View style={{flex:1,backgroundColor:'white',}}>
        {/* 标题栏 */}
        <View style={{height:(Platform.OS === 'android')?ScreenHeight/9:ScreenHeight/14,backgroundColor:'#776f71',flexDirection:'row',alignItems:'flex-end'}}>
          <View style={{marginLeft:ScreenWidth/26.79,height:ScreenHeight/33.35,width:ScreenHeight/33.35}}></View>
          <View style={{height:ScreenHeight/10.6/1.6,flex:1,justifyContent:'flex-end',alignItems:'center'}}>
              {/* logo */}
              <Image
                style={{marginRight:ScreenHeight/20*4.73/4,marginBottom:ScreenHeight/75,height:ScreenHeight/20,width:ScreenHeight/20*4.73,resizeMode:'contain'}}
                source={require('../../images/Assets/logo.png')}
              />
          </View>
          {/* 右菜单 */}
          <TouchableOpacity
            onPress={()=>{
              this.setState({
                is:true
              })
            }}
          >
            <Image
              style={{marginRight:ScreenWidth/26.79,marginBottom:ScreenHeight/75,height:ScreenHeight/33.35,width:ScreenHeight/33.35}}
              source={require('../../images/Assets/rightMenu.png')}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          refreshControl={<RefreshControl
                            refreshing={this.state.isrefresh}
                            onRefresh={this.refresh}/>}
        >
          <View style={{height:ScreenHeight/3.5,backgroundColor:'#FF4081C7',alignItems:'center'}}>
              <View style={{marginTop:ScreenHeight/55,width:ScreenWidth,height:ScreenHeight/3.81/2.5,alignItems:'center',justifyContent:'center'}}>
                {/* 头像 */}
                <Identicon
                  value={this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.isfirst==0?0:this.props.rootStore.stateStore.Account].address}
                  size={ScreenHeight/14}
                  theme={'polkadot'}
                />
                
              </View>
              <View style={{height:ScreenHeight/3.81/6,width:ScreenWidth,alignItems:'center',justifyContent:'center'}}>
                {/* 用户名 */}
                <Text style={{fontWeight:"200",fontSize:ScreenHeight/45,color:'white'}}>
                  {this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.isfirst==0?0:this.props.rootStore.stateStore.Account].account}
                </Text>
              </View>
              <View style={{height:ScreenHeight/3.81/6,width:ScreenWidth,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                {/* 地址 */}
                <Text 
                  style={{fontWeight:"200",width:ScreenWidth*0.5,fontSize:ScreenHeight/45,color:'white'}}
                  ellipsizeMode={"middle"}
                  numberOfLines={1}
                >
                  {this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.isfirst==0?0:this.props.rootStore.stateStore.Account].address}
                </Text>
                {/* 二维码 */}
                <TouchableOpacity
                  onPress={this.QR_Code}
                >
                  <Image
                    style={{marginLeft:ScreenWidth/53.57,height:ScreenHeight/45,width:ScreenHeight/45,opacity:0.8}}
                    source={require('../../images/Assets/QrButton.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={{flex:1}}></View>
              <View style={{alignItems:'center',flexDirection:'row',justifyContent:'space-between',height:ScreenHeight/3.81/3.8,width:ScreenWidth}}>
                <Text style={{fontWeight:'bold',marginLeft:ScreenWidth/40,color:'white',fontSize:ScreenWidth/25}}>Assets</Text>
                {/* 添加币种 */}
                <TouchableOpacity
                  onPress={()=>{this.setState({s:2})}}
                >
                  <Image
                    style={{marginRight:ScreenWidth/20,height:ScreenHeight/30,width:ScreenHeight/30,opacity:0.9}}
                    //Need Open
                    // source={require('../../images/Assets/addAssets.png')}
                  />
                </TouchableOpacity>
              </View>
          </View>
          {/* 各种币具体信息 */}
          <TouchableOpacity
            onPress={this.Coin_details}
          >
            <View style={{flexDirection:'row',height:ScreenHeight/10,backgroundColor:'white',borderBottomColor:'#F5F5F5',borderBottomWidth:2}}>
                <View style={{justifyContent:'center',alignItems:'center',width:ScreenWidth/6,height:ScreenHeight/10}}>
                    <Image
                      style={{borderRadius:ScreenHeight/32,height:ScreenHeight/16,width:ScreenHeight/16}}
                      source={require('../../images/Assets/DOT.png')}
                    />
                </View>
                <View style={{justifyContent:'center',flex:1,}}>
                  <View style={{flexDirection:'row'}}>
                    <Text style={{fontSize:ScreenWidth/23.44,color:'black'}}>DOT</Text>
                    <View style={{marginLeft:ScreenWidth/60,height:ScreenHeight/98,width:ScreenHeight/98,borderRadius:ScreenHeight/196,backgroundColor:this.state.color}}/>
                  </View>
                  <Text style={{marginTop:ScreenHeight/130,color:'#666666',fontSize:ScreenWidth/26.79}}>Alexander TestNet</Text>
                </View>
                <View style={{height:ScreenHeight/10,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{fontSize:ScreenWidth/23.44,marginRight:ScreenWidth/28.85,color:'black'}}>{formatBalance(this.props.rootStore.stateStore.balances[this.props.rootStore.stateStore.balanceIndex].balance)}</Text>
                </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
       </View>
      </Drawer> 
      </SafeAreaView>   
      );
  }
}