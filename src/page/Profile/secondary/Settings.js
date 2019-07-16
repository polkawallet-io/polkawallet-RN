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
  AsyncStorage,
  Switch,
  Alert,
  Linking,
  Platform,
  StatusBar,
  SafeAreaView
} from 'react-native'
import { checkUpdate, downloadUpdate, switchVersion, switchVersionLater } from 'react-native-update'
import { NavigationActions, StackActions } from 'react-navigation'
import { observer, inject } from 'mobx-react'
import _updateConfig from '../../../../update.json'
import { ScreenWidth, ScreenHeight, doubleClick } from '../../../util/Common'
import Header from '../../../components/Header.js'
import i18n from '../../../locales/i18n'
import DataRepository from '../../../util/DataRepository'

const { appKey } = _updateConfig[Platform.OS]

@inject('rootStore')
@observer
class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Gesture: this.props.rootStore.stateStore.GestureState == 0 ? false : true
    }
    this.back = this.back.bind(this)
    this.Set_Node = this.Set_Node.bind(this)
    this.Gesture = this.Gesture.bind(this)
    this.Check_Update = this.Check_Update.bind(this)
  }

  /**
   * @description 返回|Click back
   */
  back() {
    this.props.navigation.navigate('Tabbed_Navigation')
  }

  /**
   * @description 切换到设置节点页面|Switch to Set_Node page
   */
  Set_Node() {
    this.props.navigation.navigate('Set_Node')
  }

  /**
   * @description 更新APP|Update App
   */
  doUpdate = info => {
    downloadUpdate(info)
      .then(hash => {
        Alert.alert('', i18n.t('Profile.restartApp'), [
          {
            text: 'Yes',
            onPress: () => {
              switchVersion(hash)
            }
          },
          { text: 'No' },
          {
            text: 'Next startup time',
            onPress: () => {
              switchVersionLater(hash)
            }
          }
        ])
      })
      .catch(() => {
        Alert.alert('', i18n.t('Profile.UpdateFailed'))
      })
  }

  /**
   * @description 检查是否有更新|Check Update of App
   */
  Check_Update() {
    checkUpdate(appKey)
      .then(info => {
        if (info.expired) {
          Alert.alert('', i18n.t('Profile.toAppStore'), [
            {
              test: 'No',
              style: 'cancel'
            },
            {
              text: 'Yes',
              onPress: () => {
                Linking.openURL('https://polkawallet.io/#download')
              }
            }
          ])
        } else if (info.upToDate) {
          Alert.alert('', i18n.t('Profile.appV'))
        } else {
          Alert.alert(
            '',
            i18n.t('Profile.checkNewV') + info.name + ',' + i18n.t('Profile.download') + '\n' + info.description,
            [
              {
                text: 'Yes',
                onPress: () => {
                  this.doUpdate(info)
                }
              },
              { text: 'No' }
            ]
          )
        }
      })
      .catch(() => {
        Alert.alert('', i18n.t('Profile.UpdateFailed'))
      })
  }

  /**
   * @description 设置手势密码|Set gesture password
   * @param {*} e
   */
  Gesture(e) {
    this.setState({ Gesture: e })
    if (e) {
      let resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Gesture' })]
      })
      this.props.navigation.dispatch(resetAction)
    } else {
      Alert.alert(
        '',
        i18n.t('Profile.deleteGP'),
        [
          {
            text: 'Cancel',
            onPress: () => {
              this.setState({ Gesture: true })
            },
            style: 'cancel'
          },
          {
            text: 'Confirm',
            onPress: () => {
              this.props.rootStore.stateStore.GestureState = 0
              AsyncStorage.removeItem('Gesture').then(Alert.alert('', i18n.t('Profile.gestureCanceled')))
            }
          }
        ],
        { cancelable: false }
      )
    }
  }

  /**
   * @description 更换语言|Change language
   */
  changeLanguage() {
    Alert.alert(
      '',
      i18n.t('TAB.ChangeLanguages'),
      [
        {
          text: 'English',
          onPress: () => {
            i18n.locale = 'en'
            this.setState({
              localLanguage: 'en'
            })
            new DataRepository().saveLocalRepository('localLanguage', 'en')
          },
          style: 'cancel'
        },
        {
          text: '简体中文',
          onPress: () => {
            i18n.locale = 'zh'
            this.setState({
              localLanguage: 'zh'
            })
            new DataRepository().saveLocalRepository('localLanguage', 'zh')
          }
        }
      ],
      { cancelable: true }
    )
  }

  render() {
    const msg = [i18n.t('Profile.RemoteNode'), i18n.t('Profile.CheckUpdate')]
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
        {/* 标题栏 | Title bar */}
        <StatusBar
          hidden={false}
          backgroundColor="#FFF" // 状态栏背景颜色 | Status bar background color
          barStyle="dark-content" // 状态栏样式（黑字）| Status bar style (black)
        />
        <View style={{ backgroundColor: '#FFFFFF' }}>
          <Header navigation={this.props.navigation} title={i18n.t('Profile.Setting')} theme="dark" />
        </View>

        {msg.map((item, index) => {
          return (
            <TouchableOpacity
              style={styles.msgView}
              key={index}
              activeOpacity={0.7}
              onPress={() => {
                if (index == 0) {
                  this.Set_Node()
                }
                if (index == 1) {
                  doubleClick(this.Check_Update())
                }
              }}
            >
              <Text style={styles.msgText}>{item}</Text>
              <View style={{ flex: 1 }} />
              <Image style={styles.msgImage} source={require('../../../assets/images/public/addresses_nav_go.png')} />
            </TouchableOpacity>
          )
        })}
        <TouchableOpacity
          style={styles.msgView}
          activeOpacity={0.7}
          onPress={() => {
            doubleClick(this.changeLanguage.bind(this))
          }}
        >
          <Text style={styles.msgText}>{i18n.t('TAB.ChangeLanguages')}</Text>
          <View style={{ flex: 1 }} />
          <Image style={styles.msgImage} source={require('../../../assets/images/public/addresses_nav_go.png')} />
        </TouchableOpacity>

        {/* Gesture */}
        <View style={[styles.msgView, { marginTop: ScreenHeight / 40 }]}>
          <Text style={styles.msgText}>{i18n.t('Profile.Gesture')}</Text>
          <View style={{ flex: 1 }} />
          <Switch
            style={{ marginRight: ScreenWidth / 28 }}
            value={this.state.Gesture} // 默认状态 | Default state
            onValueChange={e => this.Gesture(e)} // 当状态值发生变化值回调 | Callbacks when state values change
          />
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
  msgView: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 0.5,
    borderColor: '#ECE2E5',
    marginHorizontal: 1,
    paddingLeft: ScreenWidth * 0.05
  },
  msgText: {
    fontSize: 18,
    color: '#3E2D32'
  },
  msgImage: {
    marginRight: ScreenWidth / 28,
    height: ScreenHeight / 60,
    width: ScreenHeight / 60 / 1.83,
    resizeMode: 'contain'
  }
})
export default Settings
