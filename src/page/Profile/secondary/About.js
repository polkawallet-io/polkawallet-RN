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
import { StyleSheet, Text, View, Image, SafeAreaView, StatusBar } from 'react-native'
import { observer, inject } from 'mobx-react'
import { ScreenWidth, ScreenHeight } from '../../../util/Common'
import Header from '../../../components/Header'
import i18n from '../../../locales/i18n'

@inject('rootStore')
@observer
class About extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.back = this.back.bind(this)
  }

  /**
   * @description 返回|Click the back
   */
  back() {
    this.props.navigation.navigate('Tabbed_Navigation')
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar
          hidden={false}
          backgroundColor="#FFF" // 状态栏背景颜色 | Status bar background color
          barStyle="dark-content" // 状态栏样式（黑字）| Status bar style (black)
        />
        {/* 标题栏 | Title bar */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderBottomWidth: 0.5,
            borderBottomColor: '#ECE2E5'
          }}
        >
          <Header navigation={this.props.navigation} title={i18n.t('Profile.About')} theme="dark" />
        </View>
        {/* 图标 | LOGO */}
        <Image style={styles.msgImage} source={require('../../../assets/images/public/About_logo.png')} />
        {/* 简介 | Introduction */}
        <View style={styles.msgView}>
          <Text style={{ fontSize: 18, color: '#3E2D32', fontWeight: '700' }}>{i18n.t('Profile.PolkadotApp')}</Text>
        </View>
        {/* 官网 | Website */}
        <View style={styles.msgView}>
          <Text style={{ fontSize: 15, color: '#3E2D32' }}>https://polkawallet.io</Text>
        </View>
        {/* 版本 | Version */}
        <View style={{ flex: 1 }} />
        <View style={[styles.msgView, { marginBottom: ScreenHeight / 30 }]}>
          <Text style={{ fontSize: 15, color: '#AAAAAA' }}>{i18n.t('Profile.Version')}: 0.1.9</Text>
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
    justifyContent: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    height: ScreenHeight / 18
  },
  msgText: {
    fontSize: ScreenWidth / 25,
    color: '#808080'
  },
  msgImage: {
    marginTop: 200,
    marginBottom: ScreenHeight / 40,
    alignSelf: 'center',
    // height: ScreenHeight / 4,
    // width: ScreenHeight / 4,
    resizeMode: 'contain'
  }
})
export default About
