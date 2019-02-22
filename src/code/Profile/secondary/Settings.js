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
  AsyncStorage,
} from 'react-native';

let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
const msg = [
    // 'Language',
    // 'Assets Display Unit',
    'Remote Node'
]
import { observer, inject } from "mobx-react";
@inject('rootStore')
@observer
export default class New extends Component {
  constructor(props)
    {
        super(props)
        this.state = {
           
        }
        this.back=this.back.bind(this)
        this.Set_Node=this.Set_Node.bind(this)

    }
  back(){
    this.props.navigation.navigate('Tabbed_Navigation')
  }
  Set_Node(){
    this.props.navigation.navigate('Set_Node')
  }
  componentWillMount(){
   
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:'white',}}>
        {/* 标题栏 */}
        <View style={styles.title}>
            {/* 返回 */}
            <TouchableOpacity
                onPress={this.back}
            >
                <Image
                style={styles.image_title}
                source={require('../../../images/Assetes/Create_Account/back.png')}
                />
            </TouchableOpacity>
            {/* 标题 */}
            <Text style={styles.text_title}>Settings</Text>
            {/* 空白 */}
            <View style={{height:ScreenHeight/33.35,width:ScreenHeight/33.35,}}/>
        </View>
        {
            msg.map((item,index)=>{
                return(
                    <TouchableOpacity style={styles.msgView} key={index}
                      onPress={()=>{
                          if(index==0){this.Set_Node()}
                      }}
                    >
                      <Text style={styles.msgText}>{item}</Text>
                      <View style={{flex:1}}/>
                      <Image
                        style={styles.msgImage}
                        source={require('../../../images/Profile/next.png')}
                      />
                    </TouchableOpacity>
                )
            })
        }
      </View>
    );
  }
}
const styles = StyleSheet.create({
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
    msgView:{
        backgroundColor:'white',
        flexDirection:'row',
        alignItems:'center',
        height:ScreenHeight/13,
        borderWidth:0.5,
        borderColor:'#C0C0C0',
        borderRadius:ScreenHeight/130,
        marginHorizontal:1,
        paddingLeft:ScreenWidth*0.05
    },
    msgText:{
        fontSize:ScreenWidth/20,
        color:'#696969'
    },
    msgImage:{
        marginRight:ScreenWidth/28,
        height:ScreenHeight/60,
        width:ScreenHeight/60/1.83,
        resizeMode:'contain'
    },
    
})