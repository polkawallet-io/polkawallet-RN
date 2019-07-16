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
  TextInput,
  Alert,
  StatusBar,
  SafeAreaView,
  InteractionManager
} from 'react-native'
import { observer, inject } from 'mobx-react'
import Api from '@polkadot/api/promise'
import WsProvider from '@polkadot/rpc-provider/ws'
import { ScreenWidth, ScreenHeight } from '../../../../util/Common'
import Header from '../../../../components/Header'
import RNKeyboardAvoidView from '../../../../components/RNKeyboardAvoidView'
import i18n from '../../../../locales/i18n'

@inject('rootStore')
@observer
class SetNode extends Component {
  constructor(props) {
    super(props)
    this.state = {
      node: '',
      chooseNode: 'ws://45.32.115.98:9944/',
      isCustom: false
    }
    this.back = this.back.bind(this)
    this.onChangeNode = this.onChangeNode.bind(this)
    this.Set_Node = this.Set_Node.bind(this)
    this.chooseNode = this.chooseNode.bind(this)
    this.Noclick = this.Noclick.bind(this)
  }

  /**
   * @description 返回|Click the back
   */
  back() {
    this.props.navigation.navigate('Settings')
  }

  /**
   * @description 更换节点|Change the node
   * @param {String} onChangeNode 节点|Node
   */
  onChangeNode(onChangeNode) {
    this.setState({
      node: onChangeNode
    })
  }

  /**
   * @description 空点击|Click on the empty
   */
  Noclick() {
    return null
  }

  /**
   * @description 选择更换的节点|Select the replaced node
   */
  chooseNode() {
    Alert.alert(
      '',
      i18n.t('Profile.SelectNode'),
      [
        {
          text: 'wss://poc3-rpc.polkadot.io/',
          onPress: () => {
            this.setState({ chooseNode: 'wss://poc3-rpc.polkadot.io/' })
          },
          style: 'cancel'
        },
        {
          text: 'ws://45.32.115.98:9944/',
          onPress: () => {
            this.setState({ chooseNode: 'ws://45.32.115.98:9944/' })
          },
          style: 'cancel'
        },
        {
          text: i18n.t('Profile.Custom'),
          onPress: () => {
            this.setState({ isCustom: true })
          },
          style: 'cancel'
        },
        { text: 'cancel', onPress: () => {}, style: 'cancel' }
      ],
      { cancelable: true }
    )
  }

  /**
   * @description 设置节点|Set node
   */
  Set_Node() {
    Alert.alert(
      '',
      i18n.t('Profile.changeNode') + '"' + this.state.chooseNode + '"',
      [
        { text: i18n.t('Profile.Cancel'), onPress: () => {}, style: 'cancel' },
        {
          text: i18n.t('Profile.Confirm'),
          onPress: () => {
            ;(async () => {
              this.props.rootStore.stateStore.ENDPOINT = this.state.chooseNode
              const provider = new WsProvider(this.state.chooseNode)
              const api = await Api.create(provider)
              this.props.rootStore.stateStore.API = api
              this.props.navigation.navigate('Tabbed_Navigation')
            })()
          }
        }
      ],
      { cancelable: false }
    )
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ chooseNode: this.props.rootStore.stateStore.ENDPOINT })
    })
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
          <Header navigation={this.props.navigation} title={i18n.t('Profile.SetNode')} theme="dark" />
        </View>
        <RNKeyboardAvoidView>
          <View style={{ width: ScreenWidth - 40, marginLeft: 20 }}>
            <Text style={styles.text}>{i18n.t('Profile.NOTETip_1')}</Text>
            <View style={[{ flexDirection: 'row', width: ScreenWidth - 40 }]}>
              <TouchableOpacity
                style={{
                  width: ScreenWidth - 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  height: 50
                }}
                activeOpacity={0.7}
                onPress={this.state.isCustom ? this.Noclick : this.chooseNode}
              >
                <TextInput
                  style={[styles.textInputStyle, { width: ScreenWidth - 40 }]}
                  placeholderTextColor="black"
                  autoCapitalize="none"
                  placeholder={this.state.chooseNode}
                  autoCorrect={false}
                  editable={false}
                  underlineColorAndroid="#ffffff00"
                  onChangeText={this.onChangeNode}
                />

                <Image
                  style={{
                    resizeMode: 'contain',
                    transform: [{ rotateZ: '90deg' }],
                    marginLeft: -30,
                    marginTop: 10
                  }}
                  source={require('../../../../assets/images/public/addresses_nav_go.png')}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.text}>{i18n.t('Profile.NOTETip_2')}</Text>
            {this.state.isCustom ? (
              <View>
                <Text style={styles.text}>{i18n.t('Profile.enterNode')}</Text>
                <TextInput
                  style={[styles.textInputStyle, { borderColor: '#C0C0C0' }]}
                  placeholderTextColor="black"
                  autoCapitalize="none"
                  placeholder=""
                  autoCorrect={false}
                  underlineColorAndroid="#ffffff00"
                  onChangeText={this.onChangeNode}
                />
              </View>
            ) : (
              <View />
            )}
          </View>
        </RNKeyboardAvoidView>
        <TouchableOpacity
          style={styles.Touch}
          activeOpacity={0.7}
          onPress={() => {
            this.state.isCustom ? this.setState({ chooseNode: this.state.node, isCustom: false }) : this.Set_Node()
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: ScreenHeight / 45,
              fontWeight: 'bold'
            }}
          >
            {i18n.t('Profile.SetNode')}
          </Text>
        </TouchableOpacity>
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
    width: ScreenHeight / 33.35,
    resizeMode: 'contain'
  },
  text: {
    marginTop: ScreenHeight / 20,
    width: ScreenWidth - 40,
    fontSize: ScreenWidth / 24,
    color: '#696969'
  },
  textInputStyle: {
    paddingVertical: 0,
    marginTop: 20,
    height: 50,
    width: ScreenWidth - 40,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    fontSize: 18,
    borderRadius: 5,
    paddingHorizontal: 20
  },
  Touch: {
    height: 48,
    width: ScreenWidth - 40,
    borderRadius: 8,
    backgroundColor: '#FF4081C7',
    alignSelf: 'center',
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
export default SetNode
