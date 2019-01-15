import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { VictoryPie} from "victory-native";

let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
const Actives_fixed=[
  {name:'councilVoting.setCooloffPeriod',time:'310',number:49,Aye:5042964,aye:368,Nay:2512889,nay:58,result:'Aye',Actives_Nofixed:[{name:'blocks:Compact<BlockNumber>',num:256}],Balance:32,LI_cycle:6,Nofvoting:193},
  {name:'councilVoting.setCooloffPeriod',time:'310',number:48,Aye:5042964,aye:368,Nay:2512889,nay:58,result:'Nay',Actives_Nofixed:[{name:'Compact<BlockNumber>',num:252}],Balance:41,LI_cycle:6,Nofvoting:210},  
]
export default class Polkawallet extends Component {
  constructor(props)
  {
      super(props)
  }
  render() {
    return (
      <View style={{flex:1}}>
      {
          Actives_fixed.map((item,index)=>{
              return(
                <View style={{borderBottomWidth:1,borderColor:'#C0C0C0',}} key={index}>
                  <View style={{borderRadius:ScreenHeight/200,height:ScreenHeight/30,flexDirection:'row',alignItems:'center'}}>
                      <Text style={{marginLeft:ScreenWidth/40,fontSize:ScreenWidth/30}}>{item.name}</Text>
                      <Image
                          style={{marginLeft:ScreenWidth/40,height:ScreenHeight/50,width:ScreenHeight/50,resizeMode:'contain'}}
                          source={require('../../../images/Democracy/time.png')}
                      />
                      <Text style={{fontWeight:'500',marginLeft:ScreenWidth/80,color:'#90BD5B',fontSize:ScreenWidth/35}}>{item.time}</Text>
                      <Text style={{fontWeight:'500',color:'#90BD5B',fontSize:ScreenWidth/40}}> {' blocks end'}</Text>
                      <View style={{flex:1}}></View>
                      <Text style={{marginRight:ScreenWidth/70,fontSize:ScreenWidth/26}}>#{item.number}</Text>
                  </View>
                  {
                      item.Actives_Nofixed.map((itemNo,indexNo)=>{
                        return(
                          <View style={{marginLeft:ScreenWidth/30,marginTop:ScreenHeight/70}} key={indexNo}>
                            <Text style={{color:'#696969',fontSize:ScreenHeight/51.31}}>{itemNo.name}</Text>
                            <View style={{borderRadius:ScreenHeight/200,borderWidth:1,borderColor:'#C0C0C0',marginTop:ScreenHeight/100,justifyContent:'center',width:ScreenWidth/1.7,height:ScreenHeight/30,backgroundColor:'#DCDCDC',color:'#666666'}}>
                              <Text 
                                style={{width:ScreenWidth/2.5,marginLeft:ScreenWidth/40,color:'#666666',fontSize:ScreenHeight/51.31}}
                                ellipsizeMode={"middle"}
                                numberOfLines={1}
                              >
                                {itemNo.num}
                              </Text>
                            </View>
                          </View>
                        )
                      })
                  }
                  <View style={{alignItems:'center',flexDirection:'row',marginTop:ScreenHeight/70,marginLeft:ScreenWidth/40,height:ScreenHeight/30}}>
                    <Text style={{fontSize:ScreenHeight/65}}>Threshold: Super majority approval</Text>
                    <View style={{flex:1}}/>
                    <Text style={{marginRight:ScreenWidth/40,fontSize:ScreenHeight/65}}>My Voting Record:</Text>
                    <View style={{borderRadius:ScreenHeight/200,marginRight:ScreenWidth/40,alignItems:'center',justifyContent:'center',backgroundColor:item.result=='Aye'?'#7ad52a':'#fb3232',height:ScreenHeight/30}}>
                      <Text style={{fontWeight:'bold',color:'white',marginHorizontal:ScreenWidth/60,fontSize:ScreenHeight/65}}>{item.result}</Text>
                    </View>
                  </View>
                  <View style={{borderRadius:ScreenHeight/200,height:ScreenHeight/30,flexDirection:'row',alignItems:'center'}}>
                      <Image
                          style={{marginLeft:ScreenWidth/40,height:ScreenWidth/17.86*0.52,width:ScreenWidth/17.86,resizeMode:'cover'}}
                          source={require('../../../images/Democracy/green_ellipse.png')}
                      />
                      <Text style={{marginLeft:ScreenWidth/100,fontSize:ScreenWidth/45}}>{'Aye '+item.Aye}</Text>
                      <Text style={{marginLeft:ScreenWidth/80,fontSize:ScreenWidth/45,color:'#7ad52a'}}>66.75%</Text>
                      <Text style={{fontSize:ScreenWidth/45}}>{'('+item.aye+')'}</Text>
                      <Image
                          style={{marginLeft:ScreenWidth/40,height:ScreenWidth/17.86*0.52,width:ScreenWidth/17.86,resizeMode:'cover'}}
                          source={require('../../../images/Democracy/red_ellipse.png')}
                      />
                      <Text style={{marginLeft:ScreenWidth/100,fontSize:ScreenWidth/45}}>{'Nay '+item.Nay}</Text>
                      <Text style={{marginLeft:ScreenWidth/80,fontSize:ScreenWidth/45,color:'#fb3232'}}>33.25%</Text>
                      <Text style={{fontSize:ScreenWidth/45}}>{'('+item.nay+')'}</Text>
                  </View>
                  <View style={{flexDirection:'row',marginLeft:ScreenWidth/6,marginVertical:ScreenHeight/70}}>
                      <VictoryPie
                          padding={{ top: 0, left:0 }}
                          colorScale={['#8fec41','#fb3232']}
                          innerRadius={ScreenWidth/29}
                          data={[
                              { x: 1, y: 5, },
                              { x: 2, y: 2, },
                          ]}
                          height={ScreenWidth/5.86}
                          width={ScreenWidth/5.86}
                      />
                      {/* Nay or Aye */}
                      <View style={{flex:1,alignItems:'flex-end'}}>
                        <View style={{height:ScreenWidth/5.86/3,width:ScreenWidth/2.5,flexDirection:'row',justifyContent:'space-between'}}>
                          <Text style={{color:'#696969',fontSize:ScreenHeight/65}}>Balance:</Text>
                          <Text style={{marginRight:ScreenWidth/40,color:'#696969',fontSize:ScreenHeight/65}}>{item.Balance} M</Text>
                        </View>
                        <View style={{height:ScreenWidth/5.86/3,width:ScreenWidth/2.5,flexDirection:'row',justifyContent:'space-between'}}>
                          <Text style={{color:'#696969',fontSize:ScreenHeight/65}}>Locked-in cycle:</Text>
                          <Text style={{marginRight:ScreenWidth/40,color:'#696969',fontSize:ScreenHeight/65}}>{item.LI_cycle}</Text>
                        </View>
                        <View style={{height:ScreenWidth/5.86/3,width:ScreenWidth/2.5,flexDirection:'row',justifyContent:'space-between'}}>
                          <Text style={{color:'#696969',fontSize:ScreenHeight/65}}>Number of voting:</Text>
                          <Text style={{marginRight:ScreenWidth/40,color:'#696969',fontSize:ScreenHeight/65}}>{item.Nofvoting}</Text>
                        </View>
                        
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