import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Picker,
  Clipboard
} from 'react-native';
let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
export default class Polkawallet extends Component{
  constructor(props)
  {
    super(props)
    this.state={
        text:'magic trap help enlist solve manual crush win base creek angry gate'
    }
    this.copy=this.copy.bind(this)
    this.Cancel=this.Cancel.bind(this)
    this.Continue=this.Continue.bind(this)
  }
  Cancel(){
    this.props.navigation.navigate('Create_Account')
  }
  Continue(){
    this.props.navigation.navigate('Tabbed_Navigation')
  }
  async copy(){
    Clipboard.setString(this.state.text);
    let  str = await Clipboard.getString()
  }
  render(){
      return(
        <View style={styles.container}>
          {/* 标题栏 */}
          <View style={styles.title}>
            <Text style={{fontSize:ScreenHeight/37,fontWeight:'bold',color:'#e6e6e6'}}>Create_Wallet</Text>
          </View>
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <View style={styles.Warning_View}>
                <Text style={styles.text}>Warning</Text>
                <Text style={{fontSize:ScreenWidth/33}}>
                  <Text>Before you continue,make sure you have properly backed up your seed in a safe place as</Text>
                  <Text style={{fontWeight:'bold'}}> It is needed ro restore your account.</Text>
                </Text>
                <View style={styles.textInput}>
                    {/* The key */}
                    <TextInput style = {styles.textInputStyle}
                        placeholder = {this.state.text}
                        placeholderTextColor = "black"
                        underlineColorAndroid="#ffffff00"
                        multiline={true}
                        // onChangeText = {this.onChangePh}
                    />
                    {/* copy */}
                    <TouchableOpacity
                      onPress={this.copy}
                    >
                      <Image 
                        style={styles.image}
                        source={require('../../../images/Assetes/Create_Account/copy.png')}
                      />
                    </TouchableOpacity>
                </View>
                {/* Reset or Save */}
                <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                  <View style={{flexDirection:'row',height:ScreenHeight/20,width:ScreenWidth*0.5,alignItems:'center',justifyContent:'center'}}>
                    <TouchableOpacity style={[styles.chooseView,{backgroundColor:'#696969'}]}
                       onPress={this.Cancel}
                    >
                      <Text style={styles.chooseText}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.chooseView,{backgroundColor:'#FF4081',marginLeft:ScreenWidth/100}]}
                      onPress={this.Continue}
                    >
                      <Text style={styles.chooseText}>
                        Continue
                      </Text>
                    </TouchableOpacity>
                    <View style={{borderRadius:ScreenHeight/24/14*4,backgroundColor:'white',position:'absolute',height:ScreenHeight/24/7*4,width:ScreenHeight/24/7*4,alignItems:'center',justifyContent:'center'}}>
                      <Text style={{fontSize:ScreenHeight/70}}>
                        or
                      </Text>
                    </View>
                  </View>
                </View>

              </View>
          </View>
        </View>

      )
  } 
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'white'
    },
    title:{
        padding:ScreenHeight/50,
        height:ScreenHeight/9,
        backgroundColor:'#776f71',
        flexDirection:'row',
        alignItems:'flex-end',
        justifyContent:'center',
    },
    middle:{
        justifyContent:'center',
        alignItems:'center'
    },
    Warning_View:{
        height:ScreenHeight/3,
        width:ScreenWidth*0.97,
        borderWidth:2,
        borderRadius:ScreenHeight/70,
        borderColor:'#A9A9A9',
        paddingLeft:ScreenWidth/40,
    },
    text:{
        marginTop:ScreenHeight/40,
        marginBottom:ScreenHeight/70,
        fontSize:ScreenHeight/40,
        fontWeight:'500',
        color:'black',
    },
    textInput:{
        height:ScreenHeight/8,
        flexDirection:'row',
        alignItems:'center',
    },
    textInputStyle:{
        height:ScreenHeight/10,
        width:ScreenWidth*0.75,
        borderWidth:1,
        borderColor:'grey',
        borderRadius:ScreenHeight/100,
        paddingLeft:ScreenHeight/100,
        fontSize:ScreenHeight/40,
    },
    image:{
        marginLeft:ScreenWidth*0.025,
        height:ScreenWidth*0.07,
        width:ScreenWidth*0.07,
        resizeMode:'contain'
    },
    chooseText:{
        fontWeight:'400',
        fontSize:ScreenHeight/50,
        color:'white'
    },
    chooseView:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        height:ScreenHeight/24,
        width:ScreenWidth*0.18
    }
    
})