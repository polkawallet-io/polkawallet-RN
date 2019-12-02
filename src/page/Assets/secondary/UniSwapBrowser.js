import React, { Component } from 'react'
import { WebView, View, Alert } from 'react-native'
import chainxAPI from '../../../util/chainxAPI'
import { observer, inject } from 'mobx-react'
import { ScreenWidth, ScreenHeight, doubleClick, nativePostMsg } from '../../../util/Common'
import PasswordPicker from '../../../components/PasswordPicker'
import AccountsApi from '../../../util/AccountUtils'
import polakDotApi from '../../../util/polkadotAPI'
import { TYPE_CHAINX, TYPE_KUSMA } from '../../../util/Constant'
import { formatBalance } from '@polkadot/util'

const INJECTEDJAVASCRIPT = `
  const meta = document.createElement('meta'); 
  meta.setAttribute('content', 'initial-scale=1, maximum-scale=1, user-scalable=1'); 
  meta.setAttribute('name', 'viewport'); 
  document.getElementsByTagName('head')[0].appendChild(meta); 
`
@inject('rootStore')
@observer
class UniSwapBrowser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isModel1: false,
      destination: '',
      //'PCX'
      amount: '',
      memo: '',
      type: '',
      currentAccountAddress: this.props.rootStore.stateStore.currentAccount.address
    }
  }
  isJsonString(str) {
    try {
      if (typeof JSON.parse(str) == 'object') {
        return true
      }
    } catch (e) {}
    return false
  }

  // 接受事件回调
  async onMessage(event) {
    let data = event.nativeEvent.data
    let jData = {}
    if (this.isJsonString(data)) {
      jData = JSON.parse(data)
    } else {
      jData = {
        type: 'getData'
      }
    }
    switch (jData.type) {
      // 对交易进行签名
      case 'transfer':
        this.setState({
          isModel1: true
        })
        let type = TYPE_CHAINX
        if (jData.from == 'PCX') {
          type = TYPE_CHAINX
        } else {
          type = TYPE_KUSMA
        }
        this.setState({
          isModel1: true,
          //目的地
          destination: jData.address,
          //'PCX'
          amount: jData.amount,
          from: jData.from,
          memo: jData.memo,
          type: type
        })
        break
      case 'alert':
        //Alert.alert('', JSON.stringify(jData.params))
        console.warn(JSON.stringify(jData.params))
        break
      case 'changeAccount':
        debugger
        if (jData.type == TYPE_CHAINX) {
          this.currentAccountAddress = this.props.rootStore.stateStore.currentAccount.address
        } else {
          this.currentAccountAddress = jData.currentAccountAddress
        }
        console.warn('切换后的地址为：' + this.currentAccountAddress)
        this.setState({
          currentAccountAddress: jData.currentAccountAddress,
          type: jData.currentType
        })
        break
      case 'getBalance':
        console.warn('获取balance' + jData.from)
        debugger
        this.setState({
          from: jData.from
        })
        this.getBalance(jData.from)
        break
      // 获取初始化数据
      case 'getData':
        ;(async () => {
          const walletAccounts = await AccountsApi.getUserAddress()
          let data = {
            address: this.props.rootStore.stateStore.currentAccount.address,
            walletAccounts: walletAccounts,
            type: 'getData'
          }
          this.webview.postMessage(JSON.stringify(data))
        })()
        break
      default:
        let addressData = {
          address: this.props.rootStore.stateStore.currentAccount.address,
          type: 'getData'
        }
        this.webview.postMessage(JSON.stringify(addressData))
        break
    }
  }

  getBalance(from) {
    ;(async () => {
      let walletbalance = 0
      let _from = 'PCX'
      if (!from) {
        _from = 'PCX'
      } else {
        _from = from
      }
      if (_from == 'PCX') {
        walletbalance = await chainxAPI.freeBalance(this.props.rootStore.stateStore.currentAccount.address)
      } else {
        console.warn('请求kusma地址.....' + this.state.currentAccountAddress)
        walletbalance = await polakDotApi.freeBalance(this.state.currentAccountAddress)
        walletbalance = String((walletbalance / 1000000000000).toFixed(2))
      }
      let data = {
        balance: walletbalance,
        type: 'getBalance'
      }
      this.webview.postMessage(JSON.stringify(data))
    })()
  }

  render() {
    return (
      <View
        style={{
          height: ScreenHeight,
          width: ScreenWidth
        }}
      >
        <WebView
          useWebKit={true}
          //source={{ uri: 'http://127.0.0.1:8080' }}
          source={{ uri: 'https://uniswap.chainx.org' }}
          scalesPageToFit={true}
          style={{
            marginTop: 20,
            width: ScreenWidth,
            height: ScreenHeight
          }}
          javaScriptEnable={true}
          javaScriptEnabled={true}
          ref={webview => (this.webview = webview)}
          onMessage={this.onMessage.bind(this)}
          injectedJavaScript={INJECTEDJAVASCRIPT}
        />
        <PasswordPicker
          isModel={this.state.isModel1}
          address={
            this.state.currentAccountAddress
              ? this.state.currentAccountAddress
              : this.props.rootStore.stateStore.currentAccount.address
          }
          type={this.state.type ? this.state.type : 2}
          onCancel={err => {
            let signResult = {
              signData: {},
              type: 'unlockError',
              result: 'cancel',
              errMsg: 'cancel'
            }

            this.setState({
              isModel1: false
            })
            this.webview.postMessage(JSON.stringify(signResult))
          }}
          onError={err => {
            // err不进行操作
            this.setState({
              isModel1: false
            })
            let signResult = {
              signData: {},
              type: 'unlockError',
              result: 'fail',
              errMsg: 'unlockError'
            }
            this.webview.postMessage(JSON.stringify(signResult))
          }}
          onGetPrivateKey={privatekey => {
            this.setState({
              isModel1: false
            })
            ;(async () => {
              this.setState({
                isModel1: false
              })
              let signResult = {}
              if (this.state.type == 2) {
                chainxAPI
                  .sign(this.state.destination, privatekey, 'transfer', this.state.amount * 100000000, this.state.memo)
                  .then(result => {
                    console.warn(`签名的source Tx 为 + ${result}`)
                    signResult = {
                      signData: result,
                      result: 'success',
                      type: 'transfer'
                    }
                    this.webview.postMessage(JSON.stringify(signResult))
                    this.getBalance('PCX')
                  })
                  .catch(err => {
                    signResult = {
                      signData: {},
                      type: 'transfer',
                      result: 'fail',
                      errMsg: JSON.stringify(err)
                    }
                    this.webview.postMessage(JSON.stringify(signResult))
                  })
              } else {
                debugger
                polakDotApi
                  .sign(
                    this.state.destination,
                    this.state.currentAccountAddress,
                    privatekey,
                    Number(this.state.amount) * Number(1000000000000),
                    this.state.mem
                  )
                  .then(result => {
                    signResult = {
                      signData: result,
                      result: 'success',
                      type: 'transfer'
                    }
                    debugger
                    this.webview.postMessage(JSON.stringify(signResult))
                    this.getBalance('KSM')
                  })
                  .catch(err => {
                    debugger
                    signResult = {
                      signData: {},
                      type: 'transfer',
                      result: 'fail',
                      errMsg: JSON.stringify(err)
                    }
                    this.webview.postMessage(JSON.stringify(signResult))
                  })
              }
            })()
          }}
        ></PasswordPicker>
      </View>
    )
  }
}

export default UniSwapBrowser
