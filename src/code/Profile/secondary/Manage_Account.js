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
import SInfo from 'react-native-sensitive-info';

let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;

export default class Manage_Account extends Component {
  constructor(props)
  {
    super(props)
    this.ExportKey=this.ExportKey.bind(this)
  }
  ExportKey(){
    SInfo.getItem('zx',{}).then(
      (result)=>{
        alert((JSON.parse(result)).key)
      }
    )
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
          <View style={{height:ScreenHeight/4.5,backgroundColor:'#FF4081C7',alignItems:'center'}}>
              <View style={{marginTop:ScreenHeight/55,width:ScreenWidth,height:ScreenHeight/3.81/2.5,alignItems:'center',justifyContent:'center'}}>
                {/* 头像 */}
                <Image
                  style={{marginTop:ScreenHeight/30,backgroundColor:'white',borderRadius:ScreenHeight/28,height:ScreenHeight/14,width:ScreenHeight/14,resizeMode:'cover'}}
                  source={require('../../../images/Profile/accountIMG.png')}
                />
              </View>
              <View style={{marginTop:ScreenHeight/50,height:ScreenHeight/3.81/6,width:ScreenWidth,alignItems:'center',justifyContent:'center'}}>
                {/* 地址 */}
                <Text 
                  style={{width:ScreenWidth*0.5,fontWeight:'200',fontSize:ScreenHeight/45,color:'white'}}
                  ellipsizeMode={"middle"}
                  numberOfLines={1}
                >5hfg3hofnvdoJhUidfjslfhdsfsdiljhhjkgrgdfbtnhgfhdgfd</Text>
              </View>
          </View>
          <View style={{alignItems:'center'}}>
            <TouchableOpacity
                  style={{width:ScreenWidth*0.8,backgroundColor:'white',marginTop:ScreenHeight/35,flexDirection:'row',alignItems:'center',height:ScreenHeight/13,borderWidth:0.5,borderColor:'#C0C0C0',borderRadius:ScreenHeight/130,marginHorizontal:1,borderBottomWidth:1}}
                  onPress={this.ExportKey}
                >
                  <Text style={{marginLeft:ScreenWidth/50,fontSize:ScreenHeight/40}}>Export Keystore</Text>
                  <View style={{flex:1}}/>
                  <Image
                    style={{marginRight:ScreenWidth/28,height:ScreenHeight/60,width:ScreenHeight/60/1.83,resizeMode:'cover'}}
                    source={require('../../../images/Profile/next.png')}
                  />
            </TouchableOpacity>
          </View>
      </View>
    );
  }
}