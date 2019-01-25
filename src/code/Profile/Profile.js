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
let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
const Custom_Components=[
  {image:require('../../images/Profile/Notifications.png'),text:'Notifications'},
  {image:require('../../images/Profile/Addresses.png'),text:'Addresses'},
  {image:require('../../images/Profile/Settings.png'),text:'Settings'},
  {image:require('../../images/Profile/Support.png'),text:'Support'},
  {image:require('../../images/Profile/About.png'),text:'About'},
]

import { observer, inject } from "mobx-react";
@inject('rootStore')
@observer
export default class New extends Component {
  constructor(props)
    {
        super(props)
        this.state = {
            is: false,
            s:1
        }
        this.Manage_Account=this.Manage_Account.bind(this)
    }
  Manage_Account(){
    this.props.navigation.navigate('Manage_Account')
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:'#F5F5F5',}}>
        <View style={{height:ScreenHeight/9,backgroundColor:'#776f71',flexDirection:'row',alignItems:'flex-end'}}>
          
          <View style={{height:ScreenHeight/10.6/1.6,flex:1,justifyContent:'flex-end',alignItems:'center'}}>
              {/* logo */}
              <Text style={{marginBottom:ScreenHeight/50,fontSize:ScreenHeight/37,fontWeight:'bold',color:'white'}}>Profile</Text>
          </View>
        </View>
        <ScrollView>
          <View style={{height:ScreenHeight/3.5,backgroundColor:'#FF4081C7',alignItems:'center'}}>
              <View style={{marginTop:ScreenHeight/55,width:ScreenWidth,height:ScreenHeight/3.81/2.5,alignItems:'center',justifyContent:'center'}}>
                {/* 头像 */}
                <Image
                  style={{marginTop:ScreenHeight/30,backgroundColor:'white',borderRadius:ScreenHeight/28,height:ScreenHeight/14,width:ScreenHeight/14,resizeMode:'cover'}}
                  source={require('../../images/Profile/accountIMG.png')}
                />
              </View>
              <View style={{height:ScreenHeight/3.81/6,width:ScreenWidth,alignItems:'center',justifyContent:'center'}}>
                {/* 用户名 */}
                <Text style={{fontWeight:"500",fontSize:ScreenHeight/45,color:'white'}}>
                  {this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].account}
                </Text>
              </View>
              <View style={{marginTop:ScreenHeight/70,width:ScreenWidth,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                <TouchableOpacity style={{backgroundColor:'#FF4D89',borderWidth:1,borderColor:'white',borderRadius:ScreenHeight/45,height:ScreenHeight/22,alignItems:'center',justifyContent:'center'}}
                  onPress={this.Manage_Account}
                >
                  {/* 更多 */}
                  <Text 
                    style={{marginHorizontal:ScreenWidth/20,fontWeight:'500',fontSize:ScreenHeight/45,color:'white'}}
                  >Manage Account ></Text>
                </TouchableOpacity>
              </View>
          </View>
          {
            Custom_Components.map((item,index)=>{
              return (
                <TouchableOpacity key={index}
                  onPress={()=>{alert(this.props.rootStore.stateStore.name)}}
                  style={{backgroundColor:'white',marginTop:(index==3)?ScreenHeight/35:0,flexDirection:'row',alignItems:'center',height:ScreenHeight/13,borderWidth:0.5,borderColor:'#C0C0C0',borderRadius:ScreenHeight/130,marginHorizontal:1,borderBottomWidth:(index==4||index==2)?1:0.5}}
                >
                  <Image
                    style={{marginLeft:ScreenWidth/25,height:ScreenHeight/30,width:ScreenHeight/30,resizeMode:'cover'}}
                    source={item.image}
                  />
                  <Text style={{marginLeft:ScreenWidth/50,fontSize:ScreenHeight/40}}>{item.text}</Text>
                  <View style={{flex:1}}/>
                  <Image
                    style={{marginRight:ScreenWidth/28,height:ScreenHeight/60,width:ScreenHeight/60/1.83,resizeMode:'cover'}}
                    source={require('../../images/Profile/next.png')}
                  />
                </TouchableOpacity>
              )
            })
          }
          
        </ScrollView>
      </View>
    );
  }
}