import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ListView,
  Modal ,
} from 'react-native';
var Dimensions = require('Dimensions');
const {width,height} = Dimensions.get('window');
export default class Select extends Component {
  constructor(props){
    super(props);
    this.state=({
      showModal:false,
      course:"语文",
    });
  }
  componentWillMount(){
    
  }
  selCourse(course){
    this.setState({
      showModal:false,
      course:course,
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headStyle}>
          <Text style={styles.headText} onPress={()=>{this.setState({showModal:true})}}>
            {this.state.course}
          </Text>
          <TouchableOpacity style={{marginLeft:10}} 
            onPress={()=>{this.setState({showModal:true})}}
            hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}>
            <Image style={styles.arrowStyle} source={require('../../../images/Assetes/right_menu/Create_Account.png')}/>
          </TouchableOpacity>
        </View>
        <Modal  
          visible={this.state.showModal}   
          transparent={true}  
          animationType='fade'   
          onRequestClose={() => {}}  
          style={{flex:1}}  
          ref="modal"  >
          <TouchableWithoutFeedback onPress={()=>{this.setState({showModal:false})}} >
          <View style={{flex:1,alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.5)',}} 
            
            >
            <TouchableWithoutFeedback onPress={()=>{}}>
              <View style={{backgroundColor:'#fff',width:width,
                justifyContent:'center',
                
              }}
              
              > 
                <View style={styles.headStyle}>
                  <Text style={styles.headText} onPress={()=>{this.setState({showModal:false})}}>
                    {this.state.course}
                  </Text>
                  <TouchableOpacity style={{marginLeft:10}} 
                    onPress={()=>{this.setState({showModal:false})}}
                    hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}>
                    <Image style={styles.arrStyle} source={{uri:'arr_up'}}/>
                  </TouchableOpacity>
                </View>
                <View style={styles.courseWrap}>
                  <CourseItem course="语文" onPress={()=>{this.selCourse('语文')}}/>
                  <CourseItem course="数学" onPress={()=>{this.selCourse('数学')}}/>
                  <CourseItem course="英语" onPress={()=>{this.selCourse('英语')}}/>
                </View>
                <View style={[styles.courseWrap,{marginBottom:10}]}>
                  <CourseItem course="物理" onPress={()=>{this.selCourse('物理')}}/>
                  <CourseItem course="化学" onPress={()=>{this.selCourse('化学')}}/>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}
class CourseItem extends Component{
  render(){
    return(
      <TouchableOpacity style={styles.boxView} onPress={this.props.onPress}>
        <View style={{padding:10}}>
          <Text style={{fontSize:18,fontWeight:'bold'}}>{this.props.course}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}
var cols = 3;
var boxW = 70;
var vMargin = (width-cols*boxW)/(cols+1);
var hMargin = 25;
const styles = StyleSheet.create({
   arrStyle:{
    width:26,
    height:26,
    resizeMode:'contain',
  },
  boxView:{
    justifyContent:'center',
    alignItems:'center',
    width:boxW,
    height:boxW,
    marginLeft:vMargin,
    marginTop:hMargin,
    borderWidth:StyleSheet.hairlineWidth,
    borderColor:'#999',
    borderRadius:5,
  },
  courseWrap:{
    flexDirection:'row',
    justifyContent:'flex-start',
    borderWidth:0,
    borderColor:'orange',
  },
  selCourseText:{
    padding:8,
    fontSize:18,
  },
  blackText:{
    color:'black',
    fontSize:16,
  },
  arrowStyle:{
    width:20,
    height:20,
  },
  textWrapView:{
    paddingTop:10,
    paddingBottom:10,
  },
  headText:{
    fontSize:22,
  },
  headStyle:{
    flexDirection:'row',
    width:width,
    justifyContent:"center",
    alignItems:'center',
    backgroundColor:'#F2F2F2',
    paddingTop:15,
    paddingBottom:15,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  
});
