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
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  StatusBar,
  SafeAreaView
} from 'react-native'
import { observer, inject } from 'mobx-react'
import * as CustomKeyboard from 'react-native-yusha-customkeyboard'
import { formatData, ScreenWidth, ScreenHeight, checkPwd } from '../../../util/Common'
import Header from '../../../components/Header'
import RNKeyboardAvoidView from '../../../components/RNKeyboardAvoidView'
import polkadotAPI from '../../../util/polkadotAPI'
import i18n from '../../../locales/i18n'

@inject('rootStore')
@observer
class SetSessionKey extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ispwd: true,
      password: '',
      isModal: false,
      onlyone: 0,
      type: 'pending...',
      SessionKey: '',
      Failed: false
    }
    this.lookpwd = this.lookpwd.bind(this)
    this.onChangepassword = this.onChangepassword.bind(this)
    this.Cancel = this.Cancel.bind(this)
    this.Sign_and_Submit = this.Sign_and_Submit.bind(this)
  }

  /**
   * @description 更改密码|Change password
   * @param {String} Changepassword 密码|password
   */
  onChangepassword(Changepassword) {
    this.setState({
      password: Changepassword
    })
  }

  /**
   * @description 展示密码|Show password
   */
  lookpwd() {
    this.setState({
      ispwd: !this.state.ispwd
    })
  }

  /**
   * @description SessionKey change
   * @param {String} SessionKey
   */
  onChangeValue(SessionKey) {
    this.setState({
      SessionKey: SessionKey
    })
  }

  /**
   * @description 点击取消|Click Cancel
   */
  Cancel() {
    this.props.navigation.navigate('Tabbed_Navigation')
  }

  /**
   * @description 点击提交|Submit
   */
  Sign_and_Submit() {
    if (this.state.SessionKey && this.state.password) {
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
            _this.setState({
              onlyone: 1,
              isModal: true
            })
            const SessionKey = _this.state.SessionKey
            // 设置SessionKey为用户填写的
            // Set SessionKey to be filled by the user
            setTimeout(() => {
              if (_this.state.type == 'pending...') {
                Alert.alert(
                  '',
                  i18n.t('TAB.noResponse'),
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        _this.setState({
                          isModal: false,
                          onlyone: 0
                        })
                      }
                    }
                  ],
                  { cancelable: false }
                )
              }
            }, 15000)
            let transfer
            try {
              transfer = await polkadotAPI.setKey(SessionKey)
            } catch (e) {
              this.setState({
                isModal: false,
                onlyone: 0,
                Failed: true
              })
              Alert.alert('', i18n.t('Staking.SessionKeyFailed'))
            }
            transfer.signAndSend(loadPair, ({ status }) => {
              status = formatData(status)
              if (status.Finalized) {
                _this.setState({
                  isModal: false,
                  type: 'success',
                  Failed: false
                })
                setTimeout(() => {
                  Alert.alert(
                    '',
                    i18n.t('Staking.SessionKeySuccess'),
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          _this.props.navigation.navigate('Tabbed_Navigation')
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
    } else {
      Alert.alert('', i18n.t('TAB.enterInformation'))
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          hidden={false}
          backgroundColor="#FFF" // 状态栏背景颜色 | Status bar background color
          barStyle="dark-content" // 状态栏样式（黑字）| Status bar style (black)
        />
        {/* 标题栏 | Title bar */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderBottomWidth: 0.5,
            borderBottomColor: '#ECE2E5'
          }}
        >
          <Header title={i18n.t('Staking.setSessionKey')} theme="dark" navigation={this.props.navigation} />
        </View>
        <CustomKeyboard.AwareCusKeyBoardScrollView style={{ flex: 1 }}>
          <RNKeyboardAvoidView>
            <View style={{ width: ScreenWidth - 40, marginLeft: 20, marginBottom: 20 }}>
              <Text
                style={{
                  marginTop: 40,
                  color: '#3E2D32',
                  fontSize: 20,
                  marginBottom: 40,
                  fontWeight: '600'
                }}
              >
                {i18n.t('Staking.setSessionKey')}
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
                <Text style={{ fontSize: 15 }}>{i18n.t('Staking.calling')}</Text>
                <Text
                  style={{
                    fontSize: 15,
                    backgroundColor: '#F0F0F0',
                    paddingHorizontal: 5,
                    borderRadius: 3
                  }}
                >
                  session.setKey
                </Text>
              </View>
              <Text
                style={{
                  color: '#3E2D32',
                  fontSize: 16,
                  marginBottom: 12,
                  fontWeight: '600'
                }}
              >
                {i18n.t('Staking.SessionKey')}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
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
                  placeholder=""
                  placeholderTextColor="#666666"
                  underlineColorAndroid="#ffffff00"
                  onChangeText={this.onChangeValue.bind(this)}
                />
              </View>
              <Text
                style={{
                  color: '#3E2D32',
                  fontSize: 16,
                  marginBottom: 12,
                  marginTop: 20,
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
                  onChangeText={this.onChangepassword}
                />
                <TouchableOpacity
                  onPress={this.lookpwd}
                  activeOpacity={0.7}
                  style={{ width: 50, marginLeft: -50, height: 44 }}
                >
                  <Image
                    style={{ width: 21, marginTop: 12, marginLeft: 14 }}
                    source={require('../../../assets/images/public/eye.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </RNKeyboardAvoidView>
        </CustomKeyboard.AwareCusKeyBoardScrollView>
        {/* Cancel or Set */}
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
                onPress={this.Sign_and_Submit}
              >
                <Text style={{ fontWeight: '500', fontSize: 16, color: 'white' }}>{i18n.t('Staking.Set')}</Text>
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
                <Text style={{ fontWeight: '500', fontSize: 16, color: 'white' }}>{i18n.t('Staking.Set')}</Text>
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
  middle: {
    justifyContent: 'center',
    alignItems: 'center'
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

  choose_Text: {
    fontWeight: '500',
    fontSize: ScreenHeight / 50,
    color: '#4169E1'
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
  pwdInputStyle: {
    paddingVertical: 0,
    height: ScreenHeight / 23,
    width: ScreenWidth * 0.65,
    borderWidth: 1,
    borderColor: '#97BEC7',
    borderRadius: ScreenHeight / 200,
    paddingLeft: ScreenHeight / 100
  },
  textInputStyle: {
    paddingVertical: 0,
    height: ScreenHeight / 23,
    width: ScreenWidth * 0.9,
    borderWidth: 1,
    borderColor: '#97BEC7',
    borderRadius: ScreenHeight / 200,
    paddingLeft: ScreenHeight / 100
  },
  Choose_way: {
    alignItems: 'center',
    marginLeft: ScreenWidth / 70,
    width: ScreenWidth * 0.25,
    height: ScreenHeight / 23,
    borderWidth: 1,
    borderRadius: ScreenHeight / 200,
    borderColor: '#4dabd0',
    flexDirection: 'row',
    backgroundColor: '#4dabd0'
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
  },
  choessText: {
    fontWeight: '500',
    fontSize: ScreenWidth / 28,
    color: 'white'
  }
})
export default SetSessionKey
