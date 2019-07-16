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
import { ScreenWidth, ScreenHeight, checkPwd, formatData, doubleClick } from '../../../util/Common'
import Header from '../../../components/Header'
import RNKeyboardAvoidView from '../../../components/RNKeyboardAvoidView'
import polkadotAPI from '../../../util/polkadotAPI'
import i18n from '../../../locales/i18n'

@inject('rootStore')
@observer
class Vote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ispwd: true,
      password: '',
      isModal: false,
      onlyone: 0,
      type: 'pending...',
      index: this.props.navigation.state.params.index,
      choose: this.props.navigation.state.params.choose
    }
    this.lookpwd = this.lookpwd.bind(this)
    this.onChangepassword = this.onChangepassword.bind(this)
    this.Cancel = this.Cancel.bind(this)
    this.Vote = this.Vote.bind(this)
  }

  /**
   * @description 切换密码的可见性|Toggle password visibility
   */
  lookpwd() {
    this.setState({
      ispwd: !this.state.ispwd
    })
  }

  /**
   * @description 密码更改|Password change
   * @param {String} Changepassword  更改的密码|Changed password
   */
  onChangepassword(Changepassword) {
    this.setState({
      password: Changepassword
    })
  }

  /**
   * @description 点击取消|Click the cancel
   */
  Cancel() {
    this.props.navigation.navigate('Tabbed_Navigation')
  }

  /**
   * @description 点击Vote|Click the vote
   */
  Vote() {
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
            transfer = await polkadotAPI.vote(Number(_this.state.index), _this.state.choose == 'Aye' ? true : false)
          } catch (e) {
            _this.setState({
              isModal: false,
              onlyone: 0
            })
            Alert.alert('', i18n.t('Democracy.VoteFailed'))
          }
          transfer.signAndSend(loadPair, ({ status }) => {
            status = formatData(status)
            if (status.Finalized) {
              setTimeout(() => {
                Alert.alert(
                  '',
                  i18n.t('Democracy.VoteSuccess'),
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        _this.setState({
                          isModal: false,
                          type: 'success'
                        })
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
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          hidden={false}
          backgroundColor="#FFF" // 状态栏背景颜色 | Status bar background color | Status bar background color
          barStyle="dark-content" // 状态栏样式（黑字）| Status bar style (black)| Status bar style (black)
        />
        {/* 标题栏 | Title bar */}

        <Header navigation={this.props.navigation} title={i18n.t('Democracy.Voting')} theme="dark" />
        <RNKeyboardAvoidView>
          <View style={[styles.nominate_view, { justifyContent: 'space-between' }]}>
            <View style={{ flex: 1 }}>
              {/* index */}
              <Text style={{ color: '#3E2D32', fontSize: 18, fontWeight: '500' }}>democrary.vote</Text>
              <Text style={{ fontSize: 18, color: '#3E2D32', marginTop: 40 }}>
                {i18n.t('Democracy.referendumIndex')}:
              </Text>
              <TextInput
                style={[
                  styles.textInputStyle,
                  {
                    marginTop: 21,
                    width: ScreenWidth * 0.9,
                    height: 49,
                    fontSize: 13,
                    backgroundColor: '#F9F9F9'
                  }
                ]}
                placeholder={String(this.state.index)}
                placeholderTextColor="#3E2D32"
                underlineColorAndroid="#ffffff00"
                editable={false}
              />
              {/* choose */}
              <Text style={{ fontSize: 18, color: '#3E2D32', marginTop: 20 }}>{i18n.t('Democracy.vote')}:</Text>
              <TextInput
                style={[
                  styles.textInputStyle,
                  {
                    marginTop: 21,
                    width: ScreenWidth * 0.9,
                    height: 49,
                    fontSize: 13,
                    backgroundColor: '#F9F9F9'
                  }
                ]}
                placeholder={String(this.state.choose)}
                placeholderTextColor="#3E2D32"
                underlineColorAndroid="#ffffff00"
                editable={false}
              />
              {/* password */}
              <Text style={{ fontSize: 18, color: '#3E2D32', marginTop: 20 }}>{i18n.t('TAB.unlockPassword')}</Text>
              <View
                style={{
                  width: ScreenWidth * 0.9,
                  flexDirection: 'row',
                  marginTop: 21,
                  alignItems: 'center'
                }}
              >
                <TextInput
                  style={[
                    styles.textInputStyle,
                    {
                      width: ScreenWidth * 0.9,
                      height: 49,
                      fontSize: 13,
                      backgroundColor: '#F9F9F9'
                    }
                  ]}
                  placeholder=""
                  placeholderTextColor="#666666"
                  underlineColorAndroid="#ffffff00"
                  secureTextEntry={this.state.ispwd}
                  onChangeText={this.onChangepassword}
                />
                <TouchableOpacity
                  style={{
                    width: 32,
                    justifyContent: 'center',
                    height: 49,
                    marginLeft: -40
                  }}
                  activeOpacity={0.7}
                  onPress={this.lookpwd}
                >
                  <Image style={{ tintColor: '#AAAAAA' }} source={require('../../../assets/images/public/eye.png')} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </RNKeyboardAvoidView>
        {/* Cancel or nominate */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 69
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
              backgroundColor: '#7AD52A',
              height: 49,
              width: (ScreenWidth - 50) / 2
            }}
            activeOpacity={0.7}
            onPress={this.Cancel}
          >
            <Text style={styles.choessText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
              backgroundColor: '#F14B79',
              marginLeft: 10,
              height: 49,
              width: (ScreenWidth - 50) / 2
            }}
            activeOpacity={0.7}
            onPress={() => {
              doubleClick(this.Vote)
            }}
          >
            <Text style={styles.choessText}>Vote</Text>
          </TouchableOpacity>
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
    backgroundColor: '#FFF'
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
  nominate_view: {
    backgroundColor: '#fff',
    marginTop: 40,
    alignSelf: 'center',
    width: ScreenWidth,
    borderRadius: ScreenHeight / 100,
    paddingHorizontal: 20
  },
  title_b: {
    color: '#3E2D32',
    fontSize: 18,
    fontWeight: '500'
  },
  textInputStyle: {
    paddingVertical: 0,
    height: ScreenHeight / 23,
    width: ScreenWidth * 0.65,
    borderColor: '#97BEC7',
    borderRadius: ScreenHeight / 200,
    paddingLeft: ScreenHeight / 100,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
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
export default Vote
