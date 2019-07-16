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
import { Text, View, Image, TouchableOpacity, RefreshControl, ScrollView } from 'react-native'
import { Method } from '@polkadot/types'
import { formatBalance } from '@polkadot/util'
import { VictoryPie } from 'victory-native'
import { observer, inject } from 'mobx-react'
import { ScreenWidth, ScreenHeight } from '../util/Common'
import polkadotAPI from '../util/polkadotAPI'
import i18n from '../locales/i18n'

@inject('rootStore')
@observer
class Active extends Component {
  constructor(props) {
    super(props)
    this.state = {
      referendums: [],
      Actives_Nofixed: [],
      Actives_Nofixedvalue: [],
      Actives_Title: [],
      votingCountdown: 0,
      votingIndex: [],
      votingState: [],
      votingStateIndex: []
    }
    this.votingState = this.votingState.bind(this)
    this.Nay = this.Nay.bind(this)
    this.Aye = this.Aye.bind(this)
    this.NayNumber = this.NayNumber.bind(this)
    this.AyeNumber = this.AyeNumber.bind(this)
  }

  /**
   * @description 根据投票信息获取 Nay balance | Get Nay balance based on the voting information.
   * @param {Object} votingState 投票信息 | voting information.
   */
  Nay(votingState) {
    let balance = 0
    for (let i = 0; i < votingState.msg.length; i++) {
      if (JSON.stringify(votingState.msg[i].vote) == '"0x00"') {
        balance = balance + Number(votingState.msg[i].balance)
      }
    }
    return balance
  }

  /**
   * @description 根据投票信息获取 NayNumber | Get NayNumber based on the voting information.
   * @param {Object} votingState 投票信息 | voting information.
   */
  NayNumber(votingState) {
    let NayNumber = 0
    for (let i = 0; i < votingState.msg.length; i++) {
      if (JSON.stringify(votingState.msg[i].vote) == '"0x00"') {
        NayNumber = NayNumber + 1
      }
    }
    return NayNumber
  }

  /**
   * @description 根据投票信息获取 Aye balance | Get Aye balance based on the voting information.
   * @param {Object} votingState 投票信息 | voting information.
   */
  Aye(votingState) {
    let balance = 0
    for (let i = 0; i < votingState.msg.length; i++) {
      if (JSON.stringify(votingState.msg[i].vote) == '"0xff"') {
        balance = balance + Number(votingState.msg[i].balance)
      }
    }
    return balance
  }

  /**
   * @description 根据投票信息获取AyeNumber | Get AyeNumber based on the voting information.
   * @param {Object} votingState 投票信息 | voting information.
   */
  AyeNumber(votingState) {
    let AyeNumber = 0
    for (let i = 0; i < votingState.msg.length; i++) {
      if (JSON.stringify(votingState.msg[i].vote) == '"0xff"') {
        AyeNumber = AyeNumber + 1
      }
    }
    return AyeNumber
  }

  /**
   * @description 获取所有的投票信息 | Get all the voting information.
   */
  votingState() {
    ;(async () => {
      this.state.votingState = []
      let ifNewIndex = false
      let l = 0
      for (let i = 0; i < this.state.votingIndex.length; i++) {
        await polkadotAPI.referendumVotesFor(this.state.votingIndex[i], result => {
          if (result[0] != null) {
            if (this.state.votingState[0] != null) {
              for (let k = 0; k < this.state.votingState.length; k++) {
                if (this.state.votingState[k][0].referendumId == result[0].referendumId) {
                  this.state.votingState[k] = result
                  l--
                  break
                } else if (l == this.state.votingState.length) {
                  ifNewIndex = true
                  l = 0
                  break
                }
                l++
              }
              if (ifNewIndex == true) {
                this.state.votingState.push(result)
                ifNewIndex = false
              }
              this.setState({})
            } else {
              this.state.votingState.push(result)
            }
          }
        })
      }
    })()
  }

