import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert
} from "react-native";

import PasswordGesture from 'react-native-gesture-password'
let Password1 = '';

export default class GesturePassword extends Component {
  constructor(props) {
      super(props);
      this.state = {
          message: '请绘制解锁图案',
          status: 'normal',
          timeOut: 300,
      }
  }

  render() {
      return (
          <View>
              
              <PasswordGesture
                  ref='pg'
                  status={this.state.status}
                  message={this.state.message}
                  onStart={() => this.onStart()}
                  onEnd={(password) => this.onEnd(password)}
                  innerCircle={true}
                  outerCircle={true}
                  interval={this.state.timeOut}
              />
          </View>
      )
  }

  onEnd(password) {
      const {timeOut}=this.state;
      if (Password1 === '') {
          // The first password
          Password1 = password;
          if (timeOut) {
              this.time = setTimeout(() => {
                  this.setState({
                      status: 'normal',
                      message: '请再次绘制解锁图案',
                  });
              }, timeOut)
          }
      } else {
          // The second password
          if (password === Password1) {
              this.setState({
                  status: 'right',
                  message: '您的密码是' + password,
              });

              Password1 = '';
          } else {
              this.setState({
                  status: 'wrong',
                  message: '密码错误, 请再次输入.',
              });
          }
      }
  }

  onStart() {
      if (Password1 === '') {
          this.setState({
              message: '请绘制解锁图案',
          });
      } else {
          this.setState({
              message: '请再次绘制解锁图案',
          });
      }
      if (this.state.timeOut) {
          clearTimeout(this.time);
      }
  }
}