import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Clipboard
} from 'react-native';

let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
import { observer, inject } from "mobx-react";
const msg=[
    {key:'Name',value:'aliceacoount'},
    {key:'Memo',value:'friend from Riot'},
    {key:'Address',value:'5sklfdsnfnskjvbckjvbcndfkdsjfkjdsklfsdhjghskdjfklsdvlznlkvnsjkcnvks'}
]
@inject('rootStore')
@observer
export default class New extends Component {
  constructor(props)
    {
        super(props)
        this.state = {
            is: false,
            s:1
        }
        this.back=this.back.bind(this)
        this.save=this.save.bind(this)
        this.copy=this.copy.bind(this)
    }
  back(){
      this.props.navigation.navigate('Addresses')
  }
  save(){
  }
  copy(){
    Clipboard.setString('5sklfdsnfnskjvbckjvbcndfkdsjfkjdsklfsdhjghskdjfklsdvlznlkvnsjkcnvks');
    alert('Copy success')
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
                <Text style={styles.save_text}>Edit</Text>
            </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          behavior="padding"
        >
          {
              msg.map((item,index)=>{
                  return(
                    <View style={[styles.view,{marginTop:ScreenHeight/30}]} key={index}>
                        <Text style={[styles.text,{fontSize:index==2?ScreenHeight/40:ScreenHeight/50}]}>{item.key}</Text>
                        {
                            (index==2)
                            ?
                                <View style={styles.inputview}>
                                  <View style={styles.textview}>
                                    <Text 
                                      style={styles.tvalue}
                                      ellipsizeMode={"middle"}
                                      numberOfLines={1}
                                    >
                                        {item.value}
                                    </Text>
                                  </View>
                                  
                                  <TouchableOpacity
                                    onPress={this.copy}
                                  >
                                    <Image
                                        style={styles.inputimage}
                                        source={require('../../../images/Assetes/copy.png')}
                                    />
                                  </TouchableOpacity>
                                </View>
                            :
                                <Text style = {[styles.textvalue]}>
                                  {item.value}
                                </Text>
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
    textvalue:{
        marginTop:ScreenHeight/70,
        marginLeft:ScreenWidth*0.06,
        fontSize:ScreenHeight/45,
        color:'#696969',
        fontSize:ScreenHeight/45,
    },
    
    textview:{
        marginLeft:ScreenWidth*0.06,
        fontSize:ScreenHeight/45,
        height:ScreenHeight/24,
        width:ScreenWidth*0.8,
        backgroundColor:'#F4F2F2',
        borderColor:'#DCDCDC',
        borderRadius:ScreenHeight/150,
        paddingLeft:ScreenHeight/100,
        borderWidth:1,
        justifyContent:'center'
    },
    tvalue:{
        width:ScreenWidth*0.8-ScreenHeight/50,
        color:'#696969',
        fontSize:ScreenHeight/50,
    },
    inputview:{
        marginTop:ScreenHeight/70,
        flexDirection:'row',
        alignItems:'center'
    },
    inputimage:{
        marginLeft:ScreenWidth*0.02,
        height:ScreenWidth*0.05,
        width:ScreenWidth*0.05,
        resizeMode:'contain'
    }
})