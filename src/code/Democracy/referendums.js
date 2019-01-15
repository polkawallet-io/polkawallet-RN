import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Active from './referendums/Active'
import History from './referendums/History'
import MyRecord from './referendums/MyRecord'
let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;

export default class Polkawallet extends Component {
    constructor(props)
  {
      super(props)
      this.state={
        title:1
      }
  }
  render() {
    return (
    <View style={{flex:1}}>
          <View style={{borderBottomWidth:1,borderBottomColor:'grey',height:ScreenHeight/20,width:ScreenWidth,flexDirection:'row'}}>
            <TouchableOpacity 
            style={{marginHorizontal:ScreenWidth/20,justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderBottomColor:this.state.title==1?'#005baf':'#ffffff00'}}
            onPress={()=>{
                this.setState({
                    title:1
                })
            }}
            >
            <Text style={{color:this.state.title==1?'#005bae':'#696969',fontSize:ScreenWidth/30}}>
                Active
            </Text>
            </TouchableOpacity>
            <TouchableOpacity 
            style={{justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderBottomColor:this.state.title==2?'#005baf':'#ffffff00'}}
            onPress={()=>{
                this.setState({
                    title:2
                })
            }}
            >
            <Text style={{color:this.state.title==2?'#005bae':'#696969',fontSize:ScreenWidth/30}}>
                History
            </Text>
            </TouchableOpacity>
            <TouchableOpacity 
            style={{marginHorizontal:ScreenWidth/20,justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderBottomColor:this.state.title==3?'#005baf':'#ffffff00'}}
            onPress={()=>{
                this.setState({
                    title:3
                })
            }}
            >
            <Text style={{color:this.state.title==3?'#005bae':'#696969',fontSize:ScreenWidth/30}}>
                MyNominstors
            </Text>
            </TouchableOpacity>
          </View>
        {
            (this.state.title==1)
            ?
              <Active/>
            : 
              (this.state.title==2)
              ?
                <History/>
                :
                <MyRecord/>
        }
      
    </View>    
      );
  }
}