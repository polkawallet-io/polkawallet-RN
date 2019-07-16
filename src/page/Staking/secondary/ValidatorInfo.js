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
  ScrollView,
  Image,
  StatusBar,
  Clipboard,
  SafeAreaView,
  Alert,
  InteractionManager
} from 'react-native'
import Echarts from 'native-echarts'
import Identicon from 'polkadot-identicon-react-native'
import { formatBalance } from '@polkadot/util'
import moment from 'moment/moment'
import { observer, inject } from 'mobx-react'
import Header from '../../../components/Header'
import { formatData, ScreenWidth, ScreenHeight, axios, doubleClick } from '../../../util/Common'
import i18n from '../../../locales/i18n'
import polkadotAPI from '../../../util/polkadotAPI'

@inject('rootStore')
@observer
class ValidatorInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      address: this.props.navigation.state.params.address,
      titlebottomAA: 1,
      nominators: [],
      nominatorsBalance: [],
      validatorBalances: 0,
      StakingNextPage: false,
      StakingRecords: {},
      pageNum: 1,
      inNominators: false,
      showBtn: false,
      StakingOption: {
        title: {
          text: i18n.t('Staking.StakingOption'),
          textStyle: {
            color: '#3E2D32',
            fontSize: 16
          },
          padding: [0, 0, 0, 0]
        },
        tooltip: {},
        legend: {
          data: ['']
        },
        grid: {
          left: 5
        },
        xAxis: {
          axisLine: {
            show: false
          },
          data: []
        },
        yAxis: {
          axisLine: {
            show: false
          },
          position: 'right'
        },
        color: ['#FF5080'],
        series: [
          {
            type: 'line',
            smooth: true,
            data: []
          }
        ]
      }
    }
    this.back = this.back.bind(this)
    this.nominate = this.nominate.bind(this)
    this.Unnominate = this.Unnominate.bind(this)
    this.copy = this.copy.bind(this)
    this.Loadmore = this.Loadmore.bind(this)
  }

  /**
   * @description 返回|Click back
   */
  back() {
    this.props.navigation.navigate('Tabbed_Navigation')
  }

  /**
   * @description 进入Nominate页面|Enter the Nominate page
   */
  nominate() {
    this.props.rootStore.stateStore.tonominate = 1
    this.props.navigation.navigate('Nominate', { address: this.state.address })
  }

  /**
   * @description 进入Unnominate页面|Enter the Unnominate page
   */
  Unnominate() {
    this.props.navigation.navigate('Unnominate')
  }

  /**
   * @description 返回
   */
  async copy() {
    Clipboard.setString(this.state.address)
    Alert.alert('', i18n.t('TAB.CopySuccess'))
  }

  /**
   * @description 加载更多|Load for more info
   */
  Loadmore() {
    const REQUEST_URL = 'https://api.polkawallet.io:8080/staking_list_alexander'
    const params = `{"user_address":"${this.state.address}","pageNum":"${this.state.pageNum}","pageSize":"10"}`
    axios(REQUEST_URL, params).then(result => {
      this.setState({
        StakingNextPage: result.staking_list_alexander.hasNextPage
      })
      const _StakingRecords = this.state.StakingRecords
      result.staking_list_alexander.list.map(item => {
        _StakingRecords.staking_list_alexander.list.push(item)
      })
      this.setState({
        StakingRecords: _StakingRecords
      })
    })
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      ;(async () => {
        // 获取选中账户的Staking Records
        // Get Staking Records for the selected account
        const REQUEST_URL = 'https://api.polkawallet.io:8080/staking_list_alexander'
        const params = `{"user_address":"${this.state.address}","pageNum":"1","pageSize":"10"}`
        axios(REQUEST_URL, params)
          .then(result => {
            this.setState({
              StakingNextPage: result.staking_list_alexander.hasNextPage,
              StakingRecords: result
            })
          })
          .catch()
        const info = await polkadotAPI.accountInfo(this.state.address)
        const nominators = formatData(info).stakers.others
        this.setState({
          nominators,
          validatorBalances: formatData(info).stakers.own || formatData(info).stakingLedger.active
        })
        let showBtn = false
        let address = await polkadotAPI.bonded(
          this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address
        )
        address = String(address)
        let controller = ''
        if (!address) {
          controller = await polkadotAPI.ledger(
            this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address
          )
          controller = String(controller)
          if (controller && controller != null && controller != 'null') {
            showBtn = true
            this.setState({
              showBtn: true
            })
          }
        }
        let tag = false
        console.log(nominators)
        if (showBtn) {
          for (let i = 0; i < nominators.length; i++) {
            if (formatData(nominators[i]).who == JSON.parse(controller).stash) {
              tag = true
            }
          }
        }
        this.setState(
          {
            inNominators: tag
          },
          () => {
            console.log(this.state.inNominators)
          }
        )
      })()
      this.getStakingOption(this.props.navigation.state.params.address)
    })
  }

  /**
   * @description 获取选中账户staking折线图数据|Get the data of staking chart of the selected account
   * @param {String} address 地址|Address
   */
  getStakingOption(address) {
    ;(async () => {
      // 获取选中账户staking折线图数据
      // Get the data of staking chart of the selected account
      const REQUEST_URL = 'https://api.polkawallet.io:8080/staking_chart_alexander'
      const params = `{"user_address":"${String(address)}","UTCdate":"${moment(new Date().getTime()).format(
        'YYYY-MM-DD HH:mm:ss'
      )}"}`
      axios(REQUEST_URL, params)
        .then(result => {
          const _StakingOption = {
            title: {
              text: i18n.t('Staking.StakingOption'),
              textStyle: {
                color: '#3E2D32',
                fontSize: 16
              },
              padding: [0, 0, 0, 0]
            },
            tooltip: {},
            legend: {
              data: ['']
            },
            grid: {
              left: 5
            },
            xAxis: {
              axisLine: {
                show: false
              },
              data: []
            },
            yAxis: {
              axisLine: {
                show: false
              },
              position: 'right'
            },
            color: ['#FF5080'],
            series: [
              {
                type: 'line',
                smooth: true,
                data: []
              }
            ]
          }
          result.map(item => {
            _StakingOption.xAxis.data.push(`${item.time.substring(5, 7)}/${item.time.substring(8, 10)}`)
            _StakingOption.series[0].data.push((item.slash_balance / 1000000).toFixed(1))
          })
          let max = 0
          for (let i = 0; i < _StakingOption.series[0].data.length; i++) {
            if (_StakingOption.series[0].data[i] > max) {
              max = _StakingOption.series[0].data[i]
            }
          }
          const power =
            formatBalance.calcSi(String(max), formatBalance.getDefaults().decimals).power +
            formatBalance.getDefaults().decimals
          const unit = formatBalance.calcSi(String(max), formatBalance.getDefaults().decimals).text
          for (let i = 0; i < _StakingOption.series[0].data.length; i++) {
            _StakingOption.series[0].data[i] = (_StakingOption.series[0].data[i] / Number(Math.pow(10, power))).toFixed(
              3
            )
          }
          _StakingOption.title.text = `${i18n.t('Staking.stakingOption_new')}( ${unit} )`
          this.setState({
            StakingOption: _StakingOption
          })
        })
        .catch()
    })()
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor="#F6F6F6"
          barStyle="dark-content" // 状态栏背景颜色 | Status bar background color
          hidden={false}
        />
        {/* 标题栏 | Title bar */}
        <View
          style={{
            backgroundColor: '#F6F6F6',
            borderBottomWidth: 0.5,
            borderBottomColor: '#ECE2E5'
          }}
        >
          <Header navigation={this.props.navigation} theme="dark" title={i18n.t('Staking.ValidatorInfo')} />
        </View>
        <ScrollView>
          <View style={{ width: ScreenWidth - 40, marginLeft: 20, marginTop: 40 }}>
            {/* *********************** 点线图 *********************** */}
            <View style={{ height: ScreenHeight / 3, width: ScreenWidth - 40 }}>
              <Echarts height={ScreenHeight / 3} option={this.state.StakingOption} />
            </View>
            <View
              style={{
                width: ScreenWidth - 40,
                alignItems: 'center',
                marginBottom: 40,
                backgroundColor: '#fff',
                paddingVertical: 20,
                borderRadius: 8
              }}
            >
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: ScreenWidth - 40,
                  flexDirection: 'row'
                }}
              >
                {/* 头像 | Identicon */}
                <TouchableOpacity
                  onPress={() => {
                    doubleClick(this.copy)
                  }}
                  activeOpacity={0.7}
                >
                  <Identicon size={46} theme="polkadot" value={this.state.address} />
                </TouchableOpacity>
              </View>
              {/* 地址 | Address */}
              <Text
                ellipsizeMode="middle"
                numberOfLines={1}
                style={{
                  width: ScreenWidth / 2,
                  marginBottom: 10,
                  fontSize: 13,
                  color: '#3E2D32',
                  marginTop: 30
                }}
              >
                {this.state.address}
              </Text>
              {/* 余额 | Balance */}
              <Text style={{ marginBottom: 20, fontSize: 14, color: '#AAAAAA' }}>
                {i18n.t('Staking.balance')}
                {`  ${formatBalance(String(Number(this.state.validatorBalances)))}`}
              </Text>

              {this.state.showBtn && (
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: ScreenWidth - 40
                  }}
                >
                  <TouchableOpacity
                    onPress={this.state.inNominators ? this.Unnominate : this.nominate}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 6,
                      backgroundColor: this.state.inNominators ? '#FF4081C7' : '#76CE29',
                      height: 40,
                      width: ScreenWidth * 0.5
                    }}
                    activeOpacity={0.7}
                  >
                    <Image source={require('../../../assets/images/staking/staking_nomin.png')} />
                    <Text
                      style={{
                        marginLeft: 12,
                        fontWeight: 'bold',
                        fontSize: 18,
                        color: '#FFFFFF'
                      }}
                    >
                      {this.state.inNominators ? i18n.t('Staking.Unnominate') : i18n.t('Staking.Nominate')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View
              style={{
                height: 55,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignSelf: 'flex-start',
                marginTop: 33
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    titlebottomAA: 1
                  })
                }}
                activeOpacity={0.7}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 20
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: this.state.titlebottomAA == 1 ? '#F14B79' : '#3E2D32',
                      paddingBottom: 16
                    }}
                  >
                    {i18n.t('Staking.Nominators')}
                  </Text>
                  <View
                    style={{
                      width: 30,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: '#F14B79',
                      opacity: this.state.titlebottomAA == 1 ? 1 : 0
                    }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    titlebottomAA: 2
                  })
                }}
                activeOpacity={0.7}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 20
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: this.state.titlebottomAA == 2 ? '#F14B79' : '#3E2D32',
                      paddingBottom: 16
                    }}
                  >
                    {i18n.t('Staking.SlashRecords')}
                  </Text>
                  <View
                    style={{
                      width: 30,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: '#F14B79',
                      opacity: this.state.titlebottomAA == 2 ? 1 : 0
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {this.state.titlebottomAA == 1 ? (
              <View
                style={{
                  width: ScreenWidth * 0.89,
                  alignItems: 'center',
                  marginTop: 20,
                  marginBottom: 20,
                  borderRadius: 8,
                  backgroundColor: '#fff'
                }}
              >
                {// Nominators
                this.state.nominators.length == 0 ? (
                  <View style={{ alignItems: 'center', paddingVertical: 30 }}>
                    <Text style={{ color: '#696969' }}>{i18n.t('Staking.V_no_Nominator')}</Text>
                  </View>
                ) : (
                  this.state.nominators.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        paddingHorizontal: 20,
                        flexDirection: 'row',
                        width: ScreenWidth * 0.89,
                        height: 60,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomWidth: 0,
                        borderBottomColor: '#F0F0F0'
                      }}
                    >
                      <Identicon size={25} theme="polkadot" value={formatData(item).who} />
                      <View style={{ flex: 1 }}>
                        <Text
                          ellipsizeMode="middle"
                          numberOfLines={1}
                          style={{
                            width: 150,
                            fontSize: 13,
                            color: '#3E2D32',
                            marginLeft: 12
                          }}
                        >
                          {formatData(item).who}
                        </Text>
                      </View>
                      <Text
                        style={{
                          justifyContent: 'flex-end',
                          color: '#666666',
                          fontSize: 12
                        }}
                      >
                        {formatBalance(String(Number(formatData(item).value)))}
                      </Text>
                    </View>
                  ))
                )}
              </View>
            ) : (
              // Staking Records
              <View
                style={{
                  width: ScreenWidth * 0.89,
                  alignItems: 'center',
                  marginTop: 20,
                  marginBottom: 20,
                  borderRadius: 8,
                  backgroundColor: '#fff'
                }}
              >
                {this.state.StakingRecords.staking_list_alexander &&
                  this.state.StakingRecords.staking_list_alexander.list &&
                  this.state.StakingRecords.staking_list_alexander.list.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        paddingHorizontal: 20,
                        flexDirection: 'row',
                        width: ScreenWidth * 0.89,
                        height: 60,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#F0F0F0'
                      }}
                    >
                      <Image
                        source={
                          item.st_type == 'slashed'
                            ? require('../../../assets/images/public/icon2.png')
                            : require('../../../assets/images/public/icon1.png')
                        }
                        style={{ width: 28, height: 28, marginRight: 12 }}
                      />
                      <View style={{ flex: 1 }}>
                        <Text>
                          {i18n.t('TAB.Staking')}
                          {` ${item.st_type}`}
                        </Text>
                        <Text>{moment(item.st_timestamp).format('DD/MM/YYYY HH:mm:ss')}</Text>
                      </View>
                      <Text style={{ justifyContent: 'flex-end' }}>
                        {item.st_type == 'slashed' ? '- ' : '+ '}
                        {formatBalance(String(item.st_balance))}
                      </Text>
                    </View>
                  ))}
                {this.state.StakingRecords.staking_list_alexander.list &&
                this.state.StakingRecords.staking_list_alexander.list.length > 0 ? (
                  this.state.StakingNextPage ? (
                    <TouchableOpacity
                      onPress={this.Loadmore}
                      style={{
                        height: ScreenHeight / 10,
                        width: ScreenWidth,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={{
                          color: '#696969',
                          fontSize: ScreenHeight / 45
                        }}
                      >
                        {i18n.t('TAB.loadMore')}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View
                      style={{
                        height: ScreenHeight / 10,
                        width: ScreenWidth,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Text
                        style={{
                          color: '#A9A9A9',
                          fontSize: ScreenHeight / 52
                        }}
                      >
                        {i18n.t('TAB.Bottom')}
                      </Text>
                    </View>
                  )
                ) : (
                  <View
                    style={{
                      height: ScreenHeight / 10,
                      width: ScreenWidth,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Text
                      style={{
                        color: '#A9A9A9',
                        fontSize: ScreenHeight / 52
                      }}
                    >
                      {i18n.t('Staking.V_no_SR')}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6'
  },
  title: {
    padding: ScreenHeight / 50,
    height: ScreenHeight / 9,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  text_title: {
    fontSize: ScreenHeight / 37,
    fontWeight: 'bold',
    color: 'black'
  },
  image_title: {
    height: ScreenHeight / 35,
    width: ScreenHeight / 35,
    resizeMode: 'contain'
  }
})

export default ValidatorInfo
