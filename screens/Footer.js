import React, { Component } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, TouchableOpacity, Image, StyleSheet, Picker, Dimensions, AsyncStorage, ScrollView,Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons, Ionicons, EvilIcons, MaterialCommunityIcons, Octicons, Feather, Entypo,SimpleLineIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';

import { color } from 'react-native-reanimated';
import { isRequired } from 'react-native/Libraries/DeprecatedPropTypes/DeprecatedColorPropType';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


export default class Footer extends Component {
  constructor(props){
    super(props);
    this.state = {
      page : "",
      loggedIn :false,
    }
   
  }
  componentDidMount(){
    
    AsyncStorage.getItem("userID").then(user_data => {
      const val = JSON.parse(user_data);
      if(val){
        
        this.setState({
          loggedIn: true,
        });
      }
     
    });
  }
  goToChat = () => {
    if(this.state.loggedIn){

      this.props.navigation.push('Chat')
    }else{
      Alert.alert("Sorry", "You have ended your previous chat. Please select department for ticket. Thanks", 
      [
        {
          text: 'Select Department',
          onPress: () => this.props.navigation.push("Login")
        },
        { text: "Cancel" },
      ], {
        cancelable: true
      });
    }
  }
  render(){
    return (
        <View style={{width:"100%",position: "absolute", bottom: 0,zIndex:10,}}>
           <View style={{width:"100%",height:125}}>
           <LinearGradient style={{width: "100%",height:190,flexDirection: "row",
              borderTopColor: '#D1D1D1',borderTopLeftRadius:300,borderTopRightRadius:300}}
            colors={['#f7bb97','#dd5e89' ]}>
         
           
   
  
  
           
            </LinearGradient>
             </View>
            <View style={{position:"absolute",bottom:30,zIndex:100,left:60}}>
  <TouchableOpacity style={{ width: 30, height:20,alignItems:"center"}} onPress={() => this.props.navigation.navigate('profile')} >
  
             {/* <Image style={{width:22, height:22,resizeMode:"cover"}} source={require('../assets/images/profile.jpg')}/> */}
             <Octicons name="person" size={24} color="#fff" />

                  
              </TouchableOpacity>
  </View>
            <View style={{position:"absolute",bottom:20,zIndex:100,right:60}}>
  <TouchableOpacity style={{ width: 30, height:30,alignItems:"center" }}
  onPress={() => this.props.navigation.navigate('Messages')}
   
  //  onPress={() => this.props.navigation.navigate('Chat')} 
   >
   <Image style={{width:25, height:25,resizeMode:"cover"}} source={require('../assets/images/chat.png')}/>
                  
              </TouchableOpacity>
  </View>
            <View style={{position:"absolute",bottom:90,zIndex:100,left:screenWidth/2,}}>
            
  <TouchableOpacity style={{ width: "80%",alignItems:"center", }} onPress={() => this.goToChat()}  >
              
             <View style={{width:"95%",paddingtop:10,alignItems:"center",paddingRight:80}} >
              <Image style={{width:36, height:36,resizeMode:"cover"}} source={require('../assets/images/chatbox.png')}/>
            
                </View> 
              </TouchableOpacity>
  </View>
             
          
     
              </View>
          
      
    );
  }
  
}
const styles = StyleSheet.create({
icon: {

  width: "30%",
  height:"100%",
  alignItems: "center",
  marginTop:"auto"
//   marginBottom:-100
 
  

},
Qricon: {

  width: "40%",
  alignItems: "center",
  justifyContent: "center",
    

},
}) 