  /**
   * @description 初始化页面 加载相关数据 | Initializes page load related data.
   */
  load() {
    ;(async () => {
      await polkadotAPI.bestNumber(bestNumber => {
        this.setState({ votingCountdown: bestNumber })
      })
      await polkadotAPI.referendums(result => {
        this.setState({
          referendums: [],
          Actives_Nofixed: [],
          Actives_Nofixedvalue: [],
          Actives_Title: [],
          votingIndex: [],
          votingState: []
        })
        result.map((item, index) => {
          let info = item.unwrapOr(null)
          try {
            if (info.proposal.args.proposal) {
              info = info.proposal.args
            }
          } catch (e) {}
          if (info) {
            let { meta, method, section } = Method.findFunction(info.proposal.callIndex)
            let have = 0
            this.state.Actives_Title.push({ section: section, method: method })
            this.state.Actives_Nofixedvalue.push(info.proposal.args)
            this.state.Actives_Nofixed.push(meta.args)
            this.state.referendums.push(info)
            this.state.votingIndex.push(info.index)
            if (have == 0) {
              this.state.votingState.push({ index: info.index, msg: [] })
            }
            const index = info.index
            polkadotAPI.referendumVotesFor(index, result => {
              this.props.rootStore.stateStore.have = 0
              for (let i = 0; i < this.state.votingState.length; i++) {
                if (this.state.votingState[i].index == index) {
                  this.props.rootStore.stateStore.have = 1
                  this.state.votingState[i].msg = result
                  this.setState({})
                }
              }
            })
          }
        })
      })
    })()
  }

  componentWillMount() {
    this.load()
  }

  /**
   * @description 刷新 | Refresh.
   */
  refresh() {
    this.setState({
      isrefresh: true
    })
    this.load()
    setTimeout(() => {
      this.setState({
        isrefresh: false
      })
    }, 2000)
  }

