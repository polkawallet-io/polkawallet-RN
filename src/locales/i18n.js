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
import i18n from 'react-native-i18n'
import en from './en-US/index'
import zh from './zh-CN/index'
import DataRepository from '../util/DataRepository'

i18n.defaultLocale = 'en'
i18n.fallbacks = true
i18n.translations = {
  zh,
  en
}
i18n.localeLanguage = () => {
  new DataRepository()
    .fetchLocalRepository('localLanguage')
    .then(res => {
      i18n.locale = res
    })
    .catch(() => {
      i18n.locale = 'en'
    })

  return i18n.locale
}
i18n.locale = 'en'
export default i18n
