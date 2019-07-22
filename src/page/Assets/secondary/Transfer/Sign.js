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
  SafeAreaView,
  ActivityIndicator
} from 'react-native'
import { observer, inject } from 'mobx-react'
import QRCode from 'react-native-qrcode'
import { hexToU8a, u8aToHex } from '@polkadot/util'
import { ScreenWidth, ScreenHeight, checkPwd } from '../../../../util/Common'
import Header from '../../../../components/Header'
import RNKeyboardAvoidView from '../../../../components/RNKeyboardAvoidView'
import i18n from '../../../../locales/i18n'

@inject('rootStore')
@observer
class Sign extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ispwd: true, // 密码是否展示
      password: '',
      isModal: false,
      onlyone: 0,
      type: 'pending...',
      TipTag: false, // 是否显示签名遮罩层
      TipStep: 1, // 签名遮罩层的进展步数 1 输入密码 2 展示二维码
      QRdata: {
        // 二维码信息
        address: '', // 自己的转账账户
        Sender: '' // 目标账户
      },
      signature: '' // 签名信息
    }
    this.lookpwd = this.lookpwd.bind(this)
    this.onChangepasswore = this.onChangepasswore.bind(this)
    this.Sign_and_Submit = this.Sign_and_Submit.bind(this)
  }

  /**
   * @description 密码展示
   */
  lookpwd() {
    this.setState({
      ispwd: !this.state.ispwd
    })
  }

  /**
   * @description 密码更改
   */
  onChangepasswore(Changepasswore) {
    this.setState({
      password: Changepasswore
    })
  }

  componentDidMount() {
    // 通过addListener开启监听，didFocus RN 生命周期 页面获取焦点
    this._didBlurSubscription = this.props.navigation.addListener('didFocus', () => {
      // 判断TransactionDetail是否存在
      if (this.props.rootStore.stateStore.TransactionDetail) {
        let Tdata = JSON.parse(this.props.rootStore.stateStore.TransactionDetail)
        Tdata.encoded = hexToU8a(Tdata.encoded)
        this.setState({
          QRdata: Tdata
        })
      }
    })
  }

  componentWillUnmount() {
    // 在页面消失的时候，取消监听
    this._didBlurSubscription && this._didBlurSubscription.remove()
  }

  /**
   * @description 点击提交
   */
  Sign_and_Submit() {
    this.setState({
      onlyone: 1,
      isModal: true
    })
    const _this = this
    checkPwd({
      address: _this.state.QRdata.address,
      password: _this.state.password,
      success: loadPair => {
        ;(async () => {
          // 检测api长时间（15s）没有返回，或者报错监听不到
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
                        isModal: false
                      })
                    }
                  }
                ],
                { cancelable: false }
              )
            }
          }, 15000)
          // const encoded = new Uint8Array(_this.state.QRdata.encoded)
          const signature = await loadPair.sign(_this.state.QRdata.encoded)
          _this.setState({
            TipStep: 2,
            isModal: false,
            type: 'success',
            signature: u8aToHex(signature)
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
          backgroundColor="#FFF" // 状态栏背景颜色
          barStyle="dark-content" // 状态栏样式（黑字）
        />
        {/* 标题栏 */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderBottomWidth: 0.5,
            borderBottomColor: '#ECE2E5'
          }}
        >
          <Header title={i18n.t('Assets.Transfer')} theme="dark" navigation={this.props.navigation} />
        </View>
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
                {this.state.QRdata.address}
              </Text>
            </View>

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
                {this.state.QRdata.Sender}
              </Text>
            </View>
          </View>
        </RNKeyboardAvoidView>
        {/* Reset or Save */}
        <View style={{ justifyContent: 'center', marginBottom: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              width: ScreenWidth - 40,
              marginLeft: 20
            }}
          >
            {this.state.onlyone == 0 ? (
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  backgroundColor: '#F14B79',
                  marginLeft: 10,
                  height: 49
                }}
                onPress={() => {
                  this.setState({
                    TipTag: true
                  })
                }}
              >
                <Text style={{ fontWeight: '500', fontSize: 16, color: 'white' }}>{i18n.t('Assets.Sign')}</Text>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  backgroundColor: '#F14B79',
                  marginLeft: 10,
                  height: 49
                }}
              >
                <Text style={{ fontWeight: '500', fontSize: 16, color: 'white' }}>{i18n.t('Assets.Sign')}</Text>
              </View>
            )}
          </View>
        </View>
        <Modal animationType="fade" transparent={true} visible={this.state.TipTag}>
          <View
            style={{
              width: ScreenWidth,
              height: ScreenHeight - (StatusBar.currentHeight || 0),
              backgroundColor: 'rgba(0,0,0,0.5)'
            }}
          >
            <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 0 }}>
              <View
                style={{
                  borderRadius: 8,
                  width: ScreenWidth,
                  backgroundColor: '#FFF',
                  justifyContent: 'center'
                }}
              >
                <View
                  style={{
                    height: 40,
                    borderBottomColor: '#CCC',
                    borderBottomWidth: 0.5
                  }}
                >
                  {this.state.TipStep == 1 ? (
                    <View
                      style={{
                        flexDirection: 'row'
                      }}
                    >
                      <TouchableOpacity
                        style={{ width: 50, height: 40 }}
                        onPress={() => {
                          this.setState({
                            TipTag: false
                          })
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            marginLeft: 15,
                            marginTop: 10
                          }}
                        >
                          X
                        </Text>
                      </TouchableOpacity>
                      <Text
                        style={{
                          justifyContent: 'center',
                          width: 120,
                          alignSelf: 'center',
                          marginLeft: (ScreenWidth - 50 - 160) / 2
                        }}
                      >
                        {i18n.t('TAB.unlockPassword')}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Text
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {i18n.t('Assets.signSuccess')}
                      </Text>
                    </View>
                  )}
                </View>
                {this.state.TipStep == 1 ? (
                  <View
                    style={{
                      width: ScreenWidth,
                      marginVertical: 20,
                      alignItems: 'center'
                    }}
                  >
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
                        secureTextEntry={this.state.ispwd}
                        onChangeText={this.onChangepasswore}
                      />
                      <TouchableOpacity onPress={this.lookpwd} style={{ width: 50, marginLeft: -50, height: 44 }}>
                        <Image
                          style={{ width: 21, marginTop: 12, marginLeft: 14 }}
                          source={require('../../../../assets/images/public/eye.png')}
                        />
                      </TouchableOpacity>
                    </View>
                    {this.state.isModal ? (
                      <View
                        style={{
                          width: 220,
                          height: 220,
                          overflow: 'hidden',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: 20,
                          marginBottom: 20
                        }}
                      >
                        <View
                          style={{
                            width: 100,
                            height: 100,
                            backgroundColor: '#000',
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <ActivityIndicator color="#fff" />
                          <Text style={styles.loadingTitle}>
                            {i18n.t('TAB.loading')}
                            ...
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View
                        style={{
                          width: 220,
                          height: 220,
                          overflow: 'hidden',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: 20,
                          marginBottom: 20
                        }}
                      />
                    )}
                    <View
                      style={{
                        width: ScreenWidth - 40,
                        marginRight: 40,
                        height: 49,
                        marginBottom: 20
                      }}
                    >
                      <TouchableOpacity style={styles.maket} onPress={this.Sign_and_Submit}>
                        <Text style={{ fontSize: 16, color: '#FFF' }}>{i18n.t('TAB.Confirm')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      width: ScreenWidth,
                      alignItems: 'center'
                    }}
                  >
                    <View
                      style={{
                        width: 220,
                        height: 220,
                        overflow: 'hidden',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 20,
                        marginBottom: 20
                      }}
                    >
                      <QRCode
                        value={JSON.stringify({
                          action: 'SignDetail',
                          signature: this.state.signature
                        })}
                        size={220}
                        bgColor="black"
                        fgColor="white"
                      />
                    </View>
                    <View
                      style={{
                        width: ScreenWidth - 40,
                        marginRight: 40,
                        height: 49,
                        marginBottom: 20
                      }}
                    >
                      <TouchableOpacity
                        style={styles.maket}
                        onPress={() => {
                          this.setState(
                            {
                              TipStep: 1,
                              TipTag: false
                            },
                            () => {
                              setTimeout(() => {
                                this.props.navigation.navigate('Assets')
                              }, 500)
                            }
                          )
                        }}
                      >
                        <Text style={{ fontSize: 16, color: '#FFF' }}>{i18n.t('TAB.Confirm')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
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
  },
  loading: {
    backgroundColor: '#10101099',
    height: 80,
    width: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: (ScreenHeight - 80) / 2,
    left: (ScreenWidth - 100) / 2
  },

  loadingTitle: {
    marginTop: 10,
    fontSize: 14,
    color: 'white'
  },
  maket: {
    height: 44,
    width: ScreenWidth - 40,
    marginLeft: 20,
    borderRadius: 6,
    backgroundColor: '#F14B79',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 43
  }
})
export default Sign
