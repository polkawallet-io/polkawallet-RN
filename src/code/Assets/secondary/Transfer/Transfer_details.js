import React, {PureComponent} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    Dimensions,
    Animated,
    InteractionManager,
    Easing,
    Alert,
    Image,
    ImageBackground,
    TouchableOpacity,
    Clipboard,
} from 'react-native';
import moment from "moment/moment";
import formatBalance from '../../../../util/formatBalance'

let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
import { observer, inject } from "mobx-react";
@inject('rootStore')
@observer
export default class Transfer_details extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            data:this.props.navigation.state.params.data,
        };
        this.back=this.back.bind(this)
        this.copyTo=this.copyTo.bind(this)
        this.copyFrom=this.copyFrom.bind(this)
    }
    back(){
        this.props.navigation.navigate('Coin_details')
    }
    async copyTo(){
        Clipboard.setString((this.state.data.tx_type=="Send")?this.state.data.tx_address:this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address);
        alert('Copy success')
    }
    async copyFrom(){
        Clipboard.setString(this.state.data.tx_type=="Send"?this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address:this.state.data.tx_address);
        alert('Copy success')
    }
    render() {
        return (
            <View style={[styles.container]}>
                {/* 标题栏 */}
                <View style={styles.title}>
                    <TouchableOpacity
                        onPress={this.back}
                    >
                        <Image
                        style={styles.image_title}
                        source={require('../../../../images/Assets/Create_Account/back.png')}
                        />
                    </TouchableOpacity>
                    <Text style={styles.text_title}>Details</Text>
                    <TouchableOpacity>
                        <Image 
                        style={styles.image_title}
                        // Need Open
                        // source={require('../../../../images/Assets/share.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{height:ScreenHeight/4,width:ScreenWidth,borderBottomWidth:2,justifyContent:'center',alignItems:'center',borderColor:'#C0C0C0'}}>
                  {/* 图标 */}
                  <Image
                    style={{height:ScreenHeight/16,width:ScreenHeight/16}}
                    source={require('../../../../images/Assets/transfer/successed.png')}
                  />
                  {/* 状态 */}
                  <Text style={{marginTop:ScreenHeight/70,fontSize:ScreenWidth/25,color:'black',fontWeight:'500'}}>{this.state.data.tx_type+':Successed'}</Text>
                  {/* 日期 */}
                  <Text style={{marginTop:ScreenHeight/70,fontSize:ScreenWidth/30,color:'#696969'}}>{moment(this.state.data.tx_timestamp).format('DD/MM/YYYY HH:mm:ss')}</Text>
                </View>
                <View style={{height:ScreenHeight/1.8,width:ScreenWidth,padding:ScreenWidth/30}}>
                  {/* Balance */}
                  <View style={styles.list_View}>
                    <Text style={styles.list_text1}>Balance:</Text>
                    <Text style={[styles.list_text2,{fontSize:ScreenWidth/20}]}>{formatBalance(String(this.state.data.tx_value))}</Text>
                  </View>
                  {/* Fees */}
                  <View style={styles.list_View}>
                    <Text style={styles.list_text1}>Fees:</Text>
                    <Text style={styles.list_text2}>{formatBalance(String(this.state.data.tx_fees))} </Text>
                  </View>
                  {/* To */}
                  <View style={[styles.list_View,{height:ScreenHeight/12}]}>
                    <Text style={[styles.list_text1,{width:ScreenWidth*0.23-ScreenHeight/200}]}>To:</Text>
                    <View style={styles.grey_text}>
                        <Text style={styles.address}>
                          {(this.state.data.tx_type=="Send")?this.state.data.tx_address:this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address}
                        </Text>
                    </View>
                    <TouchableOpacity
                      onPress={()=>{
                        this.copyTo()
                      }}
                    >
                        <Image 
                            style={styles.list_image}
                            source={require('../../../../images/Assets/copy.png')}
                        />
                    </TouchableOpacity>
                  </View>
                  {/* From */}
                  <View style={[styles.list_View,{height:ScreenHeight/12}]}>
                    <Text style={[styles.list_text1,{width:ScreenWidth*0.23-ScreenHeight/200}]}>From:</Text>
                    <View style={styles.grey_text}>
                        <Text style={styles.address}>
                          {this.state.data.tx_type=="Send"?this.props.rootStore.stateStore.Accounts[this.props.rootStore.stateStore.Account].address:this.state.data.tx_address}
                        </Text>
                    </View>
                    
                    <TouchableOpacity
                      onPress={()=>{
                        this.copyFrom()
                      }}
                    >
                        <Image 
                            style={styles.list_image}
                            source={require('../../../../images/Assets/copy.png')}
                        />
                    </TouchableOpacity>
                  </View>
                  {/* Block */}
                  <View style={styles.list_View}>
                    <Text style={styles.list_text1}>Block:</Text>
                    <Text style={styles.list_text2}># {this.state.data.tx_blocknumber}</Text>
                  </View>
                  {/* BlockHash */}
                  <View style={styles.list_View}>
                    <Text style={styles.list_text1}>BlockHash:</Text>
                    <Text style={[{fontSize:ScreenWidth/25,color:'black',width:ScreenWidth*0.4}]}
                      ellipsizeMode={"middle"}
                      numberOfLines={1}
                    >
                      {this.state.data.tx_blockhash}
                    </Text>
                  </View>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white'
    },
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
    list_View:{
        marginTop:ScreenHeight/50,
        height:ScreenHeight/20,
        flexDirection:'row',
        alignItems:'center'
    },
    list_text1:{
        width:ScreenWidth*0.23,
        fontSize:ScreenWidth/25,
        color:'#696969'
    },
    list_text2:{
        flex:1,
        fontSize:ScreenWidth/25,
        color:'black'
    },
    list_image:{
        marginLeft:ScreenWidth*0.05,
        marginRight:ScreenWidth*0.02,
        height:ScreenHeight/40,
        width:ScreenHeight/40,
        resizeMode:'contain'
    },
    grey_text:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#F0EFEF',
        justifyContent:'center',
        alignItems:'center'
    },
    address:{
        fontSize:ScreenWidth/30,
        color:'black',
        margin:ScreenHeight/200,
        fontWeight:'500'
    }
});
