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
  Clipboard,
  Alert,
  AsyncStorage,
  StatusBar,
  SafeAreaView
} from 'react-native'
import { observer, inject } from 'mobx-react'
import { ScreenWidth, ScreenHeight, doubleClick } from '../../../util/Common'
import RNKeyboardAvoidView from '../../../components/RNKeyboardAvoidView'
import Header from '../../../components/Header'
import i18n from '../../../locales/i18n'

@inject('rootStore')
@observer
class AddressInformation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      is: false,
      s: 1,
      index: this.props.navigation.state.params.index
    }
    this.back = this.back.bind(this)
    this.copy = this.copy.bind(this)
    this.delete = this.delete.bind(this)
  }

  /**
   * @description 返回|Click the back
   */
  back() {
    this.props.navigation.navigate('Addresses')
  }

  /**
   * @description 复制|Click the copy
   */
  copy() {
    Clipboard.setString(this.props.rootStore.stateStore.Addresses[this.state.index].Address)
    Alert.alert('', i18n.t('TAB.CopySuccess'))
  }

  /**
   * @description 删除|Click the delete
   */
  delete() {
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
            let addresses = []
            AsyncStorage.getItem('Addresses').then(result => {
              if (result != null) {
                JSON.parse(result).map((item, index) => {
                  if (index != this.state.index) {
                    addresses.push(item)
                  }
                })
                AsyncStorage.setItem('Addresses', JSON.stringify(addresses)).then(
                  this.props.navigation.navigate('Tabbed_Navigation')
                )
              }
            })
          }
        }
      ],
      { cancelable: false }
    )
  }

  render() {
    const msg = [{ key: i18n.t('Profile.Name') }, { key: i18n.t('Profile.Memo') }, { key: i18n.t('Profile.Address') }]
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        {/* 标题栏 | Title bar */}
        <StatusBar
          hidden={false}
          backgroundColor="#FFF" // 状态栏背景颜色 | Status bar background color
          barStyle="dark-content" // 状态栏样式（黑字）| Status bar style (black)
        />
        <Header navigation={this.props.navigation} title={i18n.t('Profile.addAddresses')} theme="dark" />
        <RNKeyboardAvoidView>
          {msg.map((item, index) => {
            return (
              <View style={[styles.view]} key={index}>
                {/* <Text style={[styles.text, { fontSize: index == 2 ? ScreenHeight / 40 : ScreenHeight / 50 }]}>{item.key}</Text> */}

                <View style={styles.inputview}>
                  <View style={styles.textview}>
                    {index == 2 ? (
                      <Text
                        style={[
                          styles.textInputStyle,
                          {
                            width: index == 2 ? ScreenWidth - 60 : ScreenWidth - 40
                          }
                        ]}
                        ellipsizeMode="middle"
                        numberOfLines={1}
                      >
                        {this.props.rootStore.stateStore.Addresses[this.state.index].Address}
                      </Text>
                    ) : (
                      <Text
                        style={[
                          styles.textInputStyle,
                          {
                            width: index == 2 ? ScreenWidth - 60 : ScreenWidth - 40
                          }
                        ]}
                      >
                        {index == 0
                          ? this.props.rootStore.stateStore.Addresses[this.state.index].Name
                          : this.props.rootStore.stateStore.Addresses[this.state.index].Memo}
                      </Text>
                    )}
                  </View>
                  {index == 2 && (
                    <TouchableOpacity
                      onPress={() => {
                        doubleClick(this.copy)
                      }}
                      activeOpacity={0.7}
                    >
                      <Image
                        // style={styles.inputimage}
                        style={{ width: 20, height: 22 }}
                        source={require('../../../assets/images/public/copy.png')}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )
          })}
        </RNKeyboardAvoidView>
        <View style={styles.delete}>
          <TouchableOpacity
            onPress={() => {
              doubleClick(this.delete)
            }}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: ScreenHeight / 50, color: 'red' }}>{i18n.t('Profile.DeleteAddress')}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'center',
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
  },
  delete: {
    height: ScreenHeight / 8,
    width: ScreenWidth,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
export default AddressInformation
