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
  TextInput
} from 'react-native';

let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
const msg = ['Language','Assets Display Unit','Remote Node']
import { observer, inject } from "mobx-react";
@inject('rootStore')
@observer
export default class New extends Component {
  constructor(props)
    {
        super(props)
        this.state = {
           node:''
        }
        this.back=this.back.bind(this)
        this.onChangeNode = this.onChangeNode.bind(this)
        this.Set_Node=this.Set_Node.bind(this)
    }
  back(){
    this.props.navigation.navigate('Settings')
  }
  onChangeNode(onChangeNode){
      this.setState({
          node:onChangeNode
      })
  }
  Set_Node(){
    this.props.rootStore.stateStore.ENDPOINT=this.state.node
    this.props.navigation.navigate('Tabbed_Navigation')
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
                source={require('../../../../images/Assetes/Create_Account/back.png')}
                />
            </TouchableOpacity>
            {/* 标题 */}
            <Text style={styles.text_title}>Set Node</Text>
            {/* 空白 */}
            <View style={{height:ScreenHeight/33.35,width:ScreenHeight/33.35,}}/>
        </View>
        <Text style={styles.text}>import remote node,if not is Alexander,not have the chart function</Text>
        <TextInput style = {[styles.textInputStyle]}  
            autoCapitalize = 'none'
            placeholder = ''
            autoCorrect={false}          
            underlineColorAndroid="#ffffff00"
            onChangeText = {this.onChangeNode}
        />
        <Text style={styles.text}>NOTE: Exit the app,will return to the default (wss://poc3-rpc.polkadot.io/)</Text>
        <TouchableOpacity
          style={styles.Touch}
          onPress={this.Set_Node}
        >
            <Text style={{color:'white',fontSize:ScreenHeight/50,fontWeight:'bold'}}>confirm</Text>
        </TouchableOpacity>
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
    text:{
        marginLeft:ScreenWidth*0.06,
        marginTop:ScreenHeight/70,
        width:ScreenWidth*0.8,
        fontSize:ScreenWidth/25,
        color:'#696969'
    },
    textInputStyle:{
        paddingVertical: 0,
        marginTop:ScreenHeight/70,
        color:'black',
        marginLeft:ScreenWidth*0.06,
        height:ScreenHeight/24,
        width:ScreenWidth*0.8,
        borderWidth:1,
        borderColor:'#DCDCDC',
        fontSize:ScreenHeight/60,
        borderRadius:ScreenHeight/150,
        paddingLeft:ScreenHeight/100,
        paddingVertical: 0
    },
    Touch:{
        marginRight:ScreenWidth*0.14,
        marginTop:ScreenHeight/40,
        height:ScreenHeight/20,
        width:ScreenWidth*0.4,
        alignSelf:'flex-end',
        borderRadius:ScreenHeight/100,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#FF4081C7'
    },
})