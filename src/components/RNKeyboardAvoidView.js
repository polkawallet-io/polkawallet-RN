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
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native'

export default class RNKeyboardAvoidView extends Component {
  render() {
    return Platform.OS == 'ios' ? (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView>{this.props.children}</ScrollView>
      </KeyboardAvoidingView>
    ) : (
      <ScrollView>{this.props.children}</ScrollView>
    )
  }
}
