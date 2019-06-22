import React, { Component } from 'react'
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native'

export default class RNKeyboardAvoidView extends Component {
  render() {
    return Platform.OS == 'ios' ? (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView>{this.props.children}</ScrollView>
      </KeyboardAvoidingView>
    ) : (
      <ScrollView>{this.props.children}</ScrollView>
    )
  }
}
