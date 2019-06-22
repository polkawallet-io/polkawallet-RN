import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Platform } from 'react-native'
import { observer, inject } from 'mobx-react'
import { ScreenWidth } from '../../util/Common'
import Referendums from './Referendums'
import Proposals from './Proposals'
import polkadotAPI from '../../util/polkadotAPI'
import i18n from '../../locales/i18n'

@inject('rootStore')
@observer
class Democracy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTap: 1,
      publicPropCount: '0',
      referendumCount: '0',
      referendumActive: 0,
      referendums: [],
      proposalsNum: 0
    }
  }

  componentDidMount() {
    // 通过addListener开启监听，可以使用上面的四个属性
    this._didBlurSubscription = this.props.navigation.addListener('didFocus', payload => {
      this.setState({})
      if (Platform.OS == 'android') {
        StatusBar.setBackgroundColor('#FFF')
      }
      StatusBar.setBarStyle('dark-content')
    })
  }

  componentWillUnmount() {
    // 在页面消失的时候，取消监听
    this._didBlurSubscription && this._didBlurSubscription.remove()
  }

  componentWillMount() {
    this.loadPage()
  }

  loadPage() {
    ;(async () => {
      if (Platform.OS == 'android') {
        StatusBar.setBackgroundColor('#FFF')
      }
      StatusBar.setBarStyle('dark-content')
      // 查询publicPropCount
      await polkadotAPI.publicPropCount(result => {
        this.setState({
          publicPropCount: JSON.stringify(result)
        })
      })
      // 查询referendumCount
      await polkadotAPI.referendumCount(result => {
        this.props.rootStore.stateStore.referendumCount = JSON.stringify(result)
      })
      await polkadotAPI.publicProps(result => {
        this.setState({ proposalsNum: result.length })
      })
      // 查询referendums中referendumActive
      await polkadotAPI.referendums(result => {
        this.setState({
          referendumActive: result.length
        })
      })
    })()
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
        <StatusBar
          hidden={false}
          backgroundColor="#FFF" // 状态栏背景颜色 | Status bar background color
          barStyle="dark-content" // 状态栏样式（黑字）| Status bar style (black)
        />
        <View
          style={{
            width: ScreenWidth,
            height: 44,
            backgroundColor: '#fff',
            flexDirection: 'row'
            // borderBottomWidth: 0.3,
            // borderBottomCorlor: '#F00',
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              this.setState({
                activeTap: 1
              })
            }}
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                color: this.state.activeTap == 1 ? '#F14B79' : '#3E2D32',
                fontSize: 16,
                fontWeight: '500'
              }}
            >
              {i18n.t('Democracy.referendums')}
              {'(' + this.props.rootStore.stateStore.referendumCount + ')'}
            </Text>
            <Text
              style={{
                color: this.state.activeTap == 1 ? '#F14B79' : '#3E2D32',
                fontSize: 16,
                fontWeight: '500'
              }}
            >
              {'+' + this.state.referendumActive}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              this.setState({
                activeTap: 2
              })
            }}
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                color: this.state.activeTap == 1 ? '#3E2D32' : '#F14B79',
                fontSize: 16,
                fontWeight: '500'
              }}
            >
              {i18n.t('Democracy.proposals')}
              {'(' + this.state.publicPropCount + ')'}
            </Text>
            <Text
              style={{
                color: this.state.activeTap == 1 ? '#3E2D32' : '#F14B79',
                fontSize: 16,
                fontWeight: '500'
              }}
            >
              {'+' + this.state.proposalsNum}
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.activeTap == 1 ? (
          <Referendums p={this.props} />
        ) : (
          <ScrollView>
            <Proposals />
          </ScrollView>
        )}
      </SafeAreaView>
    )
  }
}
export default Democracy
