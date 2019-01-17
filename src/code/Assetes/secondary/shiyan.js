import React, { Component } from 'react'; 
import {
    AppRegistry,
    StyleSheet,
    View,
    TextInput,
    Dimensions,
    Text,
  } from 'react-native';
  import QRCode from 'react-native-qrcode'; 
  const screenWidth=Dimensions.get('window').width
//   const screenWidth=Dimensions.get('window').width
  export default class Product_ErWeiMa extends Component{
      constructor(props){
          super(props)
          this.state={
              text:'biubiubiu'
          }
      }   
      render(){
          return(
              <View style={{flex:1,backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                <TextInput 
                  style={{height:40,borderColor:'red',borderWidth:2,margin:10,borderRadius:5,padding:5,width:screenWidth-50}}
                  onChangeText={text=>this.setState({
                      text:text
                  })}
                  value={this.state.text}
                ></TextInput>
                <QRCode
                  value={this.state.text}
                  size={200}
                  bgColor='purple'
                  fgColor='white'
                ></QRCode>
              </View>
          )
      }
  }