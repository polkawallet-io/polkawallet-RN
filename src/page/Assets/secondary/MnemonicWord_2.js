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
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native'
import { observer, inject } from 'mobx-react'
import { ScreenWidth, ScreenHeight, doubleClick } from '../../../util/Common'
import Header from '../../../components/Header'
import RNKeyboardAvoidView from '../../../components/RNKeyboardAvoidView'
import i18n from '../../../locales/i18n'

@inject('rootStore')
@observer
class MnemonicWord extends Component {
  /**
   * @description 下一步|The next step
   */
  Next() {
    this.props.navigation.navigate('MnemonicWord_3', {
      key: this.props.navigation.state.params.key,
      address: this.props.navigation.state.params.address
    })
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
            <Text style={{ color: '#3E2D32', fontSize: 15, marginBottom: 20 }}>{i18n.t('Assets.MWTip13')}</Text>
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
              {String(this.props.navigation.state.params.key)
                .split(' ')
                .map((v, i) => {
                  return (
                    <View style={styles.textView} key={i}>
                      <Text style={styles.text}>{v}</Text>
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
            marginBottom: 20
          }}
          activeOpacity={0.7}
          onPress={() => {
            doubleClick(this.Next.bind(this))
          }}
        >
          <Image source={require('../../../assets/images/Assets/Nextstep.png')} />
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
