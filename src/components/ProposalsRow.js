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
import { Text, View, Image } from 'react-native'
import { formatBalance } from '@polkadot/util'
import { ScreenWidth, ScreenHeight } from '../util/Common'
import i18n from '../locales/i18n'

export default class ProposalsRow extends Component {
  render() {
    const { publicProps, Actives_Nofixed, Actives_Title, Actives_Nofixedvalue, launchCountdown, balances } = this.props
    return publicProps.map((item, index) => (
      <View
        key={index}
        style={{
          width: ScreenWidth - 40,
          marginLeft: 20,
          borderRadius: 5,
          backgroundColor: '#FFF',
          marginTop: 20,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <View style={{ width: ScreenWidth - 81 }}>
          <View
            style={{
              width: ScreenWidth - 81,
              flexDirection: 'row',
              marginTop: 22
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, color: '#222222', fontWeight: 'bold' }}>
                {`${Actives_Title[index].section}.${Actives_Title[index].method}`}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: 13,
                  alignItems: 'center'
                }}
              >
                <Image
                  source={require('../assets/images/staking/Demccrscy_time_icon.png')}
                  style={{
                    height: ScreenHeight / 50,
                    width: ScreenHeight / 50,
                    resizeMode: 'contain'
                  }}
                />
                <Text style={{ color: '#90BD5B', fontSize: 14, marginLeft: 6 }}>{launchCountdown + 9 * index}</Text>
                <Text style={{ color: '#90BD5B', fontSize: 14 }}> {i18n.t('Democracy.blocksLaunch')}</Text>
              </View>
              {Actives_Nofixed[index].map((itemNo, indexNo) => (
                <View key={indexNo}>
                  <Text style={{ color: '#999999', fontSize: 13 }}>{`${itemNo.name} : ${itemNo.type}`}</Text>
                  <View
                    style={{
                      borderRadius: 2,
                      marginTop: 6,
                      justifyContent: 'center',
                      height: 25,
                      marginBottom: 20,
                      backgroundColor: '#F0F0F0'
                    }}
                  >
                    <Text
                      ellipsizeMode="middle"
                      numberOfLines={1}
                      style={{
                        paddingHorizontal: 7,
                        color: '#666666',
                        fontSize: 13
                      }}
                    >
                      {String(Actives_Nofixedvalue[index][indexNo]) || ''}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={{ width: 87, alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#222222' }}>{`#${item[0]}`}</Text>
            </View>
          </View>
          {/* 虚线 | Dotted line */}
          <View
            style={{
              height: 0,
              borderWidth: 0.4,
              borderColor: '#E5E5E5',
              borderStyle: 'dashed',
              borderRadius: 0.1,
              marginBottom: 20
            }}
          />
          <View style={{ flexDirection: 'row', width: ScreenWidth - 81 }}>
            {/* 确定个数 | Determine the number */}
            <View style={{ width: ScreenWidth - 81, flex: 1 }}>
              <View style={{ marginTop: ScreenHeight / 70 }}>
                <Text style={{ color: '#696969', fontSize: ScreenWidth / 30 }}>{i18n.t('Democracy.depositors')}</Text>
                <View
                  style={{
                    borderRadius: 2,
                    marginTop: 6,
                    justifyContent: 'center',
                    height: 25,
                    backgroundColor: '#F0F0F0'
                  }}
                >
                  <Text
                    ellipsizeMode="middle"
                    numberOfLines={1}
                    style={{
                      color: '#666666',
                      fontSize: 13,
                      paddingHorizontal: 7
                    }}
                  >
                    {String(item[2] || 0)}
                  </Text>
                </View>
              </View>
              <View style={{ marginTop: 15, marginBottom: 20 }}>
                <Text style={{ color: '#696969', fontSize: ScreenWidth / 30 }}>{i18n.t('Democracy.balance')}</Text>
                <View
                  style={{
                    borderRadius: 2,
                    marginTop: 6,
                    justifyContent: 'center',
                    height: 25,
                    backgroundColor: '#F0F0F0'
                  }}
                >
                  <Text
                    ellipsizeMode="middle"
                    numberOfLines={1}
                    style={{
                      width: ScreenWidth / 3.2,
                      marginLeft: ScreenWidth / 40,
                      color: '#666666',
                      fontSize: ScreenWidth / 30
                    }}
                  >
                    {String(formatBalance(balances[index] || 0))}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ width: 87 }} />
          </View>
        </View>
      </View>
    ))
  }
}
