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
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  AsyncStorage,
  StatusBar,
  Platform,
  SafeAreaView,
  InteractionManager
} from 'react-native'
import Identicon from 'polkadot-identicon-react-native'
import { observer, inject } from 'mobx-react'
import { ScreenWidth, ScreenHeight } from '../../../util/Common'
import Header from '../../../components/Header'
import i18n from '../../../locales/i18n'

@inject('rootStore')
@observer
class Addresses extends Component {
  constructor(props) {
    super(props)
    this.state = {
      is: false,
      s: 1,
      index: 0
    }
    this.back = this.back.bind(this)
    this.add_address = this.add_address.bind(this)
  }

  /**
   * @description 返回|Click the back
   */
  back() {
    this.props.navigation.navigate('Tabbed_Navigation')
  }

  /**
   * @description 切换 Add_address 页面|Switch to the Add_address page
   */
  add_address() {
    this.props.navigation.navigate('Add_address')
  }

  componentDidMount() {
    // 通过addListener开启监听，可以使用上面的四个属性
    // With addListener to enable listening, can use the four properties above
    this._didBlurSubscription = this.props.navigation.addListener('didFocus', payload => {
      InteractionManager.runAfterInteractions(() => {
        this.onDidFocus()
      })
    })
  }

  componentWillUnmount() {
    // 在页面消失的时候，取消监听
    // Unlisten when the page disappears
    this._didBlurSubscription && this._didBlurSubscription.remove()
  }

  /**
   * @description 页面获得焦点|Page gets focus
   */
  onDidFocus() {
    this.props.rootStore.stateStore.Addresses = []
    AsyncStorage.getItem('Addresses').then(result => {
      if (result != null) {
        JSON.parse(result).map((item, index) => {
          this.props.rootStore.stateStore.Addresses.push(item)
        })
      }
    })
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F14B79' }}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            paddingBottom: 40,
            marginBottom: -40
          }}
        >
          <StatusBar
            hidden={false}
            backgroundColor="#F14B79" // 状态栏背景颜色 | Status bar background color
            barStyle={Platform.OS == 'android' ? 'light-content' : 'dark-content'} // 状态栏样式（黑字）| Status bar style (black)
          />
          {/* 标题栏 | Title bar */}
          <View style={{ backgroundColor: '#F14B79' }}>
            <Header
              navigation={this.props.navigation}
              title={i18n.t('Profile.Addresses')}
              rightIcon={require('../../../assets/images/public/addresses_add.png')}
              rightPress={this.add_address}
            />
          </View>

          <ScrollView>
            {// Addresses.map((item,index)=>{
            this.props.rootStore.stateStore.Addresses.map((item, index) => {
              return (
                <TouchableOpacity
                  style={styles.view}
                  key={index}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (this.props.rootStore.stateStore.transfer_address == 0) {
                      this.props.navigation.navigate('Address_information', {
                        index: index
                      })
                    } else {
                      this.props.rootStore.stateStore.t_address = item.Address
                      this.props.rootStore.stateStore.isaddresses = 1
                      this.props.navigation.navigate('Transfer')
                    }
                  }}
                >
                  {/* 头像 | Identicon */}
                  <Identicon style={styles.image} value={item.Address} size={36} theme="polkadot" />
                  {/* 信息 | info */}
                  <View style={styles.text}>
                    <Text style={styles.text1}>{item.Name}</Text>
                    <Text style={styles.text3} ellipsizeMode="middle" numberOfLines={1}>
                      {item.Address}
                    </Text>
                    <Text style={styles.text2}>
                      {i18n.t('Profile.Memo')}:{item.Memo}
                    </Text>
                  </View>
                  {/* 查看详细信息 | View details */}
                  <Image style={styles.next} source={require('../../../assets/images/public/addresses_nav_go.png')} />
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
  title: {
    padding: ScreenHeight / 50,
    height: ScreenHeight / 9,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: '#776f71'
  },
  text_title: {
    fontSize: ScreenHeight / 37,
    fontWeight: 'bold',
    color: '#e6e6e6'
  },
  image_title: {
    height: ScreenHeight / 33.35,
    width: ScreenHeight / 33.35,
    resizeMode: 'contain'
  },
  view: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    height: 80
  },
  image: {
    marginLeft: 20
  },
  text: {
    marginLeft: ScreenWidth * 0.02,
    flex: 1,
    justifyContent: 'center'
  },
  text1: {
    fontSize: 18,
    color: '#3E2D32'
    // marginBottom: 12
  },
  text2: {
    fontSize: 14,
    color: '#AAAAAA'
  },
  text3: {
    width: ScreenWidth * 0.5,
    fontSize: 14,
    color: '#3E2D32'
    // marginBottom: 6
  },
  next: {
    marginRight: ScreenWidth / 28,
    height: ScreenHeight / 60,
    width: ScreenHeight / 60 / 1.83,
    resizeMode: 'contain'
  }
})
export default Addresses
