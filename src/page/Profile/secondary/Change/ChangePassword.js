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
  TextInput,
  StatusBar,
  SafeAreaView,
  Alert
} from 'react-native'
import { observer, inject } from 'mobx-react'
import { ScreenWidth, ScreenHeight, checkPwd, doubleClick } from '../../../../util/Common'
import RNKeyboardAvoidView from '../../../../components/RNKeyboardAvoidView'
import i18n from '../../../../locales/i18n'

@inject('rootStore')
@observer
class ChangePassword extends Component {
  constructor(props) {
    super(props)
    this.json
    this.state = {
      Current_password: '',
      New_password: '',
      Repeat_password: '',
      ispwd1: 0,
      ispwd2: 0,
      ispwd3: 0
    }
    this.back = this.back.bind(this)
    this.Current_password = this.Current_password.bind(this)
    this.New_password = this.New_password.bind(this)
    this.Repeat_password = this.Repeat_password.bind(this)
    this.Change = this.Change.bind(this)
  }

  /**
   * @description 返回|Click the back
   */
  back() {
    this.props.navigation.navigate('Manage_Account')
  }

  /**
   * @description 当前密码修改|Change of current password
   * @param {String} Current_password  当前密码|Current password
   */
  Current_password(Current_password) {
    if (Current_password != '') {
      this.setState({ ispwd1: 1 })
    }
    if (Current_password == '') {
      this.setState({ ispwd1: 0 })
    }
    this.setState({
      Current_password: Current_password
    })
  }

  /**
   * @description 新密码修改|Change of new password
   * @param {String} New_password 新密码|Now password
   */
  New_password(New_password) {
    if (New_password != '') {
      this.setState({ ispwd2: 1 })
    }
    if (New_password == '') {
      this.setState({ ispwd2: 0 })
    }
    this.setState({
      New_password: New_password
    })
  }

  /**
   * @description 重复密码修改|Change of repeat password
   * @param {String} Repeat_password 重复新密码| The repeat password
   */
  Repeat_password(Repeat_password) {
    if (Repeat_password != this.state.New_password) {
      this.setState({ ispwd3: 0 })
    }
    if (Repeat_password == this.state.New_password) {
      this.setState({ ispwd3: 1 })
    }
    this.setState({
      Repeat_password: Repeat_password
    })
  }

  /**
   * @description 密码修改的最后提交|Submit the password
   */
  Change() {
    if (this.state.New_password != this.state.Repeat_password) {
      Alert.alert('', 'The two passwords are different')
    } else {
      const _this = this
      checkPwd({
        address: _this.props.rootStore.stateStore.Accounts[_this.props.rootStore.stateStore.Account].address,
        password: _this.state.New_password,
        success: (loadPair, SInfo) => {
          _this.json = loadPair.toJson(_this.state.New_password)
          SInfo.setItem(
            _this.props.rootStore.stateStore.Accounts[_this.props.rootStore.stateStore.Account].address,
            JSON.stringify(_this.json),
            {
              sharedPreferencesName: 'Polkawallet',
              keychainService: 'PolkawalletKey'
            }
          )
          Alert.alert(
            '',
            i18n.t('Profile.Modify'),
            [
              {
                text: 'OK',
                onPress: () => {
                  _this.props.navigation.navigate('Manage_Account')
                }
              }
            ],
            { cancelable: false }
          )
        },
        error: () => {
          _this.setState({
            onlyone: 0,
            isModal: false
          })
        }
      })
    }
  }

  render() {
    const msg = [i18n.t('Profile.CurrentPassword'), i18n.t('Profile.NewPassword'), i18n.t('Profile.RepeatPassword')]
    return (
      <SafeAreaView
        style={{
          backgroundColor: 'white',
          height: ScreenHeight
        }}
      >
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          {/* 标题栏 | Title bar */}
          <StatusBar
            hidden={false}
            backgroundColor="#FFF" // 状态栏背景颜色 | Status bar background color
            barStyle="dark-content" // 状态栏样式（黑字）| Status bar style (black)
          />
          <View>
            <TouchableOpacity
              onPress={this.back}
              activeOpacity={0.7}
              style={{ height: 44, width: 61, justifyContent: 'center' }}
            >
              <Image source={require('../../../../assets/images/public/About_return.png')} />
            </TouchableOpacity>
          </View>
          <RNKeyboardAvoidView>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 24,
                  marginTop: 37,
                  marginBottom: 17,
                  color: '#3E2D32'
                }}
              >
                {i18n.t('Profile.ChangePassword')}
              </Text>
              {msg.map((item, index) => {
                return (
                  <View style={[styles.view]} key={index}>
                    <TextInput
                      style={[styles.textInputStyle]}
                      placeholder={
                        index == 0
                          ? i18n.t('Profile.CurrentPassword')
                          : index == 1
                          ? i18n.t('Profile.NewPassword')
                          : i18n.t('Profile.RepeatPassword')
                      }
                      secureTextEntry={true}
                      autoCorrect={false}
                      underlineColorAndroid="#ffffff00"
                      onChangeText={
                        index == 0 ? this.Current_password : index == 1 ? this.New_password : this.Repeat_password
                      }
                    />
                  </View>
                )
              })}
            </View>
          </RNKeyboardAvoidView>
          <TouchableOpacity
            style={styles.Change}
            onPress={() => {
              doubleClick(this.Change)
            }}
            activeOpacity={0.7}
          >
            <Image source={require('../../../../assets/images/public/Change_button.png')} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
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
  image_title: {
    height: ScreenHeight / 33.35,
    width: ScreenHeight / 33.35,
    resizeMode: 'contain'
  },
  save_touch: {
    width: ScreenHeight / 33.35 + ScreenWidth * 0.06,
    justifyContent: 'center',
    alignItems: 'center'
  },
  save_text: {
    color: 'white',
    fontSize: ScreenWidth / 28
  },
  view: {
    width: ScreenWidth - 40,
    alignItems: 'center',
    justifyContent: 'center',
    height: 57,
    marginTop: 11
  },
  text: {
    fontSize: ScreenWidth / 25,
    width: ScreenWidth * 0.8,
    color: '#696969',
    fontWeight: '400'
  },
  textInputStyle: {
    width: ScreenWidth - 40,
    color: '#AAAAAA',
    borderBottomWidth: 1,
    borderBottomColor: '#ECE2E5',
    fontSize: 16
  },
  inputview: {
    marginTop: ScreenHeight / 70,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputimage: {
    marginLeft: ScreenWidth * 0.02,
    height: ScreenWidth * 0.04,
    width: ScreenWidth * 0.04,
    resizeMode: 'contain'
  },
  Change: {
    alignSelf: 'center',
    marginBottom: 80,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
export default ChangePassword
