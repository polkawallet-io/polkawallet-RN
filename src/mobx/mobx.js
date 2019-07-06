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
import { observable } from 'mobx'

class StateStore {
  // 被观察的字段
  // Observed field
  @observable name = 'Zoey'

  // 被观察的字段
  // Observed field
  @observable API = {}

  // wss
  // @observable ENDPOINT = 'wss://poc3-rpc.polkadot.io/'
  // @observable ENDPOINT = 'ws://45.32.115.98:9944/'
  @observable ENDPOINT = 'ws://140.82.35.183:9944/'

  // 是否是第一次登陆
  // first time to use
  @observable isfirst = 0

  // 所有账户
  // All accounts
  @observable Accounts = [{ account: 'NeedCreate', address: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx' }]

  // 通讯录
  // Addresses
  @observable Addresses = []

  // 正在登陆的账户
  // Using account
  @observable Account = 0

  // 账户数量(除默认账户以外)
  // Account number (except default account)
  @observable Accountnum = 0

  // 刷新前登陆的账户
  // Refresh previously used accounts
  @observable refreshBefore = 0

  // 交易信息
  // Transaction infomation
  @observable transactions = {}

  // 当前交易信息是否是最后一页
  // Whether the current transaction information is the last page
  @observable hasNextPage

  // 当前账户在balances中的位置
  // Index of current account's balance in the balances
  @observable balanceIndex = 0

  // 所有账户balance
  // All accounts balance
  @observable balances = [{ address: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx', balance: 0 }]

  // 所有账户中有没有这个用户地址
  // Address duplicate exists
  @observable have = 0

  // balance
  @observable balance = '0'

  // 转账地址
  // Transfer address
  @observable inaddress = ''

  // 转账金额
  // Transfer value
  @observable value = 0

  // 第几笔交易
  // Transfer nonce
  @observable accountNonce = 0

  //* ****************** */Democracy界面*******************
  // referendumCount
  @observable referendumCount = '0'

  // 转到通讯录
  // Go to the address book
  @observable transfer_address = 0

  // 选中地址
  // Selected address
  @observable t_address = ''

  // 是否是从通讯录中选出的地址
  // Is selected from the address book?
  @observable isaddresses = 0

  // 判断是从哪里进入的nominate
  // 0代表从Account Actions界面，1代表Staking Overview
  // Determine which page to nominate; 0: from Account Actions； 1: from Staking Overview;
  @observable tonominate = 0

  // 判断是从哪里扫过来的
  // 0代表从Assets界面，1代表transfer，2代表通讯录
  // Determine where it Scan Qr from; 0: from Assets page; 1: from Addresses page;
  @observable tocamera = 0

  // 是否是扫码得到的地址
  // Got address from scan Qr?
  @observable iscamera = 0

  // 二维码扫描到的地址
  // The address from scan Qr
  @observable QRaddress = ''

  //* ****************************   设置   ***********************************
  // 手势密码
  // Gestures password
  @observable Gesture = ''

  // 手势密码的模式：0 代表无密码，1 代表确认密码，2 代表验证密码
  // The pattern of the gesture password; 0:  no password, 1:confirm password, 2: verify password
  @observable GestureState = 0
}

class RootStore {
  constructor() {
    this.stateStore = new StateStore()
  }
}
export default new RootStore()
