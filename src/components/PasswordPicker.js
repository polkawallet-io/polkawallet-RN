/*
 * @Description: COPYRIGHT © 2018 POLKAWALLET (HK) LIMITED
 * This file is part of Polkawaallet.

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
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  InteractionManager
} from 'react-native'
import Identicon from 'polkadot-identicon-react-native'
import SInfo from 'react-native-sensitive-info'
import { ScreenWidth, ScreenHeight, checkPwd, doubleClick } from '../util/Common'
import i18n from '../locales/i18n'
import chainxAPI from '../util/chainxAPI'
import Keyring from '@polkadot/keyring'
import { TYPE_CHAINX, TYPE_KUSMA } from '../util/Constant'

export default class PasswordPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      isModal1: props.isModel,
      msg: '',
      adderss: this.props.adderss,
      type: this.props.type
    }
    this.cancel = this.cancel.bind(this)
    this.ok = this.ok.bind(this)
    this.onChangepassword = this.onChangepassword.bind(this)
    console.warn('password picker constuct ' + this.state.isModal1)
  }

  componentDidMount() {
    console.warn('componentDidMount ...........' + this.state.isModal1)
  }

  componentWillReceiveProps(props) {
    if (props) {
      this.setState({
        isModal1: props.isModel,
        address: props.address,
        type: props.type
      })
    }
    console.warn(
      'componentWillReceiveProps  当前address为:' +
        props.address +
        'type为:.....' +
        props.type +
        ' isModule为...' +
        props.isModel
    )

    if (props.address) {
      InteractionManager.runAfterInteractions(() => {
        console.warn('address:' + props.address)
        SInfo.getItem(props.address, {
          sharedPreferencesName: 'Polkawallet',
          keychainService: 'PolkawalletKey'
        })
          .then(result => {
            this.setState({
              msg: result
            })
          })
          .catch(e => {
            console.warn('错误')
          })
      })
    }
  }

  onChangepassword(value) {
    this.setState({
      password: value
    })
  }

  /**
   * @description 返回上一页 | Go back to the previous page.
   */
  back() {
    this.props.navigation.goBack()
  }

  ok() {
    this.setState({
      isModal1: false
    })

    if (this.state.type == TYPE_CHAINX) {
      console.warn('password:  ' + this.state.password)
      chainxAPI
        .getPrivateKey(this.state.msg, this.state.password)
        .then(privateKey => {
          this.props.onGetPrivateKey(privateKey)
        })
        .catch(err => {
          console.warn('error:  ' + JSON.stringify(err))
          this.props.onError(err)
          setTimeout(() => {
            Alert.alert('', 'password is not right, please try it again')
          }, 100)
        })
    } else {
      console.warn('获取msg。。。。。。。。。' + this.state.msg)
      try {
        const keyring = new Keyring({ type: 'ed25519', addressPrefix: 2 })
        console.log(this.state.msg)
        const loadPair = keyring.addFromJson(JSON.parse(this.state.msg))
        loadPair.decodePkcs8(this.state.password)
        console.warn('解析了keystore。。。。。。。。。' + JSON.stringify(loadPair))
        this.props.onGetPrivateKey(loadPair)
      } catch (error) {
        this.props.onError(error)
        setTimeout(() => {
          Alert.alert('', 'password is not right, please try it again')
        }, 100)
      }
    }
  }

  cancel() {
    this.setState({
      isModal1: false
    })

    this.props.onCancel()
  }

  render() {
    console.warn('password picker component render' + this.state.isModal1)
    return (
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
        <Modal animationType="fade" transparent={true} visible={this.state.isModal1}>
          <View style={styles.modal}>
            <View style={styles.chooseview}>
              <Text style={styles.prompt}>{i18n.t('Profile.unlockPassword')}</Text>
              <TextInput
                style={[
                  styles.textInputStyle,
                  {
                    borderColor: this.state.password == '' ? 'red' : '#4169E1'
                  }
                ]}
                autoCapitalize="none"
                placeholder={i18n.t('Profile.unlockPassword')}
                placeholderTextColor="#DC143CA5"
                underlineColorAndroid="#ffffff00"
                secureTextEntry={true}
                onChangeText={this.onChangepassword}
              />
              {/* <View style={{ flex: 1 }} /> */}
              <View style={styles.yorn}>
                <TouchableOpacity
                  style={[styles.choose, { borderRightWidth: 1, borderRightColor: '#ECE2E5' }]}
                  onPress={() => {
                    this.setState({
                      isModal1: false
                    })
                    this.cancel()
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.textchoose}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.choose}
                  activeOpacity={0.7}
                  onPress={() => {
                    this.state.password == ''
                      ? Alert.alert('', i18n.t('Profile.unlockPassword'))
                      : doubleClick(this.ok())
                  }}
                >
                  <Text style={styles.textchoose}>Ok</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
  title1: {
    height: ScreenHeight / 9,
    backgroundColor: '#776f71',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  title2: {
    height: ScreenHeight / 10.6 / 1.6,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  titletext: {
    marginBottom: ScreenHeight / 50,
    fontSize: ScreenHeight / 37,
    fontWeight: 'bold',
    color: 'white'
  },
  head: {
    marginTop: ScreenHeight / 55,
    width: ScreenWidth,
    height: ScreenHeight / 3.81 / 2.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    marginTop: ScreenHeight / 30,
    backgroundColor: 'white',
    borderRadius: ScreenHeight / 28,
    height: ScreenHeight / 14,
    width: ScreenHeight / 14,
    resizeMode: 'contain'
  },
  adderss: {
    marginTop: ScreenHeight / 50,
    height: ScreenHeight / 3.81 / 6,
    width: ScreenWidth,
    alignItems: 'center',
    justifyContent: 'center'
  },
  export: {
    width: ScreenWidth - 40,
    backgroundColor: 'white',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    height: 68,
    borderRadius: 6
  },
  delete: {
    height: 49,
    width: ScreenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  next: {
    marginRight: ScreenWidth / 28
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000066'
  },
  chooseview: {
    alignItems: 'center',
    // height: ScreenHeight / 4,
    width: ScreenWidth * 0.7,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 16
  },
  prompt: {
    marginTop: ScreenHeight / 35,
    fontSize: ScreenWidth / 25,
    fontWeight: '500',
    color: 'black',
    padding: 10
  },
  textInputStyle: {
    height: 49,
    width: 260,
    borderWidth: 1,
    fontSize: 14,
    borderRadius: 2,
    marginVertical: 20
  },
  choose: {
    height: 49,
    width: (ScreenWidth * 0.7) / 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  yorn: {
    borderTopWidth: 1,
    borderColor: '#ECE2E5',
    alignItems: 'center',
    height: 49,
    flexDirection: 'row'
  },
  textchoose: {
    fontSize: 16,
    color: '#222222'
  }
})
