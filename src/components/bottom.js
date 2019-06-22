import React, { Component } from 'react'
import { Image, Dimensions } from 'react-native'

const ScreenHeight = Dimensions.get('screen').height
export default class TabBarItem extends Component {
  render() {
    return (
      <Image
        source={this.props.b1}
        style={{ tintColor: this.props.tintColor, height: ScreenHeight / 30.32, width: ScreenHeight / 30.32 }}
      />
    )
  }
}
