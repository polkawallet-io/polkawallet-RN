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
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import { observer, inject } from 'mobx-react'
import Identicon from 'polkadot-identicon-react-native'
import { ScreenWidth, ScreenHeight } from '../../../util/Common'
import i18n from '../../../locales/i18n'

@inject('rootStore')
@observer
class RightMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Account: this.props.rootStore.stateStore.Account + 1
    }
    this.Create_Account = this.Create_Account.bind(this)
    this.Switch_Account = this.Switch_Account.bind(this)
    this.camera = this.camera.bind(this)
    this.hide = this.props.hide
  }

  /**
   * @description 跳转 扫描界面|Jump to camera scan page
   */
  camera() {
    this.props.t.setState({
      is: false
    })
    this.props.p.rootStore.stateStore.tocamera = 0
    this.props.p.navigation.navigate('Camera')
  }

  /**
   * @description 跳转 创建用户界面|Jump to Create_Account page
   */
  Create_Account() {
    this.props.t.setState({
      is: false
    })
    this.props.p.navigation.navigate('Create_Account')
  }

  /**
   * @description 切换用户|Switch account
   */
  Switch_Account() {
    this.props.rootStore.stateStore.balances.map((item, index) => {
      if (item.address == this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address) {
        this.props.rootStore.stateStore.balanceIndex = index
      }
    })
  }

  render() {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#7582C9' }]}>
        <View style={{ backgroundColor: '#7582C9', width: ScreenWidth * 0.69 }}>
          <View
            style={{
              flexDirection: 'row',
              height: 45,
              marginLeft: 20,
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 20 }}>{i18n.t('Assets.Menu')}</Text>
            <TouchableOpacity
              style={{ padding: 20, marginRight: -10 }}
              onPress={() => {
                this.hide()
              }}
              activeOpacity={0.7}
            >
              <Image
                style={{ width: 20, height: 20, marginRight: 20 }}
                source={require('../../../assets/images/Assets/Menu_line.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={{ height: 180 }}>
            <ScrollView>
              {this.props.rootStore.stateStore.Accounts.map((item, index) => {
                if (index != 0) {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        this.props.rootStore.stateStore.Account = index
                        this.Switch_Account()
                      }}
                      activeOpacity={0.7}
                    >
                      <View>
                        <View
                          style={{
                            backgroundColor:
                              this.props.rootStore.stateStore.Account == index ? '#5C67A6' : 'rgba(0,0,0,0)',
                            height: 60
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              marginTop: 12,
                              alignItems: 'flex-start',
                              marginLeft: 20,
                              borderBottomWidth: 1,
                              borderColor: '#5C67A6'
                            }}
                          >
                            <View>
                              <Identicon value={item.address} size={36} theme="polkadot" />
                            </View>
                            <View style={{ marginLeft: 21 }}>
                              <View>
                                <Text style={{ color: '#FFF', fontSize: 16 }}>{item.account}</Text>
                              </View>
                              <Text
                                style={{
                                  width: ScreenWidth * 0.4,
                                  color: '#FFF',
                                  fontSize: 12
                                }}
                                ellipsizeMode="middle"
                                numberOfLines={1}
                              >
                                {item.address}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                }
              })}
            </ScrollView>
          </View>
          <View style={{ marginLeft: 20, marginTop: 8 }}>
            <TouchableOpacity onPress={this.camera} activeOpacity={0.7}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 37,
                  alignItems: 'center'
                }}
              >
                <Image
                  style={{ width: 36, height: 36 }}
                  source={require('../../../assets/images/Assets/Menu_scan.png')}
                />
                <Text style={{ fontSize: 15, color: '#fff', marginLeft: 20 }}>{i18n.t('Assets.Scan')}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.Create_Account} activeOpacity={0.7}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 37,
                  alignItems: 'center'
                }}
              >
                <Image
                  style={{ width: 36, height: 36 }}
                  source={require('../../../assets/images/Assets/Menu_Create.png')}
                />
                <Text style={{ fontSize: 15, color: '#fff', marginLeft: 20 }}>{i18n.t('Assets.CreateAccount')}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#ffffff00',
    flexDirection: 'row'
  },
  account: {
    height: ScreenHeight / 14,
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    height: ScreenHeight / 20,
    width: ScreenHeight / 20,
    resizeMode: 'contain',
    marginLeft: ScreenWidth / 35
  },
  line: {
    marginTop: ScreenHeight / 70,
    height: 1,
    backgroundColor: '#D3D3D3'
  },
  SandC: {
    flexDirection: 'row',
    marginTop: ScreenHeight / 70,
    height: ScreenHeight / 11.5,
    backgroundColor: 'white',
    alignItems: 'center'
  },
  middle: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})
export default RightMenu
