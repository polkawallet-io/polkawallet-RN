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
import { Image, Dimensions } from 'react-native'

const ScreenHeight = Dimensions.get('screen').height
export default class TabBarItem extends Component {
  render() {
    return (
      <Image
        source={this.props.b1}
        style={{ tintColor: this.props.tintColor, height: ScreenHeight / 30.32, width: ScreenHeight / 30.32 }}
      />
    )
  }
}
