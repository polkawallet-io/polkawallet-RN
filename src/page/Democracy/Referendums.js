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
import { Text, View, TouchableOpacity } from 'react-native'
import { observer, inject } from 'mobx-react'
import Active from '../../components/Active'
import History from './secondary/History'
import { ScreenWidth } from '../../util/Common'
import i18n from '../../locales/i18n'

@inject('rootStore')
@observer
class Referendums extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTap: 1
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            height: 44,
            width: ScreenWidth,
            flexDirection: 'row',
            backgroundColor: '#FFF'
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ justifyContent: 'center', alignItems: 'center' }}
            onPress={() => {
              this.setState({
                activeTap: 1
              })
            }}
          >
            <View style={{ paddingHorizontal: 20 }}>
              <Text
                style={{
                  color: this.state.activeTap == 1 ? '#F14B79' : '#3E2D32',
                  borderBottomWidth: 2,
                  fontSize: 15,
                  borderBottomColor: this.state.activeTap == 1 ? '#F14B79' : '#fff',
                  height: 44,
                  lineHeight: 44
                }}
              >
                {i18n.t('Democracy.Active')}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ justifyContent: 'center', alignItems: 'center' }}
            activeOpacity={0.7}
            onPress={() => {
              this.setState({
                activeTap: 2
              })
            }}
          >
            <View style={{ paddingHorizontal: 20 }}>
              <Text
                style={{
                  color: this.state.activeTap == 2 ? '#F14B79' : '#3E2D32',
                  borderBottomWidth: 2,
                  fontSize: 15,
                  borderBottomColor: this.state.activeTap == 2 ? '#F14B79' : '#fff',
                  height: 44,
                  lineHeight: 44
                }}
              >
                {i18n.t('Democracy.History')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {this.state.activeTap == 1 ? <Active num={this.props.num} p={this.props.p} /> : <History />}
      </View>
    )
  }
}
export default Referendums
