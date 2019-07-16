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
import { Platform, Picker, Text, ActionSheetIOS, TouchableOpacity, Image } from 'react-native'
import i18n from '../locales/i18n'
import { doubleClick } from '../util/Common'

const defaultData = [
  {
    title: 'femto',
    value: 'femto'
  },
  {
    title: 'pico',
    value: 'pico'
  },
  {
    title: 'nano',
    value: 'nano'
  },
  {
    title: 'micro',
    value: 'micro'
  },
  {
    title: 'milli',
    value: 'milli'
  },
  {
    title: 'DOT',
    value: 'DOT'
  },
  {
    title: 'Kilo',
    value: 'Kilo'
  },
  {
    title: 'Mega',
    value: 'Mega'
  },
  {
    title: 'Giga',
    value: 'Giga'
  },
  {
    title: 'Tera',
    value: 'Tera'
  },
  {
    title: 'Peta',
    value: 'Peta'
  },
  {
    title: 'Exa',
    value: 'Exa'
  },
  {
    title: 'Zeta',
    value: 'Zeta'
  },
  {
    title: 'Yotta',
    value: 'Yotta'
  }
]
export default class RNPicker extends Component {
  /**
   * @description IOS ActionSheet
   * @param {Array} data 要展示的选项 | The options to show.
   */
  sheet(data) {
    let paramas = []
    const _this = this
    data.map(v => {
      paramas.push(v.label ? i18n.t(v.label) : v.title)
    })
    paramas.push(i18n.t('TAB.Cancel'))
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: paramas,
        cancelButtonIndex: paramas.length - 1
        // destructiveButtonIndex: 0
      },
      function(index) {
        if (index != paramas.length) {
          _this.props.onValueChange(data[index].value)
        }
      }
    )
  }

  render() {
    const { style, selectedValue, onValueChange } = this.props
    const data = this.props.data || defaultData
    let showLable = ''
    data.map(v => {
      if (v.value == selectedValue) {
        showLable = v.label ? i18n.t(v.label) : v.title
      }
    })
    return Platform.OS == 'ios' ? (
      <TouchableOpacity
        onPress={() => {
          doubleClick(this.sheet.bind(this, data))
        }}
        activeOpacity={0.7}
        style={[
          style,
          {
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 10,
            flexDirection: 'row'
          }
        ]}
      >
        <Text>{showLable}</Text>
        <Image
          source={require('../assets/images/public/addresses_nav_go.png')}
          style={{ transform: [{ rotateZ: '90deg' }], marginRight: 10 }}
        />
      </TouchableOpacity>
    ) : (
      <Picker onValueChange={onValueChange} selectedValue={selectedValue} style={style}>
        {data &&
          data.map((v, i) => <Picker.Item key={i} label={v.label ? i18n.t(v.label) : v.title} value={v.value} />)}
      </Picker>
    )
  }
}
