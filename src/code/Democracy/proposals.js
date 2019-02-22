import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import Api from '@polkadot/api/promise';
import WsProvider from '@polkadot/rpc-provider/ws';
import { Method } from '@polkadot/types';

let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
const Proposals=[
    {name:'councilVoting.setCooloffPeriod',time:'50',number:54,depositors:'5rgjhfdkjgbfdkjvbcvbkdjvbdfghjsdffd',balance:19.999,Actives_Nofixed:[{key:'blocks:Compact<BlockNumber>',value:256}]},
    {name:'councilVoting.setCooloffPeriod',time:'50',number:53,depositors:'5rgjhfdkjgbfdkjvbcvbkdjvbdfghjsdffd',balance:19.999,Actives_Nofixed:[{key:'blocks:Compact<BlockNumber>',value:256}]},
    {name:'councilVoting.setCooloffPeriod',time:'30',number:52,depositors:'5rgjhfdkjgbfdkjvbcvbkdjvbdfghjsdffd',balance:19.999,Actives_Nofixed:[{key:'Compact<BlockNumber>',value:252},{key:'who:Address',value:'5rgjhfdkjgbfdkjvbcvbkdjvbdfghjsdffd'},{key:'reserved:Compact<Balance>',value:180000}]},   
    {name:'councilVoting.setCooloffPeriod',time:'30',number:51,depositors:'5rgjhfdkjgbfdkjvbcvbkdjvbdfghjsdffd',balance:19.999,Actives_Nofixed:[{key:'who:Address',value:'5rgjhfdkjgbfdkjvbcvbkdjvbdfghjsdffd'},{key:'free:Compact<Balance>',value:18000},{key:'reserved:Compact<Balance>',value:180000}]},  
]
import { observer, inject } from "mobx-react";
import { async } from 'rxjs/internal/scheduler/async';
@inject('rootStore')
@observer
export default class Polkawallet extends Component {
  constructor(props){
    super(props)
    this.state={
        publicProps:[],
        Actives_Nofixed:[],
        Actives_Nofixedvalue:[],
        Actives_Title:[],
        votingCountdown:0,
        launchCountdown:0,
        Index:[],
        votingState:[],
        balances:[],
    }
    this.balances=this.balances.bind(this)
  }
  balances(){
    (async()=>{
      const api = await Api.create(new WsProvider(this.props.rootStore.stateStore.ENDPOINT));
      launchPeriod = await api.query.democracy.launchPeriod()

      await api.derive.chain.bestNumber((bestNumber)=>{
        launchCountdown = launchPeriod - bestNumber.mod(launchPeriod).addn(1)
        this.setState({launchCountdown:launchCountdown})
      })
      await api.query.democracy.publicProps((result)=>{
        this.setState({publicProps:[],Actives_Nofixed:[],Actives_Nofixedvalue:[],Actives_Title:[],Index:[],balances:[]})
        result.map((item,index)=>{
          if (item) {
            let {meta, method, section } = Method.findFunction(item[1].callIndex)
            this.state.Actives_Title.push({section:section,method:method})
            this.state.Actives_Nofixedvalue.push(item[1].args)
            this.state.Actives_Nofixed.push(meta.arguments)
            this.state.publicProps.push(item)
            this.state.Index.push(item[0])
          }
          this.setState({})
        })
      })
      for(i=0;i<this.state.Index.length;i++){
        balance = await api.query.democracy.depositOf(this.state.Index[i])
        this.state.balances.push((JSON.parse(balance))[0])
        this.setState({})
      }
    })();
  }
  componentWillMount(){
    (async()=>{
      const api = await Api.create(new WsProvider(this.props.rootStore.stateStore.ENDPOINT));
      launchPeriod = await api.query.democracy.launchPeriod()

      await api.derive.chain.bestNumber((bestNumber)=>{
        launchCountdown = launchPeriod - bestNumber.mod(launchPeriod).addn(1)
        this.setState({launchCountdown:launchCountdown})
      })
      await api.query.democracy.publicProps((result)=>{
        
        this.balances()
      })
    })();
  }
  render() {
    return (
      <View style={{flex:1}}>
      {
        this.state.publicProps[0]==null
        ?
          <View style={{marginTop:ScreenHeight/15,flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize:ScreenWidth/25,color:'#696969'}}>no available proposals</Text>
          </View>
        :  
      
        this.state.publicProps.map((item,index)=>{
          return(
            <View style={{margin:ScreenWidth/150,borderWidth:1,borderColor:'#D3D3D3',borderRadius:ScreenWidth/100}} key={index}>
              <View style={{borderRadius:ScreenHeight/200,height:ScreenHeight/30,flexDirection:'row',alignItems:'center'}}>
                        <Text style={{marginLeft:ScreenWidth/40,fontSize:ScreenWidth/30}}>{this.state.Actives_Title[index].section+'.'+this.state.Actives_Title[index].method}</Text>
                        {/* 时间 */}
                        <Image
                            style={{marginLeft:ScreenWidth/40,height:ScreenHeight/50,width:ScreenHeight/50,resizeMode:'contain'}}
                            source={require('../../images/Democracy/time.png')}
                        />
                        <Text style={{fontWeight:'500',marginLeft:ScreenWidth/80,color:'#90BD5B',fontSize:ScreenWidth/35}}>{this.state.launchCountdown}</Text>
                        <Text style={{fontWeight:'500',color:'#90BD5B',fontSize:ScreenWidth/40}}> {' blocks launch'}</Text>
                        <View style={{flex:1}}></View>
                        <Text style={{marginRight:ScreenWidth/70,fontSize:ScreenWidth/26}}>{'#'+item[0]}</Text>
              </View>
              <View style={{width:ScreenWidth,flexDirection:'row'}}>
                {/* 不确定个数 */}
                <View style={{width:ScreenWidth/2-0.5}}>
                   {
                        this.state.Actives_Nofixed[index].map((itemNo,indexNo)=>{
                          return(
                            <View style={{marginLeft:ScreenWidth/30,marginTop:ScreenHeight/70}} key={indexNo}>
                              <Text style={{color:'#696969',fontSize:ScreenWidth/30}}>{itemNo.name+' : '+itemNo.type}</Text>
                              <View style={{borderRadius:ScreenHeight/200,borderWidth:1,borderColor:'#C0C0C0',marginTop:ScreenHeight/100,justifyContent:'center',width:ScreenWidth/2.3,height:ScreenHeight/30,backgroundColor:'#DCDCDC',color:'#666666'}}>
                                <Text 
                                  style={{width:ScreenWidth/3.2,marginLeft:ScreenWidth/40,color:'#666666',fontSize:ScreenWidth/30}}
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
                    <View style={{height:ScreenHeight/40}}/>
                </View>
                {/* 虚线 */}
                <View style={{flex:1,borderWidth:0.5,marginVertical:ScreenHeight/70,borderStyle:'dashed',borderColor:'#C0C0C0'}}/>
                {/* 确定个数 */}
                <View style={{width:ScreenWidth/2-0.5}}>
                  <View style={{marginLeft:ScreenWidth/30,marginTop:ScreenHeight/70}}>
                    <Text style={{color:'#696969',fontSize:ScreenWidth/30}}>depositors</Text>
                    <View style={{borderRadius:ScreenHeight/200,borderWidth:1,borderColor:'#C0C0C0',marginTop:ScreenHeight/100,justifyContent:'center',width:ScreenWidth/2.3,height:ScreenHeight/30,backgroundColor:'#DCDCDC',color:'#666666'}}>
                      <Text 
                        style={{width:ScreenWidth/3.2,marginLeft:ScreenWidth/40,color:'#666666',fontSize:ScreenWidth/30}}
                        ellipsizeMode={"middle"}
                        numberOfLines={1}
                      >
                        {String(item[2])}
                      </Text>
                    </View>
                  </View>
                  <View style={{marginLeft:ScreenWidth/30,marginTop:ScreenHeight/70}}>
                    <Text style={{color:'#696969',fontSize:ScreenWidth/30}}>balance</Text>
                    <View style={{borderRadius:ScreenHeight/200,borderWidth:1,borderColor:'#C0C0C0',marginTop:ScreenHeight/100,justifyContent:'center',width:ScreenWidth/2.3,height:ScreenHeight/30,backgroundColor:'#DCDCDC',color:'#666666'}}>
                      <Text 
                        style={{width:ScreenWidth/3.2,marginLeft:ScreenWidth/40,color:'#666666',fontSize:ScreenWidth/30}}
                        ellipsizeMode={"middle"}
                        numberOfLines={1}
                      >
                        {String(this.state.balances[index])}
                      </Text>
                    </View>
                  </View>
                  <View style={{height:ScreenHeight/40}}/>

                </View>
              </View> 
            </View> 
            
          )
        })
      }
                   
        




      </View>    
      );
  }
}