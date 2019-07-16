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
  Image,
  TouchableOpacity,
  TextInput,
  AsyncStorage,
  StatusBar,
  SafeAreaView,
  Alert
} from 'react-native'
import { observer, inject } from 'mobx-react'
import { ScreenWidth, ScreenHeight, doubleClick } from '../../../util/Common'
import RNKeyboardAvoidView from '../../../components/RNKeyboardAvoidView'
import Header from '../../../components/Header'
import i18n from '../../../locales/i18n'

@inject('rootStore')
@observer
class AddAddress extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      memo: '',
      address: ''
    }
    this.back = this.back.bind(this)
    this.save = this.save.bind(this)
    this.onChangeName = this.onChangeName.bind(this)
    this.onChangeMemo = this.onChangeMemo.bind(this)
    this.onChangeAddress = this.onChangeAddress.bind(this)
    this.camrea = this.camrea.bind(this)
  }

  /**
   * @description 返回|Click the back
   */
  back() {
    this.props.rootStore.stateStore.iscamera = 0
    this.props.navigation.navigate('Addresses')
  }

  /**
   * @description 切换扫描页面|Switch scan page
   */
  camrea() {
    this.props.rootStore.stateStore.tocamera = 2
    this.props.navigation.navigate('Camera')
  }

  /**
   * @description 更换名称|Change name
   * @param {String} ChangeName 更换的名称|The name to change
   */
  onChangeName(ChangeName) {
    this.setState({
      name: ChangeName
    })
  }

  /**
   * @description 更改备注|Change memo
   * @param {String} ChangeMemo 更换的备注|The memo to change
   */
  onChangeMemo(ChangeMemo) {
    this.setState({
      memo: ChangeMemo
    })
  }

  /**
   * @description 更改地址|Change address
   * @param {String} ChangeAddress 地址|Address
   */
  onChangeAddress(ChangeAddress) {
    if (this.props.rootStore.stateStore.iscamera == 1) {
      this.props.rootStore.stateStore.iscamera = 0
    }
    this.setState({
      address: ChangeAddress
    })
  }

  /**
   * @description 最后点击保存|Click the save
   */
  save() {
    if (!this.state.name || !this.state.memo || !this.state.address) {
      return Alert.alert('', i18n.t('TAB.enterInformation'))
    }
    AsyncStorage.getItem('Addresses').then(result => {
      if (result == null) {
        AsyncStorage.setItem(
          'Addresses',
          JSON.stringify([
            {
              Name: this.state.name,
              Memo: this.state.memo,
              Address: this.state.address
            }
          ])
        ).then(() => {
          Alert.alert('', i18n.t('Profile.SaveSuccess'))
          this.props.navigation.navigate('Addresses')
        })
      } else {
        if (this.state.address == '' && this.props.rootStore.stateStore.iscamera == 0) {
          Alert.alert('', i18n.t('TAB.enterInformation'))
        } else {
          let a = JSON.parse(result)
          a.push({
            Name: this.state.name,
            Memo: this.state.memo,
            Address:
              this.props.rootStore.stateStore.iscamera == 0
                ? this.state.address
                : this.props.rootStore.stateStore.QRaddress
          })
          AsyncStorage.setItem('Addresses', JSON.stringify(a)).then(() => {
            this.props.rootStore.stateStore.iscamera = 0
            this.props.navigation.navigate('Tabbed_Navigation')
          })
        }
      }
    })
  }

  render() {
    const msg = [i18n.t('Profile.Name'), i18n.t('Profile.Memo'), i18n.t('Profile.Address')]
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar
          hidden={false}
          backgroundColor="#FFF" // 状态栏背景颜色 | Status bar background color
          barStyle="dark-content" // 状态栏样式（黑字）| Status bar style (black)
        />
        {/* 标题栏 | Title bar */}
        <Header navigation={this.props.navigation} title={i18n.t('Profile.addAddresses')} theme="dark" />

        <RNKeyboardAvoidView>
          <View style={{ marginTop: 28, alignItems: 'center' }}>
            {msg.map((item, index) => {
              return (
                <View style={styles.view} key={index}>
                  {
                    <View style={[styles.inputview]}>
                      <TextInput
                        style={[
                          styles.textInputStyle,
                          {
                            width: index == 2 ? ScreenWidth - 60 : ScreenWidth - 40
                          }
                        ]}
                        placeholder={item}
                        autoCorrect={false}
                        underlineColorAndroid="#ffffff00"
                        onChangeText={
                          index == 0 ? this.onChangeName : index == 1 ? this.onChangeMemo : this.onChangeAddress
                        }
                      />
                      {index == 2 && (
                        <TouchableOpacity
                          style={{ padding: 20, marginLeft: -30 }}
                          activeOpacity={0.7}
                          onPress={this.camrea}
                        >
                          <Image
                            style={{ width: 20, height: 20 }}
                            source={require('../../../assets/images/public/addaddresses_code.png')}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  }
                </View>
              )
            })}
          </View>
        </RNKeyboardAvoidView>
        <TouchableOpacity
          style={styles.Change}
          onPress={() => {
            doubleClick(this.save)
          }}
          activeOpacity={0.7}
        >
          <Image source={require('../../../assets/images/public/addaddresses_save.png')} />
        </TouchableOpacity>
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
    justifyContent: 'center',
    height: ScreenHeight / 8
  },
  text: {
    marginLeft: ScreenWidth * 0.06,
    color: 'black',
    fontWeight: '400'
  },
  textInputStyle: {
    color: '#696969',
    width: ScreenWidth - 40,
    fontSize: ScreenHeight / 45
  },
  inputview: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 57,
    borderBottomWidth: 1,
    borderBottomColor: '#ECE2E5',
    width: ScreenWidth - 40
  },
  Change: {
    alignSelf: 'center',
    marginBottom: 80,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
export default AddAddress
