import React, { Component } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import { observer, inject } from "mobx-react";
@inject('rootStore')
@observer
export default class Polkawallet extends Component {
  componentDidMount(){
    setTimeout(() => {
        this.props.navigation.navigate('Tabbed_Navigation')
    }, 200);
    
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:'yellow'}}/>
     );
  }
}

