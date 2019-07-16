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
  RefreshControl,
  SafeAreaView,
  Platform,
  ImageBackground,
  StatusBar,
  Alert,
  InteractionManager
} from 'react-native'
import moment from 'moment/moment'
import Identicon from 'polkadot-identicon-react-native'
import { formatBalance } from '@polkadot/util'
import Echarts from 'native-echarts'
import { observer, inject } from 'mobx-react'
import { ScreenWidth, ScreenHeight, formatData, axios, doubleClick } from '../../util/Common'
import polkadotAPI from '../../util/polkadotAPI'
import i18n from '../../locales/i18n'

const styles = StyleSheet.create({
  navContent: {
    width: ScreenWidth,
    height: 77,
    alignItems: 'center'
  }
})
@inject('rootStore')
@observer
class Staking extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stashAccountTag: false,
      controllerAccountTag: false,
      curTab: 1, // 当前tab | The current tab
      isrefresh: false, // 隐藏刷新 | Hide the refresh
      isselectJumpPageShow: false,
      validators: [],
      validatorNum: 0,
      validatorCount: 0,

      intentions: [],
      intentionNum: 0,

      sessionProgress: 0,
      sessionLength: 0,

      eraProgress: 0,
      eraLength: 0,

      titlebottomSO: 1, // Validators 和 Next up 的tab切换 | Switch Validators and Next up's tab

      nextUp: [], // next Up 集合 | collection of next Up
      nextUpBalances: [], // next up 余额集合 | collection of next Up balance

      StakingOption: {
        title: {
          text: i18n.t('Staking.stakingOption'),
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
      },

      AccountMsg: {
        // 默认账户信息
        // Default account information
        available: 0,
        balance: 0,
        bonded: 0,
        lockedes: []
      },
      controllerToStash: {},
      controllersAccount: '', // 控制账户信息 | Control account information
      accountChangeTag: false, // 账户相关的按钮是否可以点击 | Whether the operation buttons can be clicked
      // showBtnType: 0: Not show, 1: Unbond + AddBond, 2: Unbond, 3: Unnominate, 4: Unvalidate, 5: nominate + validate, 6: bond
      showBtnType: 0, // 0 不展示 1.解绑 + 追加绑定  2.解绑   3. 取消提名   4.取消验证   5.提名 + 验证  6.绑定
      titlebottomAA: 1, // Slash Records 、Nominating、MyNominators  tab切换的tab值
      staking_list_alexander: [], // Slash Records
      pageNum: 1, // Slash Records 的页数 | Slash Records pages Number
      hasNextPage: false, // Slash Records 是否有下一页 | Is there a next page of  Slash Records?
      nominating: [], // nominating 的合集
      nominatingBalance: [], // nominating 所有账户余额的集合
      myNominators: [] // myNominators 的合集
    }
  }

  /**
   * @description 页面初始化 加载所需数据|The page initializes the required data
   */
  initPage() {
    ;(async () => {
      const _this = this
      // Query all
      let validatorCount
      let sessionLength
      let eraLength
      ;[validatorCount, sessionLength, eraLength] = await Promise.all([
        polkadotAPI.validatorCount(),
        polkadotAPI.sessionLength(),
        polkadotAPI.eraLength()
      ])

      _this.setState({
        validatorCount,
        sessionLength,
        eraLength
      })
      polkadotAPI.sessionProgress(sessionProgress => {
        _this.setState({
          sessionProgress
        })
      })
      polkadotAPI.eraProgress(eraProgress => {
        _this.setState({
          eraProgress
        })
      })

      const oldvalidators = await polkadotAPI.validators()

      const newValidators = await Promise.all(oldvalidators.map(authorityId => polkadotAPI.accountInfo(authorityId)))
      _this.setState({
        validators: newValidators,
        validatorNum: newValidators.length
      })

      await polkadotAPI.controllers(intentions => {
        _this.setState({
          intentions: intentions[0],
          intentionNum: intentions[0].length
        })
      })
    })()
  }

  /**
   * @description 切换 account Actions 加载信息
   */
  loadAccountActions() {
    ;(async () => {
      this.loadSlashRecords()
      this.getStakingOption(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address)
      let address = await polkadotAPI.bonded(
        this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address
      ) // 检测是否为“存储账户(stash)" | The account is stash account?
      address = String(address)
      if (address) {
        // 存储账户(stash)
        this.setState({
          controllerAccountTag: false,
          stashAccountTag: true
        })
        this.setState({
          controllersAccount: String(address),
          accountChangeTag: true
        })
        let AccountMsg = await polkadotAPI.accountInfo(String(address)) // 查对应的控制账户信息 | Check the control account info
        AccountMsg = formatData(AccountMsg).stakingLedger

        let allLockedValue = 0 // 所有解绑的值 | All of the unbound values
        const lockedes = [] // 解绑中的每个对象的集合 | Object of Unbond
        let balance = await polkadotAPI.freeBalance(
          String(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address)
        ) // 余额 | Balance
        const bonded = Number(AccountMsg.active)
        balance = String(Number(balance))

        if (AccountMsg.unlocking.length > 0) {
          // 解绑中的数量大于1
          // The number of unbond is greater than 1
          for (let i = 0; i < AccountMsg.unlocking.length; i++) {
            allLockedValue = String(Number(allLockedValue) + Number(AccountMsg.unlocking[i].value))
            lockedes.push({
              value: AccountMsg.unlocking[i].value,
              era: AccountMsg.unlocking[i].era
            })
          }
        }

        const available = balance - bonded - allLockedValue

        this.setState({
          AccountMsg: {
            available,
            balance,
            bonded,
            lockedes
          }
        })
        if (available == 0) {
          // 显示Unbond 隐藏Bond Additional
          // Show Unbond, hide Bond Additional
          this.setState({
            showBtnType: 2
          })
        } else if (available != 0) {
          // 显示Bond Additional和Unbond 按钮
          // Displays Bond Additional and Unbond buttons
          this.setState({
            showBtnType: 1
          })
        }
      } else {
        // 不是储存账户
        // Not is stash account
        this.setState({
          stashAccountTag: false
        })
        const balance = await polkadotAPI.freeBalance(
          String(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address)
        )
        const AccountMsg = await polkadotAPI.accountInfo(
          String(this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address)
        ) // 查对应的控制账户信息 | Check the control account info
        this.setState({
          AccountMsg: {
            balance
          }
        })
        let controller = await polkadotAPI.ledger(
          this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address
        ) // 判断是否为控制账户 | Determine whether it is a control account
        controller = formatData(controller)
        if (controller && controller != null && controller != 'null') {
          // 如果是控制账户
          // Is control account
          this.setState({
            controllerAccountTag: true,
            controllerToStash: {
              address: String(AccountMsg.stakingLedger.stash),
              polkakey: AccountMsg.stakingLedger.active
            }
          })

          if (this.state.intentions.length == 0) {
            await polkadotAPI.controllers(intentions => {
              this.setState(
                {
                  intentions: formatData(intentions[0]),
                  intentionNum: intentions[0].length
                },
                () => {
                  if (this.state.intentions.includes(String(controller.stash))) {
                    // 验证状态 显示停止验证
                    // Validation status, displays stop validate
                    this.setState({
                      showBtnType: 4
                    })
                  } else {
                    // 判断提名
                    // Determine the nomination
                    ;(async () => {
                      const info = await polkadotAPI.accountInfo(
                        this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address
                      )
                      const nominating = formatData(info).nominators
                      if (nominating.length > 0) {
                        // 提名个数大于0 正在提名   显示停止提名
                        // When the number of nominators is greater than 0, display stops nominate
                        this.setState({
                          showBtnType: 3
                        })
                      } else {
                        // 既没有验证 也 没有提名 显示验证和提名
                        // Neither validate nor nominate, shows validate and nominate
                        this.setState({
                          showBtnType: 5
                        })
                      }
                    })()
                  }
                }
              )
            })
          } else if (this.state.intentions.includes(controller.stash)) {
            // 验证状态 显示停止验证
            // validate status, displays stop validate
            this.setState({
              showBtnType: 4
            })
          } else {
            // 判断提名
            // Determine the nominate
            const info = await polkadotAPI.accountInfo(
              this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address
            )
            const nominating = formatData(info).nominators
            if (nominating.length > 0) {
              // 提名个数大于0 正在提名   显示停止提名
              // When the number of nominators is greater than 0, display stops nominate
              this.setState({
                showBtnType: 3
              })
            } else {
              // 既没有验证 也 没有提名 显示验证和提名
              // Neither validate nor nominate, shows validate and nominate
              this.setState({
                showBtnType: 5
              })
            }
          }
        } else {
          // 显示绑定bond 按钮
          // Show the Bond button
          this.setState({
            controllerAccountTag: false,
            showBtnType: 6
          })
        }
      }

      const info = await polkadotAPI.accountInfo(
        this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address
      )
      const nominating = formatData(info).nominators
      const nominatingBalance = await Promise.all(
        nominating.map(authorityId => polkadotAPI.accountInfo(String(authorityId)))
      )
      this.setState({
        nominating: nominating || [],
        nominatingBalance: nominatingBalance || [],
        myNominators: formatData(info).stakers.others
      })
    })()
  }

  /**
   * @description 点击切换 account Actions
   */
  AccountActions() {
    this.setState(
      {
        curTab: 2
      },
      () => {
        this.loadAccountActions()
      }
    )
  }

  /**
   * @description 加载SlashRecords数据
   * @param {Number} pageNum 页数
   */
  loadSlashRecords(pageNum = 1) {
    const _this = this
    const REQUEST_URL = 'https://api.polkawallet.io:8080/staking_list_alexander'
    let params = {
      pageNum,
      pageSize: 10,
      user_address: this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address
    }
    params = JSON.stringify(params)
    axios(REQUEST_URL, params)
      .then(result => {
        let staking_list_alexander = []
        if (pageNum == 1) {
          staking_list_alexander = result.staking_list_alexander.list
        } else {
          staking_list_alexander = [...this.state.staking_list_alexander, result.staking_list_alexander.list]
        }
        _this.setState({
          hasNextPage: result.staking_list_alexander.hasNextPage,
          staking_list_alexander
        })
      })
      .catch()
  }

  /**
   * @description 分页加载 Slash Records|Paging load slash Records
   */
  Loadmore() {
    this.setState(
      {
        pageNum: this.state.pageNum + 1
      },
      () => {
        this.loadSlashRecords(this.state.pageNum)
      }
    )
  }

  /**
   * @description 获取当前账户折线图数据|Get the current account chart data
   * @param {String} address 地址|Address
   */
  getStakingOption(address) {
    const REQUEST_URL = 'https://api.polkawallet.io:8080/staking_chart_alexander'
    const params = `{"user_address":"${String(address)}","UTCdate":"${moment(new Date().getTime()).format(
      'YYYY-MM-DD HH:mm:ss'
    )}"}`
    axios(REQUEST_URL, params)
      .then(result => {
        const _StakingOption = {
          title: {
            text: i18n.t('Staking.stakingOption'),
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
          _StakingOption.series[0].data[i] = (_StakingOption.series[0].data[i] / Number(Math.pow(10, power))).toFixed(3)
        }
        _StakingOption.title.text = `${i18n.t('Staking.stakingOption_new')} ( ${unit} )`
        this.setState({
          StakingOption: _StakingOption
        })
      })
      .catch()
  }

  /**
   * @description 刷新|refresh
   * @param {*} type 当前在那个tab|Currently on the tab
   */
  refresh(type) {
    this.setState({
      isrefresh: true
    })
    if (type == 1) {
      this.setState(
        {
          validators: [],
          validatorNum: 0,
          validatorCount: 0,

          intentions: [],
          intentionNum: 0,

          sessionProgress: 0,
          sessionLength: 0,

          eraProgress: 0,
          eraLength: 0,

          titlebottomSO: 1, // Validators 和 Next up 的tab切换

          nextUp: [], // next Up 集合
          nextUpBalances: [] // next up 余额集合
        },
        () => {
          this.setState({
            isrefresh: false
          })
          this.initPage()
        }
      )
    } else if (type == 2) {
      this.setState(
        {
          controllerAccountTag: false,
          stashAccountTag: true,
          StakingOption: {
            title: {
              text: i18n.t('Staking.stakingOption'),
              textStyle: {
                color: 'grey',
                fontSize: 16
              }
            },

            tooltip: {
              triggerOn: 'none'
            },
            legend: {
              data: ['']
            },
            xAxis: {
              axisPointer: { handle: { show: true } },

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
          },
          intentions: [],
          intentionNum: 0,
          AccountMsg: {
            // 默认账户信息
            available: 0,
            balance: 0,
            bonded: 0,
            lockedes: []
          },

          controllersAccount: '', // 控制账户信息 | Control account information
          accountChangeTag: false, // 账户相关的按钮是否可以点击 | Whether the operation buttons can be clicked
          // showBtnType: 0: Not show, 1: Unbond + AddBond, 2: Unbond, 3: Unnominate, 4: Unvalidate, 5: nominate + validate, 6: bond
          showBtnType: 0, // 0 不展示 1.解绑 + 追加绑定  2.解绑   3. 取消提名   4.取消验证   5.提名 + 验证  6.绑定
          titlebottomAA: 1, // Slash Records 、Nominating、MyNominators  tab切换的tab值
          staking_list_alexander: [], // Slash Records
          pageNum: 1, // Slash Records 的页数 | Slash Records pages Number
          hasNextPage: false, // Slash Records 是否有下一页| Is there a next page of  Slash Records?
          nominating: [], // nominating 的合集
          nominatingBalance: [], // nominating 所有账户余额的集合
          myNominators: [] // myNominators 的合集
        },
        () => {
          this.setState({
            isrefresh: false
          })
          this.AccountActions()
        }
      )
    }
  }

  /**
   * @description 跳转个人信息界面|Jump to the personal information interface
   * @param {String} address 地址|Address
   */
  toValidator_Info(address) {
    this.props.navigation.navigate('Validator_Info', { address: String(address) })
  }

  /**
   * @description 跳转 stake 页面|Jump to the stake page
   */
  stake() {
    this.props.navigation.navigate('Stake')
  }

  /**
   * @description 跳转 Unstake 页面|Jump to the Unstake page
   */
  Unstake() {
    this.props.navigation.navigate('Unstake')
  }

  /**
   * @description 跳转 Unnominate 页面|Jump to the Unnominate page
   */
  Unnominate() {
    this.props.navigation.navigate('Unnominate')
  }

  /**
   * @description 跳转 Nominate 页面|Jump to the Nominate page
   */
  nominate() {
    this.props.rootStore.stateStore.tonominate = 0
    this.props.navigation.navigate('Nominate', { address: '' })
  }

  /**
   * @description 跳转 BondAdditional 页面|Jump to the BondAdditional page
   */
  BondAdditional() {
    this.props.navigation.navigate('BondAdditional')
  }

  /**
   * @description 选择操作|Select operation
   */
  selectJumpPage() {
    Alert.alert(
      '',
      i18n.t('Staking.PleaseChoose'),
      [
        {
          text: i18n.t('Staking.Unbond'),
          onPress: () => {
            this.Unbond()
          }
        },
        {
          text: i18n.t('Staking.SetSessionKey'),
          onPress: () => {
            this.setSessionKey()
          }
        },
        {
          text: i18n.t('TAB.Cancel'),
          onPress: () => {},
          style: 'cancel'
        }
      ],
      { cancelable: true }
    )
  }

  /**
   * @description 跳转 SetSessionKey 页面|Jump to the SetSeesionkey
   */
  setSessionKey() {
    this.props.navigation.navigate('SetSessionKey')
  }

  /**
   * @description 跳转 Unbond 页面|Jump to the Unbond page
   */
  Unbond() {
    this.props.navigation.navigate('Unbond')
  }

  /**
   * @description 跳转 BondFunds 页面|Jump to the BondFunds
   */
  BondFunds() {
    this.props.navigation.navigate('BondFunds')
  }

  /**
   * @description 下边tab切换|The TAB to switch
   */
  changeSOIndex() {
    const _this = this
    this.setState({
      titlebottomSO: 2
    })
    if (this.state.nextUp.length == 0 && this.state.validators.length != 0) {
      ;(async () => {
        polkadotAPI.controllers(controllers => {
          const _validators = []
          const _controllers = []
          let _newControllers = []
          this.state.validators.map(item => {
            _validators.push(String(formatData(item).stashId))
          })
          controllers[0].map(item => {
            _controllers.push(String(formatData(item)))
          })
          const a = new Set(_controllers)
          const b = new Set(_validators)
          _newControllers = new Set([...a].filter(x => !b.has(x)))
          _newControllers = [..._newControllers]
          this.setState(
            {
              nextUp: _newControllers
            },
            () => {
              ;(async () => {
                const nextUpBalances = await Promise.all(
                  _this.state.nextUp.map(authorityId => polkadotAPI.accountInfo(authorityId))
                )
                _this.setState({
                  nextUpBalances
                })
              })()
            }
          )
        })
      })()
    }
  }

  /**
   * @description 跳转 Stake 页面|Jump to Stake page
   */
  Validate() {
    this.props.navigation.navigate('Stake')
  }

  /**
   * @description 跳转 Unstake 页面|Jump to the Unstake page
   */
  Unvalidate() {
    this.props.navigation.navigate('Unstake')
  }

  /**
   * @description 跳转 Nominate 页面|Jump to the Nominate page
   */
  Nominate() {
    this.props.rootStore.stateStore.tonominate = 0
    this.props.navigation.navigate('Nominate', { address: '' })
  }

  componentWillMount() {
    // 通过addListener开启监听，didFocus RN 生命周期 页面获取焦点
    // Start listening through addListener, didFocus RN lifecycle, page gets focus
    this._didBlurSubscription = this.props.navigation.addListener('didFocus', () => {
      if (this.state.curTab == 2) {
        this.refresh(2)
      } else if (this.state.eraLength == 0) {
        this.initPage()
      }
      if (Platform.OS == 'android') {
        StatusBar.setBackgroundColor('#F14B79')
      }
      StatusBar.setBarStyle(Platform.OS == 'android' ? 'light-content' : 'dark-content')
    })
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      if (Platform.OS == 'android') {
        StatusBar.setBackgroundColor('#F14B79')
        StatusBar.setBarStyle('light-content')
      }
      if (this.state.curTab == 1) {
        this.initPage()
      } else {
        this.AccountActions()
      }
    })
  }

  componentWillUnmount() {
    // 在页面消失的时候，取消监听
    // Unlisten when the page disappears
    this._didBlurSubscription && this._didBlurSubscription.remove()
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, height: ScreenHeight, backgroundColor: '#F14B79' }}>
        <View style={{ flex: 1, backgroundColor: '#F6F6F6' }}>
          <StatusBar
            backgroundColor="#F14B79"
            barStyle={Platform.OS == 'android' ? 'light-content' : 'dark-content'} // 状态栏背景颜色 | Status bar background color
            hidden={false}
          />
          <View>
            <ImageBackground
              resizeMode="stretch"
              source={require('../../assets/images/staking/staking_top_bg_no.png')}
              style={[styles.navContent, { height: 98 }]}
            >
              <View>
                <View style={{ height: 44, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, color: '#FFFFFF' }}>{i18n.t('TAB.Staking')}</Text>
                </View>
                <View
                  style={{
                    height: 55,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        curTab: 1
                      })
                    }}
                    activeOpacity={0.7}
                    style={{ justifyContent: 'center', alignItems: 'center', width: ScreenWidth * 0.5 }}
                  >
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: ScreenWidth * 0.5 }}>
                      <Text style={{ fontSize: 17, color: '#fff', paddingBottom: 16 }}>
                        {i18n.t('Staking.stakingOverview')}
                      </Text>
                      <View
                        style={{
                          width: 30,
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: '#fff',
                          opacity: this.state.curTab == 1 ? 1 : 0
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.AccountActions.bind(this)}
                    activeOpacity={0.7}
                    style={{ justifyContent: 'center', alignItems: 'center', width: ScreenWidth * 0.5 }}
                  >
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: ScreenWidth * 0.5 }}>
                      <Text style={{ fontSize: 17, color: '#fff', paddingBottom: 16 }}>
                        {i18n.t('Staking.AccountActions')}
                      </Text>
                      <View
                        style={{
                          width: 30,
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: '#fff',
                          opacity: this.state.curTab == 2 ? 1 : 0
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </View>
          <ScrollView
            refreshControl={
              <RefreshControl
                onRefresh={this.refresh.bind(this, this.state.curTab)}
                progressViewOffset={89}
                refreshing={this.state.isrefresh}
              />
            }
            style={{ height: ScreenHeight - 98 }}
          >
            {this.state.curTab == 1 ? (
              <View
                style={{
                  width: ScreenWidth,
                  backgroundColor: '#F6F6F6',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start'
                }}
              >
                <ImageBackground
                  resizeMode="stretch"
                  source={require('../../assets/images/staking/staking_nav_bg.png')}
                  style={styles.navContent}
                ></ImageBackground>
                <View style={{ width: ScreenWidth, alignItems: 'center' }}>
                  <View
                    style={{
                      width: ScreenWidth - 40,
                      backgroundColor: '#FFFFFF',
                      marginTop: -74,
                      borderRadius: 8,
                      padding: 20
                    }}
                  >
                    <View style={{ flexDirection: 'row', width: ScreenWidth - 40 }}>
                      {/* validators */}
                      <View style={{ justifyContent: 'center', flex: 1, alignItems: 'flex-start' }}>
                        <Text style={{ fontSize: 16, color: '#3E2D32', marginBottom: 12 }}>
                          {i18n.t('Staking.validatorsNum')}
                        </Text>
                        <Text style={{ fontSize: 13, color: '#AAAAAA' }}>
                          {`${this.state.validatorNum}/${this.state.validatorCount}`}
                        </Text>
                      </View>
                      {/* intentions */}
                      <View style={{ justifyContent: 'center', flex: 1, alignItems: 'flex-start' }}>
                        <Text style={{ fontSize: 16, color: '#3E2D32', marginBottom: 12 }}>
                          {i18n.t('Staking.intentions')}
                        </Text>
                        <Text style={{ fontSize: 13, color: '#AAAAAA' }}>{this.state.intentionNum}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', width: ScreenWidth - 40, marginTop: 21 }}>
                      {/* session */}
                      <View style={{ justifyContent: 'center', flex: 1, alignItems: 'flex-start' }}>
                        <Text style={{ fontSize: 16, color: '#3E2D32', marginBottom: 12 }}>
                          {i18n.t('Staking.session')}
                        </Text>
                        <Text style={{ fontSize: 13, color: '#AAAAAA' }}>
                          {`${this.state.sessionProgress}/${this.state.sessionLength}`}
                        </Text>
                      </View>
                      {/* era */}
                      <View style={{ justifyContent: 'center', flex: 1, alignItems: 'flex-start' }}>
                        <Text style={{ fontSize: 16, color: '#3E2D32', marginBottom: 12 }}>
                          {i18n.t('Staking.era')}
                        </Text>
                        <Text style={{ fontSize: 13, color: '#AAAAAA' }}>
                          {`${this.state.eraProgress}/${this.state.eraLength}`}
                        </Text>
                      </View>
                    </View>
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
                          titlebottomSO: 1
                        })
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: this.state.titlebottomSO == 1 ? '#F14B79' : '#3E2D32',
                            paddingBottom: 16
                          }}
                        >
                          {i18n.t('Staking.validators')}
                        </Text>
                        <View
                          style={{
                            width: 30,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: '#F14B79',
                            opacity: this.state.titlebottomSO == 1 ? 1 : 0
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.changeSOIndex.bind(this)} activeOpacity={0.7}>
                      <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: this.state.titlebottomSO == 2 ? '#F14B79' : '#3E2D32',
                            paddingBottom: 16
                          }}
                        >
                          {i18n.t('Staking.nextUp')}
                        </Text>
                        <View
                          style={{
                            width: 30,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: '#F14B79',
                            opacity: this.state.titlebottomSO == 2 ? 1 : 0
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>

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
                    {this.state.titlebottomSO == 1 ? ( // Validators
                      this.state.validatorNum == 0 ? (
                        <View style={{ paddingVertical: 30 }}>
                          <Text style={{ color: '#696969' }}>{i18n.t('Staking.NoValidator')}</Text>
                        </View>
                      ) : (
                        this.state.validators.map((item, index) => (
                          <TouchableOpacity
                            key={index}
                            activeOpacity={0.7}
                            onPress={this.toValidator_Info.bind(this, formatData(item).stashId)}
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
                            <Identicon size={25} theme="polkadot" value={String(formatData(item).stashId)} />
                            <View style={{ flex: 1 }}>
                              <Text
                                ellipsizeMode="middle"
                                numberOfLines={1}
                                style={{
                                  width: 80,
                                  fontSize: 13,
                                  color: '#3E2D32',
                                  marginLeft: 12
                                }}
                              >
                                {String(formatData(item).stashId)}
                              </Text>
                            </View>
                            <Text style={{ justifyContent: 'flex-end', color: '#666666', fontSize: 10 }}>
                              {`${formatBalance(String(Number(formatData(item).stakers.own)))}(+${formatBalance(
                                Number(formatData(item).stakers.total) - Number(formatData(item).stakers.own)
                              )})`}
                            </Text>
                          </TouchableOpacity>
                        ))
                      )
                    ) : this.state.nextUp.length == 0 ? ( // Next up没有数据 | Not have data
                      <View style={{ alignItems: 'center', paddingVertical: 30 }}>
                        <Text style={{ color: '#696969' }}>{i18n.t('Staking.NoValidator')}</Text>
                      </View>
                    ) : (
                      this.state.nextUp.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          activeOpacity={0.7}
                          onPress={this.toValidator_Info.bind(this, item)}
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
                          <Identicon size={25} theme="polkadot" value={String(item)} />
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
                              {String(item)}
                            </Text>
                          </View>
                          <Text style={{ justifyContent: 'flex-end', color: '#666666', fontSize: 12 }}>
                            {this.state.nextUpBalances.length > 0
                              ? formatBalance(
                                  String(Number(formatData(this.state.nextUpBalances[index]).stakingLedger.active))
                                )
                              : '0'}
                          </Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                </View>
              </View>
            ) : (
              <View
                style={{
                  width: ScreenWidth,
                  backgroundColor: '#F6F6F6',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start'
                }}
              >
                {/* 顶部导航栏加tab切换 */}
                <ImageBackground
                  resizeMode="stretch"
                  source={require('../../assets/images/staking/staking_nav_bg.png')}
                  style={styles.navContent}
                ></ImageBackground>

                <View
                  style={{
                    width: ScreenWidth,
                    backgroundColor: '#F6F6F6',
                    alignItems: 'center',
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                    marginTop: -74
                  }}
                >
                  {/* 图表 | chart */}
                  <View
                    style={{
                      width: ScreenWidth * 0.89,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20
                    }}
                  >
                    <Echarts height={ScreenHeight / 3} option={this.state.StakingOption} />
                  </View>
                  {/* 个人信息 | account info */}
                  <View
                    style={{
                      width: ScreenWidth * 0.89,
                      backgroundColor: '#fff',
                      marginVertical: 20,
                      borderRadius: 8,
                      paddingBottom: 20
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 21 }}>
                      <View style={{ width: 54, alignSelf: 'flex-start', marginLeft: 32 }}>
                        {this.state.controllerAccountTag && (
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {
                              doubleClick(this.selectJumpPage.bind(this))
                            }}
                          >
                            <Image
                              source={require('../../assets/images/public/set.png')}
                              style={{ tintColor: '#F14B79', width: 20, height: 20 }}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      <View
                        style={{
                          width: (ScreenWidth - 87) / 2,
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          paddingLeft: 30
                        }}
                      >
                        <Identicon
                          size={36}
                          theme="polkadot"
                          value={
                            this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address
                          }
                        />
                        <Text
                          style={{ color: '#4B4B4B', marginBottom: ScreenHeight / 40, fontSize: ScreenHeight / 47.65 }}
                        >
                          {this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].account}
                        </Text>
                      </View>
                      {/* 控制账户或者储存账户信息 | Control or stash account info */}
                      <View
                        style={{
                          flex: 1,
                          paddingTop: 5,
                          alignItems: 'center',
                          paddingRight: 20
                        }}
                      >
                        {((this.state.stashAccountTag && this.state.controllersAccount) ||
                          this.state.controllerAccountTag) && (
                          <View style={{ alignItems: 'center' }}>
                            <Identicon
                              size={24}
                              theme="polkadot"
                              value={
                                this.state.stashAccountTag
                                  ? this.state.controllersAccount
                                  : this.state.controllerToStash.address
                              }
                            />
                            <Text
                              ellipsizeMode="middle"
                              numberOfLines={1}
                              style={{
                                fontSize: 11,
                                textAlign: 'center',
                                color: '#3E2D32',
                                marginTop: 8,
                                marginBottom: 2
                              }}
                            >
                              {this.state.stashAccountTag ? i18n.t('Staking.controller') : i18n.t('Staking.stash')}
                            </Text>
                            <Text
                              ellipsizeMode="middle"
                              numberOfLines={1}
                              style={{ fontSize: 9, textAlign: 'center', color: '#3E2D32' }}
                            >
                              {this.state.stashAccountTag
                                ? this.state.controllersAccount
                                : this.state.controllerToStash.address}
                            </Text>
                            {this.state.controllerAccountTag && (
                              <Text
                                ellipsizeMode="middle"
                                numberOfLines={1}
                                style={{ fontSize: 10, textAlign: 'center', color: '#AAAAAA' }}
                              >
                                {formatBalance(String(this.state.controllerToStash.polkakey || '1000000000'))}
                              </Text>
                            )}
                          </View>
                        )}
                      </View>
                    </View>
                    {/* 不同账户显示不同类型的余额信息 | Different accounts display balance info */}
                    <View style={{ alignItems: 'center', marginTop: 12 }}>
                      <Text
                        ellipsizeMode="middle"
                        numberOfLines={1}
                        style={{
                          fontSize: 13,
                          textAlign: 'center',
                          color: '#3E2D32',
                          width: 165
                        }}
                      >
                        {this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address}
                      </Text>
                      {this.state.stashAccountTag && this.state.controllersAccount ? (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ marginTop: 10, fontSize: 14, color: '#AAAAAA' }}>
                            {`available  ${formatBalance(this.state.AccountMsg.available)}`}
                          </Text>
                          {/* balance */}
                          <Text style={{ marginTop: 10, fontSize: 14, color: '#AAAAAA' }}>
                            {i18n.t('Staking.balance')}
                            {`  ${formatBalance(this.state.AccountMsg.balance)}`}
                          </Text>
                          {/* bonded */}
                          <Text style={{ marginTop: 10, fontSize: 14, color: 'green' }}>
                            {`bonded  ${formatBalance(this.state.AccountMsg.bonded)}`}
                          </Text>
                          {/* lockedes */}
                          {this.state.AccountMsg.lockedes.map((v, i) => (
                            <Text key={i} style={{ marginTop: 10, fontSize: 14, color: '#AAAAAA' }}>
                              {i18n.t('Staking.locked')}
                              {`  ${formatBalance(v.value)}(${v.era} ${i18n.t('Staking.eraLeft')})`}
                            </Text>
                          ))}
                        </View>
                      ) : (
                        <Text style={{ marginTop: 10, fontSize: 14, color: '#AAAAAA' }}>
                          {i18n.t('Staking.balance')}
                          {`  ${formatBalance(this.state.AccountMsg.balance)}`}
                        </Text>
                      )}
                    </View>

                    {/* 根据不同的账户状态显示不同的按钮 | Different accounts display buttons */}
                    {this.state.showBtnType == 0 ? (
                      <Text></Text>
                    ) : // 0 不展示 | Not to show
                    this.state.showBtnType == 1 ? ( // 1.追加绑定 | AddBond
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: 20
                        }}
                      >
                        <TouchableOpacity
                          onPress={this.BondAdditional.bind(this)}
                          style={{
                            flexDirection: 'row',
                            width: 143,
                            height: 40,
                            marginLeft: 10,
                            borderRadius: 6,
                            alignItems: 'center',
                            backgroundColor: '#7AD52A',
                            justifyContent: 'center'
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={{ color: '#FFF' }}>{i18n.t('Staking.BondAdditional')}</Text>
                        </TouchableOpacity>
                      </View>
                    ) : this.state.showBtnType == 2 ? ( // 2.追加绑定禁止点击 | Can't click AddBodn button
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: 20
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            width: 143,
                            height: 40,
                            marginLeft: 10,
                            borderRadius: 6,
                            alignItems: 'center',
                            backgroundColor: '#DDDDDD',
                            justifyContent: 'center'
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={{ color: '#FFF' }}>{i18n.t('Staking.BondAdditional')}</Text>
                        </TouchableOpacity>
                      </View>
                    ) : this.state.showBtnType == 3 ? ( // 3. 取消提名 | Unnominate
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: 20
                        }}
                      >
                        <TouchableOpacity
                          onPress={this.Unnominate.bind(this)}
                          style={{
                            flexDirection: 'row',
                            width: 143,
                            height: 40,
                            marginLeft: 10,
                            borderRadius: 6,
                            alignItems: 'center',
                            backgroundColor: '#F14B79',
                            justifyContent: 'center'
                          }}
                          activeOpacity={0.7}
                        >
                          <Image source={require('../../assets/images/staking/staking_nomin.png')} />
                          <Text style={{ marginLeft: 12, color: '#FFF' }}>{i18n.t('Staking.Unnominate')}</Text>
                        </TouchableOpacity>
                      </View>
                    ) : this.state.showBtnType == 4 ? ( // 4.取消验证 | Unvalidate
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: 20
                        }}
                      >
                        <TouchableOpacity
                          onPress={this.Unvalidate.bind(this)}
                          style={{
                            flexDirection: 'row',
                            width: 143,
                            height: 40,
                            marginLeft: 10,
                            borderRadius: 6,
                            alignItems: 'center',
                            backgroundColor: '#F14B79',
                            justifyContent: 'center'
                          }}
                          activeOpacity={0.7}
                        >
                          <Image source={require('../../assets/images/staking/staking_stake_icon.png')} />
                          <Text style={{ marginLeft: 12, color: '#FFF' }}>{i18n.t('Staking.Unvalidate')}</Text>
                        </TouchableOpacity>
                      </View>
                    ) : this.state.showBtnType == 5 ? ( // 5.提名 + 验证 | nominate + validate
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: 20
                        }}
                      >
                        <TouchableOpacity
                          onPress={this.Validate.bind(this)}
                          style={{
                            flexDirection: 'row',
                            width: 143,
                            height: 40,
                            alignItems: 'center',
                            borderRadius: 6,
                            backgroundColor: '#76CE29',
                            justifyContent: 'center'
                          }}
                          activeOpacity={0.7}
                        >
                          <Image source={require('../../assets/images/staking/staking_stake_icon.png')} />
                          <Text style={{ marginLeft: 12, color: '#FFF' }}>{i18n.t('Staking.Validate')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={this.Nominate.bind(this)}
                          style={{
                            flexDirection: 'row',
                            width: 143,
                            height: 40,
                            marginLeft: 10,
                            borderRadius: 6,
                            alignItems: 'center',
                            backgroundColor: '#F14B79',
                            justifyContent: 'center'
                          }}
                          activeOpacity={0.7}
                        >
                          <Image source={require('../../assets/images/staking/staking_nomin.png')} />
                          <Text style={{ marginLeft: 12, color: '#FFF' }}>{i18n.t('Staking.Nominate')}</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      // 6.绑定 | Bond
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: 20
                        }}
                      >
                        <TouchableOpacity
                          onPress={this.BondFunds.bind(this)}
                          style={{
                            flexDirection: 'row',
                            width: 143,
                            height: 40,
                            marginLeft: 10,
                            borderRadius: 6,
                            alignItems: 'center',
                            backgroundColor: '#7AD52A',
                            justifyContent: 'center'
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={{ color: '#FFF' }}>{i18n.t('Staking.BondFunds')}</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  {/* ACCOUNT Tab Switch */}
                  <View
                    style={{
                      height: 55,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          titlebottomAA: 1
                        })
                      }}
                      activeOpacity={0.7}
                      style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
                    >
                      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: this.state.titlebottomAA == 1 ? '#F14B79' : '#3E2D32',
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
                      style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
                    >
                      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: this.state.titlebottomAA == 2 ? '#F14B79' : '#3E2D32',
                            paddingBottom: 16
                          }}
                        >
                          {i18n.t('Staking.Nominating')}
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
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          titlebottomAA: 3
                        })
                      }}
                      activeOpacity={0.7}
                      style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
                    >
                      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: this.state.titlebottomAA == 3 ? '#F14B79' : '#3E2D32',
                            paddingBottom: 16
                          }}
                        >
                          {i18n.t('Staking.MyNominators')}
                        </Text>
                        <View
                          style={{
                            width: 30,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: '#F14B79',
                            opacity: this.state.titlebottomAA == 3 ? 1 : 0
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  {this.state.titlebottomAA == 1 ? (
                    // Staking Recored
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
                      {this.state.staking_list_alexander.length > 0 ? (
                        this.state.staking_list_alexander.map((item, index) => (
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
                                  ? require('../../assets/images/public/icon2.png')
                                  : require('../../assets/images/public/icon1.png')
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
                        ))
                      ) : this.state.hasNextPage ? (
                        <TouchableOpacity
                          onPress={this.Loadmore.bind(this)}
                          activeOpacity={0.7}
                          style={{ justifyContent: 'center', alignItems: 'center', height: ScreenHeight / 10 }}
                        >
                          <Text style={{ color: '#A9A9A9', fontSize: ScreenHeight / 52 }}>
                            {i18n.t('TAB.loadMore')}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={{ justifyContent: 'center', alignItems: 'center', height: ScreenHeight / 10 }}>
                          <Text style={{ color: '#A9A9A9', fontSize: ScreenHeight / 52 }}>{i18n.t('TAB.Bottom')}</Text>
                        </View>
                      )}
                    </View>
                  ) : this.state.titlebottomAA == 2 ? (
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
                      {this.state.nominating.length == 0 ? (
                        <View style={{ justifyContent: 'center', alignItems: 'center', height: ScreenHeight / 10 }}>
                          <Text style={{ color: '#A9A9A9', fontSize: ScreenHeight / 52 }}>
                            {i18n.t('Staking.noNominating')}
                          </Text>
                        </View>
                      ) : (
                        this.state.nominating.map((v, i) => (
                          <TouchableOpacity
                            key={i}
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
                            activeOpacity={0.7}
                          >
                            <Identicon size={25} theme="polkadot" value={String(v)} />
                            <View style={{ flex: 1 }}>
                              <Text
                                ellipsizeMode="middle"
                                numberOfLines={1}
                                style={{
                                  width: 80,
                                  fontSize: 13,
                                  color: '#3E2D32',
                                  marginLeft: 12
                                }}
                              >
                                {String(v)}
                              </Text>
                            </View>
                            <Text style={{ justifyContent: 'flex-end', color: '#666666', fontSize: 12 }}>
                              {this.state.nominatingBalance.length > 0 ? (
                                formatData(this.state.nominatingBalance[i]).stakers ? (
                                  `${formatBalance(
                                    String(Number(formatData(this.state.nominatingBalance[i]).stakers.own))
                                  )}(+${formatBalance(
                                    String(
                                      Number(formatData(this.state.nominatingBalance[i]).stakers.total) -
                                        Number(formatData(this.state.nominatingBalance[i]).stakers.own)
                                    )
                                  )})`
                                ) : (
                                  <Text>0</Text>
                                )
                              ) : (
                                '0'
                              )}
                            </Text>
                          </TouchableOpacity>
                        ))
                      )}
                    </View>
                  ) : this.state.titlebottomAA == 3 ? (
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
                      {this.state.myNominators.length == 0 ? (
                        <View style={{ justifyContent: 'center', alignItems: 'center', height: ScreenHeight / 10 }}>
                          <Text style={{ color: '#A9A9A9', fontSize: ScreenHeight / 52 }}>
                            {i18n.t('Staking.noNominee')}
                          </Text>
                        </View>
                      ) : (
                        this.state.myNominators.map((item, index) => (
                          <TouchableOpacity
                            key={index}
                            activeOpacity={0.7}
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
                                  width: 80,
                                  fontSize: 13,
                                  color: '#3E2D32',
                                  marginLeft: 12
                                }}
                              >
                                {formatData(item).who}
                              </Text>
                            </View>
                            <Text style={{ justifyContent: 'flex-end', color: '#666666', fontSize: 12 }}>
                              {formatBalance(formatData(item).value)}
                            </Text>
                          </TouchableOpacity>
                        ))
                      )}
                    </View>
                  ) : (
                    <View />
                  )}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }
}

export default Staking
