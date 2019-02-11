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
} from 'react-native';
import Identicon from 'polkadot-identicon-react-native';

let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
const Addresses=[
  {Name:'chevdor',Memo:'frind from riot',Address:'5djdkhfskjhkjsvbjksbvksjvjcknvjcxbvkbcxkbvklevfdvfd'},
  {Name:'chevdor',Memo:'frind from riot',Address:'5djdkhfskjhkjsvbjksbvksjvjcknvjcxbvkbcxkbvklevfdvfd'}, 
  {Name:'chevdor',Memo:'frind from riot',Address:'5djdkhfskjhkjsvbjksbvksjvjcknvjcxbvkbcxkbvklevfdvfd'},  
  {Name:'chevdor',Memo:'frind from riot',Address:'5djdkhfskjhkjsvbjksbvksjvjcknvjcxbvkbcxkbvklevfdvfd'},
  {Name:'chevdor',Memo:'frind from riot',Address:'5djdkhfskjhkjsvbjksbvksjvjcknvjcxbvkbcxkbvklevfdvfd'},
]
import { observer, inject } from "mobx-react";
@inject('rootStore')
@observer
export default class New extends Component {
  constructor(props)
    {
        super(props)
        this.state = {
            is: false,
            s:1,
            index:0,
        }
        this.back=this.back.bind(this)
        this.add_address=this.add_address.bind(this)
        this.address=this.address.bind(this)

    }
  back(){
    this.props.navigation.navigate('Tabbed_Navigation')
  }
  add_address(){
    this.props.navigation.navigate('Add_address')
  }
  address(){
     
  }
  componentWillMount(){
    // AsyncStorage.setItem('Addresses','')
    this.props.rootStore.stateStore.Addresses=[]
    AsyncStorage.getItem('Addresses').then(
        (result)=>{
            if(result!=null)
            {
                JSON.parse(result).map((item,index)=>{
                    this.props.rootStore.stateStore.Addresses.push(item)
                })
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
                onPress={this.back}
            >
                <Image
                style={styles.image_title}
                source={require('../../../images/Assetes/Create_Account/back.png')}
                />
            </TouchableOpacity>
            {/* 标题 */}
            <Text style={styles.text_title}>Addresses</Text>
            {/* 添加地址 */}
            <TouchableOpacity
              onPress={this.add_address}
            >
                <Image 
                style={styles.image_title}
                source={require('../../../images/Profile/secondary/add_address.png')}
                />
            </TouchableOpacity>
        </View>
        <ScrollView>
            {
                // Addresses.map((item,index)=>{
                this.props.rootStore.stateStore.Addresses.map((item,index)=>{
                    return(
                        <TouchableOpacity style={[styles.view,{borderTopWidth:(index==0)?1:0}]} key={index}
                          onPress={()=>{
                              if(this.props.rootStore.stateStore.transfer_address==0){
                                this.props.navigation.navigate('Address_information',{index:index})
                              }else{
                                this.props.rootStore.stateStore.t_address=item.Address
                                this.props.rootStore.stateStore.isaddresses=1
                                this.props.navigation.navigate('Transfer')
                              }
        
                          }}
                        >
                          {/* 头像 */}
                          <Identicon
                            style={styles.image}
                            value={item.Address}
                            size={ScreenHeight/18}
                            theme={'polkadot'}
                          />
                          {/* 信息 */}
                          <View style={styles.text}>
                            <Text style={styles.text1}>{item.Name}</Text>
                            <Text style={styles.text2}>{item.Memo}</Text>
                            <Text style={styles.text3}
                              ellipsizeMode={"middle"}
                              numberOfLines={1}
                            >
                              {item.Address}
                            </Text>
                          </View>
                          {/* 查看详细信息 */}
                          <Image
                            style={styles.next}
                            source={require('../../../images/Profile/next.png')}
                          />
                        </TouchableOpacity>
                    )
                })
            }
        </ScrollView>
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
    view:{
        borderWidth:1,
        borderColor:'grey',
        flexDirection:'row',
        alignItems:'center',
        height:ScreenHeight/9,
        borderRadius:ScreenHeight/150
    },
    image:{
        marginLeft:ScreenWidth*0.04
    },
    text:{
        marginLeft:ScreenWidth*0.02,
        flex:1,
        justifyContent:'center'
    },
    text1:{
        fontSize:ScreenHeight/50,
        color:'black',
        marginBottom:ScreenHeight/300
    },
    text2:{
        fontSize:ScreenWidth/30,
        color:'#696969',
        marginBottom:ScreenHeight/200
    },
    text3:{
        width:ScreenWidth*0.5,
        fontSize:ScreenWidth/30,
        color:'black',
    },
    next:{
        marginRight:ScreenWidth/28,
        height:ScreenHeight/60,
        width:ScreenHeight/60/1.83,
        resizeMode:'contain'
    }
})