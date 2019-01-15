import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
import Referendums from './referendums'
import Proposals from './proposals'

export default class IntegralMall extends Component {
  constructor(props)
  {
      super(props)
      this.state={
        Toptitle:1
      }
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:'white'}}>
        <View style={{marginTop:ScreenHeight/30,height:ScreenHeight/20,width:ScreenWidth,flexDirection:'row',justifyContent:'center'}}>
            <TouchableOpacity 
              style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:ScreenHeight/20,width:ScreenWidth*0.49,borderWidth:1,borderColor:'#0076ff',borderTopLeftRadius:8,borderBottomLeftRadius:8,backgroundColor:this.state.Toptitle==1?'#0076ff':'white'}}
              onPress={()=>{
                this.setState({
                  Toptitle:1
                })
              }}
              >
              <Text style={{color:this.state.Toptitle==1?'white':'#0076ff',fontSize:ScreenWidth/23.44}}>
                referendums(49)
              </Text>
              <Text style={{color:'#fd75a3',fontSize:ScreenWidth/23.44}}>
                +12
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{justifyContent:'center',alignItems:'center',height:ScreenHeight/20,width:ScreenWidth*0.49,borderWidth:1,borderColor:'#0076ff',borderTopRightRadius:8,borderBottomRightRadius:8,backgroundColor:this.state.Toptitle!=1?'#0076ff':'white'}}
              onPress={()=>{
                this.setState({
                  Toptitle:2
                })
              }}
              >
              <Text style={{color:this.state.Toptitle!=1?'white':'#0076ff',fontSize:ScreenWidth/23.44,marginRight:ScreenWidth/28.85}}>
                proposals(32)
              </Text>
            </TouchableOpacity>
        </View>
        {(this.state.Toptitle==1)
          ?
            <ScrollView>
              <View/>
              <Referendums/>
            </ScrollView>
          :
            <ScrollView>
              <Proposals/>
            </ScrollView>
        }
      </View>    
      );
  }
}