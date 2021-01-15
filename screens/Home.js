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
  TextInput
} from "react-native";
import Constants from "expo-constants";
import {Linking} from 'react-native'
// import { TextField } from "react-native-material-textfield";
import { Container, Input, Content, Button } from "native-base";
import { URL } from "../components/API";
import BaseHeader from "../components/BaseHeader";
import publicIP from 'react-native-public-ip';
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
// import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
var deviceHeight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      user_data: [],
      messages: [],
      ip:"",
      departments_data: [],
      message_text: "",
      isModalVisible: false,
      isModalLoaderVisible: false,
    };
  
  }
  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  }; 
   toggleLoaderModal = () => {
    this.setState({isModalLoaderVisible: !this.state.isModalLoaderVisible});
  };
componentWillMount(){
  AsyncStorage.getItem("userID").then(user_data => {
    const val = JSON.parse(user_data);
    console.log("Async Data");
    console.log(val);

    if (val) {
      this.setState({
        user_data: val
      });
      console.log(val.user_id)
      fetch(URL+"update-login", {
        method: "POST",
        body: JSON.stringify({
            userID : val.user_id,
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(async response => {
           console.log("Response =>");
           console.log(response);
        })
        .catch(error => console.log("Please Check Your Internet Connection"));
    
     
    }
  });
}
  componentDidMount() {
    publicIP()
    .then(ip => {
      // console.log(ip);
      this.setState({ip : ip})
      // '47.122.71.234'
    })
    .catch(error => {
      console.log(error);
      // 'Unable to get IP address.'
    });
    this.getPermissionAsync();
    this.getCameraPermissionAsync();
this.fetchDepartments();

   

  }
  callDepartment = (phone) => {
    // this.toggleModal();
    Linking.openURL(`tel:${phone}`)
  }
  exitChat = () =>{
    Alert.alert(
      'Confirmation',
      'Are you sure you want to end chat?',
      [
        {text: 'Yes', onPress: () => {
          AsyncStorage.clear();
         this.props.navigation.push("Login");
        }},
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        }
       
      ],
      {cancelable: false},
    );
  }
 

  fetchDepartments = () => {
    fetch(URL+"get-departments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(async response => {
         console.log("Response =>");
         console.log(response.data);
       this.setState({departments_data : response.data})
      })
      .catch(error => console.log("Please Check Your Internet Connection"));
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
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        aspect: [4, 3],
        quality: 1,
        base64:true
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
        this.toggleLoaderModal();
        fetch(URL+"upload_file", {
          method: "POST",
          body: JSON.stringify({
            chat_id : this.state.user_data.chat_id,
              user_id : this.state.user_data.user_id,
              ip : this.state.ip,
              imageBase64 : result.base64,
  
          }),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(res => res.json())
          .then(async response => {
            console.log("Send Image")
            console.log(response)
            if (response.response == "success") {
              this.toggleLoaderModal();
              this.props.navigation.navigate("Chat");
            } else {
              this.toggleLoaderModal();
              Alert.alert("Sorry", response.message, [{ text: "OK" }], {
                cancelable: true
              });
  
              
            }
          })
          .catch(error => {
            this.toggleLoaderModal();
            console.log("Please Check Your Internet Connection");
            
          });
      }

      console.log(result);
     
     

    } catch (E) {
      console.log(E);
    }
  }; 
  _scanImage = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
        base64:true
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
        this.toggleLoaderModal();
        fetch(URL+"upload_file", {
          method: "POST",
          body: JSON.stringify({
            chat_id : this.state.user_data.chat_id,
              user_id : this.state.user_data.user_id,
              ip : this.state.ip,
              imageBase64 : result.base64,
  
          }),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(res => res.json())
          .then(async response => {
            console.log("Send Image")
            console.log(response)
            if (response.response == "success") {
              this.toggleLoaderModal();
              Alert.alert("Success", "File sent successfully.", [{ text: "OK" }], {
                cancelable: true
              });
              this.props.navigation.navigate("Chat");
            } else {
              this.toggleLoaderModal();
              Alert.alert("Sorry", response.message, [{ text: "OK" }], {
                cancelable: true
              });
              
            }
          })
          .catch(error => {
            this.toggleLoaderModal();
            console.log("Please Check Your Internet Connection");
            
          });
      }

      console.log(result);
    
    } catch (E) {
      console.log(E);
    }
  };

  render() {
    const { navigation } = this.props.navigation;
    const fontColor = "#82a601";
    return (
    <View style={{width:deviceWidth , height:deviceHeight, marginTop:Constants.statusBarHeight}}>
<View style={{width:"100%", height:"15%"}}>
  <View style={{flexDirection:"row", height:"100%"}}>
    <View style={{width:"50%", height:"100%", backgroundColor:"#6200ee", alignContent:"center", alignItems:"center"}}>
  
     <TouchableOpacity onPress={this.toggleModal}  style={{width:"100%", height:"100%", padding:10,alignContent:"center", alignItems:"center", justifyContent:"center"}}>

      {/* <Image style={{width:50,height:50, resizeMode:"contain"}} source={require("../assets/images/phone.png")}/> */}
      <Text style={{fontSize:22, fontWeight:"bold", color:"#fff"}}>DIRECTORY</Text>
     </TouchableOpacity>

    
    </View>
    <View style={{width:"50%", height:"100%", alignContent:"center", alignItems:"center"}}>
    <TouchableOpacity onPress={this.exitChat} style={{width:"100%",height:"100%",  backgroundColor:"#00695C", padding:10,alignContent:"center", alignItems:"center", justifyContent:"center"}}>
      {/* <Image style={{width:80,height:80, resizeMode:"contain"}} source={require("../assets/images/logout.png")}/> */}
      <Text style={{fontSize:22, fontWeight:"bold", color:"#fff"}}>LOGOUT</Text>
    </TouchableOpacity>
    </View>
  </View>
</View>


<View style={{width:"100%", height:"70%", alignContent:"center", alignItems:"center"}}>
    <View style={{width:"100%",height:"100%", backgroundColor:"#fd7e14", padding:10}}>
    <TouchableOpacity onPress={() => this.props.navigation.navigate("Fields")} style={{width:"100%",height:"100%",alignContent:"center", alignItems:"center", justifyContent:"center"}}>
    <Image style={{width:150,height:150, resizeMode:"contain"}} source={require("../assets/images/operator.png")}/>
   <View style={{marginTop:10}}>

    <Text style={{fontSize:30, fontWeight:"bold", color:"#fff"}}>CHAT</Text>
   </View>
    </TouchableOpacity>
    
</View>
</View>



<View style={{width:"100%", height:"15%"}}>
  <View style={{flexDirection:"row",height:"100%"}}>
    <View style={{width:"50%",height:"100%", backgroundColor:"#2E7D32", alignContent:"center", alignItems:"center"}}>
    <TouchableOpacity onPress={this._pickImage} style={{width:"100%",height:"100%", padding:10,alignContent:"center", alignItems:"center", justifyContent:"center"}}>
      {/* <Image style={{width:80,height:80, resizeMode:"contain"}} source={require("../assets/images/attach.png")}/> */}
      <Text style={{fontSize:22, fontWeight:"bold", color:"#fff"}}>FOLDER</Text>
    </TouchableOpacity>
    </View>
    <View style={{width:"50%",height:"100%", alignContent:"center", alignItems:"center"}}>
    <TouchableOpacity onPress={this._scanImage} style={{width:"100%",height:"100%",  backgroundColor:"#37474F", padding:10,alignContent:"center", alignItems:"center", justifyContent:"center"}}>
    {/* <Image style={{width:80,height:80, resizeMode:"contain"}} source={require("../assets/images/scan.png")}/> */}
    <Text style={{fontSize:22, fontWeight:"bold", color:"#fff"}}>SCAN</Text>
    </TouchableOpacity>
    </View>
   
  </View>
</View>
<Modal isVisible={this.state.isModalLoaderVisible}>
          <View style={{width: "100%",alignItems:"center", alignContent:"center"}}>
           
<ActivityIndicator size={"large"}/>
            
          </View>
        </Modal>
<Modal isVisible={this.state.isModalVisible}>
          <View style={{width: "100%", maxHeight:deviceHeight/1.5, backgroundColor:"#fff"}}>
          <ScrollView>
          <View style={{width:"100%", alignItems:"center", alignContent:"center"}}>
            {
                      this.state.departments_data.map((item, index) => {
   return(
    <TouchableOpacity onPress={()=> this.callDepartment(item.phone)} key={index} style={{width:"90%", borderBottomColor:"#808080", borderBottomWidth:0.8}}>
                <View style={{paddingTop:5, paddingHorizontal:5}}>
                  <Text style={{fontSize:18, fontWeight:"bold"}}>{item.name}</Text>
                </View> 
                <View style={{padding:5}}>
                  <Text style={{fontSize:12}}>{item.phone}</Text>
                </View>
              </TouchableOpacity>
   )
    })
                     }
             
             
            </View>
            </ScrollView>
            <Button
                    onPress={this.toggleModal}
                    style={{
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 5,
                      backgroundColor: "#0050bc"
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#fff",
                        fontSize: 17,
                        fontWeight:"bold"
                      }}
                    >
                     Close
                    </Text>
                  </Button>
         
        
            </View>
        </Modal>
    </View>
    );
  }
}
export default Home;