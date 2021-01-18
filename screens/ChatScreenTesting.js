//import React from 'react';
import React,{ Component } from "react";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Dimensions,
  AsyncStorage,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  image
} from "react-native";
import Footer from './Footer';
import queryString from 'query-string';
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from "expo-constants";
// import { TextField } from "react-native-material-textfield";
import { Container, Picker, Content, Button } from "native-base";
import { URL } from "../components/API";
import BaseHeader from "../components/BaseHeader";
import publicIP from 'react-native-public-ip';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, Ionicons, EvilIcons, MaterialCommunityIcons, Octicons, Feather, Entypo,AntDesign  } from '@expo/vector-icons';
import io from "socket.io-client";
// import KeyboardSpacer from 'react-native-keyboard-spacer';
import * as Permissions from "expo-permissions";
import { TextInput } from "react-native-gesture-handler";
var deviceHeight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;

export default class ChatScreenTesting extends Component {
  constructor(props) {
    super(props);
    this.state = {
       message: "",
       messages: [],
       users: []
    };
  
 }
 componentDidMount() {
  this.socket = io("https://9b20608851bd.ngrok.io");
  
  const  name  = 'zeeshan';
  const  room  = 'test';
  this.socket.emit('join', { name, room }, (error) => {
    if(error) {
      alert(error);
    }
  });
  
  this.socket.on("message", msg => {
    this.setState({ messages: [...this.state.messages, msg]   
});
});
//   this.socket.on("roomData", ({ users }) => {
//     this.setState({users});
//   });
}
submitmessage=()=> {
  console.log(this.state.message);
  this.socket.emit('sendMessage', this.state.message, () => this.setState({message: ''}));

}
  render() {
    console.log(this.state.messages)
 

    return (

<View style={styles.container}>
{this.state.messages.length > 0 ? 
  this.state.messages.map(message => (
        <Text>{message.text}</Text>
      ))
       : null}
        
        <TextInput
          style={{height: 40, borderWidth: 2, top: 600}}
          autoCorrect={false}
          value={this.state.message}
          onSubmitEditing={() => this.submitmessage()}
          onChangeText={message => {
            this.setState({message});
          }}
        />
      </View>
    
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});




















































     {/* {this.state.isLoading ? (
                 <Button
                   bordered
                   style={{
                     width: "100%",
                     alignItems: "center",
                     justifyContent: "center",
                     borderColor: fontColor,
                     borderRadius: 5,
                     alignItems:"center"
                   }}
                 >
                   <ActivityIndicator color={"#fd7e14"} size={"small"} />
                 </Button>
               ) : (
               
               <TouchableOpacity onPress={()=>this.props.navigation.navigate('ChatDashboard')}>
                   <image source={require('../assets/images/enter.png')}/>
                   </TouchableOpacity>
               )} */}
             