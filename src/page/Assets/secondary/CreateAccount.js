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
/* eslint no-return-assign: 2 */
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  StatusBar,
  SafeAreaView,
  Keyboard,
  InteractionManager
} from 'react-native'
import Identicon from 'polkadot-identicon-react-native'
import { formatBalance, hexToU8a, isHex, stringToU8a, u8aToHex } from '@polkadot/util'
import { NavigationActions, StackActions } from 'react-navigation'
import SInfo from 'react-native-sensitive-info'
import Keyring from '@polkadot/keyring'

import * as CustomKeyboard from 'react-native-yusha-customkeyboard'
import { observer, inject } from 'mobx-react'

import { mnemonicGenerate, randomAsU8a } from '../../../util/bip39Util'
import { ScreenWidth, ScreenHeight, doubleClick } from '../../../util/Common'
import RNKeyboardAvoidView from '../../../components/RNKeyboardAvoidView'
import polkadotAPI from '../../../util/polkadotAPI'
import i18n from '../../../locales/i18n'
import RNPicker from '../../../components/RNPicker'

// TODO: this is just show case to use sr25519
const keyring = new Keyring({ type: 'sr25519' })

@inject('rootStore')
@observer
class CreateAccount extends Component {
  constructor(props) {
    super(props)
    this.json
    this.pair
    this.Save_Account = this.Save_Account.bind(this)
    this.onChangekey = this.onChangekey.bind(this)
    this.onChangename = this.onChangename.bind(this)
    this.onChangepassword = this.onChangepassword.bind(this)
    this.Modify_way = this.Modify_way.bind(this)
    this.Reset = this.Reset.bind(this)
    this.onChangpasswordErepeat = this.onChangpasswordErepeat.bind(this)

    CustomKeyboard.keyBoardAPI('safeKeyBoard')(CustomKeyboard.SafeKeyBoardView)
  }

  defaultState = {
    way: 'Mnemonic',
    way_change: 'Mnemonic',
    isModel: false,
    israndom: 1,
    keyrandom: '',
    key: '',
    name: '',
    password: '',
    passwordErepeat: '',
    address: 'xxxxxxxxxxxxxxxxxxxxxxxx',
    islookpwd: false,
    ispwd: 0,
    ispwd2: 0,
    balance: 0
  }

  state = { ...this.defaultState }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  _keyboardDidShow() {
    return false
  }

  _keyboardDidHide() {
    console.warn('Keyboard hidden')
  }

