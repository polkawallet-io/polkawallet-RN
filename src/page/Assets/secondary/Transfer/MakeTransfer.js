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
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  StatusBar,
  SafeAreaView,
  InteractionManager
} from 'react-native'
import { observer, inject } from 'mobx-react'
import * as CustomKeyboard from 'react-native-yusha-customkeyboard'
import { ScreenWidth, ScreenHeight, checkPwd, formatData, doubleClick } from '../../../../util/Common'
import Header from '../../../../components/Header'
import RNKeyboardAvoidView from '../../../../components/RNKeyboardAvoidView'
import polkadotAPI from '../../../../util/polkadotAPI'
import i18n from '../../../../locales/i18n'

@inject('rootStore')
@observer
class Transfer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ispwd: true,
      password: '',
      isModal: false,
      accountNonce: '',
      onlyone: 0,
      type: 'pending...'
    }
    this.lookpwd = this.lookpwd.bind(this)
    this.onChangepasswore = this.onChangepasswore.bind(this)
    this.Cancel = this.Cancel.bind(this)
    this.Sign_and_Submit = this.Sign_and_Submit.bind(this)
  }

  /**
   * @description 密码展示 | Display password
   */
  lookpwd() {
    this.setState({
      ispwd: !this.state.ispwd
    })
  }

  /**
   * @description 密码更改 | Change password
   * @param {String} Changepasswore
   */
  onChangepasswore(Changepasswore) {
    this.setState({
      password: Changepasswore
    })
  }

  /**
   * @description 点击取消 | Click Cancel
   */
  Cancel() {
    this.props.rootStore.stateStore.t_address = ''
    this.props.navigation.navigate('Transfer')
  }

  /**
   * @description 获取账户的Nonce
   */
  getAccountNonce() {
    ;(async () => {
      const accountNonce = await polkadotAPI.accountNonce(
        this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address
      )
      this.setState({
        accountNonce: JSON.stringify(accountNonce)
      })
    })()
  }

  /**
   * @description 页面初始化 | Page initialization
   */
  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getAccountNonce()
    })
  }

  componentDidMount() {
    // 通过addListener开启监听，didFocus RN 生命周期 页面获取焦点
    // Start listening through addListener, didFocus RN lifecycle, page gets focus
    this._didBlurSubscription = this.props.navigation.addListener('didFocus', () => {
      InteractionManager.runAfterInteractions(() => {
        this.getAccountNonce()
      })
    })
  }

  componentWillUnmount() {
    // 在页面消失的时候，取消监听
    // Unlisten when the page disappears
    this._didBlurSubscription && this._didBlurSubscription.remove()
  }

  /**
   * @description 点击提交 | Click Submit
   */
  Sign_and_Submit() {
    this.setState({
      onlyone: 1,
      isModal: true
    })
    const _this = this
    checkPwd({
      address: _this.props.rootStore.stateStore.Accounts[_this.props.rootStore.stateStore.Account].address,
      password: _this.state.password,
      success: loadPair => {
        ;(async () => {
          // 检测api长时间（15s）没有返回，或者报错监听不到
          // The detection API did not return for a long time (15s), or the error report could not be monitored
          setTimeout(() => {
            if (_this.state.type == 'pending...') {
              Alert.alert(
                '',
                i18n.t('TAB.noResponse'),
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      _this.props.rootStore.stateStore.t_address = ''
                      _this.props.navigation.navigate('Transfer')
                      _this.setState({
                        isModal: false
                      })
                    }
                  }
                ],
                { cancelable: false }
              )
            }
          }, 15000)
          const accountNonce = await polkadotAPI.accountNonce(loadPair.address())
          // Do the transfer and track the actual status
          let transfer
          try {
            transfer = await polkadotAPI.transfer(
              _this.props.rootStore.stateStore.inaddress,
              _this.props.rootStore.stateStore.value
            )
          } catch (e) {
            Alert.alert(
              '',
              i18n.t('TAB.TransferFailed'),
              [
                {
                  text: 'OK',
                  onPress: () => {
                    _this.props.rootStore.stateStore.t_address = ''
                    _this.props.navigation.navigate('Transfer')
                    _this.setState({
                      isModal: false
                    })
                  }
                }
              ],
              { cancelable: false }
            )
          }

          // 签名 发送
          // Signature to send
          transfer.sign(loadPair, accountNonce).send(({ status }) => {
            status = formatData(status)
            if (status.Finalized) {
              _this.setState({
                isModal: false,
                type: 'success'
              })
              setTimeout(() => {
                Alert.alert(
                  '',
                  i18n.t('Assets.TransferSuccess'),
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        _this.props.navigation.navigate('Coin_details')
                      }
                    }
                  ],
                  { cancelable: false }
                )
              }, 500)
            } else {
              _this.setState({
                type: 'pending...'
              })
            }
          })
        })()
      },
      error: () => {
        _this.setState({
          onlyone: 0,
          isModal: false
        })
      }
    })
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          hidden={false}
          backgroundColor="#FFF" // 状态栏背景颜色 | Status bar background color | Status bar background color
          barStyle="dark-content" // 状态栏样式（黑字）| Status bar style (black)| Status bar style (black)
        />
        {/* 标题栏 | The title bar */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderBottomWidth: 0.5,
            borderBottomColor: '#ECE2E5'
          }}
        >
          <Header title={i18n.t('Assets.Transfer')} theme="dark" navigation={this.props.navigation} />
        </View>
        <CustomKeyboard.AwareCusKeyBoardScrollView style={{ flex: 1 }}>
          <RNKeyboardAvoidView>
            <View style={{ width: ScreenWidth - 40, marginLeft: 20 }}>
              <Text
                style={{
                  marginTop: 40,
                  color: '#3E2D32',
                  fontSize: 20,
                  marginBottom: 40,
                  fontWeight: '600'
                }}
              >
                {i18n.t('Assets.SubmitTransaction')}
              </Text>
              <Text style={{ color: '#3E2D32', fontSize: 15 }}>{i18n.t('TAB.signMess')}</Text>
              <View
                style={{
                  padding: 3,
                  backgroundColor: '#F0F0F0',
                  borderRadius: 3,
                  paddingHorizontal: 10,
                  width: 270,
                  marginTop: 12
                }}
              >
                <Text style={{ color: '#3E2D32', fontSize: 15, width: 250 }} ellipsizeMode="middle" numberOfLines={1}>
                  {this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 15,
                  marginBottom: 42
                }}
              >
                <Text style={{ fontSize: 15 }}>{i18n.t('Assets.calling')}</Text>
                <Text
                  style={{
                    fontSize: 15,
                    backgroundColor: '#F0F0F0',
                    paddingHorizontal: 5,
                    borderRadius: 3
                  }}
                >
                  balances.transfer
                </Text>
                <Text style={{ fontSize: 15 }}>{i18n.t('Assets.withIndex')}</Text>
                <Text
                  style={{
                    fontSize: 15,
                    backgroundColor: '#F0F0F0',
                    paddingHorizontal: 5,
                    borderRadius: 3
                  }}
                >
                  {this.state.accountNonce}
                </Text>
              </View>
              <Text
                style={{
                  color: '#3E2D32',
                  fontSize: 18,
                  marginBottom: 12,
                  fontWeight: '600'
                }}
              >
                {i18n.t('TAB.unlockPassword')}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CustomKeyboard.CustomTextInput
                  style={{
                    width: ScreenWidth - 40,
                    fontSize: 14,
                    color: '#3E2D32',
                    height: 44,
                    paddingHorizontal: 15,
                    borderColor: '#CCCCCC',
                    borderWidth: 1,
                    borderRadius: 6
                  }}
                  customKeyboardType="safeKeyBoard"
                  secureTextEntry={this.state.ispwd}
                  onChangeText={this.onChangepasswore}
                />
                <TouchableOpacity
                  onPress={this.lookpwd}
                  activeOpacity={0.7}
                  style={{ width: 50, marginLeft: -50, height: 44 }}
                >
                  <Image
                    style={{ width: 21, marginTop: 12, marginLeft: 14 }}
                    source={require('../../../../assets/images/public/eye.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </RNKeyboardAvoidView>
        </CustomKeyboard.AwareCusKeyBoardScrollView>
        {/* Reset or Save */}
        <View style={{ justifyContent: 'center', marginBottom: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              width: ScreenWidth - 40,
              marginLeft: 20
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6,
                backgroundColor: '#FF4081',
                height: 49
              }}
              activeOpacity={0.7}
              onPress={this.Cancel}
            >
              <Text style={{ fontWeight: '500', fontSize: 16, color: 'white' }}>{i18n.t('TAB.Cancel')}</Text>
            </TouchableOpacity>
            {this.state.onlyone == 0 ? (
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  backgroundColor: '#7AD52A',
                  marginLeft: 10,
                  height: 49
                }}
                activeOpacity={0.7}
                onPress={() => {
                  doubleClick(this.Sign_and_Submit)
                }}
              >
                <Text style={{ fontWeight: '500', fontSize: 16, color: 'white' }}>
                  {i18n.t('Assets.SignAndSubmit')}
                </Text>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  backgroundColor: '#7AD52A',
                  marginLeft: 10,
                  height: 49
                }}
              >
                <Text style={{ fontWeight: '500', fontSize: 16, color: 'white' }}>
                  {i18n.t('Assets.SignAndSubmit')}
                </Text>
              </View>
            )}
          </View>
        </View>

        <Modal animationType="fade" transparent={true} visible={this.state.isModal}>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <View
              style={{
                borderRadius: ScreenHeight / 100,
                marginTop: ScreenHeight / 5.2,
                marginRight: ScreenWidth * 0.06,
                width: ScreenWidth * 0.3,
                height: ScreenHeight / 20,
                backgroundColor: '#8bc34a',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: ScreenWidth / 25,
                  fontWeight: 'bold'
                }}
              >
                {this.state.type}
              </Text>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  title: {
    padding: ScreenHeight / 50,
    height: ScreenHeight / 9,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#776f71'
  },
  text_title: {
    fontSize: ScreenHeight / 37,
    fontWeight: 'bold',
    color: '#e6e6e6'
  },
  submit_view: {
    marginTop: ScreenHeight / 15,
    alignSelf: 'center',
    height: ScreenHeight / 2,
    borderWidth: 1,
    width: ScreenWidth * 0.98,
    borderRadius: ScreenHeight / 100,
    borderColor: 'grey',
    paddingLeft: ScreenWidth / 40
  },
  title_b: {
    color: 'black',
    fontSize: ScreenHeight / 40,
    marginTop: ScreenHeight / 50,
    fontWeight: '500'
  },
  grey_text: {
    backgroundColor: '#F0EFEF',
    height: ScreenHeight / 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  grey_t: {
    marginHorizontal: ScreenWidth * 0.02,
    color: 'black',
    fontSize: ScreenHeight / 50,
    fontWeight: '500'
  },
  textInputStyle: {
    paddingVertical: 0,
    height: ScreenHeight / 23,
    width: ScreenWidth * 0.65,
    borderWidth: 1,
    borderColor: '#97BEC7',
    borderRadius: ScreenHeight / 200,
    paddingLeft: ScreenHeight / 100
  },
  image: {
    height: ScreenHeight / 38,
    width: ScreenHeight / 38,
    resizeMode: 'contain'
  },
  eye: {
    height: ScreenHeight / 23,
    width: ScreenHeight / 23,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97BEC7'
  }
})
export default Transfer
