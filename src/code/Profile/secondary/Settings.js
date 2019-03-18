import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
  AsyncStorage,
  Switch,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import {
    isFirstTime,
    isRolledBack,
    packageVersion,
    currentVersion,
    checkUpdate,
    downloadUpdate,
    switchVersion,
    switchVersionLater,
    markSuccess,
  } from 'react-native-update';
import _updateConfig from '../../../../update.json';
import {NavigationActions, StackActions} from "react-navigation";
let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
const {appKey} = _updateConfig[Platform.OS];
const msg = [
    // 'Language',
    // 'Assets Display Unit',
    'Remote Node',
    'Check Update'
]
import { observer, inject } from "mobx-react";
@inject('rootStore')
@observer
export default class New extends Component {
  constructor(props)
    {
        super(props)
        this.state = {
            Gesture:this.props.rootStore.stateStore.GestureState==0?false:true,
            Fingerprint:false,
            Facial_Recognition:false,
        }
        this.back=this.back.bind(this)
        this.Set_Node=this.Set_Node.bind(this)
        this.Gesture=this.Gesture.bind(this)
        this.Fingerprint=this.Fingerprint.bind(this)
        this.Facial_Recognition=this.Facial_Recognition.bind(this)
        this.Check_Update=this.Check_Update.bind(this)
    }
  back(){
    this.props.navigation.navigate('Tabbed_Navigation')
  }
  Set_Node(){
    this.props.navigation.navigate('Set_Node')
  }
  doUpdate = info => {
    downloadUpdate(info).then(hash => {
    Alert.alert('Alert', 'Download finished, whether to restart the application?', [
            {text: 'Yes', onPress: ()=>{switchVersion(hash)}},
            {text: 'No',},
            {text: 'Next startup time', onPress: ()=>{switchVersionLater(hash);}},
        ]);
    }).catch(err => {
        Alert.alert('Alert', 'Update failed.'); 
    });
  };
  Check_Update(){
    checkUpdate(appKey).then(info => {
        if (info.expired) {
            Alert.alert('Alert', 'Your application version has been updated, please go to the app store to download the new version', [
            {text: 'Yes', onPress: ()=>{info.downloadUrl && Linking.openURL(info.downloadUrl)}},
                    ]);
        } else if (info.upToDate) {
            Alert.alert('Alert', 'Your application version is up to date.'); 
        } else {
            Alert.alert('Alert', 'Check the new version:'+info.name+',whether to download? \n'+ info.description, [
            {text: 'Yes', onPress: ()=>{this.doUpdate(info)}},
            {text: 'No',}, ]);
        }
    }).catch(err => {
        Alert.alert('Alert', 'Update failed.'); 
    });
  }
  Gesture(e){
    this.setState({Gesture: e});
    if(e){
        let resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Gesture'})
            ]
        })
        this.props.navigation.dispatch(resetAction)
    }else{
        Alert.alert(
            'Alert',
            'Delete gesture password ？',
            [
                {text: 'Cancel', onPress: () => {this.setState({Gesture:true})}, style: 'cancel'},
                {text: 'Confirm', onPress: () => {
                    this.props.rootStore.stateStore.GestureState=0
                    AsyncStorage.removeItem('Gesture').then(
                        alert('The gesture password has been canceled.')
                    )
                }},
            ],
            { cancelable: false }
        )
    }
  }
  Fingerprint(e)  {
    this.setState({Fingerprint: e});
  }
  Facial_Recognition(e)  {
    this.setState({Facial_Recognition: e});
  }
  componentWillUpdate(){
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:'#F5F5F5',}}>
        {/* 标题栏 */}
        <View style={styles.title}>
            {/* 返回 */}
            <TouchableOpacity
                onPress={this.back}
            >
                <Image
                style={styles.image_title}
                source={require('../../../images/Assets/Create_Account/back.png')}
                />
            </TouchableOpacity>
            {/* 标题 */}
            <Text style={styles.text_title}>Settings</Text>
            {/* 空白 */}
            <View style={{height:ScreenHeight/33.35,width:ScreenHeight/33.35,}}/>
        </View>
        {
            msg.map((item,index)=>{
                return(
                    <TouchableOpacity style={styles.msgView} key={index}
                      onPress={()=>{
                          if(index==0){this.Set_Node()}
                          if(index==1){this.Check_Update()}
                      }}
                    >
                      <Text style={styles.msgText}>{item}</Text>
                      <View style={{flex:1}}/>
                      <Image
                        style={styles.msgImage}
                        source={require('../../../images/Profile/next.png')}
                      />
                    </TouchableOpacity>
                )
            })
        }
        
        {/* Gesture */}
        <View style={[styles.msgView,{marginTop:ScreenHeight/40}]}
        >
            <Text style={styles.msgText}>Gesture</Text>
            <View style={{flex:1}}/>
            <Switch
              style={{marginRight:ScreenWidth/28}}
              value={this.state.Gesture}//默认状态
              onValueChange={(e) => this.Gesture(e)} //当状态值发生变化值回调
            />
        </View>
        {/* Fingerprint */}
        {/* <View style={styles.msgView}
        >
            <Text style={styles.msgText}>Fingerprint</Text>
            <View style={{flex:1}}/>
            <Switch
              style={{marginRight:ScreenWidth/28}}
              value={this.state.Fingerprint}//默认状态
              onValueChange={(e) => this.Fingerprint(e)} //当状态值发生变化值回调
            />
        </View> */}
        {/* Facial recognition */}
        {/* <View style={styles.msgView}
        >
            <Text style={styles.msgText}>Facial recognition</Text>
            <View style={{flex:1}}/>
            <Switch
              style={{marginRight:ScreenWidth/28}}
              value={this.state.Facial_Recognition}//默认状态
              onValueChange={(e) => this.Facial_Recognition(e)} //当状态值发生变化值回调
            />
        </View> */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
    title:{
        padding:ScreenHeight/50,
        height:ScreenHeight/9,
        flexDirection:'row',
        alignItems:'flex-end',
        justifyContent:'space-between',
        backgroundColor:'#776f71'
    },
    text_title:{
        fontSize:ScreenHeight/37,
        fontWeight:'bold',
        color:'#e6e6e6'
    },
    image_title:{
        height:ScreenHeight/33.35,
        width:ScreenHeight/33.35,
        resizeMode:'contain'
    },
    msgView:{
        backgroundColor:'white',
        flexDirection:'row',
        alignItems:'center',
        height:ScreenHeight/13,
        borderWidth:0.5,
        borderColor:'#C0C0C0',
        marginHorizontal:1,
        paddingLeft:ScreenWidth*0.05
    },
    msgText:{
        fontSize:ScreenWidth/20,
        color:'#696969'
    },
    msgImage:{
        marginRight:ScreenWidth/28,
        height:ScreenHeight/60,
        width:ScreenHeight/60/1.83,
        resizeMode:'contain'
    },
    
})