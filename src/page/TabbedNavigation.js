import React, { Component } from 'react'
import { Text } from 'react-native'
import { createBottomTabNavigator } from 'react-navigation'
import Assets from './Assets/Assets'
import Staking from './Staking/Staking'
import Democracy from './Democracy/Democracy'
import Profile from './Profile/Profile'
import Diceng from '../components/bottom'
import i18n from '../locales/i18n'

const TabRouteConfigs = {
  Assets: {
    screen: Assets,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: ({ tintColor }) => (
        <Text
          style={{
            fontSize: 10,
            color: tintColor,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {i18n.t('TAB.Assets')}
        </Text>
      ),
      tabBarIcon: ({ b, tintColor }) => (
        <Diceng b={b} b1={require('../assets/images/public/Assets_dark.png')} tintColor={tintColor} />
      ),
      tabBarOnPress: () => {
        route(navigation, 'Assets')
      }
    })
  },
  Staking: {
    screen: Staking,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: ({ tintColor }) => (
        <Text
          style={{
            fontSize: 10,
            color: tintColor,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {i18n.t('TAB.Staking')}
        </Text>
      ),
      tabBarIcon: ({ b, tintColor }) => (
        <Diceng b={b} b1={require('../assets/images/public/Staking_dark.png')} tintColor={tintColor} />
      ),
      tabBarOnPress: () => {
        route(navigation, 'Staking')
      }
    })
  },
  Democracy: {
    screen: Democracy,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: ({ tintColor }) => (
        <Text
          style={{
            fontSize: 10,
            color: tintColor,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {i18n.t('TAB.Democracy')}
        </Text>
      ),
      tabBarIcon: ({ b, tintColor }) => (
        <Diceng b={b} b1={require('../assets/images/public/Democrscy_dark.png')} tintColor={tintColor} />
      ),
      tabBarOnPress: () => {
        route(navigation, 'Democracy')
      }
    })
  },
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: ({ tintColor }) => (
        <Text
          style={{
            fontSize: 10,
            color: tintColor,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {i18n.t('TAB.Profile')}
        </Text>
      ),
      tabBarIcon: ({ b, tintColor }) => (
        <Diceng b={b} b1={require('../assets/images/public/Profile.png')} tintColor={tintColor} />
      ),
      tabBarOnPress: () => {
        route(navigation, 'Profile')
      }
    })
  }
}
const TabNavigatorConfigs = {
  tabBarOptions: {
    activeTintColor: '#E64874',
    labelStyle: {
      fontSize: 10,
      justifyContent: 'center',
      alignItems: 'center'
    },
    tabStyle: {
      fontSize: 10,
      justifyContent: 'center',
      alignItems: 'center'
    }
  },
  initialRouteName: 'Assets',
  tabBarPosition: 'bottom',
  lazy: false
}
const Tab = createBottomTabNavigator(TabRouteConfigs, TabNavigatorConfigs)
module.exports = Tab
export default class Navigation extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)
  }

  render() {
    return <Tab />
  }
}
const route = (navigation, path) => {
  console.log(navigation)
  console.log(navigation.navigate)
  if (!navigation.isFocused() && !global.LoadingTip) {
    navigation.navigate(path)
  }
}
