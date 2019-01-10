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
export default class New extends Component {
  render() {
    return (
      <View style={{flex:1,backgroundColor:'white',}}>
        <View style={{height:ScreenHeight/10.6,backgroundColor:'#776f71',flexDirection:'row',alignItems:'flex-end'}}>
          <View style={{marginLeft:ScreenWidth/26.79,height:ScreenHeight/33.35,width:ScreenHeight/33.35}}></View>
          <View style={{height:ScreenHeight/10.6/1.6,flex:1,justifyContent:'flex-end',alignItems:'center'}}>
              <Image
                style={{marginBottom:ScreenHeight/75,height:ScreenHeight/25.65,width:ScreenWidth/3}}
                source={require('../../images/Assetes/logo.png')}
              />
          </View>
          <Image
            style={{marginRight:ScreenWidth/26.79,marginBottom:ScreenHeight/75,height:ScreenHeight/33.35,width:ScreenHeight/33.35}}
            source={require('../../images/Assetes/right menu.png')}
          />
        </View>
        <ScrollView>
          <View style={{height:ScreenHeight/3.5,backgroundColor:'#FF4081C7',alignItems:'center'}}>
              <View style={{marginTop:ScreenHeight/55,width:ScreenWidth,height:ScreenHeight/3.81/2.5,alignItems:'center',justifyContent:'center'}}>
                <Image
                  style={{marginTop:ScreenHeight/30,backgroundColor:'white',borderRadius:ScreenHeight/32,height:ScreenHeight/16,width:ScreenHeight/16}}
                  source={require('../../images/Assetes/account_image.png')}
                />
              </View>
              <View style={{height:ScreenHeight/3.81/6,width:ScreenWidth,alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontWeight:"200",fontSize:ScreenHeight/45,color:'white'}}>AliceAccount</Text>
              </View>
              <View style={{height:ScreenHeight/3.81/6,width:ScreenWidth,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                <Text 
                  style={{fontWeight:"200",width:ScreenWidth*0.6,fontSize:ScreenHeight/45,color:'white'}}
                  ellipsizeMode={"middle"}
                  numberOfLines={1}
                >3jdhfjhkfjhdsfddfsfdsfdsfdslfhkdsfiurigonddsfdsfjkshhffkjds</Text>
                <Image
                  style={{marginLeft:ScreenWidth/53.57,height:ScreenHeight/45,width:ScreenHeight/45,opacity:0.8}}
                  source={require('../../images/Assetes/WechatIMG6.png')}
                />
              </View>
              <View style={{flex:1}}></View>
              <View style={{alignItems:'center',flexDirection:'row',justifyContent:'space-between',height:ScreenHeight/3.81/3.8,width:ScreenWidth}}>
                <Text style={{fontWeight:'bold',marginLeft:ScreenWidth/40,color:'white',fontSize:ScreenWidth/25}}>Assetes</Text>
                <Image
                  style={{marginRight:ScreenWidth/20,height:ScreenHeight/30,width:ScreenHeight/30,opacity:0.9}}
                  source={require('../../images/Assetes/WechatIMG5.png')}
                />
              </View>
          </View>
          <View style={{flexDirection:'row',height:ScreenHeight/10,backgroundColor:'white',borderBottomColor:'#F5F5F5',borderBottomWidth:2}}>
              <View style={{justifyContent:'center',alignItems:'center',width:ScreenWidth/6,height:ScreenHeight/10}}>
                  <Image
                    style={{borderRadius:ScreenHeight/32,height:ScreenHeight/16,width:ScreenHeight/16}}
                    source={require('../../images/Assetes/WechatIMG4.png')}
                  />
              </View>
              <View style={{justifyContent:'center',flex:1,}}>
                <Text style={{fontSize:ScreenWidth/23.44}}>DOT</Text>
                <Text style={{marginTop:ScreenHeight/130,color:'#666666',fontSize:ScreenWidth/26.79}}>Polkadot RelayChain</Text>
              </View>
              <View style={{height:ScreenHeight/10,justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:ScreenWidth/23.44,marginRight:ScreenWidth/28.85}}>13.5M</Text>
              </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}