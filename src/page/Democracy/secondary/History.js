import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'
import { formatBalance, hexToU8a } from '@polkadot/util'
import { Method } from '@polkadot/types'
import { ScreenWidth, ScreenHeight, axios } from '../../../util/Common'
import i18n from '../../../locales/i18n'

const getArrToObj = object => {
  let arr = []
  for (const key in object) {
    arr.push(object[key])
  }
  return arr
}
export default class History extends Component {
  constructor(props) {
    super(props)
    this.state = {
      History: [],
      isrefresh: false,
      hasNextPage: true,
      pageNum: 1,
      Actives_Title: [],
      Actives_Nofixedvalue: [],
      Actives_Nofixed: []
    }
    this.Loadmore = this.Loadmore.bind(this)
    this.Nay = this.Nay.bind(this)
    this.Aye = this.Aye.bind(this)
    this.NayNumber = this.NayNumber.bind(this)
    this.AyeNumber = this.AyeNumber.bind(this)
  }

  Nay(votingState) {
    let balance = 0
    for (let i = 0; i < votingState.msg.length; i++) {
      if (JSON.stringify(votingState.msg[i].vote) == '"0x00"') {
        balance = balance + Number(votingState.msg[i].balance)
      }
    }
    return balance
  }

  NayNumber(votingState) {
    let NayNumber = 0
    for (let i = 0; i < votingState.msg.length; i++) {
      if (JSON.stringify(votingState.msg[i].vote) == '"0x00"') {
        NayNumber = NayNumber + 1
      }
    }
    return NayNumber
  }

  Aye(votingState) {
    let balance = 0
    for (let i = 0; i < votingState.msg.length; i++) {
      if (JSON.stringify(votingState.msg[i].vote) == '"0xff"') {
        balance = balance + Number(votingState.msg[i].balance)
      }
    }
    return balance
  }

  AyeNumber(votingState) {
    let AyeNumber = 0
    for (let i = 0; i < votingState.msg.length; i++) {
      if (JSON.stringify(votingState.msg[i].vote) == '"0xff"') {
        AyeNumber = AyeNumber + 1
      }
    }
    return AyeNumber
  }

  refresh() {
    this.setState({
      isrefresh: true
    })
    setTimeout(() => {
      this.setState({
        isrefresh: false
      })
    }, 2000)
    this.getHistory()
  }

  getHistory(pageNum = 1) {
    this.setState({
      pageNum
    })
    let REQUEST_URL = 'https://api.polkawallet.io:8080/refer_record'
    let params = `{"pageNum":${pageNum},"pageSize":"10"}`
    axios(REQUEST_URL, params)
      .then(result => {
        console.log(result)
        let History = [...this.state.History, ...result.refer_record.list]
        if (pageNum == 1) {
          History = [...result.refer_record.list]
        }
        this.setState(
          {
            hasNextPage: result.refer_record.hasNextPage,
            History: History
          },
          () => {
            this.getOtherShow()
          }
        )
      })
      .catch()
  }

  Loadmore() {
    let pageNum = this.state.pageNum
    this.getHistory(pageNum + 1)
  }

  componentDidMount() {
    this.getHistory()
  }

  async getOtherShow() {
    this.setState({
      Actives_Title: [],
      Actives_Nofixedvalue: [],
      Actives_Nofixed: []
    })
    let Actives_Title = [],
      Actives_Nofixedvalue = [],
      Actives_Nofixed = []
    this.state.History.map((item, index) => {
      let info = null
      try {
        if (JSON.parse(item.referInfo).proposal.args.proposal.args) {
          info = JSON.parse(item.referInfo).proposal.args
        } else {
          info = JSON.parse(item.referInfo)
        }
      } catch (e) {
        info = JSON.parse(item.referInfo)
      }
      if (info) {
        try {
          let { meta, method, section } = Method.findFunction(hexToU8a(info.proposal.callIndex))
          Actives_Title.push({ section: section, method: method })
          Actives_Nofixedvalue.push(getArrToObj(info.proposal.args))
          Actives_Nofixed.push(meta.args)
        } catch (e) {}
      }
    })
    this.setState({
      Actives_Title,
      Actives_Nofixedvalue,
      Actives_Nofixed
    })
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
          {this.state.History.map(
            (item, index) =>
              this.state.Actives_Title &&
              this.state.Actives_Title.length > 0 &&
              this.state.Actives_Title[index] &&
              this.state.Actives_Title[index].section && (
                <View
                  key={index}
                  style={{
                    width: ScreenWidth - 40,
                    marginLeft: 20,
                    borderRadius: 5,
                    backgroundColor: '#fff',
                    marginTop: 0,
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
                            fontWeight: 'bold',
                            paddingBottom: 10
                          }}
                        >
                          {this.state.Actives_Title && this.state.Actives_Title.length > 0
                            ? this.state.Actives_Title[index].section + '.' + this.state.Actives_Title[index].method
                            : ''}
                        </Text>

                        <View>
                          <Text style={{ color: '#999999', fontSize: 13 }}>blocknumber:</Text>
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
                              {item.blocknumber}
                            </Text>
                          </View>
                        </View>

                        <View>
                          <Text style={{ color: '#999999', fontSize: 13 }}>timestamp:</Text>
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
                              {item.timestamp}
                            </Text>
                          </View>
                        </View>
                        {this.state.Actives_Nofixed &&
                          this.state.Actives_Nofixed.length > 0 &&
                          this.state.Actives_Nofixed[index].map((itemNo, indexNo) => {
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
                                    {itemNo.name == 'value' || itemNo.name == 'free' || itemNo.name == 'reserved'
                                      ? formatBalance(this.state.Actives_Nofixedvalue[index][indexNo])
                                      : String(this.state.Actives_Nofixedvalue[index][indexNo])}
                                  </Text>
                                </View>
                              </View>
                            )
                          })}
                        <View
                          style={{
                            flexDirection: 'row'
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              color: '#222222',
                              fontWeight: 'bold',
                              paddingTop: 10
                            }}
                          >
                            The result of voting:
                          </Text>
                          <View
                            style={{
                              borderRadius: 10,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginLeft: 20,
                              backgroundColor: item.referResult == 'Passed' ? '#7ad52a' : '#fb3232'
                            }}
                          >
                            <Text
                              style={{
                                fontWeight: 'bold',
                                color: 'white',
                                fontSize: 14,
                                padding: 10
                              }}
                            >
                              {item.referResult}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={{ width: 87, alignItems: 'flex-end' }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#222222'
                          }}
                        >
                          {'#' + item.referIndex}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        marginTop: 30,
                        height: 0,
                        borderWidth: 0.4,
                        borderColor: '#E5E5E5',
                        borderStyle: 'dashed',
                        borderRadius: 0.1,
                        marginBottom: 20
                      }}
                    />
                  </View>
                </View>
              )
          )}
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
    )
  }
}
