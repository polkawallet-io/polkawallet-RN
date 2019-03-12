import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  AsyncStorage
} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";

import PasswordGesture from 'react-native-gesture-password';
import { observer, inject } from "mobx-react";
@inject('rootStore')
@observer
export default class Gesture_Test1 extends Component{
  constructor(props){
    super(props)
    this.state = {
        status:'right',
        message:this.props.rootStore.stateStore.GestureState==0?'Please set the gesture password':'Password'
    }
    this.onStart = this.onStart.bind(this)
    this.onEnd = this.onEnd.bind(this)
  }
    
  onEnd(password) {
    //第一次设置密码
    if(this.props.rootStore.stateStore.GestureState==0){
        this.props.rootStore.stateStore.GestureState=1
        this.props.rootStore.stateStore.Gesture=password
        this.setState({
            status: 'right',
            message: 'Please confirm the gesture password.'
        });
    }else{
        //确认上一次输入密码
        if(this.props.rootStore.stateStore.GestureState==1){
            //确认成功
            if(password==this.props.rootStore.stateStore.Gesture){
                this.props.rootStore.stateStore.GestureState=2
                this.props.rootStore.stateStore.Gesture=password
                AsyncStorage.setItem('Gesture',password)
                this.setState({
                    status: 'right',
                    message: 'Confirmed, password set successfully.'
                });
                setTimeout(()=>{
                    let resetAction = StackActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'Settings'})
                        ]
                    })
                    this.props.navigation.dispatch(resetAction)
                },500)
            }else{
                //确认失败
                this.props.rootStore.stateStore.GestureState=0
                this.setState({
                    status: 'wrong',
                    message: 'Confirmation failed, please reset.'
                });
            }
        }else{
            //验证密码
            if(this.props.rootStore.stateStore.GestureState==2){
                if(password==this.props.rootStore.stateStore.Gesture){
                    this.setState({
                        status: 'right',
                        message: 'Password is correct.'
                    });
                    setTimeout(()=>{
                        let resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'Tabbed_Navigation'})
                            ]
                        })
                        this.props.navigation.dispatch(resetAction)
                    },500)
                }else{
                    this.setState({
                        status: 'wrong',
                        message: 'Password mistake.'
                    });
                }
            }
        }
    }
    
  }
  onStart() {
    this.setState({
        status: 'normal',
        message: 'Please input your password.'
    });
  }
  onReset() {
    this.setState({
        status: 'normal',
        message: 'Please input your password (again).'
    }); 
  }
  componentWillMount(){
      
  }
    render() {
        return (
            <PasswordGesture
                ref='pg'
                status={this.state.status}
                message={this.state.message}
                style = {{backgroundColor:'white'}}
                textStyle = {{fontSize:25,}}
                normalColor = 'blue'
                rightColor = 'green'
                wrongColor = 'red'
                outerCircle and innerCircle = {true}
                onStart={() => this.onStart()}
                onEnd={(password) => this.onEnd(password)}
                />
                ); 
            }
        };
const styles = StyleSheet.create({

headerTitleStyle:{
    fontSize: 20,
    alignSelf: 'center',
    color: '#FFFFFF'
  },
  headerStyle:{
height: 38,
    backgroundColor: '#00aaff',
  }
})