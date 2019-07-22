/*
 * @Description: COPYRIGHT © 2018 POLKAWALLET (HK) LIMITED
 * This file is part of Polkawallet.

 It under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License.
 You should have received a copy of the GNU General Public License
 along with Polkawallet. If not, see <http://www.gnu.org/licenses/>.

 * @Autor: POLKAWALLET LIMITED
 * @Date: 2019-06-18 21:08:00
 */
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
      tabBarOnPress: ({ defaultHandler }) => {
        if (!global.LoadingTip) {
          defaultHandler()
        }
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
      tabBarOnPress: ({ defaultHandler }) => {
        if (!global.LoadingTip) {
          defaultHandler()
        }
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
      tabBarOnPress: ({ defaultHandler }) => {
        if (!global.LoadingTip) {
          defaultHandler()
        }
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
      tabBarOnPress: ({ defaultHandler }) => {
        if (!global.LoadingTip) {
          defaultHandler()
        }
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
