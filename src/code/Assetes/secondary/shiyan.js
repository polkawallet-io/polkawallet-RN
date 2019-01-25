import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    InteractionManager,
    Animated,
    Easing,
    Platform,
    Image,
    ImageBackground,
} from 'react-native';
import Camera from 'react-native-camera';
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

export default class CodeReading extends React.Component {
    constructor(props) {
        super(props);
        this.camera = null;
        this.state = {
            show:true,
            anim: new Animated.Value(0),
            camera: {
                aspect: Camera.constants.Aspect.fill,
            },
        };
    }
    componentDidMount(){
        InteractionManager.runAfterInteractions(()=>{
           this.startAnimation()
        });
    }
    startAnimation(){
        if(this.state.show){
        this.state.anim.setValue(0)
        Animated.timing(this.state.anim,{
            toValue:1,
            duration:1500,
            easing:Easing.linear,
        }).start(()=>this.startAnimation());
        }
    }
    componentWillUnmount(){
        this.state.show = false;
    }
    //扫描二维码方法
    barcodeReceived = (e) =>{
        if(this.state.show){
            this.state.show = false;
            if (e) {
                this.props.navigator.pop()
                this.props.ReceiveCode(e.data)
            } else {
                Alert.alert(
                    '提示',
                    '扫描失败'
                    [{text:'确定'}]
                )
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {/*导航条*/}
                {this.renderNavBar()}
                <Camera
                    ref={(cam) => {
            this.camera = cam;
          }}
                    style={styles.preview}
                    aspect={this.state.camera.aspect}
                    onBarCodeRead={this.barcodeReceived.bind(this)}
                    barCodeTypes = {['qr']}
                >
                <View style = {{height: Platform.OS == 'ios' ? (height-264)/3:(height-244)/3,width:width,backgroundColor:'rgba(0,0,0,0.5)',}}>
                </View>
                    <View style={{flexDirection:'row'}}>
                        <View style={styles.itemStyle}/>
                            <ImageBackground style={styles.rectangle}
                                   source={require('../../../images/Assetes/share.png')}>
                                <Animated.View style={[styles.animatiedStyle, {
                transform: [{
                    translateY: this.state.anim.interpolate({
                        inputRange: [0,1],
                        outputRange: [0,200]
                    })
                }]
            }]}>
                                </Animated.View>
                            </ImageBackground>
                        <View style={styles.itemStyle}/>
                    </View>
                    <View style={{flex:1,backgroundColor:'rgba(0, 0, 0, 0.5)',width:width,alignItems:'center'}}>
                        <Text style={styles.textStyle}>将二维码放入框内,即可自动扫描</Text>
                    </View>
                </Camera>
            </View>
        );
    }


    // 导航条
    renderNavBar(){
        return(
            <View style={styles.navBarStyle}>
                <TouchableOpacity
                    onPress={()=>{this.props.navigator.pop()}}
                    style={styles.leftViewStyle}>
                    <Image source={{uri:'nav_return'}}
                           style={{height:20,width:20}} />
                </TouchableOpacity>
                <Text style={[styles.navTitleStyle,{marginTop:Platform.OS == 'ios'?12:0,fontSize:20}]}>
                    二维码
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    itemStyle:{
        backgroundColor:'rgba(0,0,0,0.5)',
        width:(width-200)/2,
        height:200
    },
    textStyle:{
        color:'#fff',
        marginTop:10,
        fontWeight:'bold',
        fontSize:18
    },
    navTitleStyle: {
        color:'white',
        fontWeight:'bold',
    },
    navBarStyle:{ // 导航条样式
        height: Platform.OS == 'ios' ? 64 : 44,
        backgroundColor:'rgba(34,110,184,1.0)',
        // 设置主轴的方向
        flexDirection:'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems:'center',
        justifyContent:'center'
    },

    leftViewStyle:{
        // 绝对定位
        // 设置主轴的方向
        flexDirection:'row',
        position:'absolute',
        left:10,
        bottom:Platform.OS == 'ios' ? 15:12,
        alignItems:'center',
        width:30
    },
    animatiedStyle:{
        height:2,
        backgroundColor:'#00FF00'
    },
    container: {
        flex: 1,
    },
    preview: {
        flex: 1,
    },
    rectangle: {
        height: 200,
        width: 200,
    }
});
