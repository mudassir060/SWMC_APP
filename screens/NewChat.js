//import React from 'react';
import React, { Component } from "react";
import {

  StatusBar,
  Text,
  View,
  StyleSheet,
  Dimensions,
  AsyncStorage,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Keyboard
} from "react-native";
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient';

import { MaterialIcons, Ionicons, EvilIcons, MaterialCommunityIcons, Octicons, Feather, Entypo } from '@expo/vector-icons';

import Constants from "expo-constants";
import { Linking } from 'react-native'
import TimeAgo from 'react-native-timeago';
// import { TextField } from "react-native-material-textfield";
import { Container, Input, Content, Button } from "native-base";
import { URL } from "../components/API";
import BaseHeader from "../components/BaseHeader";
import publicIP from 'react-native-public-ip';
import { Notifications } from "expo";
import io from "socket.io-client";
import * as Permissions from "expo-permissions";
// import KeyboardSpacer from 'react-native-keyboard-spacer';
// import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider
} from 'react-native-popup-menu';
var deviceHeight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;

export default class NewChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      chat_id: 0,
      user_id: 0,
      user_name: "",
      user_image: "",
      messages: [],
      ip: "",
      departments_data: [],
      users: [],
      message: "",
      keyboardHeight: 0,
      showPopup: false,
      show_loan: false,
      isModalLoaderVisible: false,
    };

  }

  toggleLoaderModal = () => {
    this.setState({ isModalLoaderVisible: !this.state.isModalLoaderVisible });
  };

  componentDidMount() {
    AsyncStorage.getItem("userID").then(user_data => {
      const val = JSON.parse(user_data);

      if (val) {
        // console.log("val========================================================");
        // console.log(val);
        this.setState({
          user_name: val.user_name,
          chat_id: val.chat_id,
          user_id: val.user_id
        });
        this.state.user_name = val.user_name;
        this.socket = io("https://swmc-be.herokuapp.com");
  
    const  name  = val.user_name;
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
       
      }
    });
    AsyncStorage.getItem("user_image").then(image => {
      const val_image = JSON.parse(image);

      if (val_image) {
        // console.log("val========================================================");
        // console.log(val_image);
        // console.log("val========================================================");
        this.setState({
          user_image: val_image
        });
        this.state.user_image = val_image;

      }
    });
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
    this.getPermissionAsync();
    this.getCameraPermissionAsync();

  }
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }

    }

  };
  getCameraPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
      }

    }

  }
  _pickImage = async () => {
    this.setState({ showPopup: false })
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
        base64: true
      });
      if (!result.cancelled) {
        // this.setState({ image: result.uri });
        this.toggleLoaderModal();
        fetch(URL + "upload_file", {
          method: "POST",
          body: JSON.stringify({
            chat_id: this.state.chat_id,
            user_id: this.state.user_id,
            ip: this.state.ip,
            imageBase64: result.base64,

          }),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(res => res.json())
          .then(async response => {
            // // console.log("Send Image")
            // // console.log(response)
            if (response.response == "success") {
              this.toggleLoaderModal();
            } else {
              this.toggleLoaderModal();
              Alert.alert("Sorry", response.message, [{ text: "OK" }], {
                cancelable: true
              });


            }
          })
          .catch(error => {
            this.toggleLoaderModal();
            // console.log("Please Check Your Internet Connection");

          });
      }

      // // console.log(result);



    } catch (E) {
      // console.log(E);
    }
  };
  _scanImage = async () => {
    this.setState({ showPopup: false })
    try {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
        base64: true
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
        this.toggleLoaderModal();
        fetch(URL + "upload_file", {
          method: "POST",
          body: JSON.stringify({
            chat_id: this.state.chat_id,
            user_id: this.state.user_id,
            ip: this.state.ip,
            imageBase64: result.base64,

          }),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(res => res.json())
          .then(async response => {
            // // console.log("Send Image")
            // // console.log(response)
            if (response.response == "success") {
              this.toggleLoaderModal();
              Alert.alert("Success", "File sent successfully.", [{ text: "OK" }], {
                cancelable: true
              });
            } else {
              this.toggleLoaderModal();
              Alert.alert("Sorry", response.message, [{ text: "OK" }], {
                cancelable: true
              });

            }
          })
          .catch(error => {
            this.toggleLoaderModal();
            // console.log("Please Check Your Internet Connection");

          });
      }

      // // console.log(result);

    } catch (E) {
      alert(e);
    }
  };
  callDepartment = (phone) => {

    Linking.openURL(`tel:${phone}`)
  }

  getChat = () => {
    
   
  }
  
  submitmessage = () => {
    if (this.state.message != "") {
        // console.log(this.state.message);
        this.socket.emit('sendMessage', this.state.message, () => this.setState({message: ''}));
    
    }

  }
  exitChat = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to end chat?',
      [
        {
          text: 'Yes', onPress: () => {
            AsyncStorage.clear();
            AsyncStorage.removeItem('userID');
            AsyncStorage.removeItem('user_image');
            this.props.navigation.push("Login");
          }
        },
        {
          text: 'Cancel',
          onPress: () =>  console.log('Cancel Pressed'),
          style: 'cancel',
        }

      ],
      { cancelable: false },
    );
  }

  _keyboardDidShow = e => {
    var KeyboardHeight = e.endCoordinates.height;
    this.setState({
      keyboardHeight: KeyboardHeight,
    });
  };
  _keyboardDidHide = e => {
    this.setState({
      keyboardHeight: 0,
    });
  };



  render() {
    const { navigation } = this.props.navigation;
    const fontColor = "#82a601";
    let image_path = this.state.user_image;
    let image_uri = "";
    image_uri = this.state.user_image
    console.log(this.state.messages)
    // console.log("final Image")
    // console.log(image_uri)
  
    // console.log("final image_path")
    // console.log(image_path)
    return (

      <MenuProvider style={{flex:1,backgroundColor:"#000"}}>


        <View style={{ width: "100%", flexDirection: "row", borderColor: "#DBDBDB", paddingBottom: 5, backgroundColor: "#000", paddingTop: 30 }}>
          <TouchableOpacity style={{ width: "10%", marginHorizontal: 10, marginTop: 10  }} onPress={() => this.props.navigation.navigate('Messages')}>
            <Entypo name="chevron-thin-left" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={{ width: "70%", alignItems: "center", paddingBottom: 20 }}>
            {this.state.user_image ? (
              <View style={{borderWidth:3,borderColor:"#fff"}}>
                {/* <Image style={{width:40,height:40,borderRadius:100}} source={require('../assets/profile.png')} /> */}
                <Image style={{  width: "100%",height: 60, borderRadius: 100 ,}} source={{ uri: this.state.user_image }} />
              </View>
            ) : null}
            <View>
              <Text style={{ fontSize: 20, color: "#fff", fontWeight: "bold" }}> {this.state.user_name}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ width: "20%", alignItems: "center" }}>

            <Menu >
              <MenuTrigger style={{ marginTop: 10 }} >
                <MaterialIcons name="more-horiz" size={24} color="#fff" />
              </MenuTrigger>
              <MenuOptions>
                <MenuOption onSelect={() => this.exitChat()}  >
                  <Text style={{ color: '#003cff', fontSize: 17, fontWeight: "bold" }}>End Chat</Text>
                </MenuOption>
                {/* <MenuOption onSelect={() => alert(`Detail Updated`)} >
          <Text style={{color: '#003cff',fontSize:17,fontWeight:"bold"}}>Update Details</Text>
        </MenuOption> */}
              </MenuOptions>
            </Menu>
          </TouchableOpacity>
        </View>
        <LinearGradient style={{width:"100%",height:"90%", borderTopLeftRadius: 30,  }} colors={['#f7bb97', '#dd5e89']}>
          <ScrollView style={{ width:"100%",height:"90%", borderTopLeftRadius: 30,  }}>
         
        


                         
              {
                this.state.messages.map((item, index) => {
                  console.log(item.user +"------------"+ this.state.user_name.toLowerCase())
                  if(item.user == this.state.user_name.toLowerCase()){
                    return(
                      <View key={index}>
                            <View style={{ flexDirection: "row-reverse", marginTop: 10, paddingHorizontal: 20 }}>
                              <ImageBackground imageStyle={{ resizeMode: "stretch" }} source={require("../assets/images/blue_bg.png")} style={{ width: "auto" }}>
                                <View style={{ padding: 10 }}>
                                  <Text style={{ lineHeight: 26,paddingHorizontal:10 }}>{item.text}</Text>
                                </View>
                              </ImageBackground>
                              <View style={{ width: "40%" }}>
                              </View>
                            </View>
                            {/* <View style={{ flexDirection: "row-reverse", marginRight: 20 }}>
                              <View style={{ padding: 10 }}>

                                <Text style={{ textAlign: "right", fontSize: 12, color: "#fff" }}> 2:00 Am </Text>
                              </View>
                              <View style={{ width: "40%" }}>
                              </View>
                            </View> */}
                          </View>
                      )
                  }
                  else{
                    return(
                    <View key={index} style={{width:"100%", flexDirection: "row", marginTop: 10 }}>
                            <ImageBackground style={{ width: "auto" }} imageStyle={{ resizeMode: "stretch" }} source={require("../assets/images/grey_bg.png")} >
                              <View style={{ width: "auto", padding: 20 }}>
                                <Text>{item.text}</Text>
                              </View>
                            </ImageBackground>
                          </View>
                    )
                  }

                  
               }
                )}
          </ScrollView>
          <View style={{ width: "100%", flexDirection: "row", marginBottom: Constants.platform.ios ? this.state.keyboardHeight : 0,paddingBottom:60 }}>
            <View style={{ width: "88%", backgroundColor: "#FFf", borderRadius: 50, flexDirection: "row", marginLeft: 8, paddingVertical: 8, }}>
              <View style={{ width: "80%" }}>
                {this.state.show_loan ? (
                  <TextInput
                    key={'input-num'}
                    multiline={false}
                    keyboardType={"number-pad"}
                    style={{ color: "black", fontSize: 15, paddingHorizontal: 15 }}
                    placeholder={"Loan Number"}
                    placeholderTextColor="#AEAEAE"
                    onChangeText={(search) => {
                      this.setState({ message: search });
                    }}
                    value={this.state.message}
                  />
                ) : (
                    <TextInput
                      key={'input-def'}
                      multiline={true}
                      keyboardAppearance={"dark"}
                      style={{ color: 'black', fontSize: 15, paddingHorizontal: 15 }}
                      placeholder={"Type your message here..."}
                      placeholderTextColor="#AEAEAE"
                      onChangeText={(search) => {
                        this.setState({ message: search });
                      }}
                      value={this.state.message}
                    />
                  )}
              </View>
              <TouchableOpacity style={{ width: "10%", marginTop: 6 }} onPress={() => this.setState({ showPopup: true })}>
                <Entypo name="attachment" size={20} color="#C7C7C7" />
              </TouchableOpacity>

              <TouchableOpacity style={{ width: "10%", marginTop: 6 }} onPress={() => this.submitmessage()}>
                <MaterialIcons style={{}} name="send" size={20} color="#C7C7C7" />
              </TouchableOpacity>

            </View>
            <TouchableOpacity style={{ width: "12%", marginTop: 10, marginHorizontal: 5, borderRadius: 100, borderColor: "black" }} onPress={() => {
              if (this.state.message == "") {
                this.setState({ show_loan: !this.state.show_loan })
              }

            }}>
              <MaterialCommunityIcons name="dlna" size={24} color="#C7C7C7" />
            </TouchableOpacity>

            {/* <TouchableOpacity style={{width:"20%"}}>
               <Ionicons style={{}} name="md-add" size={24} color="#ffffff" />
               </TouchableOpacity>
               <TouchableOpacity style={{width:"20%"}}onPress={()=>this.sendMessage()}>
               <MaterialIcons style={{marginHorizontal:30}} name="send" size={24} color="#fff" />
               </TouchableOpacity>
          */}

            {this.state.showPopup ? (
              <View style={{ width: deviceWidth, backgroundColor: "#fff", borderTopLeftRadius: 30, borderTopRightRadius: 30, borderTopColor: "#80080", position: "absolute", bottom: 0 }}>
                <TouchableOpacity onPress={this._pickImage} style={{ width: "100%", alignContent: "center", alignItems: "center", borderBottomColor: "#808080", borderBottomWidth: 0.8, paddingVertical: 10 }}>
                  <Text style={{ fontSize: 22 }}>Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._scanImage} style={{ width: "100%", alignContent: "center", alignItems: "center", borderBottomColor: "#808080", borderBottomWidth: 0.8, paddingVertical: 10 }}>
                  <Text style={{ fontSize: 22 }}>Scan</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({ showPopup: false })} style={{ width: "100%", alignContent: "center", alignItems: "center", borderBottomColor: "#808080", borderBottomWidth: 0.8, paddingVertical: 10 }}>
                  <Text style={{ fontSize: 22, color: "#ff0000" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : null}



            {/* <Modal isVisible={this.state.isModalLoaderVisible}>
          <View style={{width: "100%",alignItems:"center", alignContent:"center"}}>
           
<ActivityIndicator size={"large"}/>
            
          </View>
        </Modal> */}

          </View>


          </LinearGradient>
        

      </MenuProvider>
    )




  }

}
const styles = StyleSheet.create({

  chatbox: {

    width: "100%",
    marginLeft: 90,
    marginBottom: 50,

    paddingVertical: 15,

    backgroundColor: "#22c0f0",
    borderRadius: 50,
  },
  box: {




  },

})

