import React, { Component } from 'react'; 
import {
    AppRegistry,
    StyleSheet,
    View,
    TextInput,
    Dimensions,
    Text,
    TouchableOpacity,
    Image,
    Clipboard,
    ScrollView,
  } from 'react-native';
  import Echarts from 'native-echarts';

  const Transfer_Records=[
    {tx_type:'Receive',time:'12/12/2018 09:17:31',tx_address:'5GqBzeuVYJBorP3oP7FgheoP5nb2twFeDUFZhoBhX7ExYsia',tx_value:1.1},
    {tx_type:'Send',time:'12/12/2018 09:17:31',tx_address:'5GqBzeuVYJBorP3oP7FgheoP5nb2twFeDUFZhoBhX7ExYsia',tx_value:1.1},
    {tx_type:'Receive',time:'12/12/2018 09:17:31',tx_address:'5GqBzeuVYJBorP3oP7FgheoP5nb2twFeDUFZhoBhX7ExYsia',tx_value:1.1},
    {tx_type:'Send',time:'12/12/2018 09:17:31',tx_address:'5GqBzeuVYJBorP3oP7FgheoP5nb2twFeDUFZhoBhX7ExYsia',tx_value:1.1},
    {tx_type:'Send',time:'12/12/2018 09:17:31',tx_address:'5GqBzeuVYJBorP3oP7FgheoP5nb2twFeDUFZhoBhX7ExYsia',tx_value:1.1},
    {tx_type:'Receive',time:'12/12/2018 09:17:31',tx_address:'5GqBzeuVYJBorP3oP7FgheoP5nb2twFeDUFZhoBhX7ExYsia',tx_value:1.1},
    {tx_type:'Send',time:'12/12/2018 09:17:31',tx_address:'5GqBzeuVYJBorP3oP7FgheoP5nb2twFeDUFZhoBhX7ExYsia',tx_value:1.1},
    {tx_type:'Receive',time:'12/12/2018 09:17:31',tx_address:'5GqBzeuVYJBorP3oP7FgheoP5nb2twFeDUFZhoBhX7ExYsia',tx_value:1.1},
    {tx_type:'Send',time:'12/12/2018 09:17:31',tx_address:'5GqBzeuVYJBorP3oP7FgheoP5nb2twFeDUFZhoBhX7ExYsia',tx_value:1.1},
  ]
  const titlebottoms=['All','Out','In']
  let ScreenWidth = Dimensions.get("screen").width;
  let ScreenHeight = Dimensions.get("screen").height;
  export default class Polkawallet extends Component{
      constructor(props){
          super(props)
          this.state={
            titlebottom:1,
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
                    data: [0, 0.02,0.03,0.06,0.04,0.06,0.10,0.04]
                }]
            },
          }
          this.back=this.back.bind(this)
      }   
      back(){
        this.props.navigation.navigate('Tabbed_Navigation')
      }
      render(){
          return(
              <View style={styles.container}>
                {/* 标题栏 */}
                <View style={styles.title}>
                    <TouchableOpacity
                        onPress={this.back}
                    >
                        <Image
                        style={styles.image_title}
                        source={require('../../../images/Assetes/Create_Account/back.png')}
                        />
                    </TouchableOpacity>
                    <Text style={styles.text_title}>DOT</Text>
                    <TouchableOpacity>
                        <Image 
                        style={styles.image_title}
                        source={require('../../../images/Assetes/coin_details/books.png')}
                        />
                    </TouchableOpacity>
                </View>
                {/* The line chart */}
                <View style={{height:ScreenHeight/3,borderWidth:1}}>
                  <Echarts 
                    option={this.state.option}
                    height={ScreenHeight/3}/>   
                </View>
                {/* The secondary title */}
                <View style={{height:ScreenHeight/20}}>
                  {/* 次标题 */}
                  <View style={{borderBottomColor:'grey',height:ScreenHeight/20,width:ScreenWidth,flexDirection:'row',justifyContent:'space-around'}}>
                    {
                        titlebottoms.map((item,index)=>{
                            return(
                                <TouchableOpacity 
                                    style={{width:ScreenWidth/3,justifyContent:'center',alignItems:'center',borderBottomWidth:2,borderBottomColor:this.state.titlebottom==index+1?'#005baf':'#A9A9A9'}}
                                    onPress={()=>{
                                    this.setState({
                                        titlebottom:index+1
                                    })
                                    }}
                                    key={index}
                                    >
                                    <Text style={{color:this.state.titlebottom==index+1?'#005bae':'#696969',fontSize:ScreenWidth/30,fontWeight:'500'}}>
                                      {item}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                  </View>
                </View>
                {/* Sliding table */}
                <View style={{marginTop:10,width:ScreenWidth,flex:1,backgroundColor:'white',borderWidth:1}}>
                  <ScrollView style={{flex:1}}>
                    {
                        Transfer_Records.map((item,index)=>{
                          return(
                            (this.state.titlebottom==1)
                            ?
                            //All
                            <View style={{alignItems:'center',flexDirection:'row',height:ScreenHeight/13,borderTopWidth:(index==0)?1:0,borderBottomWidth:1,borderColor:'grey'}} key={index}>
                              <Image
                                style={{marginLeft:ScreenWidth/20,height:ScreenHeight/21,width:ScreenHeight/21,resizeMode:'cover'}}
                                source={(item.tx_type=="Receive")?require('../../images/Staking/profit.png'):require('../../images/Staking/loss.png')}
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
                            :(this.state.titlebottom==2)
                            ?<View/>
                            :<View/>
                          )
                        })
                    }
                  </ScrollView>
                </View>
                {/* Send or Receive  */}
                <View style={{height:ScreenHeight/10,borderWidth:1}}></View>
              </View>
          )
      }
  }
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white'
    },
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
})