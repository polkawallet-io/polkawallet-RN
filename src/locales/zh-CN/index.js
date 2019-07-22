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
import Assets from './Assets/index'
import Staking from './Staking/index'
import Democracy from './Democracy/index'
import Profile from './Profile/index'

export default {
  TAB: {
    Assets: '资产',
    Staking: '抵押',
    Democracy: '民主',
    Profile: '设置',
    ChangeLanguages: '更换语言',
    PasswordMistake: '密码错误',
    PasswordCorrect: '密码正确',
    Reset: '重置',
    Save: '保存',
    Continue: '继续',
    Cancel: '取消',
    StakingOption: '资产变化记录，单位(xxx) ',
    Receive: '接收',
    Received: '接收',
    Send: '发送',
    loadMore: '加载更多',
    Bottom: '到底啦',
    noResponse: '反应超时，请再次尝试。',
    enterInformation: '请输入相关信息',
    signMess: '正在用该账户进行签名',
    unlockPassword: '输入密码解锁账户',
    loading: '加载中',
    CopySuccess: '复制成功',
    Copy: '复制',
    Confirm: '确认'
  },
  Assets: {
    ...Assets
  },
  Staking: {
    ...Staking
  },
  Democracy: {
    ...Democracy
  },
  Profile: {
    ...Profile
  }
}
