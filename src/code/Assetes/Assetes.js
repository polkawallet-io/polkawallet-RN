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
import Drawer from 'react-native-drawer'
import Right_menu from './secondary/right_menu'

let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
export default class New extends Component {
  constructor(props)
    {
        super(props)
        this.state = {
            is: false,
            s:1
        }
        this.QR_Code=this.QR_Code.bind(this)
        this.Coin_details=this.Coin_details.bind(this)
    }

  QR_Code(){
    this.props.navigation.navigate('QR_Code')
  }
  Coin_details(){
    this.props.navigation.navigate('Coin_details')
  }
  
  
  render() {
    return (
      <Drawer
        type='overlay'
        side='right'
        content={<Right_menu p={this.props} t={this}/>}
        open={this.state.is}
        tapToClose={true}//点底层可关闭
        // openDrawerOffset={0.43} // 左边留0.336
        openDrawerOffset={0} // 左边留0.336
        closedDrawerOffset={0}//左边留0
        panOpenMask={0.1}
      >
       <View style={{flex:1,backgroundColor:'white',}}>
        {/* 标题栏 */}
        <View style={{height:ScreenHeight/9,backgroundColor:'#776f71',flexDirection:'row',alignItems:'flex-end'}}>
          <View style={{marginLeft:ScreenWidth/26.79,height:ScreenHeight/33.35,width:ScreenHeight/33.35}}></View>
          <View style={{height:ScreenHeight/10.6/1.6,flex:1,justifyContent:'flex-end',alignItems:'center'}}>
              {/* logo */}
              <Image
                style={{marginRight:ScreenHeight/20*4.73/4,marginBottom:ScreenHeight/75,height:ScreenHeight/20,width:ScreenHeight/20*4.73,resizeMode:'contain'}}
                source={require('../../images/Assetes/logo.png')}
              />
          </View>
          {/* 右菜单 */}
          <TouchableOpacity
            onPress={()=>{
              this.setState({
                is:true
              })
            }}
          >
            <Image
              style={{marginRight:ScreenWidth/26.79,marginBottom:ScreenHeight/75,height:ScreenHeight/33.35,width:ScreenHeight/33.35}}
              source={require('../../images/Assetes/rightMenu.png')}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={{height:ScreenHeight/3.5,backgroundColor:'#FF4081C7',alignItems:'center'}}>
              <View style={{marginTop:ScreenHeight/55,width:ScreenWidth,height:ScreenHeight/3.81/2.5,alignItems:'center',justifyContent:'center'}}>
                {/* 头像 */}
                <Image
                  style={{marginTop:ScreenHeight/30,backgroundColor:'white',borderRadius:ScreenHeight/28,height:ScreenHeight/14,width:ScreenHeight/14,resizeMode:'cover'}}
                  source={require('../../images/Assetes/accountIMG.png')}
                />
              </View>
              <View style={{height:ScreenHeight/3.81/6,width:ScreenWidth,alignItems:'center',justifyContent:'center'}}>
                {/* 用户名 */}
                <Text style={{fontWeight:"200",fontSize:ScreenHeight/45,color:'white'}}>AliceAccount</Text>
              </View>
              <View style={{height:ScreenHeight/3.81/6,width:ScreenWidth,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                {/* 地址 */}
                <Text 
                  style={{fontWeight:"200",width:ScreenWidth*0.5,fontSize:ScreenHeight/45,color:'white'}}
                  ellipsizeMode={"middle"}
                  numberOfLines={1}
                >5Dn8F1SUX6SoLt1BTfKEPL5VY9wMvG1A6tEJTSCHpLsinThm</Text>
                {/* 二维码 */}
                <TouchableOpacity
                  onPress={this.QR_Code}
                >
                  <Image
                    style={{marginLeft:ScreenWidth/53.57,height:ScreenHeight/45,width:ScreenHeight/45,opacity:0.8}}
                    source={require('../../images/Assetes/QrButton.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={{flex:1}}></View>
              <View style={{alignItems:'center',flexDirection:'row',justifyContent:'space-between',height:ScreenHeight/3.81/3.8,width:ScreenWidth}}>
                <Text style={{fontWeight:'bold',marginLeft:ScreenWidth/40,color:'white',fontSize:ScreenWidth/25}}>Assetes</Text>
                {/* 添加币种 */}
                <TouchableOpacity
                  onPress={()=>{this.setState({s:2})}}
                >
                  <Image
                    style={{marginRight:ScreenWidth/20,height:ScreenHeight/30,width:ScreenHeight/30,opacity:0.9}}
                    source={require('../../images/Assetes/addAssetes.png')}
                  />
                </TouchableOpacity>
              </View>
          </View>
          {/* 各种币具体信息 */}
          <TouchableOpacity
            onPress={this.Coin_details}
          >
            <View style={{flexDirection:'row',height:ScreenHeight/10,backgroundColor:'white',borderBottomColor:'#F5F5F5',borderBottomWidth:2}}>
                <View style={{justifyContent:'center',alignItems:'center',width:ScreenWidth/6,height:ScreenHeight/10}}>
                    <Image
                      style={{borderRadius:ScreenHeight/32,height:ScreenHeight/16,width:ScreenHeight/16}}
                      source={require('../../images/Assetes/DOT.png')}
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
          </TouchableOpacity>
        </ScrollView>
       </View>
      </Drawer>    
      );
  }
}