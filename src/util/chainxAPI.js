import { ApiBase, WsProvider, HttpProvider, Account } from 'chainx.js'
import { nacl } from 'tweetnacl'
import { async } from 'rxjs/internal/scheduler/async'
import AppState from '../mobx/mobx'
import { Alert } from 'react-native'
import { axiosGet } from './Common'
/**
 *
 * @description 判断是否为空对象 | Empty object judgment
 * @param {Object} obj 对象 | Object
 * @returns {Boolean} true 空对象 false 非空对象 | True: empty object, false: non-empty object
 */
function judgeObj(obj) {
  if (obj == null) {
    return false
  } else {
    return true
  }
}

const getAppApi = async () =>
  new Promise(function(resolve, reject) {
    try {
      ;(async () => {
        if (!judgeObj(AppState.stateStore.CHAINX_API)) {
          const provider = new WsProvider(AppState.stateStore.PCX_ENDPOINT)
          const chainx = new ApiBase(provider)
          AppState.stateStore.CHAINX_API = chainx
          await chainx._isReady
          resolve(chainx)
        } else {
          resolve(AppState.stateStore.CHAINX_API)
        }
      })()
    } catch (error) {
      reject(error)
    }
  })

const chainxAPI = {
  init: () => {
    return new Promise(function(resolve, reject) {
      try {
        return getAppApi()
      } catch (error) {
        reject(error)
      }
    })
  },
  getPrivateKey: (_json, _pwd) => {
    _json = JSON.parse(_json)
    delete _json.meta
    delete _json.address
    _json.iv = new Uint8Array(_json.iv.data)
    _json.salt = new Uint8Array(_json.salt.data)
    console.warn('getKeyStore' + JSON.stringify(_json))
    return new Promise(function(resolve, reject) {
      try {
        let userAccount = Account.fromKeyStore(_json, _pwd)

        resolve(userAccount.privateKey())
      } catch (error) {
        reject(error)
      }
    })
  },
  getAddress: _destkey => {
    if (!_destkey) {
      return 'wait to confirm'
    }
    let result = '~'
    try {
      result = Account.encodeAddress('0x' + _destkey)
    } catch (err) {}
    return result
  },
  getIfTransferIn: (_originAddress, _destkey) => {
    //如果原始地址和目标地址相同，则是转入，否则转出
    // _originAddress = '5TL7Rd7hxbUugkzuuZy7T41BcgqJ3E6F9U7HRAbBuyL7don2'
    let destAddress = ''
    try {
      destAddress = Account.encodeAddress('0x' + _destkey)
    } catch (error) {}
    console.warn('dest:' + _destkey + 'destaddress:' + destAddress)
    if (_originAddress == destAddress) {
      return true
    } else {
      return false
    }
  },
  getTxList: (_address, _pageNum) => {
    let publicKey = Account.decodeAddress(_address)
    return new Promise(async (resolve, reject) => {
      try {
        //let REQUEST_URL = 'https://api.chainx.org.cn/account/' + publicKey + '/transfers?page=' + _pageNum + '&page_size=10'
        let REQUEST_URL =
          'https://api.chainx.org.cn/account/' + publicKey + '/transfers?page=' + _pageNum + '&page_size=10'
        let result = await axiosGet(REQUEST_URL)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  },
  // 获取时间戳
  timestampNow: cb => {
    if (cb) {
      ;(async () => {
        const api = await getAppApi()
        await api.query.timestamp.now(cb)
      })()
    } else {
      return new Promise(function(resolve, reject) {
        try {
          ;(async () => {
            const api = await getAppApi()
            const _data = await api.query.timestamp.now()
            resolve(_data)
          })()
        } catch (error) {
          reject(error)
        }
      })
    }
  },
  freeBalance: (_address, cb) => {
    if (cb) {
      ;(async () => {
        const api = await getAppApi()
        await api.rpc.chainx.getAssetsByAccount(_address, 0, 10)
      })()
    } else {
      return new Promise(function(resolve, reject) {
        try {
          ;(async () => {
            const api = await getAppApi()
            const _data = await api.rpc.chainx.getAssetsByAccount(_address, 0, 10)
            let balance = 0
            _data.data.forEach(element => {
              if (element.name == 'PCX') {
                balance = element.details.Free / 100000000
              }
            })
            resolve(balance)
          })()
        } catch (error) {
          AppState.stateStore.CHAINX_API = null
          reject(error)
        }
      })
    }
  },
  sign: (_address, _privatekey, _type, _amount, _memo, _param, cb) => {
    return new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          try {
            const api = await getAppApi()
            let signMethod = {}
            let nonce = {}
            if (_type == 'transfer') {
              console.warn('transfer memo' + _address)
              signMethod = api.tx.xAssets.transfer(_address, 'PCX', _amount, _memo).method.toHex()
            } else if (_type == 'nominate') {
              console.warn(`投票信息 address: ${_address} + amount: ${_amount} + memo: ${_memo}`)
              signMethod = api.tx.xStaking.nominate(_address, _amount, _memo).method.toHex()
            } else if (_type == 'unnominate') {
              signMethod = api.tx.xStaking.unnominate(_address, _amount, _memo).method.toHex()
            } else if (_type == 'voteClaim') {
              console.warn('voteclam......' + _type + '当前address....' + _address)
              signMethod = api.tx.xStaking.claim(_address)
            } else if (_type == 'refresh') {
              if (_param == null) {
                signMethod = api.tx.xStaking.refresh(null, true, null, '')
              } else {
                signMethod = api.tx.xStaking.refresh(
                  _param.url ? _param.url : null,
                  _param.desireToRun ? _param.desireToRun : true,
                  _param.nextKey ? _param.nextKey : null,
                  _param.about ? _param.about : ''
                )
              }
            } else if (_type == 'unfreeze') {
              console.warn('解冻......' + _type + 'address_' + _address + '当前param....' + _param)
              signMethod = api.tx.xStaking.unfreeze(_address, _param).method.toHex()
            } else {
              signMethod = api.tx.xAssets.transfer(_address, 'PCX', _amount, _memo).method.toHex()
            }
            const extrinsic = api.createExtrinsic(signMethod)
            if (_type != 'transfer') {
              console.warn('privateKey' + _privatekey)
              extrinsic.signAndSend(_privatekey, (error, response) => {
                if (error) {
                  reject(error)
                } else if (response.status === 'Finalized') {
                  if (response.result === 'ExtrinsicSuccess') {
                    resolve(`response`.result)
                    console.log('交易成功')
                  } else {
                    reject(response.result)
                  }
                }
              })
            } else {
              const nonce = await api.query.system.accountNonce(Account.from(_privatekey).address())
              const signedExtrinsic = extrinsic.sign(_privatekey, {
                acceleration: 10,
                nonce
              })
              resolve(signedExtrinsic.toHex())
            }
          } catch (error) {
            reject(error)
          }
        })()
      } catch (error) {
        reject(error)
      }
    })
  },
  signAndsend: async (_targetAddress, _from, _amount, _privatekey, _memo) => {
    return new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const extrinsic = api.tx.xAssets.transfer(_targetAddress, _from, _amount, _memo)
          const result = extrinsic.signAndSend(_privatekey, { acceleration: 10 }, (error, response) => {
            if (error) {
              resolve(error)
            } else if (response.status === 'Finalized') {
              if (response.result === 'ExtrinsicSuccess') {
                resolve(response.result)
                console.log('交易成功')
              }
            }
          })
        })()
      } catch (error) {
        reject(error)
      }
    })
  },
  properties: () =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.rpc.system.properties()
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  fees: () =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.derive.balances.fees()
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  transfer: (_address, _value, _momo) =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = api.asset.transfer(_address, 'PCX', _value, _momo)
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    })
}

export default chainxAPI
