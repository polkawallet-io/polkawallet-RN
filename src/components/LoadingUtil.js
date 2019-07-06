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
const LoadingUtil = {
  /**
   * @description 展示loading框 | Show the loading frame.
   * @param {Number} timeOut 超时时间 默认3000 (3s) | Timeout default 3000 (3s).
   */
  showLoading(timeOut = 30000) {
    global.LoadingTip = true
    global.mLoadingComponentRef && global.mLoadingComponentRef.showLoading()
    this.timerLoading = setTimeout(() => {
      this.dismissLoading()
    }, timeOut)
  },
  /**
   * @description 隐藏loading框 | Hide the loading frame.
   */
  dismissLoading() {
    global.LoadingTip = false
    global.mLoadingComponentRef && global.mLoadingComponentRef.dismissLoading()
    this.timerLoading && clearTimeout(this.timerLoading)
  }
}

export default LoadingUtil
