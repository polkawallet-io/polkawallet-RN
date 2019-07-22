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
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  AsyncStorage,
  Alert,
  Animated,
  Platform,
  ImageBackground,
  StyleSheet,
  Modal,
  Linking,
  InteractionManager
} from 'react-native'
import {
  isFirstTime,
  checkUpdate,
  downloadUpdate,
  switchVersion,
  switchVersionLater,
  markSuccess
} from 'react-native-update'
import Api from '@polkadot/api/promise'
import WsProvider from '@polkadot/rpc-provider/ws'
import { NavigationActions, StackActions } from 'react-navigation'
import JPushModule from 'jpush-react-native'
import Identicon from 'polkadot-identicon-react-native'
import SInfo from 'react-native-sensitive-info'
import { formatBalance } from '@polkadot/util'
import { observer, inject } from 'mobx-react'
import TouchID from 'react-native-touch-id'
import Right_menu from './secondary/RightMenu'
import { ScreenWidth, ScreenHeight, axios } from '../../util/Common'
import _updateConfig from '../../../update.json'
import i18n from '../../locales/i18n'
import polkadotAPI from '../../util/polkadotAPI.js'
import Loading from '../../components/Loading'
import LoadingUtil from '../../components/LoadingUtil'

function judgeObj(obj) {
  for (let attr in obj) {
    return false
  }
  return true
}
const optionalConfigObject = {
  title: i18n.t('Profile.Authentication'), // Android
  color: '#e00606', // Android,
  fallbackLabel: 'Show Passcode' // iOS (if empty, then label is hidden)
}
@inject('rootStore')
@observer
class Assets extends Component {
  constructor(props) {
    super(props)
    this.state = {
      is: false,
      name: '0',
      address: '0',
      isfirst: 0,
      isrefresh: false,
      color: 'rgb(0,255,0)'
    }
    this.QR_Code = this.QR_Code.bind(this)
    this.Coin_details = this.Coin_details.bind(this)
    this.refresh = this.refresh.bind(this)
    this.Loading = this.Loading.bind(this)
    this.checkApi = this.checkApi.bind(this)
    this.interval = null
    this.doUpdate = this.doUpdate.bind(this)
    this.animatedValue = new Animated.Value(0)
    this.movingMargin = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [ScreenWidth * 0.57, 0]
    })
  }

  /**
   * @description 跳转二维码页面|Jump to Qr_code page
   */
  QR_Code() {
    this.props.navigation.navigate('QR_Code')
  }

  /**
   * @description 获取Store
   * @param {String} key
   */
  getStore = async key => {
    try {
      const value = await AsyncStorage.getItem(key)
      return value
    } catch (error) {}
  }

  /**
   * @description 跳转交易页面|Jump to Coin_details page
   */
  Coin_details() {
    this.props.navigation.navigate('Coin_details')
  }

  /**
   * @description 检查创建的API是否还存在|Check that the created API still exists
   */
  checkApi() {
    ;(async () => {
      if (judgeObj(this.props.rootStore.stateStore.API)) {
        let ENDPOINT = await this.getStore('ENDPOINT')
        if (ENDPOINT) {
          this.props.rootStore.stateStore.ENDPOINT = ENDPOINT
        }
        LoadingUtil.showLoading()
        const api = await Api.create(new WsProvider(this.props.rootStore.stateStore.ENDPOINT))
        this.props.rootStore.stateStore.API = api
        LoadingUtil.dismissLoading()
      }
    })()
  }

  /**
   * @description 初始加载函数|Londing function
   */
  Loading() {
    SInfo.getAllItems({
      sharedPreferencesName: 'Polkawallet',
      keychainService: 'PolkawalletKey'
    }).then(result => {
      if (JSON.stringify(result).length < 10) {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Create_Account' }, { t: this })]
        })
        this.props.navigation.dispatch(resetAction)
      } else {
        this.setState({
          isfirst: 1
        })
        this.props.rootStore.stateStore.refreshBefore = this.props.rootStore.stateStore.Account
        this.props.rootStore.stateStore.balanceIndex = 0
        this.props.rootStore.stateStore.Account = 0
        this.props.rootStore.stateStore.Accountnum = 0
        this.props.rootStore.stateStore.isfirst = 1
        this.props.rootStore.stateStore.Accounts = [{ account: 'NeedCreate', address: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx' }]
        this.props.rootStore.stateStore.balances = [{ address: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx', balance: 0 }]
        if (Platform.OS == 'android') {
          // android
          let noticeTags = []
          for (let o in result) {
            this.props.rootStore.stateStore.Accounts.push({
              account: JSON.parse(result[o]).meta.name,
              address: JSON.parse(result[o]).address
            })
            this.props.rootStore.stateStore.Account++
            this.props.rootStore.stateStore.Accountnum++
            // 创建查询每个账户余额的进程
            // Create a process to query each account balance
            ;(async () => {
              const _address = o
              await polkadotAPI.freeBalance(_address, balance => {
                this.props.rootStore.stateStore.have = 0
                this.props.rootStore.stateStore.balances.map((item, index) => {
                  if (item.address == _address) {
                    this.props.rootStore.stateStore.have = 1
                    this.props.rootStore.stateStore.balances[index].balance = balance
                  }
                })
                if (this.props.rootStore.stateStore.have == 0) {
                  this.props.rootStore.stateStore.balances.push({
                    address: _address,
                    balance
                  })
                }
              })
            })()
            // 截取地址前25字符作为推送标签
            // Capture the first 25 characters of the address as the push tag
            noticeTags.push(o.slice(0, 25))
          }
          // 设置通知推送标签
          // Set notification push tages
          JPushModule.setTags(noticeTags, map => {
            if (map.errorCode === 0) {
              // console.warn('Set tags succeed, tags: ' + map.tags)
            } else {
              // console.warn('Set tags failed, error code: ' + map.errorCode)
            }
          })
        } else {
          // ios
          let noticeTags = []
          result.map((item, index) => {
            item.map((item, index) => {
              // 添加用户到mobx
              // Add account to mobx
              this.props.rootStore.stateStore.Accounts.push({
                account: JSON.parse(item.value).meta.name,
                address: item.key
              })
              this.props.rootStore.stateStore.Account++
              this.props.rootStore.stateStore.Accountnum++
              // 创建查询每个账户的进程
              // Create a process to query each account balance
              ;(async () => {
                await polkadotAPI.freeBalance(item.key, balance => {
                  const _address = item.key
                  this.props.rootStore.stateStore.have = 0
                  this.props.rootStore.stateStore.balances.map((item, index) => {
                    if (item.address == _address) {
                      this.props.rootStore.stateStore.have = 1
                      this.props.rootStore.stateStore.balances[index].balance = balance
                    }
                  })
                  if (this.props.rootStore.stateStore.have == 0) {
                    this.props.rootStore.stateStore.balances.push({
                      address: _address,
                      balance
                    })
                  }
                })
              })()
              // 截取地址前25字符作为推送标签
              // Capture the first 25 characters of the address as the push tag
              noticeTags.push(item.key.slice(0, 25))
            })
          })
          // 设置通知推送标签
          // Set notification push tages
          JPushModule.setTags(noticeTags, map => {
            if (map.errorCode === 0) {
              // console.warn('Set tags succeed, tags: ' + map.tags)
            } else {
              // console.warn('Set tags failed, error code: ' + map.errorCode)
            }
          })
        }
      }
    })
    setTimeout(() => {
      if (this.props.rootStore.stateStore.isfirst == 1) {
        this.props.rootStore.stateStore.Account = 1
      }
      this.props.rootStore.stateStore.Account =
        this.props.rootStore.stateStore.refreshBefore == 0 && this.props.rootStore.stateStore.isfirst == 1
          ? 1
          : this.props.rootStore.stateStore.refreshBefore
      if (this.props.rootStore.stateStore.Account != 0) {
        // Query Balance
        ;(async () => {
          const props = await polkadotAPI.properties()
          this.props.rootStore.stateStore.balances.map((item, index) => {
            if (
              item.address == this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address
            ) {
              this.props.rootStore.stateStore.balanceIndex = index
            }
          })
          formatBalance.setDefaults({
            decimals: props.get('tokenDecimals'),
            unit: props.get('tokenSymbol')
          })
          clearInterval(this.interval)
          this.interval = setInterval(async () => {
            let myDate = new Date()
            let blockdate = await polkadotAPI.timestampNow()
            let lastBlockTime = Number(myDate) - Number(blockdate)
            let a
            let b
            let c
            if (lastBlockTime > 120000) {
              a = 192
              b = 192
              c = 192
            } else {
              let colorPara = (lastBlockTime / 1000) * (255 / 18)
              a = 0
              b = 255
              c = 0
              for (let i = 0; i < colorPara; i++) {
                if (b >= 255 && a < 255) {
                  a++
                }
                if (a >= 255) b--
                if (a >= 255 && b <= 0) {
                  a = 255
                  b = 0
                }
              }
            }
            this.setState({
              color: `rgb(${a},${b},${c})`
            })
          }, 500)
        })()
      }

      // 清除缓存
      // Clear the cache
      const REQUEST_URL = 'https://api.polkawallet.io:8080/tx_list_for_redis'
      const params = `{"user_address":"${this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address}","pageNum":"1","pageSize":"10"}`
      axios(REQUEST_URL, params, 'post', true).then(() => {
        // 获取交易记录
        // Access to transaction records
        const REQUEST_URL = 'https://api.polkawallet.io:8080/tx_list'
        const params = `{"user_address":"${this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address}","pageNum":"1","pageSize":"10"}`
        axios(REQUEST_URL, params).then(result => {
          this.props.rootStore.stateStore.hasNextPage = result.tx_list.hasNextPage
          this.props.rootStore.stateStore.transactions = result
        })
      })
    }, 100)
  }

  /**
   * @description 刷新|refresh
   */
  refresh() {
    this.setState({
      isrefresh: true
    })
    this.checkApi()
    this.Loading()
    setTimeout(() => {
      this.setState({
        isrefresh: false
      })
    }, 2000)
  }

  /**
   * @description 更新app|Update the app
   * @param {*} info 更新信息|update information
   */
  doUpdate(info) {
    downloadUpdate(info)
      .then(hash => {
        Alert.alert('', i18n.t('Profile.restartApp'), [
          {
            text: 'Yes',
            onPress: () => {
              switchVersion(hash)
            }
          },
          { text: 'No' },
          {
            text: i18n.t('Profile.nextTime'),
            onPress: () => {
              switchVersionLater(hash)
            }
          }
        ])
      })
      .catch(() => {
        Alert.alert('', i18n.t('Profile.UpdateFailed') + '\n' + i18n.t('Profile.gotoAppStore'), [
          {
            text: 'Yes',
            onPress: () => {
              Linking.openURL('https://polkawallet.io/#download')
            }
          },
          { text: 'No' }
        ])
      })
  }

  /**
   * @description 检查更新|Check the update
   */
  checkUpdate = () => {
    const { appKey } = _updateConfig[Platform.OS]
    checkUpdate(appKey)
      .then(info => {
        if (info.expired) {
          Alert.alert('', i18n.t('Profile.toAppStore'), [
            {
              text: 'Yes',
              onPress: () => {
                Linking.openURL('https://polkawallet.io/#download')
              }
            },

            {
              test: 'No'
            }
          ])
        } else if (info.upToDate) {
          // Alert.alert('提示', '您的应用版本已是最新.');
        } else {
          Alert.alert(
            '',
            `${i18n.t('Profile.checkNewV') + info.name},${i18n.t('Profile.download')}\n${info.description}`,
            [
              {
                text: 'YES',
                onPress: () => {
                  this.doUpdate(info)
                }
              },
              { text: 'No' }
            ]
          )
        }
      })
      .catch(() => {
        // Alert.alert('', i18n.t('Profile.UpdateFailed'))
      })
  }

  /**
   * @description 侧边栏Modal显示|Modal display in the sidebar
   */
  show() {
    this.setState({
      is: true
    })
    this.animatedValue.setValue(0)
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start()
  }

  /**
   * @description 侧边栏Modal隐藏|Modal hidden sidebar
   */
  hide() {
    Animated.timing(this.animatedValue, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start()
    setTimeout(
      function() {
        this.changeAccount()
        this.setState({ is: false })
      }.bind(this),
      500
    )
  }

  /**
   * @description 切换账户|Switch account
   */
  changeAccount() {
    this.props.rootStore.stateStore.balances.map((item, index) => {
      if (item.address == this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address) {
        this.props.rootStore.stateStore.balanceIndex = index
      }
    })
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      // 通过addListener开启监听，可以使用上面的四个属性
      // With addListener to enable listening, use the four properties above
      this._didBlurSubscription = this.props.navigation.addListener('didFocus', payload => {
        if (Platform.OS == 'android') {
          StatusBar.setBackgroundColor('#F14B79')
        }
        StatusBar.setBarStyle(Platform.OS == 'android' ? 'light-content' : 'dark-content')
        this.setState({})
        this.checkApi()
        this.Loading()
        this.changeAccount()
      })

      // 通知推送初始化
      // Notification push initialization
      if (Platform.OS === 'android') {
        JPushModule.initPush()
        JPushModule.addReceiveNotificationListener(this.receiveNotificationListener)
      } else if (Platform.OS === 'ios') {
        /* eslint-disable no-undef */
        this.subscription = NativeAppEventEmitter.addListener('ReceiveNotification', e => {})
      }
    })
  }

  componentWillUnmount() {
    // 在页面消失的时候，取消监听
    // Unlisten when the page disappears
    this._didBlurSubscription && this._didBlurSubscription.remove()
  }

  pressHandler() {
    TouchID.authenticate('', optionalConfigObject)
      .then(success => {
        // Alert.alert('Authenticated Successfully')
        this.checkUpdate()
      })
      .catch(error => {
        Alert.alert(
          '',
          i18n.t('Profile.AuthenticatedError'),
          [
            {
              text: 'OK',
              onPress: () => {
                this.pressHandler()
              },
              style: 'cancel'
            }
          ],
          { cancelable: false }
        )
      })
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      if (isFirstTime) {
        markSuccess()
      }

      if (Platform.OS == 'android') {
        StatusBar.setBackgroundColor('#F14B79')
      }
      StatusBar.setBarStyle(Platform.OS == 'android' ? 'light-content' : 'dark-content')
      // 判断用户是否设置手势密码
      // Determines whether the user has set a gesture password
      AsyncStorage.getItem('Gesture').then(result => {
        if (result == null) {
          // 没有设置
          // Not set gesture password
          AsyncStorage.getItem('TouchID').then(result => {
            if (result == null) {
              // 没有设置
              // Not set TouchID password
              this.checkUpdate()
              this.props.rootStore.stateStore.TouchIDState = 0
            } else {
              this.props.rootStore.stateStore.TouchIDState = 1
              this.pressHandler()
            }
          })
          this.props.rootStore.stateStore.GestureState = 0
        } else {
          // 设置了手势密码
          // The gesture password has been set
          if (this.props.rootStore.stateStore.GestureState != 2) {
            this.props.rootStore.stateStore.Gesture = result
            this.props.rootStore.stateStore.GestureState = 2
            const resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'Gesture' })]
            })
            this.props.navigation.dispatch(resetAction)
          } else {
            AsyncStorage.getItem('TouchID').then(result => {
              if (result == null) {
                // 没有设置
                // Not set TouchID password
                this.checkUpdate()
                this.props.rootStore.stateStore.TouchIDState = 0
              } else {
                this.props.rootStore.stateStore.TouchIDState = 1
                this.pressHandler()
              }
            })
          }
        }
      })
      this.Loading()
    })
  }

  render() {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Platform.OS == 'android' ? '#F6F6F6' : '#F14B79' }]}>
        <View style={[styles.container]}>
          <StatusBar
            backgroundColor="#F14B79"
            barStyle={Platform.OS == 'android' ? 'light-content' : 'dark-content'} // 状态栏背景颜色 | Status bar background color | Status bar background color
            hidden={false}
          />
          <View>
            <ImageBackground
              resizeMode="stretch"
              source={require('../../assets/images/Assets/Assets_bg.png')}
              style={styles.navContent}
            >
              {/* 导航栏 | avigation bar */}
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: ScreenWidth - 40
                }}
              >
                <View style={{ marginTop: -3 }}>
                  <Image source={require('../../assets/images/Assets/logo.png')} />
                </View>
                <View style={{ marginTop: -2 }}>
                  <TouchableOpacity
                    style={{ padding: 10, marginTop: -10 }}
                    activeOpacity={0.7}
                    onPress={this.show.bind(this)}
                  >
                    <Image source={require('../../assets/images/Assets/Assets_title_line.png')} />
                  </TouchableOpacity>
                </View>
              </View>
              {/* 头部卡片信息 | Header card information */}
              <View style={styles.TopBar}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginTop: 20,
                    alignItems: 'flex-start'
                  }}
                >
                  <View style={{ marginLeft: 20 }}>
                    <Identicon
                      size={40}
                      theme="polkadot"
                      value={
                        this.props.rootStore.stateStore.Accounts[
                          this.props.rootStore.stateStore.isfirst == 0 ? 0 : this.props.rootStore.stateStore.Account
                        ].address
                      }
                    />
                  </View>
                  {/* 用户名 | Account name */}
                  <View style={{ marginLeft: 8 }}>
                    <Text style={{ color: '#3E2D32', fontSize: 16 }}>
                      {
                        this.props.rootStore.stateStore.Accounts[
                          this.props.rootStore.stateStore.isfirst == 0 ? 0 : this.props.rootStore.stateStore.Account
                        ].account
                      }
                    </Text>
                    <Text style={{ color: '#A29A9D', fontSize: 14, marginTop: 5 }}>{i18n.t('Assets.Account')}</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'flex-end',
                      paddingRight: 20,
                      paddingTop: 7
                    }}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginHorizontal: 20,
                    paddingBottom: 20
                  }}
                >
                  {/* 地址 | Address */}
                  <View>
                    <Text ellipsizeMode="middle" numberOfLines={1} style={{ width: ScreenWidth * 0.5 }}>
                      {
                        this.props.rootStore.stateStore.Accounts[
                          this.props.rootStore.stateStore.isfirst == 0 ? 0 : this.props.rootStore.stateStore.Account
                        ].address
                      }
                    </Text>
                  </View>
                  {/* 二维码 | Qr code */}
                  <View>
                    <TouchableOpacity
                      style={{ padding: 20, marginBottom: -20, marginRight: -20 }}
                      activeOpacity={0.7}
                      onPress={this.QR_Code}
                    >
                      <Image source={require('../../assets/images/Assets/Assets_nav_code.png')} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ImageBackground>
            <View style={{ alignItems: 'center', marginTop: 234 }}>
              <View style={{ width: ScreenWidth - 40 }}>
                {/* Assets list TIP */}
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <Image source={require('../../assets/images/Assets/Assets_nav_title.png')} style={{ marginTop: 5 }} />
                  <View>
                    <Text style={{ color: '#3E2D32', fontSize: 18, marginLeft: 6 }}>{i18n.t('Assets.AssetsList')}</Text>
                  </View>
                </View>
                {/* Assets list */}
                <TouchableOpacity activeOpacity={0.7} onPress={this.Coin_details}>
                  <View
                    style={{
                      backgroundColor: '#FFF',
                      height: 74,
                      borderRadius: 8,
                      marginVertical: 5
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        marginTop: 20,
                        alignItems: 'flex-start'
                      }}
                    >
                      <View style={{ marginLeft: 20 }}>
                        <Image
                          source={require('../../assets/images/Assets/Assets_nav_0.png')}
                          style={{ width: 36, height: 36 }}
                        />
                      </View>
                      <View style={{ marginLeft: 8 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ color: '#3E2D32', fontSize: 16 }}>DOT</Text>
                          <View
                            style={{
                              marginLeft: ScreenWidth / 60,
                              height: ScreenHeight / 98,
                              width: ScreenHeight / 98,
                              borderRadius: ScreenHeight / 196,
                              backgroundColor: this.state.color
                            }}
                          />
                        </View>
                        <Text
                          style={{
                            color: '#A29A9D',
                            fontSize: 14,
                            marginTop: -3
                          }}
                        >
                          {i18n.t('Assets.Alexander')}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'flex-end',
                          paddingRight: 20,
                          paddingTop: 7
                        }}
                      >
                        <Text style={{ color: '#3E2D32', fontSize: 15 }}>
                          {formatBalance(
                            this.props.rootStore.stateStore.balances[this.props.rootStore.stateStore.balanceIndex]
                              .balance
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <Modal
              animationType="fade"
              onRequestClose={() => {
                this.setState({ is: false })
              }}
              transparent
              visible={this.state.is}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0,.4)',
                  flexDirection: 'row'
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.hide()
                  }}
                  style={{
                    width: ScreenWidth * 0.31,
                    flex: 1,
                    height: ScreenHeight
                  }}
                />
                <Animated.View>
                  <Right_menu hide={this.hide.bind(this)} p={this.props} t={this} />
                </Animated.View>
              </View>
            </Modal>

            <Loading
              ref={ref => {
                global.mLoadingComponentRef = ref
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 98,
    backgroundColor: '#F6F6F6'
  },
  navBar: {
    height: 44,
    width: ScreenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    top: 0
  },

  navContent: {
    width: ScreenWidth,
    height: 157,
    alignItems: 'center',
    flex: 1,
    paddingTop: 15
  },
  TopBar: {
    borderRadius: 16,
    width: ScreenWidth - 40,
    height: 140,
    backgroundColor: 'white',
    marginTop: 32
  }
})
export default Assets
