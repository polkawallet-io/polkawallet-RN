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
  Image,
  TouchableOpacity,
  Clipboard,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native'
import { NavigationActions, StackActions } from 'react-navigation'
import { observer, inject } from 'mobx-react'
import { ScreenWidth, ScreenHeight, doubleClick } from '../../../util/Common'
import Header from '../../../components/Header'
import polkadotAPI from '../../../util/polkadotAPI'
import i18n from '../../../locales/i18n'

@inject('rootStore')
@observer
class BackupAccount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: this.props.navigation.state.params.key,
      address: this.props.navigation.state.params.address
    }
    this.copy = this.copy.bind(this)
    this.Cancel = this.Cancel.bind(this)
    this.Continue = this.Continue.bind(this)
  }

  /**
   * @description 点击取消|Click cancel
   */
  Cancel() {
    // 创建查询每个账户的进程
    // Create a process to query each account
    ;(async () => {
      await polkadotAPI.freeBalance(this.state.address, balance => {
        let _address = this.state.address
        this.props.rootStore.stateStore.have = 0
        this.props.rootStore.stateStore.balances.map((item, index) => {
          if (item.address == _address) {
            this.props.rootStore.stateStore.have = 1
            this.props.rootStore.stateStore.balances[index].balance = balance
          }
        })
        if (this.props.rootStore.stateStore.have == 0) {
          this.props.rootStore.stateStore.balances.push({
            address: _address,
            balance: balance
          })
        }
      })
    })()
    this.props.navigation.navigate('Create_Account')
  }

  /**
   * @description 点击确认|Click Continue
   */
  Continue() {
    // 创建查询每个账户的进程
    // Create a process to query each account
    ;(async () => {
      await polkadotAPI.freeBalance(this.state.address, balance => {
        let _address = this.state.address
        this.props.rootStore.stateStore.have = 0
        this.props.rootStore.stateStore.balances.map((item, index) => {
          if (item.address == _address) {
            this.props.rootStore.stateStore.have = 1
            this.props.rootStore.stateStore.balances[index].balance = balance
          }
        })
        if (this.props.rootStore.stateStore.have == 0) {
          this.props.rootStore.stateStore.balances.push({
            address: _address,
            balance: balance
          })
        }
      })
    })()
    let resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Tabbed_Navigation' })]
    })
    this.props.navigation.dispatch(resetAction)
  }

  /**
   * @description 拷贝|Click Copy
   */
  async copy() {
    Alert.alert('', i18n.t('TAB.CopySuccess'))
    Clipboard.setString(this.state.text)
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          hidden={false}
          backgroundColor="#FFF" // 状态栏背景颜色 | Status bar background color | Status bar background color
          barStyle="dark-content" // 状态栏样式（黑字）| Status bar style (black)| Status bar style (black)
        />
        {/* 标题栏 | Title bar */}
        <Header navigation={this.props.navigation} title="Backup Account" theme="dark" />
        <ScrollView>
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={styles.text}>{i18n.t('Assets.Warning')}</Text>
            <Text style={{ fontSize: 15, color: '#3E2D32' }}>{i18n.t('Assets.BeforeSafe')}</Text>
            <Text style={{ fontSize: 15, color: '#3E2D32' }}>{i18n.t('Assets.Restore')}</Text>
            <View
              style={{
                width: ScreenWidth - 40,
                height: 56,
                backgroundColor: '#F4F3F3',
                flexDirection: 'row',
                borderRadius: 6,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20
              }}
            >
              {/* The key */}
              <Text style={{ width: ScreenWidth - 75, paddingHorizontal: 20 }} ellipsizeMode="middle" numberOfLines={1}>
                {this.state.text}
              </Text>
              {/* copy */}
              <TouchableOpacity
                onPress={() => {
                  doubleClick(this.copy)
                }}
                activeOpacity={0.7}
                style={{ width: 30 }}
              >
                <Image source={require('../../../assets/images/public/copy.png')} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20
            }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.chooseView, { backgroundColor: '#F14B79' }]}
              onPress={this.Cancel}
            >
              <Text style={[styles.chooseText, { marginLeft: 0 }]}>{i18n.t('TAB.Cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chooseView, { backgroundColor: '#76CE29', marginLeft: 10 }]}
              activeOpacity={0.7}
              onPress={this.Continue}
            >
              <Text style={styles.chooseText}>{i18n.t('TAB.Continue')}</Text>
            </TouchableOpacity>
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
  text: {
    paddingVertical: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3E2D32'
  },
  textInput: {
    height: ScreenHeight / 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  textInputStyle: {
    height: ScreenHeight / 10,
    width: ScreenWidth * 0.75,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: ScreenHeight / 100,
    paddingLeft: ScreenHeight / 100,
    fontSize: ScreenHeight / 40,
    paddingVertical: 0
  },
  image: {
    marginLeft: ScreenWidth * 0.025,
    height: ScreenWidth * 0.07,
    width: ScreenWidth * 0.07,
    resizeMode: 'contain'
  },
  chooseText: {
    fontSize: 18,
    color: 'white'
  },
  chooseView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: 49,
    width: (ScreenWidth - 50) / 2
  }
})
export default BackupAccount
