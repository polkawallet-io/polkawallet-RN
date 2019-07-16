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
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
  InteractionManager
} from 'react-native'
import { NavigationActions, StackActions } from 'react-navigation'
import { observer, inject } from 'mobx-react'
import { ScreenWidth, ScreenHeight, doubleClick } from '../../../util/Common'
import Header from '../../../components/Header'
import RNKeyboardAvoidView from '../../../components/RNKeyboardAvoidView'
import polkadotAPI from '../../../util/polkadotAPI'
import i18n from '../../../locales/i18n'
/**
 * @description 返回min和max之间的一个随机数，包括min和max|Returns a random number between min and Max, including min and Max
 * @param {Num} min 最小值|The min value
 * @param {Num} max 最大值|The max value
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min) // +1是保证可以取到上限值
}
/**
 * @description 洗牌函数|Shuffle function
 * @param {Array} arr 要重组的数组|Array to be reorganized
 */
function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}
@inject('rootStore')
@observer
class MnemonicWord extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectWM: [], // 展示选择的WM | Show the selected WM
      WM: [], // 展示的WM | The WM to show
      oldWM: String(this.props.navigation.state.params.key).split(' '), // 预留判断的 | Reserved for judgment
      selectTag: false // 判断标识。false不匹配，true匹配 | Determine the identity. False does not match, true does
    }
  }

  /**
   * @description 提交|Submit
   */
  Next() {
    if (this.state.selectWM.length == this.state.oldWM.length && this.state.selectTag) {
      // 创建查询每个账户的进程
      // Create a process to query each account
      ;(async () => {
        await polkadotAPI.freeBalance(this.state.address, balance => {
          let _address = this.state.address
          this.props.rootStore.stateStore.have = 0
          this.props.rootStore.stateStore.balances.map((item, index) => {
            if (item.address == _address) {
              this.props.rootStore.stateStore.have = 1
              this.props.rootStore.stateStore.balances[index].balance = balance
            }
          })
          if (this.props.rootStore.stateStore.have == 0) {
            this.props.rootStore.stateStore.balances.push({
              address: _address,
              balance: balance
            })
          }
        })
      })()
      let resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Tabbed_Navigation' })]
      })
      this.props.navigation.dispatch(resetAction)
    } else {
      Alert.alert('', i18n.t('Assets.MWTip15'))
    }
  }

  /**
   * 根据数组获取完整的str|Get the full str from the array
   * @param {Array} arr 要获取的数组|Array to get
   */
  getEndArr(arr) {
    let str = ''
    for (let i = 0; i < arr.length; i++) {
      str += arr[i].text
    }
    return str
  }

  /**
   * @description 校验选择的正确性|Verify the correctness of the selection
   */
  checkArr() {
    this.setState({
      selectTag: this.getEndArr(this.state.selectWM) == this.state.oldWM.join('')
    })
  }

  /**
   * @description 添加上方展示的Word Mnemonic|Add Word Mnemonic shown above
   * @param {Object} one 添加项|Add item
   */
  addWM(one) {
    this.changeWM(one)
    let selectWM = this.state.selectWM
    selectWM.push(one)
    this.setState(
      {
        selectWM
      },
      () => {
        if (this.state.selectWM.length == this.state.oldWM.length) {
          this.checkArr()
        } else {
          this.setState({
            selectTag: false
          })
        }
      }
    )
  }

  /**
   * @description 删除上方展示的Word Mnemonic|Remove Word Mnemonic shown above
   * @param {Object} one 删除项|Remove item
   */
  removeWM(one) {
    this.changeWM(one)
    let selectWM = this.state.selectWM
    for (let i = 0; i < selectWM.length; i++) {
      if (selectWM[i].text == one.text) {
        selectWM.splice(i, 1)
      }
    }
    this.setState({
      selectWM,
      selectTag: false
    })
  }

  /**
   * @description 改变下方展示的Word Mnemonic|Change the Word Mnemonic shown below
   * @param {Object} one 改变项|Change item
   */
  changeWM(one) {
    let WM = this.state.WM
    for (let i = 0; i < WM.length; i++) {
      if (WM[i].text == one.text) {
        WM[i].tap = !WM[i].tap
      }
    }
    this.setState({
      WM
    })
  }

  /**
   * @description 选择空白的WM|Select the blank WM
   */
  setWM() {
    let WM = String(this.props.navigation.state.params.key).split(' ')
    WM = shuffle(WM)
    for (let i = 0; i < WM.length; i++) {
      WM[i] = {
        text: WM[i],
        tap: true
      }
    }
    this.setState({
      WM
    })
  }

  componentWillMount() {
    // 通过addListener开启监听，didFocus RN 生命周期 页面获取焦点
    // Start listening through addListener, didFocus RN lifecycle, page gets focus
    this._didBlurSubscription = this.props.navigation.addListener('didFocus', payload => {
      this.setWM()
    })
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setWM()
    })
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
          backgroundColor="#FFF" // 状态栏背景颜色 | Status bar background color | Status bar background color
          barStyle="dark-content" // 状态栏样式（黑字）| Status bar style (black)| Status bar style (black)
        />
        {/* 标题栏 | Title bar */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderBottomWidth: 0.5,
            borderBottomColor: '#ECE2E5'
          }}
        >
          <Header theme="dark" navigation={this.props.navigation} />
        </View>
        <RNKeyboardAvoidView>
          <View style={{ width: ScreenWidth - 40, marginLeft: 20 }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text
                style={{
                  color: '#3E2D32',
                  fontSize: 18,
                  fontWeight: '600',
                  marginTop: 39,
                  marginBottom: 20
                }}
              >
                {i18n.t('Assets.MWTip2')}
              </Text>
            </View>
            <Text style={{ color: '#3E2D32', fontSize: 15, marginBottom: 20 }}>{i18n.t('Assets.MWTip14')}</Text>
            {!this.state.selectTag && this.state.selectWM.length == this.state.oldWM.length && (
              <View
                style={{
                  backgroundColor: '#FBAD31',
                  width: ScreenWidth - 40,
                  paddingVertical: 13,
                  borderRadius: 6
                }}
              >
                <Text style={{ color: '#FFF', fontSize: 15, paddingHorizontal: 13 }}>{i18n.t('Assets.MWTip15')}</Text>
              </View>
            )}
            {/* 虚线 | Dotted line */}
            {this.state.selectWM.length > 0 && (
              <View
                style={{
                  flex: 1,
                  borderWidth: 0.5,
                  marginVertical: ScreenHeight / 70,
                  borderStyle: 'dashed',
                  borderRadius: 0.01,
                  borderColor: '#C0C0C0'
                }}
              />
            )}
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                paddingBottom: 20
              }}
            >
              {this.state.selectWM.map((v, i) => {
                return (
                  <TouchableOpacity
                    style={styles.textView}
                    key={i}
                    activeOpacity={0.7}
                    onPress={() => {
                      doubleClick(this.removeWM.bind(this, v))
                    }}
                  >
                    <Text style={styles.text}>{v.text}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
            {/* 虚线 | Dotted line */}
            <View
              style={{
                flex: 1,
                borderWidth: 0.5,
                marginVertical: ScreenHeight / 70,
                borderStyle: 'dashed',
                borderRadius: 0.01,
                borderColor: '#C0C0C0'
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                paddingBottom: 20
              }}
            >
              {this.state.WM.map((v, i) => {
                return v.tap ? (
                  <TouchableOpacity
                    style={styles.textView}
                    key={i}
                    activeOpacity={0.7}
                    onPress={() => {
                      doubleClick(this.addWM.bind(this, v))
                    }}
                  >
                    <Text style={styles.text}>{v.text}</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.textView, { backgroundColor: '#EEEEEE' }]} key={i}>
                    <Text style={styles.text}>{v.text}</Text>
                  </View>
                )
              })}
            </View>
            {/* 虚线 | Dotted line */}
            <View
              style={{
                flex: 1,
                borderWidth: 0.5,
                marginVertical: ScreenHeight / 70,
                borderStyle: 'dashed',
                borderRadius: 0.01,
                borderColor: '#C0C0C0'
              }}
            />
          </View>
        </RNKeyboardAvoidView>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
            backgroundColor: '#F14B79',
            height: 48,
            borderRadius: 6,
            width: ScreenWidth - 40,
            marginLeft: 20
          }}
          activeOpacity={0.7}
          onPress={() => {
            doubleClick(this.Next.bind(this))
          }}
        >
          <Text style={{ color: '#FFF', fontSize: 20 }}>Complete</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  textView: {
    height: 30,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 2,
    marginTop: 14,
    marginRight: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: '#3E2D32',
    fontSize: 15
  }
})
export default MnemonicWord
