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
  InteractionManager,
  AppState,
  DeviceEventEmitter,
  NativeAppEventEmitter
} from 'react-native'
import {
  isFirstTime,
  checkUpdate,
  downloadUpdate,
  switchVersion,
  switchVersionLater,
  markSuccess
} from 'react-native-update'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { NavigationActions, StackActions } from 'react-navigation'
import JPushModule from 'jpush-react-native'
// import Identicon from 'polkadot-identicon-react-native'
import SInfo from 'react-native-sensitive-info'
// import { formatBalance } from '@polkadot/util'
import { observer, inject } from 'mobx-react'
import TouchID from 'react-native-touch-id'
import { TYPE_CHAINX } from '../../util/Constant'
import Right_menu from './secondary/RightMenu'
import { ScreenWidth, ScreenHeight } from '../../util/Common'
import _updateConfig from '../../../update.json'
import i18n from '../../locales/i18n'
import polkadotAPI from '../../util/polkadotAPI.js'
import Loading from '../../components/Loading'
import LoadingUtil from '../../components/LoadingUtil'
// import AccountPicker from '../../components/AccountPicker'
import chainxAPI from '../../util/chainxAPI'
import { FileDownlad } from '../../util/FileUtils'
import AccountUtils from '../../util/AccountUtils'

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
      currentAppState: AppState.currentState,
      is: false,
      name: '0',
      address: '0',
      isfirst: 0,
      isrefresh: false,
      color: 'rgb(0,255,0)',
      balance: 0,
      currentBalance: '~',
      showAccoutSelect: false,
      currentAccount: {},
      tokenDecimals: 0,
      tokenUnit: ''
    }
    this.QR_Code = this.QR_Code.bind(this)
    this.Coin_details = this.Coin_details.bind(this)
    this.refresh = this.refresh.bind(this)
    this.Loading = this.Loading.bind(this)
    this.checkApi = this.checkApi.bind(this)
    this.fetchBalance = this.fetchBalance.bind(this)
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
    if (this.props.rootStore.stateStore.type == TYPE_CHAINX) {
      this.props.navigation.navigate('Coin_PCX_details')
    } else {
      this.props.navigation.navigate('Coin_details')
    }
  }

  /**
   * @description 检查创建的API是否还存在|Check that the created API still exists
   */
  async checkApi() {
    // initialize api apart form CHAINX
    if (this.props.rootStore.stateStore.type != TYPE_CHAINX) {
      if (judgeObj(this.props.rootStore.stateStore.API)) {
        let ENDPOINT = await this.getStore('ENDPOINT')
        if (ENDPOINT) {
          this.props.rootStore.stateStore.ENDPOINT = ENDPOINT
        }
        LoadingUtil.showLoading()
        try {
          const provider = new WsProvider(this.props.rootStore.stateStore.ENDPOINT)
          const api = await ApiPromise.create({ provider })
          this.props.rootStore.stateStore.API = api
        } catch (e) {
          console.log(e)
        }
        LoadingUtil.dismissLoading()
        // initialize token unit
        const props = await polkadotAPI.properties()
        this.setState({
          tokenDecimals: Number(props.get('tokenDecimals')),
          tokenUnit: props.get('tokenSymbol').toString()
        })
      } else {
        return Promise.resolve()
      }
    }
  }

  /**
   * @description 初始加载函数|Londing function
   */
  async Loading() {
    let result = await SInfo.getAllItems({
      sharedPreferencesName: 'Polkawallet',
      keychainService: 'PolkawalletKey'
    })
    if (JSON.stringify(result).length < 10) {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Create_Account' }, { t: this })]
      })
      this.props.navigation.dispatch(resetAction)
    } else {
      const { stateStore } = this.props.rootStore
      this.setState({ isfirst: 1 })
      stateStore.refreshBefore = this.props.rootStore.stateStore.Account
      let AccountsArray = await AccountUtils.getAllAccountsArray()
      stateStore.balanceIndex = 0
      stateStore.isfirst = 1
      stateStore.balances = [{ address: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx', balance: 0 }]
      // set accounts and account count
      stateStore.Accounts = AccountsArray
      // get current account if current account is not exits use 0
      const currentAccount = stateStore.Accounts[stateStore.Account] || {}
      stateStore.currentAccount = currentAccount
      if (currentAccount) {
        stateStore.type = currentAccount.type || 0
        this.setState({ currentAccount, currentBalance: '~' }, async () => {
          // after set current account, fetch the balance
          await this.checkApi()
          await this.fetchBalance()
        })
        // if account type is chainx, use chainx's tab
        if (stateStore.prevType !== currentAccount.type) {
          this.changeTab(currentAccount.type)
          stateStore.prevType = currentAccount.type
        }
      }
    }
  }

  /**
   * @description 刷新|refresh
   */
  refresh() {
    this.setState({ isrefresh: true })
    // this.Loading()
    ;(async () => {
      await this.checkApi()
      this.setState({ isrefresh: false })
    })()
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
        Alert.alert('', i18n.t('Profile.UpdateFailed'))
      })
  }

  /**
   * @description 侧边栏Modal显示|Modal display in the sidebar
   */
  show() {
    this.setState({ is: true })
  }

  /**
   * @description 侧边栏Modal隐藏|Modal hidden sidebar
   */
  hide() {
    this.setState({ is: false })
  }

  /**
   * @description 浏览器打开网址|Browser Opens Web Site
   * @param {String} url 要跳转的url|URL to jump
   */
  jumpUrl(url) {
    Linking.openURL(url)
  }

  async changeTab(type) {
    if (type == TYPE_CHAINX) {
      let resetAction = null
      if (this.props.rootStore.stateStore.DEFAULT_WALLET_CONFIG.isOpenUniswap) {
        resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Tabbed_Navigation_Common' }, { t: this })]
        })
      } else {
        resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Tabbed_Navigation_WithoutUniswap' }, { t: this })]
        })
      }
      this.props.navigation.dispatch(resetAction)
    } else {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Tabbed_Navigation' }, { t: this })]
      })
      this.props.navigation.dispatch(resetAction)
    }
  }

  async fetchBalance() {
    const account = this.state.currentAccount
    const { type, address } = account
    if (type == TYPE_CHAINX) {
      let balance = await chainxAPI.freeBalance(address)
      this.setState({ currentBalance: balance })
    } else {
        const props = await polkadotAPI.properties()
        this.setState({
          tokenDecimals: Number(props.get('tokenDecimals')),
          tokenUnit: props.get('tokenSymbol').toString()
        })
        let balance = await polkadotAPI.freeBalance(address)
        this.setState({ currentBalance: balance })
    }
  }

  componentDidMount() {
    console.log('component did mount this time')

    // listen change tab event
    this.changeTabListener = DeviceEventEmitter.addListener('changeTab', param => {
      this.changeTab(param)
    })

    DeviceEventEmitter.addListener('deleteAccount', async param => {
      this.Loading()
    })

    InteractionManager.runAfterInteractions(() => {
      // 通过addListener开启监听，可以使用上面的四个属性
      // With addListener to enable listening, use the four properties above
      this._didBlurSubscription = this.props.navigation.addListener('didFocus', async payload => {
        if (this.props.rootStore.stateStore.hasDownload == false) {
          let wallet_config = await FileDownlad()
          this.props.rootStore.stateStore.hasDownload = true
          this.props.rootStore.stateStore.DEFAULT_WALLET_CONFIG = wallet_config
        }
        // when back to assets page, fetch account information and fetch balance
        await this.Loading()
      })

      // fetch address list and then fetch balance
      this.Loading()

      // 通知推送初始化
      // Notification push initialization
      if (Platform.OS === 'android') {
        JPushModule.initPush()
        JPushModule.addReceiveNotificationListener(this.receiveNotificationListener)
      } else if (Platform.OS === 'ios') {
        this.subscription = NativeAppEventEmitter.addListener('ReceiveNotification', e => {})
      }
    })
  }

  componentWillUnmount() {
    // 在页面消失的时候，取消监听
    // Unlisten when the page disappears
    this._didBlurSubscription && this._didBlurSubscription.remove()

    // chear change tab event listener
    this.changeTabListener.remove()
  }

  pressHandler() {
    this.props.rootStore.stateStore.TouchIDState = 2
    TouchID.authenticate('', optionalConfigObject)
      .then(success => {
        // Alert.alert('Authenticated Successfully')
        setTimeout(() => {
          this.checkUpdate()
        }, 500)
      })
      .catch(error => {
        this.props.rootStore.stateStore.TouchIDState = 1
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

  getFormatBalance() {
    const { currentBalance, currentAccount } = this.state
    // default display
    if (currentBalance === '~' || currentBalance === '') return '~'

    if (currentAccount.type == TYPE_CHAINX) {
      return currentBalance
    } else {
      return String((currentBalance/Math.pow(10,this.state.tokenDecimals)).toFixed(2)) + ' ' +this.state.tokenUnit
    }
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      if (isFirstTime) {
        markSuccess()
      }

      // set display style
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
            } else if (this.props.rootStore.stateStore.TouchIDState != 2) {
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
              } else if (this.props.rootStore.stateStore.TouchIDState != 2) {
                this.props.rootStore.stateStore.TouchIDState = 1
                this.pressHandler()
              }
            })
          }
        }
      })
    })
  }

  render() {
    const { currentAccount } = this.state
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
                    {(() => {
                      if (currentAccount.type == 2) {
                        return (
                          <Image
                            style={{ width: 36, height: 36 }}
                            source={require('../../assets/images/Assets/pcx.png')}
                          />
                        )
                      } else {
                        return (
                          <Image
                            style={{ width: 36, height: 36 }}
                            source={require('../../assets/images/Assets/KSC.png')}
                          />
                        )
                      }
                    })()}
                  </View>
                  {/* 用户名 | Account name */}
                  <View style={{ marginLeft: 8 }}>
                    <Text style={{ color: '#3E2D32', fontSize: 16 }}>{currentAccount.account}</Text>
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
                      {currentAccount.address}
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

            <View style={{ alignItems: 'center', marginTop: 200 }}>
              <View style={{ width: ScreenWidth - 40 }}>
                <View style={{ alignItems: 'flex-start' }}>
                  <TouchableOpacity
                    onPress={this.jumpUrl.bind(
                      this,
                      'https://api.chainx.org/claim-ksm?address=' + currentAccount.address
                    )}
                  >
                    <Text style={{ color: '#F14B79', fontSize: 14 }}>Kusama Claim/映射Kusama</Text>
                  </TouchableOpacity>
                </View>
                {/* Assets list TIP */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginTop: 20
                  }}
                >
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
                        {(() => {
                          if (currentAccount.type == 2) {
                            return (
                              <Image
                                source={require('../../assets/images/Assets/pcx.png')}
                                style={{ width: 36, height: 36 }}
                              />
                            )
                          } else {
                            return (
                              <Image
                                source={require('../../assets/images/Assets/Assets_nav_0.png')}
                                style={{ width: 36, height: 36 }}
                              />
                            )
                          }
                        })()}
                      </View>
                      <View style={{ marginLeft: 8 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ color: '#3E2D32', fontSize: 16 }}>
                            {(() => {
                              if (this.props.rootStore.stateStore.type == 2) {
                                return 'PCX'
                              } else {
                                return 'DOT'
                              }
                            })()}
                          </Text>
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
                        <View>
                          {(() => {
                            if (currentAccount.type == 2) {
                              return (
                                <Text
                                  style={{
                                    color: '#A29A9D',
                                    fontSize: 14,
                                    marginTop: -3
                                  }}
                                >
                                  chainx network
                                </Text>
                              )
                            } else {
                              return (
                                <Text
                                  style={{
                                    color: '#A29A9D',
                                    fontSize: 14,
                                    marginTop: -3
                                  }}
                                >
                                  {i18n.t('Assets.Alexander')}
                                </Text>
                              )
                            }
                          })()}
                        </View>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'flex-end',
                          paddingRight: 20,
                          paddingTop: 7
                        }}
                      >
                        <Text style={{ color: '#3E2D32', fontSize: 15 }}>{this.getFormatBalance()}</Text>
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
                <View>
                  <Right_menu hide={this.hide.bind(this)} p={this.props} t={this} />
                </View>
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
