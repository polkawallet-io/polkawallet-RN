import React,{Component} from 'react';  
import {Image,Dimensions,} from 'react-native';  
let ScreenWidth = Dimensions.get("screen").width;
let ScreenHeight = Dimensions.get("screen").height;
export default class TabBarItem extends Component {  
  
    render() {  
        return(  
            <Image
                style = {{tintColor:this.props.tintColor,height:ScreenHeight/30.32,width:ScreenHeight/30.32}}
                source={this.props.b1}
            />
        )  
    }  
      
}