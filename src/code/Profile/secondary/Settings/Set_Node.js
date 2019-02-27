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
  TextInput,
  Alert,
  Modal,
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
           node:'',
           chooseNode:'wss://poc3-rpc.polkadot.io/',
           isCustom:false,
        }
        this.back=this.back.bind(this)
        this.onChangeNode = this.onChangeNode.bind(this)
        this.Set_Node=this.Set_Node.bind(this)
        this.chooseNode=this.chooseNode.bind(this)
        this.Noclick=this.Noclick.bind(this)
    }
  back(){
    this.props.navigation.navigate('Settings')
  }
  onChangeNode(onChangeNode){
      this.setState({
          node:onChangeNode
      })
  }
  Noclick(){}
  chooseNode(){
    Alert.alert(
        '',
        'Select your Node',
        [
            {text: 'wss://poc3-rpc.polkadot.io/', onPress: () => {
                this.setState({chooseNode:'wss://poc3-rpc.polkadot.io/'})
            }, style: 'cancel'},
            {text: 'ws://107.173.250.124:9944/', onPress: () => {
                this.setState({chooseNode:'ws://107.173.250.124:9944/'})
            }, style: 'cancel'},
            {text: 'Custom', onPress: () => {
                this.setState({isCustom:true})
            }, style: 'cancel'},
            {text: 'cancel', onPress: () => {}, style: 'cancel'},
        ],
        { cancelable: false }
    )
  }
  Set_Node(){
    Alert.alert(
        '',
        'Make sure you change Node to: "'+this.state.chooseNode+'"',
        [
            {text: 'cancel', onPress: () => {}, style: 'cancel'},
            {text: 'confirm', onPress: () => {
                this.props.rootStore.stateStore.ENDPOINT=this.state.chooseNode
                this.props.navigation.navigate('Tabbed_Navigation')
            }},
        ],
        { cancelable: false }
    )
  }
  componentWillMount(){
      this.setState({chooseNode:this.props.rootStore.stateStore.ENDPOINT})
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
                source={require('../../../../images/Assets/Create_Account/back.png')}
                />
            </TouchableOpacity>
            {/* 标题 */}
            <Text style={styles.text_title}>Set Node</Text>
            {/* 空白 */}
            <View style={{height:ScreenHeight/33.35,width:ScreenHeight/33.35,}}/>
        </View>
        <Text style={styles.text}>import remote node,if not is Alexander,not have the chart function</Text>
        <View style={[styles.textInputStyle,{flexDirection:'row',paddingLeft:0}]}>
          <TextInput style = {[styles.textInputStyle,{width:ScreenWidth*0.8-ScreenHeight/18,marginLeft:0,marginTop:0,borderWidth:0}]}  
            placeholderTextColor = 'black'
            autoCapitalize = 'none'
            placeholder = {this.state.chooseNode}
            autoCorrect={false}     
            editable={false}     
            underlineColorAndroid="#ffffff00"
            onChangeText = {this.onChangeNode}
          />
          <TouchableOpacity 
            style={{height:ScreenHeight/18,width:ScreenHeight/18,justifyContent:'center',alignItems:'center'}}
            onPress={(this.state.isCustom)?this.Noclick:this.chooseNode}  
          >
            <Image
                style={{height:ScreenHeight/50,width:ScreenHeight/50,resizeMode:'contain'}}
                source={require('../../../../images/Assets/Create_Account/next.png')}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.text}>NOTE: Exit the app,will return to the default (wss://poc3-rpc.polkadot.io/)</Text>
        {
            (this.state.isCustom)
            ?
              <View>
                <Text style={styles.text}>Please enter your custom Node</Text>
                <TextInput style = {[styles.textInputStyle,{borderColor:'#C0C0C0'}]}  
                    placeholderTextColor = 'black'
                    autoCapitalize = 'none'
                    placeholder = ''
                    autoCorrect={false}     
                    underlineColorAndroid="#ffffff00"
                    onChangeText = {this.onChangeNode}
                />
              </View>
            :<View/>
        }
        <TouchableOpacity
          style={styles.Touch}
          onPress={()=>{
              (this.state.isCustom)
              ?
                this.setState({chooseNode:this.state.node,isCustom:false})
              :
                this.Set_Node()
          }}
        >
            <Text style={{color:'white',fontSize:ScreenHeight/45,fontWeight:'bold'}}>confirm</Text>
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
        marginTop:ScreenHeight/20,
        width:ScreenWidth*0.8,
        fontSize:ScreenWidth/24,
        color:'#696969'
    },
    textInputStyle:{
        paddingVertical: 0,
        marginTop:ScreenHeight/70,
        marginLeft:ScreenWidth*0.06,
        height:ScreenHeight/18,
        width:ScreenWidth*0.8,
        borderWidth:1,
        borderColor:'#DCDCDC',
        fontSize:ScreenWidth/25,
        borderRadius:ScreenHeight/150,
        paddingLeft:ScreenHeight/100,
    },
    Touch:{
        marginRight:ScreenWidth*0.14,
        marginTop:ScreenHeight/20,
        height:ScreenHeight/18,
        width:ScreenWidth*0.4,
        alignSelf:'flex-end',
        borderRadius:ScreenHeight/100,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#FF4081C7'
    },
})