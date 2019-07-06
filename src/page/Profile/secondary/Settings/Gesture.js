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
import { AsyncStorage, SafeAreaView, StatusBar, View } from 'react-native'
import { NavigationActions, StackActions } from 'react-navigation'
import PasswordGesture from 'react-native-gesture-password'
import { observer, inject } from 'mobx-react'
import { ScreenWidth } from '../../../../util/Common'
import i18n from '../../../../locales/i18n'

@inject('rootStore')
@observer
class Gesture extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 'right',
      message: this.props.rootStore.stateStore.GestureState == 0 ? 'Please set the gesture password' : 'Password'
    }
    this.onStart = this.onStart.bind(this)
    this.onEnd = this.onEnd.bind(this)
  }

  /**
   * @description 滑动结束|End of the slide
   * @param {String} password 密码|password
   */
  onEnd(password) {
    // 第一次设置密码
    // First time to set the gesture password
    if (this.props.rootStore.stateStore.GestureState == 0) {
      this.props.rootStore.stateStore.GestureState = 1
      this.props.rootStore.stateStore.Gesture = password
      this.setState({
        status: 'right',
        message: i18n.t('Profile.confirmGesture')
      })
    } else {
      // 确认上一次输入密码
      // Confirm the gesture password
      if (this.props.rootStore.stateStore.GestureState == 1) {
        // 确认成功
        // Confirm success
        if (password == this.props.rootStore.stateStore.Gesture) {
          this.props.rootStore.stateStore.GestureState = 2
          this.props.rootStore.stateStore.Gesture = password
          AsyncStorage.setItem('Gesture', password)
          this.setState({
            status: 'right',
            message: i18n.t('Profile.gestureSuccess')
          })
          setTimeout(() => {
            let resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: 'Settings' })]
            })
            this.props.navigation.dispatch(resetAction)
          }, 500)
        } else {
          // 确认失败
          // Confirm faild
          this.props.rootStore.stateStore.GestureState = 0
          this.setState({
            status: 'wrong',
            message: i18n.t('Profile.gestureFailed')
          })
        }
      } else {
        // 验证密码
        // Verify gesture password
        if (this.props.rootStore.stateStore.GestureState == 2) {
          if (password == this.props.rootStore.stateStore.Gesture) {
            this.setState({
              status: 'right',
              message: i18n.t('TAB.PasswordCorrect')
            })
            setTimeout(() => {
              let resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Tabbed_Navigation' })]
              })
              this.props.navigation.dispatch(resetAction)
            }, 500)
          } else {
            this.setState({
              status: 'wrong',
              message: i18n.t('TAB.PasswordMistake')
            })
          }
        }
      }
    }
  }

  /**
   * @description 开始滑动|Start to slide
   */
  onStart() {
    this.setState({
      status: 'normal',
      message: i18n.t('Profile.inputPWD')
    })
  }

  /**
   * @description 重置密码|Reset password
   */
  onReset() {
    this.setState({
      status: 'normal',
      message: i18n.t('Profile.inputPWD_d')
    })
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar
          hidden={false}
          backgroundColor="#FFF" // 状态栏背景颜色 | Status bar background color
          barStyle="dark-content" // 状态栏样式（黑字）| Status bar style (black)
        />
        <View
          style={{
            width: ScreenWidth,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f00'
          }}
        >
          <PasswordGesture
            status={this.state.status}
            message={this.state.message}
            style={{ backgroundColor: '#f00', width: ScreenWidth }}
            textStyle={{ fontSize: 25 }}
            normalColor="blue"
            rightColor="green"
            wrongColor="red"
            outerCircle={true}
            innerCircle={true}
            onStart={() => this.onStart()}
            onEnd={password => this.onEnd(password)}
          />
        </View>
      </SafeAreaView>
    )
  }
}
export default Gesture
