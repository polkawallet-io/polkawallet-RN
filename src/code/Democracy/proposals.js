import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { VictoryPie,VictoryLegend} from "victory-native";


export default class Polkawallet extends Component {
  render() {
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontSize:30}}>proposals</Text>
        <View style={{flexDirection:'row',borderWidth:1}}>
          <View style={{borderWidth:1}}>
            <VictoryPie
                padding={{ top: 0, left: 0 }}
                colorScale={['green','red']}
                innerRadius={20}
                data={[
                    { x: 1, y: 5, label: "one" },
                    { x: 2, y: 2, label: "two" },
                ]}
                height={100}
                width={100}
            />
          </View>
            </View>

        




      </View>    
      );
  }
}