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
import i18n, { getLanguages } from 'react-native-i18n'
import en from './en-US/index'
import zh from './zh-CN/index'

getLanguages().then(languages => {
  if (languages[0] == 'en' || languages[0] == 'en-US') {
    i18n.defaultLocale = 'en'
  } else {
    i18n.defaultLocale = 'zh'
  }
})

i18n.fallbacks = true
i18n.translations = {
  en,
  zh
}
export default i18n
