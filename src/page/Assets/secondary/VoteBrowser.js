import React, { Component } from 'react'
import { WebView, View, Alert } from 'react-native'
import chainxAPI from '../../../util/chainxAPI'
import { observer, inject } from 'mobx-react'
import { ScreenWidth, ScreenHeight, doubleClick, nativePostMsg } from '../../../util/Common'
import PasswordPicker from '../../../components/PasswordPicker'
const INJECTEDJAVASCRIPT = `
  const meta = document.createElement('meta');
  meta.setAttribute('content', 'initial-scale=1, maximum-scale=1, user-scalable=1');
  meta.setAttribute('name', 'viewport');
  document.getElementsByTagName('head')[0].appendChild(meta);
`
//投票界面
@inject('rootStore')
@observer
class VoteBrowser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isModel1: false,
      destination: '',
      //'PCX'
      amount: '',
      memo: '',
      method: '',
      id: '',
      jsonrpc: '',
      revocationIndex: 1,
      optionalParams: null
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
        method: 'getAddress'
      }
    }
    switch (jData.method) {
      // 对交易进行签名
      case 'sign':
        this.setState({
          isModel1: true,
          //目的地
          destination: jData.address,
          //'PCX'
          amount: jData.amount,
          from: jData.from,
          memo: jData.memo,
          type: 'transfer'
        })
        break
      case 'alert':
        Alert.alert('', JSON.stringify(jData.params))
        break
      // 获取初始化数据
      case 'getAddress':
        let data = {
          result: {
            address: this.props.rootStore.stateStore.currentAccount.address
          },
          id: jData.id,
          method: jData.method,
          jsonrpc: jData.jsonrpc
        }
        this.webview.postMessage(JSON.stringify(data))
        break
      case 'unfreeze':
        console.warn(`接受到投票消息${JSON.stringify(jData)}`)
        this.setState({
          isModel1: true,

          //目的地
          destination: jData.params[0],
          id: jData.id,
          optionalParams: jData.params[1],
          method: jData.method,
          jsonrpc: jData.jsonrpc
        })
        break
      case 'nominate':
        console.warn(`接受到投票消息${JSON.stringify(jData)}`)
        this.setState({
          isModel1: true,
          //目的地
          destination: jData.params[0],
          amount: jData.params[1],
          memo: jData.params[2],
          id: jData.id,
          method: jData.method,
          jsonrpc: jData.jsonrpc
        })
        break
      case 'unnominate':
        console.warn(`解冻${JSON.stringify(jData)}`)
        this.setState({
          isModel1: true,
          //目的地
          destination: jData.params[0],
          amount: jData.params[1],
          memo: jData.params[2],
          id: jData.id,
          method: jData.method,
          jsonrpc: jData.jsonrpc
        })
        break
      case 'voteClaim':
        console.warn(`接受到提息${JSON.stringify(jData)}`)
        this.setState({
          isModel1: true,
          //目的地
          destination: jData.params[0],
          id: jData.id,
          method: jData.method
        })
        break
      case 'refresh':
        console.warn(`接受到投票消息${JSON.stringify(jData)}`)
        this.setState({
          isModel1: true,
          //目的地
          id: jData.id,
          method: jData.method,
          jsonrpc: jData.jsonrpc,
          optionalParams: {
            url: jData.params[0],
            desireToRun: jData[1],
            nextKey: jData[2],
            about: jData[3]
          }
        })
        break
      default:
        break
    }
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
          source={{ uri: this.props.rootStore.stateStore.DEFAULT_WALLET_CONFIG.voteUrl }}
          scalesPageToFit={true}
          style={{
            marginTop: 20,
            marginBottom: 40,
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
          address={this.props.rootStore.stateStore.currentAccount.address}
          type={this.props.rootStore.stateStore.currentAccount.type}
          onCancel={() => {
            this.setState({
              isModel1: false
            })

            signResult = {
              result: {
                signData: {},
                method: this.state.method
              },
              id: this.state.id,
              jsonrpc: this.state.jsonrpc,
              error: {
                errorCode: -1024,
                message: 'cancel'
              }
            }
            console.warn('cancel' + 'postmessage:' + JSON.stringify(signResult))
            this.webview.postMessage(JSON.stringify(signResult))
          }}
          onError={() => {
            this.setState({
              isModel1: false
            })
            console.warn('password is error')
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
              chainxAPI
                .sign(
                  this.state.destination,
                  privatekey,
                  this.state.method,
                  this.state.amount,
                  this.state.memo,
                  this.state.optionalParams
                )
                .then(result => {
                  signResult = {
                    result: {
                      signData: result,
                      method: this.state.method
                    },
                    id: this.state.id,
                    jsonrpc: this.state.jsonrpc
                  }
                  console.warn(`交易信息,method: ${this.state.method}, post结果: ${JSON.stringify(signResult)}`)
                  this.webview.postMessage(JSON.stringify(signResult))
                })
                .catch(err => {
                  signResult = {
                    result: {
                      signData: {},
                      method: this.state.method
                    },
                    id: this.state.id,
                    jsonrpc: this.state.jsonrpc,
                    error: {
                      errorCode: -1000,
                      message: JSON.stringify(err)
                    }
                  }
                  console.warn(
                    `地址: ${this.state.destination}   ,投票失败: ${this.state.method}, 失败原因: ${JSON.stringify(
                      signResult
                    )}`
                  )
                  this.webview.postMessage(JSON.stringify(signResult))
                })
            })()
          }}
        ></PasswordPicker>
      </View>
    )
  }
}

export default VoteBrowser
1
