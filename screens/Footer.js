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
      <View style={{ width: "100%", position: "absolute", bottom: 10,zIndex:0,alignItems:"center",alignContent:"center" }}>
      <View style={{width:"80%", flexDirection: "row", backgroundColor: '#FEFEFE',borderTopWidth :1, borderTopColor: '#D1D1D1',paddingVertical:1,paddingHorizontal:5,borderBottomLeftRadius:15,borderTopRightRadius:15}}>
      <View style={styles.icon}>
        <TouchableOpacity style={{ width: "100%",alignItems:"center",backgroundColor:this.props.title=="profile"? "#FAF1EF":"#fff",borderBottomLeftRadius:15 }} onPress={() => this.props.navigation.navigate('profile')} >
         
         <View style={{width:"100%",paddingTop:10,paddingBottom:5,alignItems:"center" }}>
         <View>
         <Octicons name="person" size={24} color={this.props.title == "profile" ? "#E4717D" : "#B1B1B1"} />
          </View>
          <Text style={{ color: this.props.title == "profile" ? "#E4717D" : "#B1B1B1",textAlign:"center",marginTop:2 }} >Profile </Text>
       
         </View>
          </TouchableOpacity>

      </View>
      
      <View style={styles.icon}>
        <TouchableOpacity style={{ width: "100%",alignItems:"center",backgroundColor:this.props.title=="Messages"? "#FAF1EF":"#fff" }} onPress={() => this.props.navigation.navigate('Messages')}>
        <View style={{width:"95%",paddingTop:10,paddingBottom:5,alignItems:"center"}}>
        <View>
      
        <Entypo name="chat" size={24} color={this.props.title == "Messages" ? "#E4717D" : "#B1B1B1"} />
          </View>
          <Text style={{ color: this.props.title == "Messages" ? "#E4717D" : "#B1B1B1",textAlign:"center", }} >History </Text>
          </View>   
          
        </TouchableOpacity>

      </View>
      <View style={styles.icon}>
        <TouchableOpacity style={{ width: "100%",alignItems:"center",backgroundColor:this.props.title=="Chat"? "#FAF1EF":"#fff",borderTopRightRadius:15  }} onPress={() => this.props.navigation.navigate('Chat')}>
          
        <View style={{width:"95%",paddingTop:10,paddingBottom:5,alignItems:"center"}}>
        <View >
         <MaterialIcons name="chat-bubble-outline" size={24} color={this.props.title == "Chat" ? "#E4717D" : "#B1B1B1"}/>
          </View>
          <Text style={{ color: this.props.title == "Chat" ? "#E4717D" : "#B1B1B1",textAlign:"center",marginTop:1 }} >Chat </Text>
          </View>  
        </TouchableOpacity>

      </View>
   

      </View>
    
    
   
      </View>
 
    
);
}

}
const styles = StyleSheet.create({
icon: {

width: "33%",
alignItems: "center",
justifyContent: "center",




},
searchicon: {

width: "24%",
alignItems: "center",
justifyContent: "center",


},
})