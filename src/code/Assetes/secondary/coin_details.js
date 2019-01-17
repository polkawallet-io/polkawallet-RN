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
  } from 'react-native';
  
  let ScreenWidth = Dimensions.get("screen").width;
  let ScreenHeight = Dimensions.get("screen").height;
  export default class Polkawallet extends Component{
      constructor(props){
          super(props)
          this.state={
          }
      }   
      render(){
          return(
              <View style={styles.container}>
              </View>
          )
      }
  }
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white'
    },
})