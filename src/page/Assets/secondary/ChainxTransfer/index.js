/*
 * @Description: COPYRIGHT © 2018 POLKAWALLET (HK) LIMITED
 * This file is part of Polkawallet.

 It under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License.
 You should have received a copy of the GNU General Public License
 along with Polkawallet. If not, see <http://www.gnu.org/licenses/>.

 * @Autor: POLKAWALLET LIMITED
 * @Date: 2019-06-18 21:08:00
 *
 * 填写余额转账页面
 *
 */
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Modal,
  NetInfo
} from 'react-native'
import { formatBalance, u8aToHex, hexToU8a } from '@polkadot/util'
import QRCode from 'react-native-qrcode'
import { observer, inject } from 'mobx-react'
import { getUnit, ScreenWidth, ScreenHeight, formatData, doubleClick } from '../../../../util/Common'
import Header from '../../../../components/Header'
import RNKeyboardAvoidView from '../../../../components/RNKeyboardAvoidView'
import chainxAPI from '../../../../util/chainxAPI'
import i18n from '../../../../locales/i18n'
import PasswordPicker from '../../../../components/PasswordPicker'
import ChineseTextInput from './ChineseTextInput'

@inject('rootStore')
@observer
class Transfer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      balance: 0,
      address: '',
      memo: '',
      value: 0,
      isModel: false,
      isModel1: false,
      type: 'pending...',
      multiple: 1000000000000000,
      fees: {},
      tfColor: '#CCC',
      TipTag: false,
      TipStep: 1,
      encoded: '',
      transfer: '',
      signature: ''
    }
    this.Make_transfer = this.Make_transfer.bind(this)
    this.back = this.back.bind(this)
    this.ChangeAddress = this.ChangeAddress.bind(this)
    this.ChangeValue = this.ChangeValue.bind(this)
    this.ChangeMemo = this.ChangeMemo.bind(this)
    this.addresses = this.addresses.bind(this)
    this.camera = this.camera.bind(this)
  }

  /**
   * @description 点击返回 | Click back
   */
  back() {
    this.props.rootStore.stateStore.t_address = ''
    this.props.rootStore.stateStore.isaddresses = 0
    this.props.rootStore.stateStore.transfer_address = 0
    this.props.rootStore.stateStore.iscamera = 0
    if (this.props.rootStore.stateStore.tocamera == 0) {
      this.props.navigation.navigate('Tabbed_Navigation')
    } else {
      this.props.navigation.navigate('Coin_PCX_details')
    }
  }

  /**
   * @description 点击扫一扫|Click Scan
   */
  camera() {
    this.props.rootStore.stateStore.tocamera = 1
    this.props.navigation.navigate('Camera')
  }

  /**
   * @description 选择通讯录|Switch Addresses
   */
  addresses() {
    this.props.rootStore.stateStore.transfer_address = 1
    this.props.navigation.navigate('Addresses')
  }

  /**
   * @description 点击转账|Click Transfer
   */
  Make_transfer() {
    console.warn('value:' + this.state.value)
    if (this.state.address == '' || this.state.address.length != 48) {
      Alert.alert('', i18n.t('Assets.PleaseEnterAddress'))
      this.setState({
        isModel1: false
      })
    } else if (this.state.value == '' || this.state.value == 0 || !this.check(this.state.value)) {
      Alert.alert('', i18n.t('Assets.enterValue'))
      this.setState({
        isModel1: false
      })
    } else if (this.state.balance < this.state.value) {
      Alert.alert('', 'balance is not enough')
      this.setState({
        isModel1: false
      })
    } else {
      this.setState({
        isModel1: true
      })
    }
  }

  check(number) {
    var re = /^\d+(?=\.{0,1}\d+$|$)/
    if (number != '' && re.test(number)) {
      return true
    } else {
      return false
    }
  }
  /**
   * @description 输入转账地址改变|Change of transfer address
   * @param {String} changeAddress
   */
  ChangeAddress(changeAddress) {
    if (changeAddress != '') {
      this.props.rootStore.stateStore.isaddresses = 0
    } else {
      if (this.props.rootStore.stateStore.transfer_address == 1) {
        this.props.rootStore.stateStore.isaddresses = 1
      }
    }
    this.setState({
      address: changeAddress
    })
  }

  /**
   * @description 转账金额的更改 | Change of transfer balance
   * @param {String} changeValue
   */
  ChangeValue(changeValue) {
    this.setState({
      value: changeValue,
      tfColor: this.state.balance > changeValue * this.state.multiple ? '#CCC' : 'red'
    })
  }

  chkPrice(number) {
    //方法1
    number = number.replace(/[^\d.]/g, '')
    //必须保证第一位为数字而不是.
    number = number.replace(/^\./g, '')
    //保证只有出现一个.而没有多个.
    number = number.replace(/\.{2,}/g, '.')
    //保证.只出现一次，而不能出现两次以上
    number = number
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
    return number
  }

  /*
   * @description momo的更改 | change of memo
   *
   */
  ChangeMemo(ChangeMemo) {
    this.setState({
      memo: ChangeMemo
    })
  }

  /**
   * @description 页面初始化|Page initialization
   */
  componentWillMount() {
    ;(async () => {
      this.props.rootStore.stateStore.tocamera = 1
      let balance = await chainxAPI.freeBalance(this.props.rootStore.stateStore.currentAccount.address)
      this.setState({
        balance: balance
      })
      // 暂时不用获取费率
      // this.setState({ fees: await Polkawallet.fees() })
    })()
  }

  getSignTosend(signature) {
    this.props.rootStore.stateStore.SignDetail = ''
    this.setState({
      TipTag: true,
      TipStep: 2,
      signature: JSON.parse(signature)
    })
  }

  componentDidMount() {
    // 通过addListener开启监听，didFocus RN 生命周期 页面获取焦点
    // Start listening through addListener, didFocus RN lifecycle page gets focus
    console.warn(
      'account index 为:' +
        this.props.rootStore.stateStore.Account +
        'address为:' +
        this.props.rootStore.stateStore.currentAccount.address
    )
    this._didBlurSubscription = this.props.navigation.addListener('didFocus', payload => {
      if (String(this.props.rootStore.stateStore.t_address)) {
        this.ChangeAddress(String(this.props.rootStore.stateStore.t_address))
      }
      if (this.props.rootStore.stateStore.SignDetail) {
        this.getSignTosend(this.props.rootStore.stateStore.SignDetail)
      }
    })
    ;(async () => {
      this.props.rootStore.stateStore.tocamera = 1
      let balance = await chainxAPI.freeBalance(this.props.rootStore.stateStore.currentAccount.address)
      this.setState({
        balance: balance
      })
      // 暂时不用获取费率
      // this.setState({ fees: await Polkawallet.fees() })
    })()
  }

  componentWillUnmount() {
    // 在页面消失的时候，取消监听
    // Unlisten when the page disappears
    this._didBlurSubscription && this._didBlurSubscription.remove()
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
          <Header
            title={(() => {
              if (this.props.rootStore.stateStore.type == 2) {
                return 'Transfer PCX'
              } else {
                return 'Transfer DOT'
              }
            })()}
            theme="dark"
            navigation={this.props.navigation}
            rightIcon={require('../../../../assets/images/public/addaddresses_code.png')}
            rightPress={this.camera}
          />
        </View>
        <PasswordPicker
          isModel={this.state.isModel1}
          address={this.props.rootStore.stateStore.currentAccount.address}
          type={this.props.rootStore.stateStore.currentAccount.type}
          onCancel={() => this.setState({ isModel1: false })}
          onError={() => this.setState({ isModel1: false })}
          onGetPrivateKey={privatekey => {
            this.setState({
              isModel1: false
            })
            ;(async () => {
              this.setState({
                isModel1: false
              })
              let sendData = ''
              await chainxAPI
                .signAndsend(this.state.address, 'PCX', this.state.value * 100000000, privatekey, this.state.memo)
                .then(result => {
                  sendData = result
                  setTimeout(() => {
                    Alert.alert('', 'transfer result: ' + JSON.stringify(result))
                  }, 100)
                  ;(async () => {
                    let balance = await chainxAPI.freeBalance(this.props.rootStore.stateStore.currentAccount.address)
                    this.setState({
                      balance: balance
                    })
                  })()
                })
                .catch(err => {
                  setTimeout(() => {
                    Alert.alert('', 'transfer is error, error msg: ' + JSON.stringify(err))
                  }, 100)
                })
              let balance = await chainxAPI.freeBalance(this.props.rootStore.stateStore.currentAccount.address)
              this.setState({
                balance: balance
              })
              console.warn(JSON.stringify(sendData))
            })()
          }}
        ></PasswordPicker>
        <RNKeyboardAvoidView>
          <View style={{ width: ScreenWidth - 40, marginLeft: 20, marginTop: 40 }}>
            <Text style={{ color: '#3E2D32', fontSize: 16 }}>{i18n.t('Assets.recipientAddress')}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 12,
                marginBottom: 20
              }}
            >
              <TextInput
                style={{
                  width: ScreenWidth - 40,
                  paddingHorizontal: 12,
                  height: 56,
                  borderColor: '#CCC',
                  borderWidth: 1,
                  fontSize: 16,
                  borderRadius: 4,
                  paddingRight: 50
                }}
                placeholder={i18n.t('Assets.recipientAddress')}
                value={this.state.address}
                onChangeText={changeText => {
                  this.ChangeAddress(changeText)
                }}
              />
              <TouchableOpacity onPress={this.addresses} activeOpacity={0.7} style={{ marginLeft: -54, padding: 10 }}>
                <Image style={styles.image} source={require('../../../../assets/images/public/Pro_Addre.png')} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#3E2D32', fontSize: 16 }}>{i18n.t('Assets.sendOf')}</Text>
              <Text style={{ color: '#F14B79', fontSize: 16 }}>
                {i18n.t('Assets.Balance')}:{this.state.balance}
              </Text>
            </View>
            <View
              style={{
                width: ScreenWidth - 40,
                flexDirection: 'row',
                marginBottom: 20,
                marginTop: 12
              }}
            >
              <TextInput
                style={{
                  height: 56,
                  borderColor: this.state.tfColor,
                  paddingHorizontal: 12,
                  borderWidth: 1,
                  fontSize: 16,
                  flex: 1,
                  borderRadius: 4
                }}
                type=""
                placeholder={i18n.t('Assets.sendOf')}
                onChangeText={changeText => {
                  this.ChangeValue(changeText)
                }}
              />
            </View>
            <Text style={{ color: '#3E2D32', fontSize: 16 }}>{i18n.t('Assets.memoOf')}</Text>
            <View
              style={{
                width: ScreenWidth - 40,
                flexDirection: 'row',
                marginBottom: 40,
                marginTop: 2
              }}
            >
              <ChineseTextInput
                style={{
                  height: 56,
                  borderColor: this.state.tfColor,
                  paddingHorizontal: 12,
                  borderWidth: 1,
                  fontSize: 16,
                  flex: 1,
                  borderRadius: 4
                }}
                placeholder={i18n.t('Assets.memoOf')}
                onChangeText={changeText => {
                  this.ChangeMemo(changeText)
                }}
              />
            </View>
          </View>
        </RNKeyboardAvoidView>
        <TouchableOpacity
          style={styles.maket}
          onPress={() => {
            doubleClick(this.Make_transfer)
          }}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 16, color: '#FFF' }}>{i18n.t('Assets.MakeTransfer')}</Text>
        </TouchableOpacity>
        <Modal animationType="fade" transparent={true} visible={this.state.isModel}>
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
                    alignItems: 'flex-start',
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
                          marginLeft: (ScreenWidth - 50 - 120) / 2
                        }}
                      >
                        {i18n.t('Assets.Cold')}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row'
                      }}
                    >
                      <TouchableOpacity
                        style={{ width: 50, height: 40 }}
                        onPress={() => {
                          this.setState({
                            TipStep: 1
                          })
                        }}
                      >
                        <Image
                          style={{ marginLeft: 15, marginTop: 13 }}
                          source={require('../../../../assets/images/public/About_return.png')}
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          justifyContent: 'center',
                          width: 120,
                          alignSelf: 'center',
                          marginLeft: (ScreenWidth - 50 - 120) / 2
                        }}
                      >
                        {i18n.t('Assets.ReadData')}
                      </Text>
                    </View>
                  )}
                </View>
                {this.state.TipStep == 1 ? (
                  <View
                    style={{
                      width: ScreenWidth,
                      alignItems: 'center'
                    }}
                  >
                    {this.state.encoded ? (
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
                        <QRCode value={this.state.encoded} size={220} bgColor="black" fgColor="white" />
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
                    )}

                    <Text
                      style={{
                        color: '#3E2D32',
                        fontSize: 12,
                        paddingTop: 20,
                        paddingBottom: 20
                      }}
                    >
                      {i18n.t('Assets.ScanAndNext')}
                    </Text>
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
                          this.state.encoded &&
                            this.setState({
                              TipStep: 2
                            })
                        }}
                      >
                        <Text style={{ fontSize: 16, color: '#FFF' }}>{i18n.t('Assets.Next')}</Text>
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
                    <TouchableOpacity
                      style={{
                        alignItems: 'center',
                        marginTop: 20,
                        paddingTop: 20,
                        paddingBottom: 20,
                        marginBottom: 20
                      }}
                      onPress={() => {
                        this.setState(
                          {
                            TipTag: false
                          },
                          () => {
                            this.props.rootStore.stateStore.ScanTransaction = 2
                            this.props.navigation.navigate('Camera')
                          }
                        )
                      }}
                    >
                      <Image source={require('../../../../assets/images/public/addaddresses_code.png')} />
                      <Text style={{ marginTop: 10 }}>{i18n.t('Assets.ScanCold')}</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={[
                        styles.textInputStyle,
                        {
                          height: 168,
                          fontSize: 16,
                          color: '#3E2D32',
                          paddingVertical: 15,
                          marginBottom: 20,
                          width: ScreenWidth - 40,
                          borderColor: '#ccc'
                        }
                      ]}
                      value={this.state.signature}
                      autoCorrect={false}
                      editable={false}
                      placeholderTextColor="black"
                      underlineColorAndroid="#ffffff00"
                      multiline={true}
                      maxLength={1000}
                    />
                    <View
                      style={{
                        width: ScreenWidth - 40,
                        marginRight: 40,
                        height: 49,
                        marginBottom: 20
                      }}
                    >
                      <TouchableOpacity style={styles.maket} onPress={this.toSend.bind(this)}>
                        <Text style={{ fontSize: 16, color: '#FFF' }}>{i18n.t('Assets.MakeTransfer')}</Text>
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
    justifyContent: 'space-between',
    backgroundColor: '#776f71'
  },
  text_title: {
    fontSize: ScreenHeight / 37,
    fontWeight: 'bold',
    color: '#e6e6e6'
  },
  image_title: {},
  NandP: {
    justifyContent: 'center',
    paddingLeft: ScreenWidth / 20,
    height: ScreenHeight / 7
  },
  textInputStyle: {
    height: ScreenHeight / 23,
    width: ScreenWidth * 0.65,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    paddingLeft: ScreenHeight / 100,
    paddingVertical: 0
  },
  image: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    tintColor: '#ccc'
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
  choose_Text: {
    fontWeight: '500',
    fontSize: ScreenHeight / 50,
    color: '#4169E1'
  },
  feesView: {
    color: '#888888',
    fontSize: 14,
    marginBottom: 12
  },
  feesText: {
    color: '#696969',
    fontSize: ScreenHeight / 60
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
  }
})
export default Transfer
