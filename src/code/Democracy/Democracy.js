import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  
} from 'react-native';
let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
import Referendums from './referendums'
import Proposals from './proposals'
import Api from '@polkadot/api/promise';
import WsProvider from '@polkadot/rpc-provider/ws';
import { Method } from '@polkadot/types';


import { observer, inject } from "mobx-react";
@inject('rootStore')
@observer
export default class IntegralMall extends Component {
  constructor(props)
  {
      super(props)
      this.state={
        Toptitle:1,
        publicPropCount:'0',
        referendumCount:'0',
        referendumActive:0,
        referendums:[],
        proposalsNum:0
      }
  }
  componentWillMount(){
    (async()=>{
      const api = await Api.create(new WsProvider(this.props.rootStore.stateStore.ENDPOINT));
      //查询publicPropCount
      await api.query.democracy.publicPropCount((result)=>{
        this.setState({
          publicPropCount:JSON.stringify(result)
        })
      })
      //查询referendumCount
      await api.query.democracy.referendumCount((result)=>{
          this.props.rootStore.stateStore.referendumCount=JSON.stringify(result)
      })
      await api.query.democracy.publicProps((result)=>{
        this.setState({proposalsNum:result.length})
      })
      //查询referendums中referendumActive
      await api.derive.democracy.referendums((result)=>{
        this.setState({
          referendumActive:result.length
        })
      })
    })();
  }
  render() {
    return (
    <SafeAreaView style={{flex:1,backgroundColor:'white'}}>
      <View style={{flex:1,backgroundColor:'white'}}>
        <View style={{marginTop:ScreenHeight/70,height:ScreenHeight/20,width:ScreenWidth,flexDirection:'row',justifyContent:'center'}}>
            <TouchableOpacity 
              style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:ScreenHeight/20,width:ScreenWidth*0.49,borderWidth:1,borderColor:'#0076ff',borderTopLeftRadius:8,borderBottomLeftRadius:8,backgroundColor:this.state.Toptitle==1?'#0076ff':'white'}}
              onPress={()=>{
                this.setState({
                  Toptitle:1
                })
              }}
              >
              <Text style={{color:this.state.Toptitle==1?'white':'#0076ff',fontSize:ScreenWidth/23.44}}>
                {'referendums('+this.props.rootStore.stateStore.referendumCount+')'}
              </Text>
              <Text style={{color:'#fd75a3',fontSize:ScreenWidth/23.44}}>
                {"+"+this.state.referendumActive}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:ScreenHeight/20,width:ScreenWidth*0.49,borderWidth:1,borderColor:'#0076ff',borderTopRightRadius:8,borderBottomRightRadius:8,backgroundColor:this.state.Toptitle!=1?'#0076ff':'white'}}
              onPress={()=>{
                this.setState({
                  Toptitle:2
                })
              }}
              >
              <Text style={{color:this.state.Toptitle!=1?'white':'#0076ff',fontSize:ScreenWidth/23.44}}>
                {'proposals('+this.state.publicPropCount+')'}
              </Text>
              <Text style={{color:'#fd75a3',fontSize:ScreenWidth/23.44}}>
                {"+"+this.state.proposalsNum}
              </Text>
            </TouchableOpacity>
        </View>
        {(this.state.Toptitle==1)
          ?
            <ScrollView>
              <View/>
              <Referendums p={this.props}/>
            </ScrollView>
          :
            <ScrollView>
              <Proposals/>
            </ScrollView>
        }
      </View>   
    </SafeAreaView> 
      );
  }
}