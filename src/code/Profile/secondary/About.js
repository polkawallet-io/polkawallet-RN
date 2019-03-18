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
  AsyncStorage,
} from 'react-native';

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
           
        }
        this.back=this.back.bind(this)
        this.Set_Node=this.Set_Node.bind(this)

    }
  back(){
    this.props.navigation.navigate('Tabbed_Navigation')
  }
  Set_Node(){
    this.props.navigation.navigate('Set_Node')
  }
  componentWillMount(){
   
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:'white',}}>
        {/* 标题栏 */}
        <View style={styles.title}>
            {/* 返回 */}
            <TouchableOpacity
                onPress={this.back}
            >
                <Image
                style={styles.image_title}
                source={require('../../../images/Assets/Create_Account/back.png')}
                />
            </TouchableOpacity>
            {/* 标题 */}
            <Text style={styles.text_title}>About</Text>
            {/* 空白 */}
            <View style={{height:ScreenHeight/33.35,width:ScreenHeight/33.35,}}/>
        </View>
        {/* 图标 */}
            <Image
                style={styles.msgImage}
                source={require('../../../images/Profile/secondary/logo.png')}
            />
        {/* 简介 */}
        <View style={styles.msgView}>
            <Text style={{fontSize:ScreenWidth/20,color:'#808080',fontWeight:'500'}}>Mobile wallet for Polkadot.</Text>
        </View>
        {/* 官网 */}
        <View style={styles.msgView}>
            <Text style={{fontSize:ScreenWidth/23,color:'#808080',fontWeight:'400'}}>https://polkawallet.io</Text>
        </View>
        {/* 版本 */}
        <View style={{flex:1}}/>
        <View style={[styles.msgView,{marginBottom:ScreenHeight/30}]}>
            <Text style={{fontSize:ScreenWidth/25,color:'#808080'}}>Version: 0.1.5</Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
    title:{
        padding:ScreenHeight/50,
        height:ScreenHeight/9,
        flexDirection:'row',
        alignItems:'flex-end',
        justifyContent:'space-between',
        backgroundColor:'#776f71'
    },
    text_title:{
        fontSize:ScreenHeight/37,
        fontWeight:'bold',
        color:'#e6e6e6'
    },
    image_title:{
        height:ScreenHeight/33.35,
        width:ScreenHeight/33.35,
        resizeMode:'contain'
    },
    msgView:{
        justifyContent:'center',
        backgroundColor:'white',
        flexDirection:'row',
        alignItems:'center',
        height:ScreenHeight/18,
    },
    msgText:{
        fontSize:ScreenWidth/25,
        color:'#808080'
    },
    msgImage:{
        marginTop:ScreenHeight/10,
        marginBottom:ScreenHeight/40,
        alignSelf:'center',
        height:ScreenHeight/4,
        width:ScreenHeight/4,
        resizeMode:'contain'
    },
    
})