  render() {
    return (
      <View style={{ flex: 1, width: ScreenWidth, marginBottom: 20 }}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.isrefresh}
              onRefresh={this.refresh.bind(this)}
              progressViewOffset={89}
            />
          }
        >
          {this.state.referendums[0] == null || this.props.num == 0 ? (
            <View
              style={{
                marginTop: ScreenHeight / 20,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={{ fontSize: ScreenWidth / 25, color: '#696969' }}>{i18n.t('Democracy.noReferendums')}</Text>
            </View>
          ) : (
            this.state.referendums.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    width: ScreenWidth - 40,
                    marginLeft: 20,
                    borderRadius: 5,
                    backgroundColor: '#fff',
                    marginTop: 20,
                    alignItems: 'center',
                    justifyContent: 'center'
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
                        <Text
                          style={{
                            fontSize: 14,
                            color: '#222222',
                            fontWeight: 'bold'
                          }}
                        >
                          {this.state.Actives_Title[index].section + '.' + this.state.Actives_Title[index].method}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginVertical: 13,
                            alignItems: 'center'
                          }}
                        >
                          <Image
                            style={{
                              height: ScreenHeight / 50,
                              width: ScreenHeight / 50,
                              resizeMode: 'contain'
                            }}
                            source={require('../assets/images/staking/Demccrscy_time_icon.png')}
                          />
                          <Text
                            style={{
                              color: '#90BD5B',
                              fontSize: 14,
                              marginLeft: 6
                            }}
                          >
                            {Number(item.end) - Number(this.state.votingCountdown) - 1}
                          </Text>
                          <Text style={{ color: '#90BD5B', fontSize: 14 }}> {i18n.t('Democracy.blocksEnd')}</Text>
                        </View>
                        {this.state.Actives_Nofixed[index].map((itemNo, indexNo) => {
                          return (
                            <View key={indexNo}>
                              <Text style={{ color: '#999999', fontSize: 13 }}>
                                {itemNo.name + ' : ' + itemNo.type}
                              </Text>
                              <View
                                style={{
                                  borderRadius: 5,
                                  borderWidth: 1,
                                  borderColor: '#E5E5E5',
                                  marginTop: 6,
                                  justifyContent: 'center',
                                  height: 25,
                                  marginBottom: 20,
                                  backgroundColor: '#F9F9F9'
                                }}
                              >
                                <Text
                                  style={{
                                    paddingHorizontal: 7,
                                    color: '#666666',
                                    fontSize: 13
                                  }}
                                  ellipsizeMode="middle"
                                  numberOfLines={1}
                                >
                                  {String(this.state.Actives_Nofixedvalue[index][indexNo])}
                                </Text>
                              </View>
                            </View>
                          )
                        })}
                      </View>
                      <View style={{ width: 87, alignItems: 'flex-end' }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#222222'
                          }}
                        >
                          {'#' + item.index}
                        </Text>
                      </View>
                    </View>
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

                    {this.Aye(this.state.votingState[index]) == 0 &&
                    this.NayNumber(this.state.votingState[index]) == 0 ? (
                      <View />
                    ) : (
                      <View>
                        <View>
                          <Text
                            style={{
                              fontSize: 14,
                              color: '#3F3F3F',
                              marginBottom: 20
                            }}
                          >
                            {i18n.t('Democracy.Threshold')}
                            {': ' + item.threshold}
                          </Text>
                        </View>
                        <View
                          style={{
                            width: ScreenWidth - 81,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <VictoryPie
                            padding={{ top: 0, left: 0 }}
                            colorScale={['#7AD52A', '#F14B79']}
                            innerRadius={ScreenWidth / 30}
                            data={[
                              {
                                x: 1,
                                y: this.Aye(this.state.votingState[index])
                              },
                              {
                                x: 2,
                                y: this.Nay(this.state.votingState[index])
                              }
                            ]}
                            height={ScreenWidth / 5.86}
                            width={ScreenWidth / 5.86}
                          />
                        </View>
                        <View
                          style={{
                            width: ScreenWidth - 81,
                            alignItems: 'center',
                            marginTop: 12
                          }}
                        >
                          <View style={{ flexDirection: 'row', flex: 1 }}>
                            <View
                              style={{
                                width: 21,
                                height: 11,
                                borderRadius: 6,
                                backgroundColor: '#90ED3F'
                              }}
                            />
                            <Text
                              style={{
                                marginLeft: ScreenWidth / 100,
                                fontSize: ScreenWidth / 45
                              }}
                            >
                              {i18n.t('Democracy.Aye')}
                              {' ' + formatBalance(this.Aye(this.state.votingState[index]))}
                            </Text>
                            <Text
                              style={{
                                marginLeft: ScreenWidth / 80,
                                fontSize: ScreenWidth / 45,
                                color: '#7ad52a'
                              }}
                            >
                              {(
                                (this.Aye(this.state.votingState[index]) /
                                  (this.Aye(this.state.votingState[index]) + this.Nay(this.state.votingState[index]))) *
                                100
                              ).toFixed(2) + '%'}
                            </Text>
                            <Text style={{ fontSize: ScreenWidth / 45 }}>
                              {'(' + this.AyeNumber(this.state.votingState[index]) + ')'}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              flex: 1,
                              marginTop: 20
                            }}
                          >
                            <View
                              style={{
                                width: 21,
                                height: 11,
                                borderRadius: 6,
                                backgroundColor: '#F14B79'
                              }}
                            />
                            <Text
                              style={{
                                marginLeft: ScreenWidth / 100,
                                fontSize: ScreenWidth / 45
                              }}
                            >
                              {i18n.t('Democracy.Nay')}
                              {' ' + formatBalance(this.Nay(this.state.votingState[index]))}
                            </Text>
                            <Text
                              style={{
                                marginLeft: ScreenWidth / 80,
                                fontSize: ScreenWidth / 45,
                                color: '#fb3232'
                              }}
                            >
                              {(
                                (this.Nay(this.state.votingState[index]) /
                                  (this.Aye(this.state.votingState[index]) + this.Nay(this.state.votingState[index]))) *
                                100
                              ).toFixed(2) + '%'}
                            </Text>
                            <Text style={{ fontSize: ScreenWidth / 45 }}>
                              {'(' + this.NayNumber(this.state.votingState[index]) + ')'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}

                    {/* Nay or Aye */}
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginVertical: 20
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 5,
                            backgroundColor: '#F14B79',
                            height: 40,
                            width: (ScreenWidth - 87) / 2
                          }}
                          activeOpacity={0.7}
                          onPress={() => {
                            this.props.p.navigation.navigate('Vote', {
                              choose: 'Nay',
                              index: item.index
                            })
                          }}
                        >
                          <Text style={{ fontSize: 17, color: 'white' }}>{i18n.t('Democracy.Nay')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 5,
                            backgroundColor: '#7AD52A',
                            marginLeft: 7,
                            height: 40,
                            width: (ScreenWidth - 87) / 2
                          }}
                          activeOpacity={0.7}
                          onPress={() => {
                            this.props.p.navigation.navigate('Vote', {
                              choose: 'Aye',
                              index: item.index
                            })
                          }}
                        >
                          <Text style={{ fontSize: 17, color: 'white' }}>{i18n.t('Democracy.Aye')}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              )
            })
          )}
        </ScrollView>
      </View>
    )
  }
}
export default Active
