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
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  Platform,
  StatusBar,
  SafeAreaView,
  InteractionManager
} from 'react-native'
import Echarts from 'native-echarts'
import moment from 'moment/moment'

import { formatBalance } from '@polkadot/util'
import { observer, inject } from 'mobx-react'
import { ScreenWidth, ScreenHeight, axios } from '../../../util/Common'
import Header from '../../../components/Header'
import CoinRow from '../../../components/CoinPCXRow'
import i18n from '../../../locales/i18n'
import chainxAPI from '../../../util/chainxAPI'
import { TYPE_CHAINX } from '../../../util/Constant'

const titlebottoms = ['All', 'Out', 'In']
@inject('rootStore')
@observer
class CoinDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isrefresh: false,
      isfirst: 0,
      titlebottom: 1,
      pageNum: 1,
      hasNextPage: false,
      transactions: [],
      StakingOption: {
        title: {
          text: i18n.t('Assets.AssetsOption'),
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
    this.Send = this.Send.bind(this)
    this.Receive = this.Receive.bind(this)
    this.Loadmore = this.Loadmore.bind(this)
    this.refresh = this.refresh.bind(this)
    this.Load = this.Load.bind(this)
  }

  /**
   * @description 点击返回|Click back
   */
  back() {
    this.props.navigation.navigate('Tabbed_Navigation')
  }

  /**
   * @description 加载信息|Loding
   */
  Load() {
    // 清除缓存
    // Clear the cache
    this.LoadTxList(0)
  }

  /**
   * @description 加载交易列表|Load transaction list
   * @param {Num} pageNum 加载的页数|Page number to load
   */
  async LoadTxList(pageNum = 0) {
    // 获取交易记录
    // Access to transaction records
    let result = await chainxAPI.getTxList(this.props.rootStore.stateStore.currentAccount.address, pageNum)
    console.warn(JSON.stringify(result))
    let transactions = [...this.state.transactions, ...result.items]
    if (pageNum == 1) {
      transactions = [...result.items]
    }
    this.setState({
      hasNextPage: result.page + 1,
      transactions
    })
  }

  /**
   * @description 刷新|refresh
   */
  refresh() {
    this.setState({
      isrefresh: true,
      transactions: []
    })
    setTimeout(() => {
      this.Load()
    }, 200)
    this.setState({
      isrefresh: false
    })
  }

  /**
   * @description 交易记录加载更多|Load more transaction record
   */
  Loadmore() {
    this.setState(
      {
        pageNum: this.state.pageNum + 1
      },
      () => {
        this.LoadTxList(this.state.pageNum + 1)
      }
    )
  }

  /**
   * @description 点击send按钮 跳转页面|Click Send
   */
  Send() {
    this.props.navigation.navigate('PCX_transfer')
  }

  /**
   * @description 点击Receive按钮 跳转页面|Click Receive
   */
  Receive() {
    this.props.navigation.navigate('QR_Code')
  }

  componentDidMount() {
    this.LoadTxList()
  }

  componentWillUnmount() {
    // 在页面消失的时候，取消监听
    // Unlisten when the page disappears
    this._didBlurSubscription && this._didBlurSubscription.remove()
  }

  render() {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#F14B79' }]}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            paddingBottom: 40,
            marginBottom: -40
          }}
        >
          <StatusBar
            hidden={false}
            backgroundColor="#F14B79" // 状态栏背景颜色 | Status bar background color | Status bar background color
            barStyle={Platform.OS == 'android' ? 'light-content' : 'dark-content'} // 状态栏样式（黑字）| Status bar style (black)| Status bar style (black)
          />
          {/* 标题栏 | Title bar */}
          <View style={{ backgroundColor: '#F14B79', marginBottom: 22 }}>
            <Header
              navigation={this.props.navigation}
              title={() => {
                if (this.props.rootStore.stateStore.type == TYPE_CHAINX) {
                  return 'PCX'
                } else {
                  return 'DOT'
                }
              }}
            />
          </View>

          {/* The line chart */}
          <View
            style={{
              width: ScreenWidth,
              flexDirection: 'row',

              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {(() => {
              if (this.props.rootStore.stateStore.type == 2) {
                return <View />
              } else {
                return (
                  <View
                    style={{
                      width: ScreenWidth,
                      flexDirection: 'row',
                      height: ScreenHeight / 3,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Echarts option={this.state.StakingOption} height={ScreenHeight / 3} width={ScreenWidth * 0.888} />
                  </View>
                )
              }
            })()}
          </View>
          <View style={{ height: ScreenHeight / 20 }}>
            {/* 次标题 | Subheading */}
            <View
              style={{
                borderBottomColor: '#F0F0F0',
                borderBottomWidth: 1,
                height: ScreenHeight / 20,
                width: ScreenWidth,
                flexDirection: 'row',
                justifyContent: 'space-around'
              }}
            >
              {titlebottoms.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.7}
                    style={{
                      width: ScreenWidth / 3,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderBottomWidth: 2,
                      borderBottomColor: this.state.titlebottom == index + 1 ? '#F14B79' : '#FFF'
                    }}
                    onPress={() => {
                      this.setState({
                        titlebottom: index + 1
                      })
                    }}
                  >
                    <Text
                      style={{
                        color: this.state.titlebottom == index + 1 ? '#F14B79' : '#3E2D32',
                        fontSize: ScreenWidth / 30,
                        fontWeight: '500'
                      }}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
          {/* Sliding table */}
          <View
            style={{
              marginTop: 0,
              width: ScreenWidth,
              flex: 1,
              backgroundColor: 'white'
            }}
          >
            <ScrollView
              style={{ flex: 1 }}
              refreshControl={<RefreshControl refreshing={this.state.isrefresh} onRefresh={this.refresh} />}
            >
              {this.state.transactions.map((item, index) => {
                return this.state.titlebottom == 1 ? (
                  // All
                  <CoinRow
                    navigation={this.props.navigation}
                    item={item}
                    index={index}
                    key={index}
                    address={this.props.rootStore.stateStore.currentAccount.address}
                  />
                ) : this.state.titlebottom == 2 &&
                  chainxAPI.getIfTransferIn(this.props.rootStore.stateStore.currentAccount.address, item.signed) ? (
                  // Out
                  <CoinRow
                    navigation={this.props.navigation}
                    item={item}
                    index={index}
                    key={index}
                    address={this.props.rootStore.stateStore.currentAccount.address}
                  />
                ) : this.state.titlebottom == 3 &&
                  !chainxAPI.getIfTransferIn(this.props.rootStore.stateStore.currentAccount.address, item.signed) ? (
                  // in
                  <CoinRow
                    navigation={this.props.navigation}
                    item={item}
                    index={index}
                    key={index}
                    address={this.props.rootStore.stateStore.currentAccount.address}
                  />
                ) : (
                  <View key={index} />
                )
              })}
              {this.state.hasNextPage ? (
                <TouchableOpacity
                  style={{
                    height: ScreenHeight / 10,
                    width: ScreenWidth,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  activeOpacity={0.7}
                  onPress={this.Loadmore}
                >
                  <Text style={{ color: '#AAAAAA', fontSize: ScreenHeight / 45 }}>{i18n.t('TAB.loadMore')}</Text>
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
                  <Text style={{ color: '#AAAAAA', fontSize: ScreenHeight / 52 }}>{i18n.t('TAB.Bottom')}</Text>
                </View>
              )}
            </ScrollView>
          </View>

          <View style={{ height: ScreenHeight / 98, backgroundColor: 'white' }} />

          {/* Send or Receive  */}
          <View style={{ height: 48, flexDirection: 'row' }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#4FACD1',
                width: ScreenWidth / 2,
                justifyContent: 'center',
                alignItems: 'center',
                height: 48,
                flexDirection: 'row'
              }}
              activeOpacity={0.7}
              onPress={this.Send}
            >
              <Image style={styles.SorR_Image} source={require('../../../assets/images/public/assets_btc_send.png')} />
              <Text style={styles.SorR_Text}>{i18n.t('Assets.send')}</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              style={{
                backgroundColor: '#76CE29',
                width: ScreenWidth / 2,
                justifyContent: 'center',
                alignItems: 'center',
                height: 48,
                flexDirection: 'row'
              }}
              activeOpacity={0.7}
              onPress={this.Receive}
            >
              <Image
                style={styles.SorR_Image}
                source={require('../../../assets/images/public/assets_btc_receive.png')}
              />
              <Text style={styles.SorR_Text}>{i18n.t('TAB.Receive')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  title: {
    padding: ScreenHeight / 50,
    height: ScreenHeight / 9,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: '#776f71'
  },
  text_title: {
    fontSize: ScreenHeight / 37,
    fontWeight: 'bold',
    color: '#e6e6e6'
  },
  image_title: {
    height: ScreenHeight / 33.35,
    width: ScreenHeight / 33.35,
    resizeMode: 'contain'
  },
  SorR_View: {
    height: ScreenHeight / 15,
    width: ScreenWidth / 2.015,
    borderRadius: ScreenHeight / 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  SorR_Image: {
    height: ScreenHeight / 33,
    width: ScreenHeight / 33,
    resizeMode: 'contain'
  },
  SorR_Text: {
    color: 'white',
    fontSize: ScreenWidth / 25,
    fontWeight: '500',
    marginLeft: ScreenWidth / 30
  },
  value: {
    marginRight: ScreenWidth / 20,
    fontSize: 16,
    color: '#3E2D32'
  }
})
export default CoinDetails
