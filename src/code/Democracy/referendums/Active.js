import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import Api from '@polkadot/api/promise';
import WsProvider from '@polkadot/rpc-provider/ws';
import { Method } from '@polkadot/types';

import { VictoryPie} from "victory-native";

let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
const Actives_fixed=[
    {name:'councilVoting.setCooloffPeriod',time:'310',number:49,Aye:5042964,aye:368,Nay:2512889,nay:58,Actives_Nofixed:[{name:'blocks:Compact<BlockNumber>',num:256}]},
    {name:'councilVoting.setCooloffPeriod',time:'310',number:48,Aye:5042964,aye:368,Nay:2512889,nay:58,Actives_Nofixed:[{name:'Compact<BlockNumber>',num:252}]},   
    {name:'councilVoting.setCooloffPeriod',time:'310',number:47,Aye:5042964,aye:368,Nay:2512889,nay:58,Actives_Nofixed:[{name:'who:Address',num:'5rgjhfdkjgbfdkjvbcvbkdjvbdfghjsdffd'},{name:'free:Compact<Balance>',num:18000},{name:'reserved:Compact<Balance>',num:180000}]},  
]
import { observer, inject } from "mobx-react";
import { async } from 'rxjs/internal/scheduler/async';
@inject('rootStore')
@observer
export default class Polkawallet extends Component {
  constructor(props)
  {
      super(props)
      this.state={
        referendums:[],
        Actives_Nofixed:[],
        Actives_Nofixedvalue:[]
      }
  }
  componentWillMount(){
    (async()=>{
      const api = await Api.create(new WsProvider(this.props.rootStore.stateStore.ENDPOINT));
      await api.derive.democracy.referendums((result)=>{
        result.map((item,index)=>{
          info = item.unwrapOr(null)
          if (info) {
            let {meta, method, section } = Method.findFunction(info.proposal.callIndex)
            this.state.Actives_Nofixedvalue.push(info.proposal.args)
            this.state.Actives_Nofixed.push(meta.arguments)
            this.state.referendums.push(info)
          }
        })
        this.setState({})
      })
    })()
    
  }
  render() {
    return (
      <View style={{flex:1}}>
        {
            this.state.referendums.map((item,index)=>{
                return(
                  <View style={{borderBottomWidth:1,borderColor:'#C0C0C0',}} key={index}>
                    <View style={{borderRadius:ScreenHeight/200,height:ScreenHeight/30,flexDirection:'row',alignItems:'center'}}>
                        <Text style={{marginLeft:ScreenWidth/40,fontSize:ScreenWidth/30}}>{item.proposal.callIndex}</Text>
                        <Image
                            style={{marginLeft:ScreenWidth/40,height:ScreenHeight/50,width:ScreenHeight/50,resizeMode:'contain'}}
                            source={require('../../../images/Democracy/time.png')}
                        />
                        <Text style={{fontWeight:'500',marginLeft:ScreenWidth/80,color:'#90BD5B',fontSize:ScreenWidth/35}}>{310}</Text>
                        <Text style={{fontWeight:'500',color:'#90BD5B',fontSize:ScreenWidth/40}}> {' blocks end'}</Text>
                        <View style={{flex:1}}></View>
                        <Text style={{marginRight:ScreenWidth/70,fontSize:ScreenWidth/26}}>#{49}</Text>
                    </View>
                    {
                        this.state.Actives_Nofixed[index].map((itemNo,indexNo)=>{
                          return(
                            <View style={{marginLeft:ScreenWidth/30,marginTop:ScreenHeight/70}} key={indexNo}>
                              <Text style={{color:'#696969',fontSize:ScreenHeight/51.31}}>{itemNo.name+' : '+itemNo.type}</Text>
                              <View style={{borderRadius:ScreenHeight/200,borderWidth:1,borderColor:'#C0C0C0',marginTop:ScreenHeight/100,justifyContent:'center',width:ScreenWidth/1.7,height:ScreenHeight/30,backgroundColor:'#DCDCDC',color:'#666666'}}>
                                <Text 
                                  style={{width:ScreenWidth/2.5,marginLeft:ScreenWidth/40,color:'#666666',fontSize:ScreenHeight/51.31}}
                                  ellipsizeMode={"middle"}
                                  numberOfLines={1}
                                >
                                  {String(this.state.Actives_Nofixedvalue[index][indexNo])}
                                </Text>
                              </View>
                            </View>
                          )
                        })
                    }
                    <View style={{alignItems:'center',flexDirection:'row',marginTop:ScreenHeight/70,marginLeft:ScreenWidth/40,height:ScreenHeight/30}}>
                      <Text style={{fontSize:ScreenHeight/65}}>Threshold: Super majority approval</Text>
                    </View>
                    <View style={{borderRadius:ScreenHeight/200,height:ScreenHeight/30,flexDirection:'row',alignItems:'center'}}>
                        <Image
                            style={{marginLeft:ScreenWidth/40,height:ScreenWidth/17.86*0.52,width:ScreenWidth/17.86,resizeMode:'cover'}}
                            source={require('../../../images/Democracy/green_ellipse.png')}
                        />
                        <Text style={{marginLeft:ScreenWidth/100,fontSize:ScreenWidth/45}}>{'Aye '+item.Aye}</Text>
                        <Text style={{marginLeft:ScreenWidth/80,fontSize:ScreenWidth/45,color:'#7ad52a'}}>66.75%</Text>
                        <Text style={{fontSize:ScreenWidth/45}}>{'('+item.aye+')'}</Text>
                        <Image
                            style={{marginLeft:ScreenWidth/40,height:ScreenWidth/17.86*0.52,width:ScreenWidth/17.86,resizeMode:'cover'}}
                            source={require('../../../images/Democracy/red_ellipse.png')}
                        />
                        <Text style={{marginLeft:ScreenWidth/100,fontSize:ScreenWidth/45}}>{'Nay '+item.Nay}</Text>
                        <Text style={{marginLeft:ScreenWidth/80,fontSize:ScreenWidth/45,color:'#fb3232'}}>33.25%</Text>
                        <Text style={{fontSize:ScreenWidth/45}}>{'('+item.nay+')'}</Text>
                    </View>
                    <View style={{flexDirection:'row',marginLeft:ScreenWidth/6,marginVertical:ScreenHeight/70}}>
                        <VictoryPie
                            padding={{ top: 0, left:0 }}
                            colorScale={['#8fec41','#fb3232']}
                            innerRadius={ScreenWidth/30}
                            data={[
                                { x: 1, y: 5, },
                                { x: 2, y: 2, },
                            ]}
                            height={ScreenWidth/5.86}
                            width={ScreenWidth/5.86}
                        />
                        {/* Nay or Aye */}
                        <View style={{flex:1,justifyContent:'flex-end',alignItems:'flex-end'}}>
                         <View style={{flexDirection:'row',height:ScreenHeight/20,width:ScreenWidth*0.5,alignItems:'center',justifyContent:'center'}}>
                          <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#fb3232',height:ScreenHeight/24,width:ScreenWidth*0.2}}>
                            
                            <Text style={{fontWeight:'bold',fontSize:ScreenHeight/60,color:'white'}}>
                              Nay
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#7ad52a',marginLeft:ScreenWidth/100,height:ScreenHeight/24,width:ScreenWidth*0.2}}>
                            
                            <Text style={{fontWeight:'bold',fontSize:ScreenHeight/60,color:'white'}}>
                              Aye
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
            })
            
        }
        
      </View>   
      // <View/>
      );
  }
}