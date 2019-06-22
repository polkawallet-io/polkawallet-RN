/*
 * @Description: COPYRIGHT © 2018 POLKAWALLET (HK) LIMITED 
 *  This file is part of Polkawallet. 
 
 It under the terms of the GNU General Public License as published by 
 the Free Software Foundation, either version 3 of the License. 
 You should have received a copy of the GNU General Public License 
 along with Polkawallet. If not, see <http://www.gnu.org/licenses/>. 

 * @Autor: POLKAWALLET LIMITED
 * @Date: 2019-06-18 21:08:00
 */
import { AsyncStorage } from 'react-native'

/**
 * 数据持久化类 | Data persistence class
 */
export default class DataRepository {
  /**
   * 保存本地数据
   * @param key key
   * @param items value
   * @param callback  回调函数
   */
  saveLocalRepository(key, items, callback) {
    if (!items || !key) return

    AsyncStorage.setItem(key, JSON.stringify(items), callback)
  }

  /**
   * 获取本地的数据
   * @param key
   * @returns {Promise}
   */
  fetchLocalRepository(key) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(key, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result))
          } catch (e) {
            reject(e)
            console.log(e)
          }
        } else {
          reject(error)
          console.log(error)
        }
      })
    })
  }

  /**
   * 移除本地存的key
   * @param key
   * @returns {*}
   */
  removeLocalRepository(key, callback) {
    if (!key) return

    AsyncStorage.removeItem(key, callback)
  }

  /**
   * 移除本地存的keys
   * @param keys
   * @returns {*}
   */
  removeMultiLocalRepository(keys, callback) {
    if (!keys) return

    AsyncStorage.multiRemove(keys, callback)
  }

  /**
   * 获取网络的数据
   * @param key
   * @returns {Promise}
   */
  fetchNetRepository(key) {
    return new Promise((resolve, reject) => {
      fetch(key)
        .then(response => response.json())
        .then(responseData => {
          if (responseData) {
            this.saveRepository(key, responseData)
            resolve(responseData)
          } else {
            reject(new Error('responseData is null'))
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
