import SInfo from 'react-native-sensitive-info'
import Keyring from '@polkadot/keyring'
import { Dimensions, Alert } from 'react-native'
import i18n from '../locales/i18n'
// 返回页面宽度
// Get page width
export const ScreenWidth = Dimensions.get('window').width
// 返回页面高度
// Get page height
export const ScreenHeight = Dimensions.get('window').height

// 根据单位名称获取值
// Gets the value based on the unit name
export function getUnit(type) {
  let unit = 1
  type = String(type)
  switch (type) {
    case 'femto':
      unit = '1'
      break
    case 'pico':
      unit = '1000'
      break
    case 'nano':
      unit = '1000000'
      break
    case 'micro':
      unit = '1000000000'
      break
    case 'milli':
      unit = '1000000000000'
      break
    case 'DOT':
      unit = '1000000000000000'
      break
    case 'Kilo':
      unit = '1000000000000000000'
      break
    case 'Mega':
      unit = '1000000000000000000000'
      break
    case 'Giga':
      unit = '1000000000000000000000000'
      break
    case 'Tera':
      unit = '1000000000000000000000000000'
      break
    case 'Peta':
      unit = '1000000000000000000000000000000'
      break
    case 'Exa':
      unit = '1000000000000000000000000000000000'
      break
    case 'Zeta':
      unit = '1000000000000000000000000000000000000'
      break
    default:
      // Yotta
      unit = '1000000000000000000000000000000000000000'
  }
  return unit
}
/**
 * 校验密码 方法整合 | Verify password, method integration
 * @param {Object} params            传入的对象 | Incoming object
 * @param {String} params.address    地址 | Address
 * @param {String} params.password   密码 | Password
 * @param {Function} params.success  成功回调方法 | Success callback method
 * @param {Function} params.error    密码错误的回调 | Password error callback method
 */
export function checkPwd(params) {
  const keyring = new Keyring()
  SInfo.getItem(params.address, {
    sharedPreferencesName: 'Polkawallet',
    keychainService: 'PolkawalletKey'
  }).then(result => {
    const loadPair = keyring.addFromJson(JSON.parse(result))
    try {
      loadPair.decodePkcs8(params.password)
    } catch (error) {
      params.error && params.error()
      Alert.alert(
        '',
        i18n.t('TAB.PasswordMistake'),
        [
          {
            text: 'OK',
            onPress: () => {}
          }
        ],
        { cancelable: false }
      )
    }
    !loadPair.isLocked() && (params.success && params.success(loadPair, SInfo))
  })
}

// 格式化api返回的对象
// Format the object returned by the API
export function formatData(data) {
  if (data) {
    return JSON.parse(JSON.stringify(data))
  }
}
export function axios(url, params, type = 'POST', noJson = false) {
  const map = {
    method: type
  }
  const privateHeaders = {
    'Content-Type': 'application/json'
  }
  map.headers = privateHeaders
  map.follow = 20
  map.timeout = 0
  map.body = params
  if (noJson) {
    return new Promise((resolve, reject) => {
      fetch(url, map)
        .then(responseData => {
          resolve(responseData)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
  return new Promise((resolve, reject) => {
    fetch(url, map)
      .then(response => response.json())
      .then(responseData => {
        if (responseData) {
          resolve(responseData)
        } else {
          reject(console.log('responseData is null'))
        }
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function accountId(address, networkType = 'substrate') {
  if (typeof address !== 'string' || address.length === 0) {
    return ''
  } else {
    return `${networkType}:${address}`
  }
}
export function ScannerType(data) {
  if (typeof data !== 'string' || !data) {
    return ''
  } else {
    let type = ''
    let QRData = ''
    try {
      if (data.indexOf('substrate:') > -1) {
        type = 'substrate'
        QRData = data.split('substrate:')[1]
      } else {
        type = ''
        QRData = data
      }
    } catch (e) {
      type = ''
      QRData = data
    }
    return {
      type: type,
      data: QRData
    }
  }
}
