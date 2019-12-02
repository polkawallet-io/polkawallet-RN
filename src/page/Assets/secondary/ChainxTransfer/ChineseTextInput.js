import React, { Component } from 'react'
import { Platform, TextInput } from 'react-native'

class ChineseTextInput extends Component {
  shouldComponentUpdate(nextProps) {
    return Platform.OS !== 'ios' || this.props.value === nextProps.value
  }
  render() {
    return <TextInput {...this.props} />
  }
}

export default ChineseTextInput
