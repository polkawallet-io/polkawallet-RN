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
import Echarts from 'native-echarts';
let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
export default class IntegralMall extends Component {
  constructor(props){
    super(props)
    this.state={
      titlebottomAA:1,
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
    }
    this.back=this.back.bind(this)
  }  
  back(){
    this.props.navigation.navigate('Tabbed_Navigation')
  }  
    render() {
        return (
          
            <View style={styles.container}>
              {/* 标题栏 */}
              <View style={styles.title}>
                <TouchableOpacity
                    onPress={this.back}
                >
                    <Image
                    style={styles.image_title}
                    source={require('../../../images/Staking/back.png')}
                    />
                </TouchableOpacity>
                <Text style={styles.text_title}>Validator Info</Text>
                <TouchableOpacity>
                    <Image 
                      style={styles.image_title}
                    />
                </TouchableOpacity>
              </View>
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
                      // source={require('../../images/Staking/greysharp.png')}
                    />
                    {/* 头像 */}
                    <Image
                      style={{marginTop:ScreenHeight/40,height:ScreenHeight/14.5,width:ScreenHeight/14.5,resizeMode:'cover'}}
                      source={require('../../../images/Staking/accountIMG.png')}
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
                  {/* nominate */}
                  <View style={{flexDirection:'row',flex:1,alignItems:'center',justifyContent:'center',width:ScreenWidth}}>
                    <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:5,backgroundColor:'#4eacd1',height:ScreenHeight/16,width:ScreenWidth*0.4}}>
                      <Image
                        style={{height:ScreenHeight/32,width:ScreenHeight/32,resizeMode:'contain'}}
                        source={require('../../../images/Staking/branch.png')}
                      />
                      <Text style={{marginLeft:ScreenWidth/30,fontWeight:'bold',fontSize:ScreenHeight/40,color:'white'}}>
                        nominate
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* 次标题 */}
                  <View style={{borderBottomWidth:1,padding:1,borderBottomColor:'grey',height:ScreenHeight/20,width:ScreenWidth,flexDirection:'row',justifyContent:'space-around'}}>
                    <TouchableOpacity 
                      style={{justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderBottomColor:this.state.titlebottomAA==1?'#005baf':'#ffffff00'}}
                      onPress={()=>{
                        this.setState({
                          titlebottomAA:1
                        })
                      }}
                      >
                      <Text style={{color:this.state.titlebottomAA==1?'#005bae':'#696969',fontSize:ScreenWidth/30}}>
                        Nominators
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
                        Staking Records
                      </Text>
                    </TouchableOpacity>
                    <View 
                      style={{width:ScreenWidth*0.25,justifyContent:'center',alignItems:'center',borderBottomWidth:1,borderBottomColor:this.state.titlebottomAA==3?'#005baf':'#ffffff00'}}
                    >
                    </View>

                  </View>
                </View>
              </ScrollView>
            </View>
        )}
}
const styles = StyleSheet.create({
  container: {
      flex:1,
      backgroundColor:'white',
  },
  title:{
    padding:ScreenHeight/50,
    height:ScreenHeight/9,
    flexDirection:'row',
    alignItems:'flex-end',
    justifyContent:'space-between'
  },
  text_title:{
      fontSize:ScreenHeight/37,
      fontWeight:'bold',
      color:'black'
  },
  image_title:{
      height:ScreenHeight/35,
      width:ScreenHeight/35,
      resizeMode:'contain'
  },
})