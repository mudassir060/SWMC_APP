//import React from 'react';
import React, { Component } from "react";
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
       chatMessage: "",
       chatMessages: []
    };
  
 }
 componentDidMount() {
  this.socket = io("http://491fe7996c55.ngrok.io");
  console.log(this.socket)
  
   this.socket.on("chat message", msg => {
         this.setState({ chatMessages: [...this.state.chatMessages, msg]   
    });
 });
}
submitChatMessage=()=> {
  // console.log("this.state.chatMessage")
  // console.log(this.state.chatMessage);
  io.on("http://491fe7996c55.ngrok.io", socket => {
    console.log("a user connected :D");
    socket.on("chat message", msg => {
      console.log(this.state.chatMessage);
      io.emit("chat message", this.state.chatMessage);
    });
  });
  this.socket.emit('chat message', this.state.chatMessage);

  this.setState({chatMessage: ''});
}
  render() {
    const chatMessages = this.state.chatMessages.map(chatMessage => (
      <Text>{chatMessage}</Text>
    ));
    return (

<View style={styles.container}>
        {chatMessages}
        <TextInput
          style={{height: 40, borderWidth: 2, top: 600}}
          autoCorrect={false}
          value={this.state.chatMessage}
          onSubmitEditing={() => this.submitChatMessage()}
          onChangeText={chatMessage => {
            this.setState({chatMessage});
          }}
        />
      </View>
    
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: 400,
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
             