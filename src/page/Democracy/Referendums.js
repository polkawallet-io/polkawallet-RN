import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { observer, inject } from 'mobx-react'
import Active from '../../components/Active'
import History from './secondary/History'
import { ScreenWidth } from '../../util/Common'
import i18n from '../../locales/i18n'

@inject('rootStore')
@observer
class Referendums extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTap: 1
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            height: 44,
            width: ScreenWidth,
            flexDirection: 'row',
            backgroundColor: '#FFF'
          }}
        >
          <TouchableOpacity
            style={{ justifyContent: 'center', alignItems: 'center' }}
            onPress={() => {
              this.setState({
                activeTap: 1
              })
            }}
          >
            <View style={{ paddingHorizontal: 20 }}>
              <Text
                style={{
                  color: this.state.activeTap == 1 ? '#F14B79' : '#3E2D32',
                  borderBottomWidth: 2,
                  fontSize: 15,
                  borderBottomColor: '#F14B79',
                  height: 44,
                  lineHeight: 44
                }}
              >
                {i18n.t('Democracy.Active')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {this.state.activeTap == 1 ? <Active p={this.props.p} /> : <History />}
      </View>
    )
  }
}
export default Referendums
