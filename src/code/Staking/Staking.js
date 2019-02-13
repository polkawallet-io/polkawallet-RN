import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  
} from 'react-native';
import Api from '@polkadot/api/promise';
import WsProvider from '@polkadot/rpc-provider/ws';
import Echarts from 'native-echarts';
let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
const Staking_Records=[
  {Staking_Record:'Staking Reward',time:'12/12/2018 09:17:31',num:35},
  {Staking_Record:'Staking Slashed',time:'12/12/2018 09:17:31',num:1000},
  {Staking_Record:'Staking Reward',time:'12/12/2018 09:17:31',num:30},
  {Staking_Record:'Staking Reward',time:'12/12/2018 09:17:31',num:26}
]
const MyNominstors=[
  {address:'5hfg3hofnvdoJhUidfjslfhdsfsdgrgdfbtnhgfhdgfd',balance:'33,333,567'},
  {address:'5IHhjhfdksjfuvbuUHUlfhshUHUBFifhdslhfudsivbh',balance:'213,344,565'},
  {address:'5DKofjgvldfjJKLHjkbdjsbgkjdsfelmfomvernvkvNL',balance:'30,222,333'},
  {address:'5LJdjhsfJhjksfjLVTnkdsfbsjkbshjlgbdsflkbdsjf',balance:'22,446,633'}
]
const Vailators=[
  {address:'5hfg3hofnvdoJhUidfjslfhdsfsdgrgdfbtnhgfhdgfd',num1:'33,333,567',num2:'34,443,333'},
  {address:'5IHhjhfdksjfuvbuUHUlfhshUHUBFifhdslhfudsivbh',num1:'213,344,565',num2:'34,443,333'},
  {address:'5DKofjgvldfjJKLHjkbdjsbgkjdsfelmfomvernvkvNL',num1:'30,222,333',num2:'34,443,333'},
  {address:'5DKofjgvldfjJKLHjkbdjsbgkjdsfelmfomvernvkvNL',num1:'30,222,333',num2:'34,443,333'},
  {address:'5DKofjgvldfjJKLHjkbdjsbgkjdsfelmfomvernvkvNL',num1:'30,222,333',num2:'34,443,333'},
  {address:'5DKofjgvldfjJKLHjkbdjsbgkjdsfelmfomvernvkvNL',num1:'30,222,333',num2:'34,443,333'},
  {address:'5DKofjgvldfjJKLHjkbdjsbgkjdsfelmfomvernvkvNL',num1:'30,222,333',num2:'34,443,333'},
  {address:'5DKofjgvldfjJKLHjkbdjsbgkjdsfelmfomvernvkvNL',num1:'30,222,333',num2:'34,443,333'},
  {address:'5LJdjhsfJhjksfjLVTnkdsfbsjkbshjlgbdsflkbdsjf',num1:'22,446,633',num2:'34,443,333'}
]
const Next_up=[
  {address:'5hfg3hofnvdoJhUidfjslfhdsfsdgrgdfhgdkfjhgjdf',num1:'33,333,567',num2:'34,443,333'},
  {address:'5IHhjhfdksjfuvbuUHUlfhshUHUBFifhdsffgfdghfhg',num1:'213,344,565',num2:'34,443,333'},
  {address:'5DKofjgvldfjJKLHjkbdjsbgkjdsfelmyhkbdjsbgkjd',num1:'30,222,333',num2:'34,443,333'},
  {address:'5DKofjgvldfjJKLHjkbdjsbgkjdskvNLHjkbdjsbgkjd',num1:'30,222,333',num2:'34,443,333'},
  {address:'5DKofjgvldfjJKLHjkbdjsbgkjdsfelmfombdjsbgkjd',num1:'30,222,333',num2:'34,443,333'},
  {address:'5DKofjgvldfjJKLHjkbdjsbgkjdsfelmfomvdjsbgkjd',num1:'30,222,333',num2:'34,443,333'},
  {address:'5DKofjgvldfjJKLHjkbdjsbgkjdsfelmfombdjsbgkjd',num1:'30,222,333',num2:'34,443,333'},
  {address:'5DKofjgvldfjJKLHjkbdjsbgkjdsfelmfomvdjsbgkjd',num1:'30,222,333',num2:'34,443,333'},
  {address:'5LJdjhsfJhjksfjLVTnkdsfbsjkbshjlgbdsHjkfrrjd',num1:'22,446,633',num2:'34,443,333'}
]
import { observer, inject } from "mobx-react";
@inject('rootStore')
@observer
export default class IntegralMall extends Component {
  constructor(props)
  {
      super(props)
      this.state={
        validators:[],
        validatorBalances:[],
        title:1,
        titlebottomAA:1,
        titlebottomSO:1,
        option: {
          title: {
            show:false
          },
          tooltip: {},
          legend: {
              data: ['']
          },
          xAxis: {
              data: ["12/5", "12/8", "12/11", "12/14", "12/17","12/20","12/23","12/26"]
          },
          yAxis: {},
          series: [{
              type: 'line',
              data: [0, 0.02,0.03,0.06,0.04,0.06,0,0.04]
          }]
        },
        text: 'text'
      }
      this.validators=this.validators.bind(this)
  }
  validators(){
    console.log(this.state.intentions)
    alert(this.state.intentions)
  }
  componentWillMount(){
    (async()=>{
      const api = await Api.create(new WsProvider(this.props.rootStore.stateStore.ENDPOINT));
      //查询all
      [validators,intentions] = await Promise.all([
        api.query.session.validators(),
        api.query.staking.intentions()
      ]);
      
      for (let i = intentions.length - 1; i >= 0; i--) {
        a = intentions[i];
        for (let j = validators.length - 1; j >= 0; j--) {
            b = validators[j];
            if (a == b) {
              intentions.splice(i, 1);
              validators.splice(j, 1);
                break;
            }
        }
    }
      alert(intentions)
        
      //查询提名者额度
      if (validators && validators.length > 0) {
        // Retrieve the balances for all validators
        validatorBalances = await Promise.all(
          validators.map(authorityId =>
            api.query.balances.freeBalance(authorityId)
          )
        );
        this.setState({
          validators: validators,
          validatorBalances: validatorBalances,
          intentions: intentions
        })
      }
      
      //查询等候提名者额度

    })()
    
  }
  render() {
    return (
        <View style={{flex:1,backgroundColor:'white'}}>
          <View style={{marginTop:ScreenHeight/30,height:ScreenHeight/20,width:ScreenWidth,flexDirection:'row',justifyContent:'center'}}>
            <TouchableOpacity 
              style={{justifyContent:'center',alignItems:'center',height:ScreenHeight/20,width:ScreenWidth*0.49,borderWidth:1,borderColor:'#0076ff',borderTopLeftRadius:8,borderBottomLeftRadius:8,backgroundColor:this.state.title==1?'#0076ff':'white'}}
              onPress={()=>{
                this.setState({
                  title:1
                })
              }}
              >
              <Text style={{color:this.state.title==1?'white':'#0076ff',fontSize:ScreenWidth/23.44,marginRight:ScreenWidth/28.85}}>Account Actions</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{justifyContent:'center',alignItems:'center',height:ScreenHeight/20,width:ScreenWidth*0.49,borderWidth:1,borderColor:'#0076ff',borderTopRightRadius:8,borderBottomRightRadius:8,backgroundColor:this.state.title!=1?'#0076ff':'white'}}
              onPress={()=>{
                this.setState({
                  title:2
                })
              }}
              >
              <Text style={{color:this.state.title!=1?'white':'#0076ff',fontSize:ScreenWidth/23.44,marginRight:ScreenWidth/28.85}}>Staking Overview</Text>
            </TouchableOpacity>
          </View>
          {   
              (this.state.title==1)
              ?
              // ***********************AliceAccount************************
              <ScrollView>
                {/* *********************** 点线图 *********************** */}
                <View style={{height:ScreenHeight/3,width:ScreenWidth,borderBottomWidth:2,borderBottomColor:'grey'}}>
                  <Echarts 
                    option={this.state.option}
                    height={ScreenHeight/3}/>                
                </View>
                <View style={{height:ScreenHeight*0.45,width:ScreenWidth,alignItems:'center'}}>
                  <View style={{alignItems:'center',justifyContent:'space-between',width:ScreenWidth,flexDirection:'row',height:ScreenHeight*0.4/3}}>
                    {/* 灰色尖锐 */}
                    <Image
                      style={{marginLeft:ScreenWidth/4,marginBottom:ScreenHeight/29-ScreenHeight/40,height:ScreenHeight/35,width:ScreenHeight/35,resizeMode:'cover'}}
                      source={require('../../images/Staking/greysharp.png')}
                    />
                    {/* 头像 */}
                    <Image
                      style={{marginTop:ScreenHeight/40,height:ScreenHeight/14.5,width:ScreenHeight/14.5,resizeMode:'cover'}}
                      source={require('../../images/Staking/accountIMG.png')}
                    />
                    <View style={{marginRight:ScreenWidth/4,height:ScreenHeight/35,width:ScreenHeight/35}}></View>
                  </View>
                  {/* 用户名 */}
                  <Text style={{color:'#4B4B4B',marginBottom:ScreenHeight/40,fontSize:ScreenHeight/47.65}}>AliceAccount</Text>
                  {/* 地址 */}
                  <Text 
                    style={{width:ScreenWidth/2,marginBottom:ScreenHeight/40,fontSize:ScreenHeight/45,color:'black'}}
                    ellipsizeMode={"middle"}
                    numberOfLines={1}
                  >
                    5hfg3hofnvdoJhUidfjslfhdsfsdiljhhjkgrgdfbtnhgfhdgfd
                  </Text>
                  {/* 余额 */}
                  <Text style={{marginBottom:ScreenHeight/80,fontSize:ScreenHeight/47.65,color:'#4B4B4B'}}>balance 1.5 M</Text>
                  {/* transactions */}
                  <Text style={{fontSize:ScreenHeight/47.65,color:'#4B4B4B'}}>47 transactions</Text>
                  {/* Stake or nominate */}
                  <View style={{flexDirection:'row',flex:1,alignItems:'center',justifyContent:'center',width:ScreenWidth}}>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#4eacd1',height:ScreenHeight/16,width:ScreenWidth*0.4}}>
                      <Image
                        style={{height:ScreenHeight/30,width:ScreenHeight/30,resizeMode:'cover'}}
                        source={require('../../images/Staking/whitesharp.png')}
                      />
                      <Text style={{marginLeft:ScreenWidth/30,fontWeight:'bold',fontSize:ScreenHeight/40,color:'white'}}>
                        Stake
                      </Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#4eacd1',marginLeft:ScreenWidth/100,height:ScreenHeight/16,width:ScreenWidth*0.4}}>
                      <Image
                        style={{height:ScreenHeight/32,width:ScreenHeight/32,resizeMode:'contain'}}
                        source={require('../../images/Staking/branch.png')}
                      />
                      <Text style={{marginLeft:ScreenWidth/30,fontWeight:'bold',fontSize:ScreenHeight/40,color:'white'}}>
                        nominate
                      </Text>
                    </View>
                    <View style={{borderRadius:ScreenHeight/16/14*4,backgroundColor:'white',position:'absolute',height:ScreenHeight/16/7*4,width:ScreenHeight/16/7*4,alignItems:'center',justifyContent:'center'}}>
                      <Text style={{fontSize:ScreenHeight/48}}>
                        or
                      </Text>
                    </View>
                  </View>
                </View>
                {/* 次标题 */}
                <View style={{padding:1,borderBottomColor:'grey',height:ScreenHeight/20,width:ScreenWidth,flexDirection:'row',justifyContent:'space-around'}}>
                  <TouchableOpacity 
                    style={{justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderBottomColor:this.state.titlebottomAA==1?'#005baf':'#ffffff00'}}
                    onPress={()=>{
                      this.setState({
                        titlebottomAA:1
                      })
                    }}
                    >
                    <Text style={{color:this.state.titlebottomAA==1?'#005bae':'#696969',fontSize:ScreenWidth/30}}>
                      Staking Records
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderBottomColor:this.state.titlebottomAA==2?'#005baf':'#ffffff00'}}
                    onPress={()=>{
                      this.setState({
                        titlebottomAA:2
                      })
                    }}
                    >
                    <Text style={{color:this.state.titlebottomAA==2?'#005bae':'#696969',fontSize:ScreenWidth/30}}>
                      Nominsting
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderBottomColor:this.state.titlebottomAA==3?'#005baf':'#ffffff00'}}
                    onPress={()=>{
                      this.setState({
                        titlebottomAA:3
                      })
                    }}
                    >
                    <Text style={{color:this.state.titlebottomAA==3?'#005bae':'#696969',fontSize:ScreenWidth/30}}>
                      MyNominstors
                    </Text>
                  </TouchableOpacity>
                </View>
                {
                    (this.state.titlebottomAA==1)?
                    // Staking Records
                    <View>
                      {
                        Staking_Records.map((item,index)=>{
                          return(
                            <View style={{alignItems:'center',flexDirection:'row',height:ScreenHeight/13,borderTopWidth:(index==0)?1:0,borderBottomWidth:1,borderColor:'grey'}} key={index}>
                              <Image
                                style={{marginLeft:ScreenWidth/20,height:ScreenHeight/21,width:ScreenHeight/21,resizeMode:'cover'}}
                                source={(item.Staking_Record=="Staking Reward")?require('../../images/Staking/profit.png'):require('../../images/Staking/loss.png')}
                              />
                              <View style={{marginLeft:ScreenWidth/16.30,flex:1}}>
                                <Text
                                  style={{fontSize:ScreenHeight/47.64,color:'black'}}
                                >
                                  {item.Staking_Record}
                                </Text>
                                <Text
                                  style={{marginTop:ScreenHeight/120,fontSize:ScreenHeight/51.31,color:'#666666'}}
                                >
                                  {item.time}
                                </Text>
                              </View>
                              <Text
                                style={{marginRight:ScreenWidth/20,fontSize:ScreenHeight/41.69,color:'black'}}
                              >
                                {(item.Staking_Record=="Staking Reward")?"+ "+item.num:"- "+item.num} 
                              </Text>
                            </View>
                          )
                        })
                      }
                    </View>
                    :(this.state.titlebottomAA==2)?
                      // Nominsting
                      <View style={{borderTopWidth:1,borderTopColor:'grey',alignItems:'center',height:ScreenHeight/2.5}}>
                        <Text style={{marginTop:20,color:'#696969'}}>-You are not nominating.</Text>
                      </View>
                      :
                      // MyNominstors
                      <View>
                        {
                          MyNominstors.map((item,index)=>{
                            return(
                              <View style={{alignItems:'center',flexDirection:'row',height:ScreenHeight/13,borderTopWidth:(index==0)?1:0,borderBottomWidth:1,borderColor:'grey'}} key={index}>
                                <Image
                                  style={{marginLeft:ScreenWidth/20,height:ScreenHeight/21,width:ScreenHeight/21,resizeMode:'cover'}}
                                  source={require('../../images/Staking/accountIMG.png')}
                                />
                                <View style={{marginLeft:ScreenWidth/20,flex:1}}>
                                  <Text
                                    style={{width:ScreenWidth/4,fontSize:ScreenHeight/47.64,color:'black'}}
                                    ellipsizeMode={"middle"}
                                    numberOfLines={1}
                                  >
                                    {item.address}
                                  </Text>
                                </View>
                                <Text
                                  style={{marginRight:ScreenWidth/20,fontSize:ScreenHeight/51.31,color:'#666666'}}
                                >
                                  {item.balance} 
                                </Text>
                              </View>
                            )
                          })
                        }
                      </View>
                }
              </ScrollView>
              :
              //***************************************   */Staking Overview     ****************************
              <ScrollView>
                <View style={{marginTop:6,marginLeft:2,marginRight:2,height:ScreenHeight/5,borderWidth:2,borderColor:'grey',borderRadius:ScreenHeight/100}}>
                  <View style={{flexDirection:'row',height:ScreenHeight/12}}>
                    {/* vailators */}
                    <View style={{alignItems:'center',justifyContent:'center',height:ScreenHeight/12,width:ScreenWidth/4}}>
                      <Text style={{fontSize:ScreenHeight/51.31,color:'#696969'}}>vailators</Text>
                      <Text style={{fontSize:ScreenHeight/51.31}}>35/35</Text>
                    </View>
                    {/* intentions */}
                    <View style={{alignItems:'center',justifyContent:'center',height:ScreenHeight/12,width:ScreenWidth/4}}>
                      <Text style={{fontSize:ScreenHeight/51.31,color:'#696969'}}>intentions</Text>
                      <Text style={{fontSize:ScreenHeight/51.31}}>35</Text>
                    </View>
                    {/* session */}
                    <View style={{alignItems:'center',justifyContent:'center',height:ScreenHeight/12,width:ScreenWidth/4}}>
                      <Text style={{fontSize:ScreenHeight/51.31,color:'#696969'}}>session</Text>
                      <Text style={{fontSize:ScreenHeight/51.31}}>8/60</Text>
                    </View>
                    {/* era */}
                    <View style={{alignItems:'center',justifyContent:'center',height:ScreenHeight/12,width:ScreenWidth/4}}>
                      <Text style={{fontSize:ScreenHeight/51.31,color:'#696969'}}>era</Text>
                      <Text style={{fontSize:ScreenHeight/51.31}}>608/720</Text>
                    </View>
                  </View>
                  <Text style={{marginLeft:ScreenWidth/40,fontSize:ScreenHeight/51.31,height:ScreenHeight/10/3,color:'#696969'}}>balance</Text>
                  <Text style={{marginLeft:ScreenWidth/40,fontSize:ScreenHeight/51.31,height:ScreenHeight/10/3}}>lowest vailidator 2,181,791(+1,570,443)</Text>
                  <Text style={{marginLeft:ScreenWidth/40,fontSize:ScreenHeight/51.31,height:ScreenHeight/10/3}}>highest intention unknown</Text>
                </View>
                {/* Vailators and Next_up */}
                <View style={{padding:1,borderBottomColor:'grey',height:ScreenHeight/20,width:ScreenWidth,flexDirection:'row',borderBottomWidth:1,borderBottomColor:'black'}}>
                  <TouchableOpacity 
                    style={{justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderBottomColor:this.state.titlebottomSO==1?'blue':'#ffffff00'}}
                    onPress={()=>{
                      this.setState({
                        titlebottomSO:1
                      })
                    }}
                    >
                    <Text style={{marginHorizontal:ScreenWidth/40,color:this.state.titlebottom==1?'blue':'#696969',fontSize:ScreenWidth/30}}>
                      Vailators
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderBottomColor:this.state.titlebottomSO==2?'blue':'#ffffff00'}}
                    onPress={()=>{
                      this.setState({
                        titlebottomSO:2
                      })
                    }}
                    >
                    <Text style={{marginHorizontal:ScreenWidth/40,color:this.state.titlebottom==2?'blue':'#696969',fontSize:ScreenWidth/30}}>
                      Next up
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  {
                    (this.state.titlebottomSO==1)?
                    //Vailators
                    this.state.validators.map((item,index)=>{
                      return(
                          <TouchableOpacity style={{alignItems:'center',flexDirection:'row',height:ScreenHeight/13,borderBottomWidth:1,borderColor:'grey'}} key={index}
                            onPress={this.validators}
                          >
                                <Image
                                  style={{marginLeft:ScreenWidth/20,height:ScreenHeight/21,width:ScreenHeight/21,resizeMode:'cover'}}
                                  source={require('../../images/Staking/accountIMG.png')}
                                />
                                <View style={{marginLeft:ScreenWidth/20,flex:1}}>
                                  <Text
                                    style={{width:ScreenWidth/4,fontSize:ScreenHeight/47.64}}
                                    ellipsizeMode={"middle"}
                                    numberOfLines={1}
                                  >
                                    {String(item)}
                                  </Text>
                                </View>
                                <Text
                                  style={{marginRight:ScreenWidth/20,fontSize:ScreenHeight/51.31,color:'#666666'}}
                                >
                                  {String(this.state.validatorBalances[index])}
                                </Text>
                          </TouchableOpacity>
                      )
                    })
                    :
                    // Next_up
                    Next_up.map((item,index)=>{
                      return(
                          <View style={{alignItems:'center',flexDirection:'row',height:ScreenHeight/13,borderBottomWidth:1,borderColor:'grey'}} key={index}>
                                <Image
                                  style={{marginLeft:ScreenWidth/20,height:ScreenHeight/21,width:ScreenHeight/21,resizeMode:'cover'}}
                                  source={require('../../images/Staking/accountIMG.png')}
                                />
                                <View style={{marginLeft:ScreenWidth/20,flex:1}}>
                                  <Text
                                    style={{width:ScreenWidth/4,fontSize:ScreenHeight/47.64}}
                                    ellipsizeMode={"middle"}
                                    numberOfLines={1}
                                  >
                                    {item.address}
                                  </Text>
                                </View>
                                <Text
                                  style={{marginRight:ScreenWidth/20,fontSize:ScreenHeight/51.31,color:'#666666'}}
                                >
                                  {item.num1+'(+'+item.num2+')'} 
                                </Text>
                          </View>
                      )
                    })
                  }
                </View>
              </ScrollView>

          }
        </View>
    );
  }
}