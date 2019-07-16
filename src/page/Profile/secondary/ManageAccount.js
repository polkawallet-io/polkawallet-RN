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
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Clipboard,
  Platform,
  StatusBar,
  SafeAreaView,
  InteractionManager
} from 'react-native'
import Identicon from 'polkadot-identicon-react-native'
import SInfo from 'react-native-sensitive-info'
import { observer, inject } from 'mobx-react'
import { ScreenWidth, ScreenHeight, checkPwd, doubleClick } from '../../../util/Common'
import Header from '../../../components/Header'
import i18n from '../../../locales/i18n'

@inject('rootStore')
@observer
class ManageAccount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      address: this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address,
      isModal1: false,
      isModal2: false,
      msg: ''
    }
    this.ExportKey = this.ExportKey.bind(this)
    this.onChangepassword = this.onChangepassword.bind(this)
    this.cancel = this.cancel.bind(this)
    this.delete_account = this.delete_account.bind(this)
    this.Continue = this.Continue.bind(this)
    this.Copy = this.Copy.bind(this)
    this.Change_Password = this.Change_Password.bind(this)
    this.Change_Name = this.Change_Name.bind(this)
  }

  /**
   * @description  切换到更改账户|Switch to Change_Name page
   */
  Change_Name() {
    this.props.navigation.navigate('Change_Name')
  }

  /**
   * @description  切换到更改密码|Switch to Change_Password page
   */
  Change_Password() {
    this.props.navigation.navigate('Change_Password')
  }

  /**
   * @description  导出 key store|Export key store
   */
  ExportKey() {
    this.setState({
      isModal1: true
    })
  }

  /**
   * @description 密码修改|Change password
   * @param {String} changepassword 密码|password
   */
  onChangepassword(changepassword) {
    this.setState({
      password: changepassword
    })
  }

  /**
   * @description 点击取消|Click Cancel
   */
  cancel() {
    this.setState({
      password: '',
      isModal1: false
    })
  }

  /**
   * @description  点击提交|Submit
   */
  ok() {
    checkPwd({
      address: this.state.address,
      password: this.state.password,
      success: () => {
        this.setState({
          isModal1: false,
          isModal2: true
        })
      }
    })
  }

  /**
   * @description 点击继续|Click the continue
   */
  Continue() {
    this.setState({
      password: '',
      isModal2: false
    })
  }

  /**
   * @description 复制|Click the copy
   */
  async Copy() {
    Clipboard.setString(this.state.msg)
    Alert.alert('', i18n.t('TAB.CopySuccess'))
  }

  /**
   * @description 删除账户|Delete account
   */
  delete_account() {
    Alert.alert(
      '',
      i18n.t('Profile.deleteTip'),
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            SInfo.deleteItem(
              this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address,
              {
                sharedPreferencesName: 'Polkawallet',
                keychainService: 'PolkawalletKey'
              }
            ).then(
              Alert.alert(
                '',
                i18n.t('Profile.DeleteSuccess'),
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      this.props.rootStore.stateStore.Account = 1
                      SInfo.getAllItems({
                        sharedPreferencesName: 'Polkawallet',
                        keychainService: 'PolkawalletKey'
                      }).then(result => {
                        if (JSON.stringify(result).length < 10) {
                          this.props.rootStore.stateStore.Account = 0
                          this.props.rootStore.stateStore.Accountnum = 0
                          this.props.rootStore.stateStore.Accounts = [
                            {
                              account: 'NeedCreate',
                              address: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx'
                            }
                          ]
                          this.props.navigation.navigate('Create_Account')
                        } else {
                          this.props.rootStore.stateStore.Account = 0
                          this.props.rootStore.stateStore.Accountnum = 0
                          this.props.rootStore.stateStore.Accounts = [
                            {
                              account: 'NeedCreate',
                              address: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx'
                            }
                          ]

                          if (Platform.OS == 'android') {
                            // android
                            for (let o in result) {
                              this.props.rootStore.stateStore.Accounts.push({
                                account: JSON.parse(result[o]).meta.name,
                                address: JSON.parse(result[o]).address
                              })
                              this.props.rootStore.stateStore.Account++
                              this.props.rootStore.stateStore.Accountnum++
                            }
                          } else {
                            // ios
                            result.map((item, index) => {
                              item.map((item, index) => {
                                // 添加用户到 mobx
                                // Add account to mobx
                                this.props.rootStore.stateStore.Accounts.push({
                                  account: JSON.parse(item.value).meta.name,
                                  address: item.key
                                })
                                this.props.rootStore.stateStore.Account = 1
                                this.props.rootStore.stateStore.Accountnum++
                              })
                            })
                          }
                          this.props.rootStore.stateStore.balances.map((item, index) => {
                            if (
                              item.address ==
                              this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address
                            ) {
                              this.props.rootStore.stateStore.balanceIndex = index
                            }
                          })
                          this.props.navigation.navigate('Tabbed_Navigation')
                        }
                      })
                    }
                  }
                ],
                { cancelable: false }
              )
            )
          }
        }
      ],
      { cancelable: false }
    )
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      SInfo.getItem(this.state.address, {
        sharedPreferencesName: 'Polkawallet',
        keychainService: 'PolkawalletKey'
      }).then(result => {
        this.setState({
          msg: result
        })
      })
    })
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F14B79' }}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#F6F6F6',
            paddingBottom: 40,
            marginBottom: -40
          }}
        >
          <StatusBar
            hidden={false}
            backgroundColor="#F14B79" // 状态栏背景颜色 | Status bar background color
            barStyle={Platform.OS == 'android' ? 'light-content' : 'dark-content'} // 状态栏样式（黑字）| Status bar style (black)
          />
          {/* The title */}
          <View style={{ backgroundColor: '#F14B79' }}>
            <Header navigation={this.props.navigation} title={i18n.t('Profile.ManageAccount')} />
            <View
              style={{
                height: 80,
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 21
              }}
            >
              <Identicon
                value={
                  this.props.rootStore.stateStore.Accounts[
                    this.props.rootStore.stateStore.isfirst == 0 ? 0 : this.props.rootStore.stateStore.Account
                  ].address
                }
                size={56}
                theme="polkadot"
              />
              <Text
                style={{
                  width: ScreenWidth * 0.5,
                  marginLeft: 21,
                  fontSize: 14,
                  color: 'white'
                }}
                ellipsizeMode="middle"
                numberOfLines={1}
              >
                {this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address}
              </Text>
            </View>
          </View>
          {/* Change Name */}
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <TouchableOpacity style={styles.export} activeOpacity={0.7} onPress={this.Change_Name}>
              <Text style={{ marginLeft: 20, color: '#3E2D32', fontSize: 18 }}>{i18n.t('Profile.ChangeName')}</Text>
              <View style={{ flex: 1 }} />
              <Image style={styles.next} source={require('../../../assets/images/public/addresses_nav_go.png')} />
            </TouchableOpacity>
          </View>
          {/* Change password */}
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={styles.export} activeOpacity={0.7} onPress={this.Change_Password}>
              <Text style={{ marginLeft: 20, color: '#3E2D32', fontSize: 18 }}>{i18n.t('Profile.ChangePassword')}</Text>
              <View style={{ flex: 1 }} />
              <Image style={styles.next} source={require('../../../assets/images/public/addresses_nav_go.png')} />
            </TouchableOpacity>
          </View>
          {/* Export Keystore */}
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.export}
              activeOpacity={0.7}
              onPress={() => {
                doubleClick(this.ExportKey)
              }}
            >
              <Text style={{ marginLeft: 20, color: '#3E2D32', fontSize: 18 }}>{i18n.t('Profile.ExportKeystore')}</Text>
              <View style={{ flex: 1 }} />
              <Image style={styles.next} source={require('../../../assets/images/public/addresses_nav_go.png')} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }} />
          {/* delete account */}
          <View>
            <TouchableOpacity style={styles.delete} activeOpacity={0.7} onPress={this.delete_account}>
              <Text style={{ fontSize: 18, fontWeight: '500', color: '#F14B79' }}>
                {i18n.t('Profile.DeleteAccount')}
              </Text>
            </TouchableOpacity>
          </View>
          {/* Please enter your password */}
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
                    onPress={this.cancel}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.textchoose}>cancel</Text>
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
                    <Text style={styles.textchoose}>ok</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {/* Please save your information */}
          <Modal animationType="fade" transparent={true} visible={this.state.isModal2}>
            <View style={styles.modal}>
              <View style={styles.chooseview}>
                <Text style={styles.prompt}>{i18n.t('Profile.saveInformation')}</Text>
                <Text
                  style={{
                    marginTop: ScreenHeight / 30,
                    padding: 10,
                    width: ScreenWidth * 0.7,
                    marginBottom: 20,
                    fontSize: 14
                  }}
                  selectable={true}
                >
                  {this.state.msg}
                </Text>
                {/* <View style={{ flex: 1 }} /> */}
                <View style={styles.yorn}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.choose, { borderRightWidth: 1, borderRightColor: '#ECE2E5' }]}
                    onPress={this.Continue}
                  >
                    <Text style={styles.textchoose}>{i18n.t('TAB.Continue')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.choose} onPress={this.Copy} activeOpacity={0.7}>
                    <Text style={styles.textchoose}>{i18n.t('TAB.Copy')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
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
export default ManageAccount