  /**
   * @description 页面初始化加载|Page init load
   */
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      ;(async () => {
        let key = await mnemonicGenerate()
        this.pair = keyring.addFromMnemonic(key)
        this.setState({
          key,
          address: this.pair.address()
        })
        // should manually update state via timeout due to
        // @gre workaround https://github.com/facebook/react-native/issues/8624
        setTimeout(() => {
          this.onChangekey(this.state.key)
          this.onChangename(this.state.name)
          this.onChangepassword(this.state.password)
        }, 500)
        const props = await polkadotAPI.properties()
        formatBalance.setDefaults({
          decimals: props.get('tokenDecimals'),
          unit: props.get('tokenSymbol')
        })
      })()
    })
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
  }

  /**
   * @description 切换单位|Switching unit
   * @param {String} way_change 单位|unit
   */
  async Modify_way(way_change) {
    this.setState({
      isModel: false,
      way: way_change,
      way_change: way_change
    })
    let key
    if (way_change == 'Keystore') {
      this.setState({
        key: '',
        address: ''
      })
      return
    } else if (way_change == 'Mnemonic') {
      key = await mnemonicGenerate()
    } else if (way_change == 'Mnemonic24') {
      key = await mnemonicGenerate(24)
    } else {
      key = u8aToHex(await randomAsU8a())
    }
    this.pair = keyring.addFromMnemonic(key)
    this.setState({
      key,
      address: this.pair.address()
    })
  }

  /**
   * @description key 输入框发生改变|The key input box has changed
   * @param {String} Changekey 改变的key值|The changed value of key
   */
  onChangekey(Changekey) {
    let tag = true
    let address = ''
    if (this.state.way == 'Mnemonic' || this.state.way == 'Mnemonic24') {
      try {
        tag = true
        this.pair = keyring.addFromMnemonic(Changekey)
        address = this.pair.address()
        this.setState({
          key: Changekey,
          address: this.pair.address()
        })
      } catch (e) {
        tag = false
        this.setState({
          key: Changekey,
          address: 'xxxxxxxxxxxxxxxxxxxxxxxx'
        })
      }
    } else if (this.state.way == 'Raw Seed') {
      try {
        tag = true
        if (isHex(Changekey) && Changekey.length === 66) {
          let SEEDu8a = hexToU8a(Changekey)
          this.pair = keyring.addFromSeed(SEEDu8a)
          address = this.pair.address()
          this.setState({
            key: Changekey,
            address: this.pair.address()
          })
        } else if (Changekey.length <= 32) {
          let SEED = Changekey.padEnd(32, ' ')
          let SEEDu8a = stringToU8a(SEED)
          this.pair = keyring.addFromSeed(SEEDu8a)
          address = this.pair.address()
          this.setState({
            key: Changekey,
            address: this.pair.address()
          })
        } else {
          tag = false
          this.setState({
            key: Changekey,
            address: 'xxxxxxxxxxxxxxxxxxxxxxxx'
          })
        }
      } catch (e) {
        tag = false
        this.setState({
          key: Changekey,
          address: 'xxxxxxxxxxxxxxxxxxxxxxxx'
        })
      }
    } else {
      try {
        tag = true
        address = JSON.parse(Changekey).address
        this.setState({
          key: Changekey,
          address: JSON.parse(Changekey).address
        })
      } catch (e) {
        this.setState({
          key: Changekey,
          address: 'xxxxxxxxxxxxxxxxxxxxxxxx'
        })
        tag = false
      }
    }
    if (tag) {
      ;(async () => {
        let balance = await polkadotAPI.freeBalance(address)
        this.setState({ balance: balance })
      })()
    }
  }

  /**
   * @description 姓名更改|The name has been changed
   * @param {String} Changename 更改的名称| The changed name
   */
  onChangename(Changename) {
    this.setState({
      name: Changename
    })
  }

  /**
   * @description 密码更改|The password has been changed
   * @param {String} Changepassword 更改的密码|The changed password
   */
  onChangepassword(Changepassword) {
    this.setState({
      password: Changepassword
    })
    if (Changepassword != '') {
      this.setState({ ispwd: 1 })
    }
    if (Changepassword == '') {
      this.setState({ ispwd: 0 })
    }
  }

  /**
   * @description 第二次重复密码更改|The repeat password has been changed
   * @param {String} Changepassword 更改的密码|The changed password
   */
  onChangpasswordErepeat(Changepassword) {
    this.setState({
      passwordErepeat: Changepassword
    })
    if (Changepassword != this.state.password) {
      this.setState({ ispwd2: 0 })
    }
    if (Changepassword == this.state.password) {
      this.setState({ ispwd2: 1 })
    }
  }

  /**
   * @description 点击重置|Click Reset
   */
  async Reset() {
    const { way } = this.state
    let key

    if (way == 'Keystore') {
      this.setState({ ...this.defaultState, way })
      return
    } else if (way === 'Mnemonic') {
      key = await mnemonicGenerate()
    } else if (way === 'Mnemonic24') {
      key = await mnemonicGenerate(24)
    } else {
      key = u8aToHex(await randomAsU8a())
    }

    this.pair = keyring.addFromMnemonic(key)
    const { address } = this.pair
    this.setState({
      ...this.defaultState,
      address: address(),
      key,
      way
    })
  }

  /**
   * @description 点击保存|Click Save
   */
  Save_Account() {
    if (this.state.name == '' && this.state.way != 'Keystore') {
      return Alert.alert('', i18n.t('Assets.EnterName'))
    }
    if (this.state.password == '' || this.state.passwordErepeat == '') {
      Alert.alert('', i18n.t('Assets.EnterPassword'))
    } else {
      if (this.state.password != this.state.passwordErepeat) {
        Alert.alert('', i18n.t('Assets.CheckPassword'))
      } else {
        if (this.state.address == 'xxxxxxxxxxxxxxxxxxxxxxxx' || this.state.address == '') {
          return Alert.alert('', i18n.t('TAB.enterInformation'))
        }
        // 开始校验密码
        // Start checking password
        SInfo.getItem(this.state.address, {
          sharedPreferencesName: 'Polkawallet',
          keychainService: 'PolkawalletKey'
        }).then(result => {
          if (result == null) {
            if (this.state.way == 'Keystore') {
              // 导入key 校验密码
              // Import key check password
              let loadPair = keyring.addFromJson(JSON.parse(this.state.key))
              try {
                loadPair.decodePkcs8(this.state.password)
              } catch (error) {
                Alert.alert(
                  '',
                  i18n.t('TAB.PasswordMistake'),
                  [
                    {
                      text: 'OK',
                      onPress: () => {}
                    }
                  ],
                  { cancelable: false }
                )
              }
              loadPair.isLocked()
                ? '' // 校验成功 | Checking success
                : SInfo.setItem(this.state.address, this.state.key, {
                    sharedPreferencesName: 'Polkawallet',
                    keychainService: 'PolkawalletKey'
                  })
              this.props.rootStore.stateStore.isfirst = 1
              this.props.rootStore.stateStore.Accounts.push({
                account: JSON.parse(this.state.key).meta.name,
                address: this.state.address
              })
              this.props.rootStore.stateStore.Accountnum++
              this.props.rootStore.stateStore.Account = this.props.rootStore.stateStore.Accountnum
              this.props.rootStore.stateStore.balances.push({
                address: this.state.address,
                balance: this.state.balance
              })
              this.props.rootStore.stateStore.balances.map((item, index) => {
                if (
                  item.address ==
                  this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address
                ) {
                  this.props.rootStore.stateStore.balanceIndex = index
                }
              })
              // this.props.navigation.navigate('Backup_Account', { key: this.state.key })
              this.props.navigation.navigate('Tabbed_Navigation')
            } else {
              this.pair.setMeta({ name: this.state.name })
              this.json = this.pair.toJson(this.state.password)
              this.json.meta = this.pair.getMeta()
              SInfo.setItem(this.state.address, JSON.stringify(this.json), {
                sharedPreferencesName: 'Polkawallet',
                keychainService: 'PolkawalletKey'
              })
              this.props.rootStore.stateStore.isfirst = 1
              this.props.rootStore.stateStore.Accounts.push({
                account: this.state.name,
                address: this.pair.address()
              })
              this.props.rootStore.stateStore.Accountnum++
              this.props.rootStore.stateStore.Account = this.props.rootStore.stateStore.Accountnum
              this.props.rootStore.stateStore.balance = 0
              this.props.rootStore.stateStore.balances.push({
                address: this.state.address,
                balance: this.state.balance
              })
              this.props.rootStore.stateStore.balances.map((item, index) => {
                if (
                  item.address ==
                  this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address
                ) {
                  this.props.rootStore.stateStore.balanceIndex = index
                }
              })
              if (this.state.way == 'Mnemonic' || this.state.way == 'Mnemonic24') {
                this.props.navigation.navigate('MnemonicWord_1', {
                  key: this.state.key,
                  address: this.state.address
                })
              } else {
                this.props.navigation.navigate('Backup_Account', {
                  key: this.state.key,
                  address: this.state.address
                })
              }
            }
          } else {
            Alert.alert('', i18n.t('Assets.ExistingAddress'))
          }
        })
      }
    }
  }

  render() {
    const pickerData = [
      { label: 'Assets.WordMnemonic12', value: 'Mnemonic' },
      { label: 'Assets.WordMnemonic24', value: 'Mnemonic24' },
      { label: 'Assets.RawSeed', value: 'Raw Seed' },
      { label: 'Assets.ImportKeystore', value: 'Keystore' }
    ]
    return (
      <SafeAreaView style={[styles.container]}>
        <StatusBar
          hidden={false}
          backgroundColor="#FFF" // 状态栏背景颜色 | Status bar background color
          barStyle="dark-content" // 状态栏样式（黑字）| Status bar style (black)
        />

        <View
          style={{
            width: ScreenWidth,
            paddingRight: 20,
            height: 44,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {this.props.rootStore.stateStore.isfirst != 0 ? (
            <TouchableOpacity
              onPress={() => {
                ;(async () => {
                  let balance = await polkadotAPI.freeBalance(
                    this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address
                  )
                  this.props.rootStore.stateStore.balance = String(balance)
                })()
                let resetAction = StackActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({
                      routeName: 'Tabbed_Navigation'
                    })
                  ]
                })
                this.props.navigation.dispatch(resetAction)
              }}
              style={{ paddingLeft: 20, height: 44, width: 61 }}
              activeOpacity={0.7}
            >
              <Image
                style={{ width: 16, marginTop: 15, height: 16 }}
                source={require('../../../assets/images/public/About_return.png')}
              />
            </TouchableOpacity>
          ) : (
            <View style={{ paddingLeft: 20, height: 44, width: 40 }} />
          )}
          <Text
            style={{
              color: '#3E2D32',
              fontSize: 18,
              marginLeft: -25,
              fontWeight: '700'
            }}
          >
            {i18n.t('Assets.CreateAccount')}
          </Text>
          <View />
        </View>
        <CustomKeyboard.AwareCusKeyBoardScrollView style={{ flex: 1 }}>
          <RNKeyboardAvoidView>
            <View style={{ alignItems: 'center' }}>
              {/* 头像 | Identicon */}
              <View style={[styles.imageview]}>
                <Identicon value={this.state.address} size={56} theme="polkadot" />
              </View>
              {/* 地址 | Address */}
              <View style={styles.address_text}>
                <Text style={{ width: 180, fontSize: 15, color: '#3E2D32' }} ellipsizeMode="middle" numberOfLines={1}>
                  {this.state.address}
                </Text>
              </View>
              <Text style={[styles.text1, { marginTop: 10 }]}>
                {i18n.t('Assets.balance')}
                {formatBalance(this.state.balance)}
              </Text>
            </View>
            {/* 虚线 | Dotted line */}
            <View
              style={{
                flex: 1,
                borderWidth: 0.5,
                borderRadius: 0.1,
                marginTop: 20,
                marginBottom: 40,
                borderStyle: 'dashed',
                borderColor: '#C0C0C0'
              }}
            />
            {/* 密钥 | Key word */}
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: ScreenWidth
              }}
            >
              <Text style={{ fontSize: 15, color: '#3E2D32', marginBottom: 20 }}>{i18n.t('Assets.Createfrom')}</Text>
              {/* 选择方式 | Selection scheme */}
              <View
                style={{
                  width: ScreenWidth * 0.8,
                  paddingLeft: 13,
                  paddingRight: 13,
                  height: 44,
                  borderWidth: 1,
                  borderColor: '#d4cbcd',
                  borderRadius: 5
                }}
              >
                <RNPicker
                  style={{ height: 44 }}
                  selectedValue={this.state.way_change}
                  onValueChange={this.Modify_way}
                  data={pickerData}
                />
              </View>
              <CustomKeyboard.CustomTextInput
                style={[
                  styles.textInputStyle,
                  {
                    height: ScreenHeight / 7,
                    fontSize: 16,
                    color: '#3E2D32',
                    paddingVertical: 15
                  }
                ]}
                autoCorrect={false}
                customKeyboardType="safeKeyBoard"
                value={this.state.key}
                placeholderTextColor="black"
                underlineColorAndroid="#ffffff00"
                multiline={true}
                maxLength={1000}
                onChangeText={this.onChangekey}
              />
              {this.state.way != 'Keystore' && (
                <TouchableWithoutFeedback>
                  <View>
                    <View style={{ marginTop: 30 }}>
                      <Text style={{ fontSize: 16, color: '#3E2D32' }}>{i18n.t('Assets.NameTheAccount')}</Text>
                      <CustomKeyboard.CustomTextInput
                        style={[styles.textInputStyle, { fontSize: 16 }]}
                        placeholder=""
                        placeholderTextColor="#666666"
                        autoCorrect={false}
                        customKeyboardType="safeKeyBoard"
                        underlineColorAndroid="#ffffff00"
                        ref={ref => (this.KeypairInput = ref)}
                        value={this.state.name}
                        onFocus={this.onFocusSpecialComponent}
                        // onBlur={this.onBlurSpecialComponent}
                        onChangeText={this.onChangename}
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )}
              {/* pass */}
              <View style={{ marginTop: 30 }}>
                <Text style={{ fontSize: ScreenWidth / 30 }}>{i18n.t('Assets.Password')}</Text>
                <CustomKeyboard.CustomTextInput
                  style={[styles.textInputStyle, { fontSize: 16, borderColor: '#d4cbcd' }]}
                  placeholder={i18n.t('Assets.EnterPassword')}
                  placeholderTextColor="#666666"
                  underlineColorAndroid="#ffffff00"
                  autoCorrect={false}
                  customKeyboardType="safeKeyBoard"
                  secureTextEntry={true}
                  onChangeText={this.onChangepassword}
                  value={this.state.password}
                />
              </View>
              {/* repeatPass 2 */}
              <View style={{ marginTop: 30 }}>
                <Text style={{ fontSize: ScreenWidth / 30 }}>{i18n.t('Assets.EnterPassword_d')}</Text>
                <CustomKeyboard.CustomTextInput
                  style={[styles.textInputStyle, { fontSize: 16, borderColor: '#d4cbcd' }]}
                  placeholder={i18n.t('Assets.EnterPassword_d')}
                  placeholderTextColor="#666666"
                  underlineColorAndroid="#ffffff00"
                  autoCorrect={false}
                  secureTextEntry={true}
                  customKeyboardType="safeKeyBoard"
                  onChangeText={this.onChangpasswordErepeat}
                  value={this.state.passwordErepeat}
                />
              </View>
            </View>

            {/* Reset or Save */}
            <View
              style={{
                width: ScreenWidth,
                justifyContent: 'center',
                marginTop: 40,
                marginBottom: 22
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  height: ScreenHeight / 20,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    backgroundColor: '#F14B79',
                    height: ScreenHeight / 20,
                    width: (ScreenWidth - 50) / 2
                  }}
                  onPress={() => {
                    doubleClick(this.Reset)
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: ScreenHeight / 50,
                      color: 'white'
                    }}
                  >
                    {i18n.t('TAB.Reset')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    backgroundColor: '#76CE29',
                    marginLeft: ScreenWidth / 100,
                    height: ScreenHeight / 20,
                    width: (ScreenWidth - 50) / 2
                  }}
                  onPress={() => {
                    doubleClick(this.Save_Account)
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: ScreenHeight / 50,
                      color: 'white'
                    }}
                  >
                    {i18n.t('TAB.Save')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </RNKeyboardAvoidView>
        </CustomKeyboard.AwareCusKeyBoardScrollView>
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  middle: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageview: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: ScreenHeight / 100,
    width: ScreenWidth,
    height: ScreenHeight / 10
  },
  image: {
    marginTop: ScreenHeight / 30,
    backgroundColor: 'white',
    borderRadius: ScreenHeight / 28,
    height: ScreenHeight / 14,
    width: ScreenHeight / 14,
    resizeMode: 'contain'
  },
  address_text: {
    marginTop: 21,
    width: ScreenWidth,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    padding: ScreenHeight / 50,
    height: ScreenHeight / 9,
    backgroundColor: '#776f71',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  text_title: {
    fontSize: ScreenHeight / 37,
    fontWeight: 'bold',
    color: '#e6e6e6'
  },
  text1: {
    fontSize: 15,
    color: '#AAAAAA'
  },
  textInputStyle: {
    paddingVertical: 0,
    height: 44,
    width: ScreenWidth * 0.8,
    borderWidth: 1,
    borderColor: '#d4cbcd',
    borderRadius: 4,
    paddingLeft: 13,
    marginTop: 12
  },
  NandP: {},
  Choose_way: {
    alignItems: 'center',
    marginLeft: ScreenWidth / 70,
    width: ScreenWidth * 0.25,
    height: ScreenHeight / 23,
    borderWidth: 1,
    borderRadius: ScreenHeight / 200,
    borderColor: 'red',
    flexDirection: 'row',
    backgroundColor: '#FF4081'
  },
  chooses: {
    paddingLeft: ScreenWidth / 20,
    paddingRight: ScreenWidth / 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: ScreenHeight / 18,
    backgroundColor: '#DCDCDC'
  },
  choose_Text: {
    fontWeight: '500',
    fontSize: ScreenHeight / 50,
    color: '#4169E1'
  }
})
export default CreateAccount
