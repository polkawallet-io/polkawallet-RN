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
import React, { PureComponent } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Clipboard,
  StatusBar,
  SafeAreaView,
  Alert,
  Linking
} from 'react-native'
import moment from 'moment/moment'
import { formatBalance } from '@polkadot/util'
import { observer, inject } from 'mobx-react'
import QRCode from 'react-native-qrcode'
import { ScreenWidth, ScreenHeight } from '../../../../util/Common'
import Header from '../../../../components/Header'
import i18n from '../../../../locales/i18n'

@inject('rootStore')
@observer
class Transfer_details extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.navigation.state.params.data,
      url: 'https://polkascan.io/pre/alexander/system/block/'
    }
    this.back = this.back.bind(this)
    this.copyTo = this.copyTo.bind(this)
    this.copyFrom = this.copyFrom.bind(this)
  }

  /**
   * @description 点击返回 | Click the back
   */
  back() {
    this.props.navigation.navigate('Coin_details')
  }

  /**
   * @description 拷贝 | Click the copy of "To address"
   */
  async copyTo() {
    Clipboard.setString(
      this.state.data.tx_type == 'Send'
        ? this.state.data.tx_address
        : this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address
    )
    Alert.alert('', i18n.t('TAB.CopySuccess'))
  }

  /**
   * @description 拷贝 from | Click the copy of "From address"
   */
  async copyFrom() {
    Clipboard.setString(
      this.state.data.tx_type == 'Send'
        ? this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address
        : this.state.data.tx_address
    )
    Alert.alert('', i18n.t('TAB.CopySuccess'))
  }

  /**
   * @description 打开区块浏览器 | Open the block explorer
   */
  open = () => {
    Linking.openURL(this.state.url + String(this.state.data.tx_blocknumber))
  }

  render() {
    return (
      <SafeAreaView style={[styles.container]}>
        <StatusBar
          hidden={false}
          backgroundColor="#FFF" // 状态栏背景颜色 | Status bar background color
          barStyle="dark-content" // 状态栏样式（黑字）| Status bar style (black)
        />
        {/* 标题栏 | Title bar */}
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#ECE2E5' }}>
          <Header navigation={this.props.navigation} title={i18n.t('Assets.Details')} theme="dark" />
        </View>
        <View
          style={{
            height: ScreenHeight / 4,
            width: ScreenWidth,
            borderBottomWidth: 0.5,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#ECE2E5'
          }}
        >
          {/* 图标 */}
          <Image
            style={{
              height: ScreenHeight / 16,
              width: ScreenHeight / 16,
              marginTop: 30,
              tintColor: '#76CE29'
            }}
            source={require('../../../../assets/images/public/success.png')}
          />
          {/* 状态 */}
          <Text
            style={{
              marginTop: 30,
              fontSize: 18,
              fontWeight: '500',
              color: '#3E2D32'
            }}
          >
            {this.state.data.tx_type + ':' + i18n.t('Assets.Successed')}
          </Text>
          {/* 日期 */}
          <Text
            style={{
              marginTop: 12,
              fontSize: 14,
              color: '#AAAAAA',
              marginBottom: 40
            }}
          >
            {moment(this.state.data.tx_timestamp).format('DD/MM/YYYY HH:mm:ss')}
          </Text>
        </View>
        <View
          style={{
            height: ScreenHeight / 1.8,
            width: ScreenWidth,
            paddingHorizontal: 20
          }}
        >
          {/* Balance */}
          <View style={styles.list_View}>
            <Text style={styles.list_text1}>{i18n.t('Assets.Balance')}:</Text>
            <Text style={[styles.list_text2, { fontSize: 16 }]}>{formatBalance(String(this.state.data.tx_value))}</Text>
          </View>
          {/* Fees */}
          <View style={styles.list_View}>
            <Text style={styles.list_text1}>{i18n.t('Assets.Fees')}:</Text>
            <Text style={styles.list_text2}>{formatBalance(String(this.state.data.tx_fees))} </Text>
          </View>
          {/* To */}
          <View style={styles.list_View}>
            <Text style={[styles.list_text1, { width: ScreenWidth * 0.23 - ScreenHeight / 200 }]}>
              {i18n.t('Assets.To')}:
            </Text>
            <View style={styles.grey_text}>
              <Text style={styles.address} ellipsizeMode="middle" numberOfLines={1}>
                {this.state.data.tx_type == 'Send'
                  ? this.state.data.tx_address
                  : this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.copyTo()
              }}
              activeOpacity={0.7}
            >
              <Image style={styles.list_image} source={require('../../../../assets/images/public/copy.png')} />
            </TouchableOpacity>
          </View>
          {/* From */}
          <View style={styles.list_View}>
            <Text style={[styles.list_text1, { width: ScreenWidth * 0.23 - ScreenHeight / 200 }]}>
              {i18n.t('Assets.From')}:
            </Text>
            <View style={styles.grey_text}>
              <Text style={[styles.address, { fontSize: 14 }]} ellipsizeMode="middle" numberOfLines={1}>
                {this.state.data.tx_type == 'Send'
                  ? this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address
                  : this.state.data.tx_address}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                this.copyFrom()
              }}
              activeOpacity={0.7}
            >
              <Image style={styles.list_image} source={require('../../../../assets/images/public/copy.png')} />
            </TouchableOpacity>
          </View>
          {/* Block */}
          <View style={styles.list_View}>
            <Text style={styles.list_text1}>{i18n.t('Assets.Block')}:</Text>
            <Text style={[styles.list_text2, { fontSize: 16 }]}>#{this.state.data.tx_blocknumber}</Text>
          </View>
          {/* BlockHash */}
          <View style={styles.list_View}>
            <Text style={styles.list_text1}>{i18n.t('Assets.BlockHash')}:</Text>
            <Text
              style={[{ fontSize: 16, color: '#3E2D32', width: ScreenWidth * 0.4 }]}
              ellipsizeMode="middle"
              numberOfLines={1}
            >
              {this.state.data.tx_blockhash}
            </Text>
          </View>
          <TouchableWithoutFeedback onPress={this.open}>
            <View style={styles.viewForText}>
              <Text style={{ color: '#3385ff' }}>View in the Polkascan.io</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View
              style={{
                width: 75,
                height: 75,
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <QRCode
                value={this.state.url + String(this.state.data.tx_blocknumber)}
                size={75}
                bgColor="black"
                fgColor="white"
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
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
    color: '#e6e6e6'
  },
  image_title: {
    height: ScreenHeight / 33.35,
    width: ScreenHeight / 33.35,
    resizeMode: 'contain'
  },
  list_View: {
    marginTop: ScreenHeight / 50,
    height: ScreenHeight / 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  list_text1: {
    width: ScreenWidth * 0.25,
    fontSize: 16,
    color: '#AAAAAA'
  },
  list_text2: {
    flex: 1,
    fontSize: 14,
    color: '#3E2D32'
  },
  list_image: {
    marginLeft: ScreenWidth * 0.05,
    marginRight: ScreenWidth * 0.02,
    height: ScreenHeight / 40,
    width: ScreenHeight / 40,
    resizeMode: 'contain'
  },
  grey_text: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  address: {
    fontSize: 14,
    color: '#3E2D32',
    margin: ScreenHeight / 200
  },
  viewForText: {
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#3E2D32',
    paddingVertical: 20
  }
})
export default Transfer_details
