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
import Drawer from 'react-native-drawer'
import Right_menu from './secondary/right_menu'
import Api from '@polkadot/api/promise';
import WsProvider from '@polkadot/rpc-provider/ws';
import { Balance, BlockNumber } from '@polkadot/types';

const { Keyring } = require('@polkadot/keyring');
const { stringToU8a } = require('@polkadot/util');

type Props = {};
type State = {
  balance?: Balance | null,
  blockNumber?: BlockNumber
};

const ALICE = '5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ';
const ALICE_SEED = 'Alice'.padEnd(32, ' ');
const BOB   = '5FZEyVyZm7r8WPQ8racC8MfdYMsAJNqGVVQQR4zM5SbEwhDr';
const ENDPOINT = 'ws://10.0.2.2:9944/';

let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
export default class New extends Component {
  constructor(props)
    {
        super(props)
        this.state = {
            is: false,
           
        }
    }

    componentDidMount () {
      (async () => {
        const keyring = new Keyring();
        const alice = keyring.addFromSeed(stringToU8a(ALICE_SEED));
  
        const provider = new WsProvider(ENDPOINT);
        const api = await Api.create(provider);
  
        //query balance
        api.query.balances.freeBalance(ALICE, (balance) => {
          this.setState({
            balance
          });
        });
  
        //block number
        api.rpc.chain.subscribeNewHead((block) => {
          if (block && block.blockNumber) {
            this.setState({
              blockNumber: block.blockNumber
            });
          }
        });
  
        //Taransfer
        const aliceNonce = await api.query.system.accountNonce(alice.address());
        const transfer = api.tx.balances.transfer(BOB, 99369);
        transfer.sign(alice, aliceNonce);
        const hash = await transfer.send();
        console.log(`transfer 99369 to Bob with hash ${hash}`);
  
        // query Storage
        const [accountNonce, blockPeriod, validators] = await Promise.all([
          api.query.system.accountNonce(ALICE),
          api.query.timestamp.blockPeriod(),
          api.query.session.validators()
        ]);
      
        console.log(`accountNonce(${ALICE}) ${accountNonce}`);
        console.log(`blockPeriod ${blockPeriod.toNumber()} seconds`);
  
        // Retrieve the balances for all validators
        const validatorBalances = await Promise.all(
          validators.map((authorityId) =>
            api.query.balances.freeBalance(authorityId)
          )
        );
  
        console.log('validators', validators.map((authorityId, index) => ({
          address: authorityId.toString(),
          balance: validatorBalances[index].toString()
        })));
      
        // subscribe to system events via storage
        api.query.system.events((events) => {
          console.log(`\nReceived ${events.length} events:`);
  
          // loop through the Vec<EventRecord>
          events.forEach((record) => {
            // extract the phase, event and the event types
            const { event, phase } = record;
            const types = event.typeDef;
  
            // show what we are busy with
            console.log(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`);
            console.log(`\t\t${event.meta.documentation.toString()}`);
  
            // loop through each of the parameters, displaying the type and data
            event.data.forEach((data, index) => {
              console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
            });
          });
        });
  
  
  
      })();
    }

  

  render() {
    const { balance, blockNumber } = this.state;
    return (
      <Drawer
        type='overlay'
        side='right'
        content={<Right_menu p={this.props}/>}
        open={this.state.is}
        tapToClose={true}//点底层可关闭
        openDrawerOffset={0.43} // 左边留0.336
        closedDrawerOffset={0}//左边留0
        panOpenMask={0.1}
      >
       <View style={{flex:1,backgroundColor:'white',}}>
        {/* 标题栏 */}
        <View style={{height:ScreenHeight/9,backgroundColor:'#776f71',flexDirection:'row',alignItems:'flex-end'}}>
          <View style={{marginLeft:ScreenWidth/26.79,height:ScreenHeight/33.35,width:ScreenHeight/33.35}}></View>
          <View style={{height:ScreenHeight/10.6/1.6,flex:1,justifyContent:'flex-end',alignItems:'center'}}>
              {/* logo */}
              <Image
                style={{marginRight:ScreenHeight/20*4.73/4,marginBottom:ScreenHeight/75,height:ScreenHeight/20,width:ScreenHeight/20*4.73,resizeMode:'contain'}}
                source={require('../../images/Assetes/logo.png')}
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
              source={require('../../images/Assetes/rightMenu.png')}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={{height:ScreenHeight/3.5,backgroundColor:'#FF4081C7',alignItems:'center'}}>
              <View style={{marginTop:ScreenHeight/55,width:ScreenWidth,height:ScreenHeight/3.81/2.5,alignItems:'center',justifyContent:'center'}}>
                {/* 头像 */}
                <Image
                  style={{marginTop:ScreenHeight/30,backgroundColor:'white',borderRadius:ScreenHeight/28,height:ScreenHeight/14,width:ScreenHeight/14,resizeMode:'cover'}}
                  source={require('../../images/Assetes/accountIMG.png')}
                />
              </View>
              <View style={{height:ScreenHeight/3.81/6,width:ScreenWidth,alignItems:'center',justifyContent:'center'}}>
                {/* 用户名 */}
                <Text style={{fontWeight:"200",fontSize:ScreenHeight/45,color:'white'}}>AliceAccount</Text>
              </View>
              <View style={{height:ScreenHeight/3.81/6,width:ScreenWidth,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                {/* 地址 */}
                <Text 
                  style={{fontWeight:"200",width:ScreenWidth*0.5,fontSize:ScreenHeight/45,color:'white'}}
                  ellipsizeMode={"middle"}
                  numberOfLines={1}
                >5Dn8F1SUX6SoLt1BTfKEPL5VY9wMvG1A6tEJTSCHpLsinThm</Text>
                {/* 二维码 */}
                <TouchableOpacity
                  onPress={()=>{this.props.navigation.navigate('Create_Account')}}
                >
                  <Image
                    style={{marginLeft:ScreenWidth/53.57,height:ScreenHeight/45,width:ScreenHeight/45,opacity:0.8}}
                    source={require('../../images/Assetes/QrButton.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={{flex:1}}></View>
              <View style={{alignItems:'center',flexDirection:'row',justifyContent:'space-between',height:ScreenHeight/3.81/3.8,width:ScreenWidth}}>
                <Text style={{fontWeight:'bold',marginLeft:ScreenWidth/40,color:'white',fontSize:ScreenWidth/25}}>Assetes</Text>
                {/* 添加币种 */}
                <TouchableOpacity>
                  <Image
                    style={{marginRight:ScreenWidth/20,height:ScreenHeight/30,width:ScreenHeight/30,opacity:0.9}}
                    source={require('../../images/Assetes/addAssetes.png')}
                  />
                </TouchableOpacity>
              </View>
          </View>
          {/* 各种币具体信息 */}
          <TouchableOpacity>
            <View style={{flexDirection:'row',height:ScreenHeight/10,backgroundColor:'white',borderBottomColor:'#F5F5F5',borderBottomWidth:2}}>
                <View style={{justifyContent:'center',alignItems:'center',width:ScreenWidth/6,height:ScreenHeight/10}}>
                    <Image
                      style={{borderRadius:ScreenHeight/32,height:ScreenHeight/16,width:ScreenHeight/16}}
                      source={require('../../images/Assetes/DOT.png')}
                    />
                </View>
                <View style={{justifyContent:'center',flex:1,}}>
                  <Text style={{fontSize:ScreenWidth/23.44}}>DOT</Text>
                  <Text style={{marginTop:ScreenHeight/130,color:'#666666',fontSize:ScreenWidth/26.79}}>Polkadot RelayChain</Text>
                </View>
                <View style={{height:ScreenHeight/10,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{fontSize:ScreenWidth/23.44,marginRight:ScreenWidth/28.85}}>{(balance || '-').toString()}</Text>
                </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
       </View>
      </Drawer>    
      );
  }
}