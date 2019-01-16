import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
const Proposals=[
    {name:'councilVoting.setCooloffPeriod',time:'50',number:54,depositors:'5rgjhfdkjgbfdkjvbcvbkdjvbdfghjsdffd',balance:19.999,Actives_Nofixed:[{key:'blocks:Compact<BlockNumber>',value:256}]},
    {name:'councilVoting.setCooloffPeriod',time:'50',number:53,depositors:'5rgjhfdkjgbfdkjvbcvbkdjvbdfghjsdffd',balance:19.999,Actives_Nofixed:[{key:'blocks:Compact<BlockNumber>',value:256}]},
    {name:'councilVoting.setCooloffPeriod',time:'30',number:52,depositors:'5rgjhfdkjgbfdkjvbcvbkdjvbdfghjsdffd',balance:19.999,Actives_Nofixed:[{key:'Compact<BlockNumber>',value:252},{key:'who:Address',value:'5rgjhfdkjgbfdkjvbcvbkdjvbdfghjsdffd'},{key:'reserved:Compact<Balance>',value:180000}]},   
    {name:'councilVoting.setCooloffPeriod',time:'30',number:51,depositors:'5rgjhfdkjgbfdkjvbcvbkdjvbdfghjsdffd',balance:19.999,Actives_Nofixed:[{key:'who:Address',value:'5rgjhfdkjgbfdkjvbcvbkdjvbdfghjsdffd'},{key:'free:Compact<Balance>',value:18000},{key:'reserved:Compact<Balance>',value:180000}]},  
]

export default class Polkawallet extends Component {
  render() {
    return (
      <View style={{flex:1}}>
      {
        Proposals.map((item,index)=>{
          return(
            <View style={{margin:ScreenWidth/150,borderWidth:1,borderColor:'#D3D3D3',borderRadius:ScreenWidth/100}} key={index}>
              <View style={{borderRadius:ScreenHeight/200,height:ScreenHeight/30,flexDirection:'row',alignItems:'center'}}>
                        <Text style={{marginLeft:ScreenWidth/40,fontSize:ScreenWidth/30}}>{item.name}</Text>
                        {/* 时间 */}
                        <Image
                            style={{marginLeft:ScreenWidth/40,height:ScreenHeight/50,width:ScreenHeight/50,resizeMode:'contain'}}
                            source={require('../../images/Democracy/time.png')}
                        />
                        <Text style={{fontWeight:'500',marginLeft:ScreenWidth/80,color:'#90BD5B',fontSize:ScreenWidth/35}}>{item.time}</Text>
                        <Text style={{fontWeight:'500',color:'#90BD5B',fontSize:ScreenWidth/40}}> {' blocks launch'}</Text>
                        <View style={{flex:1}}></View>
                        <Text style={{marginRight:ScreenWidth/70,fontSize:ScreenWidth/26}}>#{item.number}</Text>
              </View>
              <View style={{width:ScreenWidth,flexDirection:'row'}}>
                {/* 不确定个数 */}
                <View style={{width:ScreenWidth/2-0.5}}>
                {
                        item.Actives_Nofixed.map((itemNo,indexNo)=>{
                          return(
                            <View style={{marginLeft:ScreenWidth/30,marginTop:ScreenHeight/70}} key={indexNo}>
                              <Text style={{color:'#696969',fontSize:ScreenWidth/40}}>{itemNo.key}</Text>
                              <View style={{borderRadius:ScreenHeight/200,borderWidth:1,borderColor:'#C0C0C0',marginTop:ScreenHeight/100,justifyContent:'center',width:ScreenWidth/2.3,height:ScreenHeight/30,backgroundColor:'#DCDCDC',color:'#666666'}}>
                                <Text 
                                  style={{width:ScreenWidth/3.2,marginLeft:ScreenWidth/40,color:'#666666',fontSize:ScreenWidth/30}}
                                  ellipsizeMode={"middle"}
                                  numberOfLines={1}
                                >
                                  {itemNo.value}
                                </Text>
                              </View>
                            </View>
                          )
                        })
                    }
                    <View style={{height:ScreenHeight/40}}/>
                </View>
                {/* 虚线 */}
                <View style={{flex:1,borderWidth:0.5,marginVertical:ScreenHeight/70,borderStyle:'dashed',borderColor:'#C0C0C0'}}/>
                {/* 确定个数 */}
                <View style={{width:ScreenWidth/2-0.5}}>
                  <View style={{marginLeft:ScreenWidth/30,marginTop:ScreenHeight/70}}>
                    <Text style={{color:'#696969',fontSize:ScreenWidth/40}}>depositors</Text>
                    <View style={{borderRadius:ScreenHeight/200,borderWidth:1,borderColor:'#C0C0C0',marginTop:ScreenHeight/100,justifyContent:'center',width:ScreenWidth/2.3,height:ScreenHeight/30,backgroundColor:'#DCDCDC',color:'#666666'}}>
                      <Text 
                        style={{width:ScreenWidth/3.2,marginLeft:ScreenWidth/40,color:'#666666',fontSize:ScreenWidth/30}}
                        ellipsizeMode={"middle"}
                        numberOfLines={1}
                      >
                        {item.depositors}
                      </Text>
                    </View>
                  </View>
                  <View style={{marginLeft:ScreenWidth/30,marginTop:ScreenHeight/70}}>
                    <Text style={{color:'#696969',fontSize:ScreenWidth/40}}>balance</Text>
                    <View style={{borderRadius:ScreenHeight/200,borderWidth:1,borderColor:'#C0C0C0',marginTop:ScreenHeight/100,justifyContent:'center',width:ScreenWidth/2.3,height:ScreenHeight/30,backgroundColor:'#DCDCDC',color:'#666666'}}>
                      <Text 
                        style={{width:ScreenWidth/3.2,marginLeft:ScreenWidth/40,color:'#666666',fontSize:ScreenWidth/30}}
                        ellipsizeMode={"middle"}
                        numberOfLines={1}
                      >
                        {item.balance}
                      </Text>
                    </View>
                  </View>
                  <View style={{height:ScreenHeight/40}}/>

                </View>
              </View> 
            </View> 
            
          )
        })
      }
                   
        




      </View>    
      );
  }
}