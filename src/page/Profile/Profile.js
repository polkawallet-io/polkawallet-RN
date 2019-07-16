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
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  InteractionManager
} from 'react-native'

import Identicon from 'polkadot-identicon-react-native'
import { observer, inject } from 'mobx-react'
import { ScreenWidth, ScreenHeight } from '../../util/Common'
import i18n from '../../locales/i18n'

@inject('rootStore')
@observer
class Profile extends Component {
  /**
   * @description 切换到 Manage_Account 页面|Switch to the Manage_Account page
   */
  Manage_Account() {
    this.props.navigation.navigate('Manage_Account')
  }

  /**
   * @description 切换到通讯录页面|Switch to the address book page
   */
  GoAddresses() {
    this.props.rootStore.stateStore.transfer_address = 0
    this.props.navigation.navigate('Addresses')
  }

  /**
   * @description 切换到设置页面|Switch to the settings page
   */
  Settings() {
    this.props.navigation.navigate('Settings')
  }

  /**
   * @description 切换到关于我们页面|Switch to the About page
   */
  About() {
    this.props.navigation.navigate('About')
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      if (Platform.OS == 'android') {
        StatusBar.setBackgroundColor('#F14B79')
      }
      StatusBar.setBarStyle(Platform.OS == 'android' ? 'light-content' : 'dark-content')
    })
  }

  componentWillUnmount() {
    // 在页面消失的时候，取消监听
    // Unlisten when the page disappears
    this._didBlurSubscription && this._didBlurSubscription.remove()
  }

  componentWillMount() {
    // 通过addListener开启监听，可以使用上面的四个属性
    // With addListener to enable listening, use the four properties above
    this._didBlurSubscription = this.props.navigation.addListener('didFocus', payload => {
      this.setState({})
      if (Platform.OS == 'android') {
        StatusBar.setBackgroundColor('#F14B79')
      }
      StatusBar.setBarStyle(Platform.OS == 'android' ? 'light-content' : 'dark-content')
    })
  }

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Platform.OS == 'android' ? '#fff' : '#F14B79'
        }}
      >
        <StatusBar
          hidden={false}
          backgroundColor="#F14B79" // 状态栏背景颜色 | Status bar background color | Status bar background color
          barStyle={Platform.OS == 'android' ? 'light-content' : 'dark-content'} // 状态栏样式（黑字）| Status bar style (black)| Status bar style (black)
        />
        <View style={{ flex: 1 }}>
          <ScrollView>
            <View style={{ backgroundColor: '#F14B79', height: 243 }}>
              <View
                style={{
                  height: 44,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text style={{ color: '#fff', fontSize: 20 }}>{i18n.t('TAB.Profile')}</Text>
              </View>
              <View
                style={{
                  marginTop: 12,
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginLeft: 21
                }}
              >
                {/* 头像 | Identicon */}
                <Identicon
                  value={
                    this.props.rootStore.stateStore.Accounts[
                      this.props.rootStore.stateStore.isfirst == 0 ? 0 : this.props.rootStore.stateStore.Account
                    ].address
                  }
                  size={56}
                  theme="polkadot"
                />
                {/* 用户名 | User name */}
                <Text style={{ fontSize: 18, color: 'white', marginLeft: 21 }}>
                  {this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].account}
                </Text>
              </View>
            </View>
            <View
              style={{
                height: ScreenHeight - 243,
                backgroundColor: '#fff',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                marginTop: -111
              }}
            >
              <View
                style={{
                  width: ScreenWidth,
                  alignItems: 'center',
                  marginTop: 20,
                  marginBottom: 40
                }}
              >
                <TouchableOpacity onPress={this.Manage_Account.bind(this)}>
                  {/* 更多 | The more */}
                  <View
                    style={{
                      width: 150,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: '#F14B79',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 15 }}>{i18n.t('Profile.ManageAccount')}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={this.GoAddresses.bind(this)}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 60
                }}
              >
                <Image
                  style={{ marginLeft: 20, height: 22, width: 21 }}
                  source={require('../../assets/images/public/Pro_Addre.png')}
                />
                <Text style={{ marginLeft: 20, fontSize: 18 }}>{i18n.t('Profile.Addresses')}</Text>
                <View style={{ flex: 1 }} />
                <Image
                  style={{ marginRight: 20, resizeMode: 'cover' }}
                  source={require('../../assets/images/public/addresses_nav_go.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.Settings.bind(this)}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 60
                }}
              >
                <Image
                  style={{ marginLeft: 20, height: 20, width: 20 }}
                  source={require('../../assets/images/public/Pro-Setting.png')}
                />
                <Text style={{ marginLeft: 20, fontSize: 18 }}>{i18n.t('Profile.Settings')}</Text>
                <View style={{ flex: 1 }} />
                <Image
                  style={{ marginRight: 20, resizeMode: 'cover' }}
                  source={require('../../assets/images/public/addresses_nav_go.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.About.bind(this)}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 60
                }}
              >
                <Image
                  style={{ marginLeft: 20, height: 20, width: 20 }}
                  source={require('../../assets/images/public/Pro_about.png')}
                />
                <Text style={{ marginLeft: 20, fontSize: 18 }}>{i18n.t('Profile.About')}</Text>
                <View style={{ flex: 1 }} />
                <Image
                  style={{ marginRight: 20, resizeMode: 'cover' }}
                  source={require('../../assets/images/public/addresses_nav_go.png')}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }
}
export default Profile
