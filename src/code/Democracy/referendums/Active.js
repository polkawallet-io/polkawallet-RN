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

import { observer, inject } from "mobx-react";
@inject('rootStore')
@observer
export default class Polkawallet extends Component {
  constructor(props)
  {
      super(props)
      this.state={
        referendums:[],
        Actives_Nofixed:[],
        Actives_Nofixedvalue:[],
        Actives_Title:[],
        votingCountdown:0,
        votingIndex:[],
        votingState:[],
        votingStateIndex:[],
      }
      // this.votingState=this.votingState.bind(this)
  }
  votingState(){
    (async()=>{
      this.state.votingState = []
      ifNewIndex = false
      test=0
      l=0
      const api = await Api.create(new WsProvider(this.props.rootStore.stateStore.ENDPOINT));
      for(i=0;i<this.state.votingIndex.length;i++){
        await api.derive.democracy.referendumVotesFor(this.state.votingIndex[i],(result)=>{
          if(result[0]!=null){
            if(this.state.votingState[0]!=null){
              // this.state.votingState.forEach(value => {
              //   this.state.votingStateIndex.push(value[0].referendumId)
              // })
              // console.warn('votingStateIndex: '+ this.state.votingStateIndex)
              for(k=0;k<this.state.votingState.length;k++){
                // console.warn("L: "+l+"length: "+this.state.votingState.length+' I: '+i+" k: "+k)
                if(this.state.votingState[k][0].referendumId==result[0].referendumId){
                  this.state.votingState[k] = result
                  l--
                  // console.warn('change__votingState'+JSON.stringify(this.state.votingState))
                  break
                }else if(l==this.state.votingState.length){
                  ifNewIndex = true
                  // console.warn('isTrue')
                  // console.warn("*****L"+l+"length:"+this.state.votingState.length+' I: '+i+" k: "+k+' Index:'+this.state.votingIndex)
                  l=0
                  break
                }
                l++
              }
              if(ifNewIndex==true){
                this.state.votingState.push(result)
                ifNewIndex = false
                test++
                // console.warn('PushVotingState'+JSON.stringify(this.state.votingState))
              }
                // console.warn("ID:",result[0].referendumId)
              // console.warn("***"+JSON.stringify(this.state.votingState))  
              this.setState({}) 
            }else {
              this.state.votingState.push(result)
              // console.warn('newArray')
            }
          }
          
        })
        // console.warn('votingState'+JSON.stringify(this.state.votingState))
      }
    })()
  }
  componentWillMount(){
    (async()=>{
      const api = await Api.create(new WsProvider(this.props.rootStore.stateStore.ENDPOINT));
      await api.derive.chain.bestNumber((bestNumber)=>{
        this.setState({votingCountdown:bestNumber})
      })
      await api.derive.democracy.referendums((result)=>{
        this.setState({referendums:[],Actives_Nofixed:[],Actives_Nofixedvalue:[],Actives_Title:[],votingState:[]})
        result.map((item,index)=>{
          info = item.unwrapOr(null)
          if (info) {
            let {meta, method, section } = Method.findFunction(info.proposal.callIndex)
            this.state.Actives_Title.push({section:section,method:method})
            this.state.Actives_Nofixedvalue.push(info.proposal.args)
            this.state.Actives_Nofixed.push(meta.arguments)
            this.state.referendums.push(info)
            this.state.votingIndex.push(info.index)
          }
          this.setState({})
          this.votingState()
        })
        
      })
      // for(i=0;i<this.state.votingIndex.length;i++){
      //   VotingFor = await api.derive.democracy.referendumVotesFor(this.state.votingIndex[i],(result)=>{
      //       this.state.votingState.push(result);
      //     this.setState({})
      //   })
      // }
      
      
    })()
    
  }
  render() {
    return (
      <View style={{flex:1}}>
        {this.state.referendums[0]==null
        ?
          <View style={{marginTop:ScreenHeight/20,flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize:ScreenWidth/25,color:'#696969'}}>no available referendums</Text>
          </View>
        :  
            this.state.referendums.map((item,index)=>{
                return(
                  <View style={{borderBottomWidth:1,borderColor:'#C0C0C0',}} key={index}>
                    <View style={{borderRadius:ScreenHeight/200,height:ScreenHeight/30,flexDirection:'row',alignItems:'center'}}>
                        <Text style={{marginLeft:ScreenWidth/40,fontSize:ScreenWidth/30}}>{this.state.Actives_Title[index].section+'.'+this.state.Actives_Title[index].method}</Text>
                        <Image
                            style={{marginLeft:ScreenWidth/40,height:ScreenHeight/50,width:ScreenHeight/50,resizeMode:'contain'}}
                            source={require('../../../images/Democracy/time.png')}
                        />
                        <Text style={{fontWeight:'500',marginLeft:ScreenWidth/80,color:'#90BD5B',fontSize:ScreenWidth/35}}>{Number(item.end)-Number(this.state.votingCountdown)-1}</Text>
                        <Text style={{fontWeight:'500',color:'#90BD5B',fontSize:ScreenWidth/40}}> {' blocks end'}</Text>
                        <View style={{flex:1}}></View>
                        <Text style={{marginRight:ScreenWidth/70,fontSize:ScreenWidth/26}}>{'#'+item.index}</Text>
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
                    {/* threshold */}
                    <View style={{alignItems:'center',flexDirection:'row',marginTop:ScreenHeight/70,marginLeft:ScreenWidth/40,height:ScreenHeight/30}}>
                      <Text style={{fontSize:ScreenHeight/65}}>{'Threshold: '+item.threshold}</Text>
                    </View>
                    {/* <View style={{borderRadius:ScreenHeight/200,height:ScreenHeight/30,flexDirection:'row',alignItems:'center'}}>
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
                    </View> */}
                    <View style={{flexDirection:'row',marginLeft:ScreenWidth/6,marginVertical:ScreenHeight/70}}>
                        {/* <VictoryPie
                            padding={{ top: 0, left:0 }}
                            colorScale={['#8fec41','#fb3232']}
                            innerRadius={ScreenWidth/30}
                            data={[
                                { x: 1, y: 3, },
                                { x: 2, y: 1, },
                            ]}
                            height={ScreenWidth/5.86}
                            width={ScreenWidth/5.86}
                        /> */}
                        {/* Nay or Aye */}
                        <View style={{flex:1,justifyContent:'flex-end',alignItems:'flex-end'}}>
                         <View style={{flexDirection:'row',height:ScreenHeight/20,width:ScreenWidth*0.5,alignItems:'center',justifyContent:'center'}}>
                          <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#fb3232',height:ScreenHeight/24,width:ScreenWidth*0.2}}
                            onPress={()=>{
                              this.props.p.navigation.navigate('NayorAye',{choose:'Nay',index:item.index})
                            }}
                          >
                            
                            <Text style={{fontWeight:'bold',fontSize:ScreenHeight/60,color:'white'}}>
                              Nay
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#7ad52a',marginLeft:ScreenWidth/100,height:ScreenHeight/24,width:ScreenWidth*0.2}}
                            onPress={()=>{
                              this.props.p.navigation.navigate('NayorAye',{choose:'Aye',index:item.index})
                            }}
                          >
                            
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