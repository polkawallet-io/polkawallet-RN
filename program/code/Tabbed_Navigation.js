import React, { Component } from 'react';
import {
    StyleSheet,
    DeviceEventEmitter,
    AsyncStorage,
} from 'react-native';
import {TabBarBottom,createBottomTabNavigator} from 'react-navigation'
import Assetes from './Assetes/Assetes'
import Staking from './Staking/Staking'
import Democrscy from './Democrscy/Democrscy'
import CrossChain from './CrossChain/CrossChain'
import Profile from './Profile/Profile'
import Diceng from './bottom'
const TabRouteConfigs = {
    B1:{
        screen : Assetes,
        navigationOptions:()=>({
            tabBarLabel:'Assets',
            tabBarIcon:({b,tintColor})=>(
              <Diceng
                tintColor={tintColor} 
                b = {b}
                b1 = {require('../images/Bottom/assetc icon.png')}
              />
            )
            
        })
    },
    B2:{
        screen : Staking,
        navigationOptions:()=>({
            tabBarLabel:'Staking',
            tabBarIcon:({b,tintColor})=>(
              <Diceng
                tintColor={tintColor} 
                b = {b}
                b1 = {require('../images/Bottom/staking icon.png')}
              />
            )
            
        })
    },
    B3:{
        screen : Democrscy,
        navigationOptions:()=>({
            tabBarLabel:'Democrscy',
            tabBarIcon:({b,tintColor})=>(
              <Diceng
                tintColor={tintColor} 
                b = {b}
                b1 = {require('../images/Bottom/democrscy icon.png')}
              />
            )
            
        })
    },
    B4:{
        screen : CrossChain,
        navigationOptions:()=>({
            tabBarLabel:'CrossChain',
            tabBarIcon:({b,tintColor})=>(
              <Diceng
                tintColor={tintColor} 
                b = {b}
                b1 = {require('../images/Bottom/crosschain icon.png')}
              />
            )
            
        })
    },
    B5:{
        screen : Profile,
        navigationOptions:()=>({
            tabBarLabel:'Profile',
            tabBarIcon:({b,tintColor})=>(
              <Diceng
                tintColor={tintColor} 
                b = {b}
                b1 = {require('../images/Bottom/profile icon.png')}
              />
            )
            
        })
    }
}
const TabNavigatorConfigs = {
    tabBarOptions: {
        activeTintColor: '#005BAF',
    },
    initialRouteName : 'B1',
    tabBarPosition : 'bottom',
    lazy : true,
};
const Tab = createBottomTabNavigator(TabRouteConfigs,TabNavigatorConfigs);
module.exports = Tab
export default class Navigation extends Component {
    static navigationOptions = {
        header:null
      }
    constructor(props){
        super(props)
    }
    render() {
        return (
            <SimpleApp/>
        );
    }
}
