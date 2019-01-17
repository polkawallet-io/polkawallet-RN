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
  Picker
} from 'react-native';

let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
export default class Polkawallet extends Component {
    constructor(props)
    {
        super(props)
        this.state = {
            language: '' 
        }
    }
  render() {
    return (
        <View style={styles.container}>
        <Text >
          Picker选择器实例
        </Text>
        <Picker
          style={{width:414,borderWidth:1}}
          selectedValue={this.state.language}
          onValueChange={(value) => this.setState({language: value})}
        //   value={["1",'2']}
        >
          <Picker.Item label="Java" value="java" />
          <Picker.Item label="JavaScript" value="javaScript" />
        </Picker>
        <Text>当前选择的是:{this.state.language}</Text>
      </View>
      );
  }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
  });
