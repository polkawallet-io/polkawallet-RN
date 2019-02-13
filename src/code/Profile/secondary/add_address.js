import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  AsyncStorage,
} from 'react-native';

let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
import { observer, inject } from "mobx-react";
const msg=['Name','Memo','Address']
@inject('rootStore')
@observer
export default class New extends Component {
  constructor(props)
    {
        super(props)
        this.state = {
            name:'',
            memo:'',
            address:''
        }
        this.back=this.back.bind(this)
        this.save=this.save.bind(this)
        this.onChangeName=this.onChangeName.bind(this)
        this.onChangeMemo=this.onChangeMemo.bind(this)
        this.onChangeAddress=this.onChangeAddress.bind(this)  
        this.camrea=this.camrea.bind(this)      
    }
  back(){
      this.props.rootStore.stateStore.iscamera=0
      this.props.navigation.navigate('Addresses')
  }
  camrea(){
    this.props.rootStore.stateStore.tocamera=2
    this.props.navigation.navigate('Camera')
  }
  onChangeName(ChangeName){
      this.setState({
          name:ChangeName
      })
  }
  onChangeMemo(ChangeMemo){
    this.setState({
        memo:ChangeMemo
    })
  }
  onChangeAddress(ChangeAddress){
    if(this.props.rootStore.stateStore.iscamera==1){
        this.props.rootStore.stateStore.iscamera=0
    }
    this.setState({
        address:ChangeAddress
    })
  }
  save(){
      AsyncStorage.getItem('Addresses').then(
          (result)=>{
              if(result==null)
              {
                AsyncStorage.setItem('Addresses',JSON.stringify([{Name:this.state.name,Memo:this.state.memo,Address:this.state.address}])).then(
                    alert('Save success')
                )
              }else{
                  if(this.state.address==''&&this.props.rootStore.stateStore.iscamera==0)
                  {
                      alert('The address cannot be empty')
                  }else{
                    a=JSON.parse(result)
                    a.push({Name:this.state.name,Memo:this.state.memo,Address:(this.props.rootStore.stateStore.iscamera==0)?this.state.address:this.props.rootStore.stateStore.QRaddress})
                    AsyncStorage.setItem('Addresses',JSON.stringify(a)).then(()=>{
                      this.props.rootStore.stateStore.iscamera=0
                      this.props.navigation.navigate('Tabbed_Navigation')}
                    )
                  }
              }
          }
      )
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:'white',}}>
        {/* 标题栏 */}
        <View style={styles.title}>
            {/* 返回 */}
            <TouchableOpacity
                style={{flexDirection:'row'}}
                onPress={this.back}
            >
                <Image
                style={styles.image_title}
                source={require('../../../images/Assetes/Create_Account/back.png')}
                />
                <View style={{width:ScreenWidth*0.0}}/>
            </TouchableOpacity>
            {/* 标题 */}
            <Text style={styles.text_title}>Addresses</Text>
            {/* 保存 */}
            <TouchableOpacity
              style={styles.save_touch}
              onPress={this.save}
            >
                <Text style={styles.save_text}>Save</Text>
            </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          behavior="padding"
        >
          {
              msg.map((item,index)=>{
                  return(
                    <View style={[styles.view,{marginTop:ScreenHeight/30}]} key={index}>
                        <Text style={[styles.text,{fontSize:index==2?ScreenHeight/40:ScreenHeight/50}]}>{item}</Text>
                        {
                            (index==2)
                            ?
                                <View style={styles.inputview}>
                                  <TextInput style = {[styles.textInputStyle,{marginTop:0}]}  
                                    placeholder = {(this.props.rootStore.stateStore.iscamera==1)?this.props.rootStore.stateStore.QRaddress:''}
                                    autoCorrect={false}          
                                    underlineColorAndroid="#ffffff00"
                                    onChangeText = {this.onChangeAddress}
                                  />
                                  <TouchableOpacity
                                    onPress={this.camrea}
                                  >
                                    <Image
                                        style={styles.inputimage}
                                        source={require('../../../images/Profile/secondary/camera.png')}
                                    />
                                  </TouchableOpacity>
                                </View>
                            :
                                <TextInput style = {[styles.textInputStyle]}  
                                  autoCorrect={false}          
                                  underlineColorAndroid="#ffffff00"
                                  onChangeText = {(index==0)?this.onChangeName:this.onChangeMemo}
                                />
                        }
                    </View>
                  )
              })
          }
        </KeyboardAvoidingView>
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
    save_touch:{
        width:ScreenHeight/33.35+ScreenWidth*0.06,
        justifyContent:'center',
        alignItems:'center',
    },
    save_text:{
        color:'white',
        fontSize:ScreenWidth/28,
    },
    view:{
        justifyContent:'center',
        height:ScreenHeight/8,
    },
    text:{
        marginLeft:ScreenWidth*0.06,
        color:'black',
        fontWeight:'400'
    },
    textInputStyle:{
        marginTop:ScreenHeight/70,
        color:'#696969',
        marginLeft:ScreenWidth*0.06,
        backgroundColor:'#F4F2F2',
        height:ScreenHeight/24,
        width:ScreenWidth*0.8,
        borderWidth:1,
        borderColor:'#DCDCDC',
        fontSize:ScreenHeight/45,
        borderRadius:ScreenHeight/150,
        paddingLeft:ScreenHeight/100,
        paddingVertical: 0
    },
    inputview:{
        marginTop:ScreenHeight/70,
        flexDirection:'row',
        alignItems:'center'
    },
    inputimage:{
        marginLeft:ScreenWidth*0.02,
        height:ScreenWidth*0.04,
        width:ScreenWidth*0.04,
        resizeMode:'contain'
    }
})