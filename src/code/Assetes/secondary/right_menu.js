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
const Accounts=[
  {account:'AliceAccount',address:'5rgjhfdkjgbfdkjvbcvbkdjvbdfghjsdffd'},
  {account:'AliceAccount',address:'5rgjhfdkjgbfdkjvbcvbkdjvbdfghjsdffd'},  
  {account:'AliceAccount',address:'5rgjhfdkjgbfdkjvbcvbkdjvbdfghjsdffd'},
  {account:'AliceAccount',address:'5rgjhfdkjgbfdkjvbcvbkdjvbdfghjsdffd'},
  {account:'AliceAccount',address:'5rgjhfdkjgbfdkjvbcvbkdjvbdfghjsdffd'}
]
let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
export default class New extends Component {
    constructor(props)
    {
        super(props)
        this.state = {
            Account: 0 
        }
        this.Create_Account=this.Create_Account.bind(this)
    }
    Create_Account()
    {
      this.props.t.setState({
        is:false
      })
      this.props.p.navigation.navigate('Create_Account')
    }
  render() {
        return (
            <View style={[styles.container]}>
              <TouchableOpacity style={{width:ScreenWidth*0.43,flex:1}}
                onPress={()=>{
                  this.props.t.setState({
                    is:false
                  })
                }}
              />
              <View style={{backgroundColor:'#7582C9'}}>
                <View style={{height:ScreenHeight/14*3,marginTop:ScreenHeight/14}}>
                  <ScrollView>
                    {
                      Accounts.map((item,index)=>{
                        return(
                          <TouchableOpacity style={[styles.account,{backgroundColor:(this.state.Account==index)?'#5c67a6':'#7582C9'}]} key={index}
                            onPress={()=>{
                              this.setState({
                                Account:index
                              })
                            }}
                          >
                            {/* 账户头像 */}
                            <Image
                              style={[styles.image,{}]}
                              source={require('../../../images/Assetes/accountIMG.png')}
                            />
                            {/* 账户名 and 地址 */}
                            <View style={{marginLeft:ScreenWidth/30,flex:1}}>
                              <Text
                                style={{fontSize:ScreenHeight/44.47,color:'white'}}
                              >
                                {item.account}</Text>
                              <Text
                                style={{marginTop:ScreenHeight/200,fontSize:ScreenHeight/51.31,width:ScreenWidth/3,color:'#EEEEEE'}}
                                ellipsizeMode={"middle"}
                                numberOfLines={1}
                              >
                                {item.address}</Text>
                            </View>
                          </TouchableOpacity>
                        )
                      })
                    }
                  </ScrollView>
                </View>
                {/* 上线 */}
                <View style={styles.line}/>
                <View style={styles.SandC}>
                  {/* 摄像头 */} 
                  <TouchableOpacity style={[styles.middle,{width:ScreenWidth*0.57*0.45-0.5}]}>
                    <Image
                      style={[{height:ScreenHeight/38,width:ScreenHeight/38,resizeMode:'contain'}]}
                      source={require('../../../images/Assetes/right_menu/Scan.png')}
                    />
                    <Text style={{marginTop:ScreenHeight/200,fontSize:ScreenWidth/25,color:'#333333'}}>Scan</Text>
                  </TouchableOpacity>
                  <View style={{width:1,height:ScreenHeight/40,backgroundColor:'#A9A9A9'}}/>
                  {/* 创建钱包 */}
                  <TouchableOpacity style={[styles.middle,{width:ScreenWidth*0.57*0.55-0.5}]}
                    onPress={()=>{this.Create_Account()}}
                  >
                    <Image
                      style={[{height:ScreenHeight/38,width:ScreenHeight/38,resizeMode:'contain'}]}
                      source={require('../../../images/Assetes/right_menu/Create_Account.png')}
                    />
                    <Text style={{marginTop:ScreenHeight/200,fontSize:ScreenWidth/25,color:'#333333'}}>Create Account</Text>
                  </TouchableOpacity>
                </View>
                <View style={{flex:1}}/>
                {/* 下线 */}
                <View style={styles.line}/>
                {/* 帮助 */}
                <TouchableOpacity style={[styles.middle,{height:ScreenHeight/13,flexDirection:'row'}]}>
                  <Image
                    style={[{height:ScreenHeight/48,width:ScreenHeight/48,resizeMode:'contain'}]}
                    source={require('../../../images/Assetes/right_menu/help.png')}
                  />
                  <Text style={{fontWeight:'500',color:'white',marginLeft:ScreenWidth/70,fontSize:ScreenWidth/38}}>Can I help you?</Text>
                </TouchableOpacity>
              </View>
            </View>
            
        )
}
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#ffffff00',
    flexDirection:'row'
  },
  account: {
    height:ScreenHeight/14,
    flexDirection:'row',
    alignItems:'center',
  },
  image: {
    height:ScreenHeight/20,
    width:ScreenHeight/20,
    resizeMode:'contain',
    marginLeft:ScreenWidth/20
  },
  line:{
    marginTop:ScreenHeight/70,
    height:1,
    backgroundColor:'#D3D3D3'
  },
  SandC:{
    flexDirection:'row',
    marginTop:ScreenHeight/70,
    height:ScreenHeight/11.5,
    backgroundColor:'white',
    alignItems:'center',
  },
  middle:{
    justifyContent:'center',
    alignItems:'center'
  }
});