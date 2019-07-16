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
import { Image, View, TouchableOpacity, Text } from 'react-native'
import { ScreenWidth } from '../util/Common'

export default class Header extends Component {
  /**
   * @description 返回上一页 | Go back to the previous page.
   */
  back() {
    this.props.navigation.goBack()
  }

  render() {
    const { title, rightIcon, rightPress, backPress } = this.props
    const theme = this.props.theme || 'light'
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
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={backPress ? backPress() : this.back.bind(this)}
          style={{ paddingLeft: 20, height: 44, width: 61 }}
        >
          {/* <View> */}
          <Image
            source={
              theme == 'light'
                ? require('../assets/images/Assets/sweep_code_return.png')
                : theme == 'dark' && require('../assets/images/public/About_return.png')
            }
            style={{
              width: theme == 'light' ? 11 : 16,
              marginTop: 15,
              height: 16
            }}
          />
          {/* </View> */}
        </TouchableOpacity>
        <Text
          style={{
            color: theme == 'light' ? '#FFF' : theme == 'dark' && '#3E2D32',
            fontSize: 18,
            marginLeft: -25,
            fontWeight: '700'
          }}
        >
          {title}
        </Text>
        {rightIcon ? (
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => {
              rightPress()
            }}
            activeOpacity={0.7}
          >
            <Image source={rightIcon} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={{ padding: 10 }} activeOpacity={0.7}>
            <Image style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        )}
      </View>
    )
  }
}
