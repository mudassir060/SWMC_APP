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
  TextInput,
  Keyboard
} from "react-native";
import Constants from "expo-constants";
import TimeAgo from 'react-native-timeago';
import {Linking} from 'react-native'
// import { TextField } from "react-native-material-textfield";
import { Item, Input, Content, Button } from "native-base";
import { URL } from "../components/API";
import BaseHeader from "../components/BaseHeader";
import publicIP from 'react-native-public-ip';
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
// import KeyboardSpacer from 'react-native-keyboard-spacer';
var deviceHeight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;

class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {
          image: null,
          chat_id:0,
          user_id:0,
          user_name : "",
          messages: [],
          ip:"",
          departments_data: [],
          message_text: "",
          keyboardHeight: 0,
          showPopup: false,
          isModalLoaderVisible: false,
        };
      
      }
     
       toggleLoaderModal = () => {
        this.setState({isModalLoaderVisible: !this.state.isModalLoaderVisible});
      };
    componentWillMount(){
      AsyncStorage.getItem("userID").then(user_data => {
        const val = JSON.parse(user_data);
        
        if (val) {
          console.log("val");
        console.log(val);
          this.setState({
            user_name : val.user_name,
            chat_id : val.chat_id,
            user_id : val.user_id
          });
          this.state.user_name = val.user_name;
          // console.log(val.user_id)
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
              //  console.log("Response =>");
              //  console.log(response);
            })
            .catch(error => console.log("Please Check Your Internet Connection"));
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
      // clearInterval(this.interval);
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
    //  this.interval = setInterval(() => this.getChat(), 1000);
       
    
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
        this.setState({showPopup:false})
        try {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
                chat_id : this.state.chat_id,
                  user_id : this.state.user_id,
                  ip : this.state.ip,
                  imageBase64 : result.base64,
      
              }),
              headers: {
                "Content-Type": "application/json"
              }
            })
              .then(res => res.json())
              .then(async response => {
                // console.log("Send Image")
                // console.log(response)
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
                console.log("Please Check Your Internet Connection");
                
              });
          }
    
          // console.log(result);
         
         
    
        } catch (E) {
          console.log(E);
        }
      }; 
      _scanImage = async () => {
        this.setState({showPopup:false})
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
                chat_id : this.state.chat_id,
                  user_id : this.state.user_id,
                  ip : this.state.ip,
                  imageBase64 : result.base64,
      
              }),
              headers: {
                "Content-Type": "application/json"
              }
            })
              .then(res => res.json())
              .then(async response => {
                // console.log("Send Image")
                // console.log(response)
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
                console.log("Please Check Your Internet Connection");
                
              });
          }
    
          // console.log(result);
        
        } catch (E) {
          alert(e);
        }
      };
      callDepartment = (phone) => {
       
        Linking.openURL(`tel:${phone}`)
      }
      
      getChat = () => {
        // console.log("user Data");
        // console.log(this.state.user_data);
        fetch(URL+"get-messages", {
          method: "POST",
          body: JSON.stringify({
            "chatID" :this.state.chat_id,
            // "chatID" : this.state.user_data.chat_id,
          }),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(res => res.json())
          .then(async response => {
            //  console.log("Response =>");
            //  console.log(response);
            if (response.response == "success") {
            // console.log("Chat Messages")
            // console.log(response)
            this.setState({messages:response.data})
          
            } else {
              Alert.alert("Sorry", response.message, [{ text: "OK" }], {
                cancelable: true
              });
              this.setState({ isLoading: false });
            }
          })
          .catch(error => {
            console.log("Please Check Your Internet Connection");
            this.setState({ isLoading: false });
          });
      }
      sendMessage = () => {
          if(this.state.message_text != ""){
            this.toggleLoaderModal();
            fetch(URL+"send-message", {
              method: "POST",
              body: JSON.stringify({
                chatID : this.state.chat_id,
                  userID : this.state.user_id,
                  message : this.state.message_text,
                  ip : this.state.ip
              }),
              headers: {
                "Content-Type": "application/json"
              }
            })
              .then(res => res.json())
              .then(async response => {
                //  console.log("Response =>");
                //  console.log(response);
                if (response.response == "success") {
                // console.log("Send Messages")
                // console.log(response)
               this.setState({message_text:""});
               this.toggleLoaderModal();
              
                } else {
                  this.toggleLoaderModal();
                  Alert.alert("Sorry", response.message, [{ text: "OK" }], {
                    cancelable: true
                  });
                  this.setState({ isLoading: false });
                }
              })
              .catch(error => {
                this.toggleLoaderModal();
                alert("Please Check Your Internet Connection");
                this.setState({ isLoading: false });
              });
          }
       
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
    
  _keyboardDidShow = e => {
    var KeyboardHeight = e.endCoordinates.height;
    this.setState({
      keyboardHeight: KeyboardHeight + Constants.statusBarHeight,
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
    return (
   <View style={{width:deviceWidth, height:deviceHeight, backgroundColor:"#ff0000", marginTop:Constants.statusBarHeight}}>
    {/* <View style={{width:"100%", height:Constants.statusBarHeight}}></View> */}
<View style={{width:"100%",height:60, backgroundColor:"#3785ea"}}>
<View style={{flexDirection:"row", height:"100%"}}>
    <TouchableOpacity onPress={this.exitChat} style={{height:"100%", width:"20%", alignItems:"center", alignContent:"center", justifyContent:"center"}}>
        <Image style={{width:25, height:25, resizeMode:"contain"}} source={require("../assets/images/logout.png")}/>
    </TouchableOpacity>
    <View style={{height:"100%", width:"60%", alignItems:"center", alignContent:"center", justifyContent:"center"}}>
       <Text style={{fontSize:28, fontWeight:"bold", fontStyle:"italic", color:"#eaeaea"}}>{this.state.user_name}</Text>
    </View>
    <View style={{height:"100%", width:"20%", alignItems:"center", alignContent:"center", justifyContent:"center"}}>
        <Image style={{width:70, height:70, resizeMode:"contain"}} source={require("../assets/images/top_logo.png")}/>
    </View>
</View>

</View>

<ImageBackground source={require("../assets/images/splash.png")} style={{width:"100%", height:deviceHeight - 120, alignContent:"center", alignItems:"center"}}>

<View style={{width:"95%"}}>
<ScrollView style={{width:"100%"}} ref="scrollView"
             onContentSizeChange={(width,height) => this.refs.scrollView.scrollTo({y:height})}
             > 
             {
                      this.state.messages.map((item, index) => {

                        if(item.notify == 1){
                        return(
                            <View key={index} style={{width:"100%", alignItems:"center", alignContent:"center",paddingVertical:5}}>
                            <View style={{paddingVertical:4,paddingHorizontal:10,}}>
                                <Text style={{color:"#808080", fontWeight:"bold"}}>{item.msg}</Text>
                            </View>
                            </View>
                        )
                        }else{
                            
                            if(item.user_id == "-1"){
      if(item.image){
      return(

<View key={index} style={{width:"100%", paddingVertical:10}}>
<View style={{flexDirection:"row"}}>
    <View style={{width:"20%"}}>
        <View style={{width:60, height:60,borderRadius:60, borderColor:"#fff", borderWidth:3}}>
            <Image style={{width:55, height:55, resizeMode:"cover",borderRadius:55}} source={require("../assets/images/admin_av.png")}/>
        </View>
    </View>
    <View style={{width:"80%", alignItems:"center", alignContent:"center"}}>
<View style={{ maxWidth:"95%", backgroundColor:"#eaeaea", padding:20, borderRadius:10, alignContent:"center", alignItems:"center"}}>
<Image style={{width:250, height:250, resizeMode:"contain"}} source={{uri:"http://swmcapp.com/uploads/temp/"+item.image}}/>
</View>
<View style={{width:"95%", paddingVertical:4, paddingRight:10}}>
<View style={{flexDirection:"row-reverse"}}>
<TimeAgo style={{fontSize:10, textAlign:"right", color:"#808080"}} time={item.date} />
    <View style={{paddingHorizontal:3, paddingTop:3}}>
        <Image style={{width:7, height:7, resizeMode:"contain"}} source={require("../assets/images/timer_grey.png")}/>
    </View>
</View>
</View>
    </View>
    </View>
</View>
        
      )
    }else{
      return(
        <View key={index} style={{width:"100%", paddingVertical:10}}>
<View style={{flexDirection:"row"}}>
    <View style={{width:"20%"}}>
        <View style={{width:60, height:60,borderRadius:60, borderColor:"#fff", borderWidth:3}}>
            <Image style={{width:55, height:55, resizeMode:"cover",borderRadius:55}} source={require("../assets/images/admin_av.png")}/>
        </View>
    </View>
    <View style={{width:"80%", alignItems:"center", alignContent:"center"}}>
<View style={{width:"95%", backgroundColor:"#eaeaea", padding:10, borderRadius:10}}>
<Text style={{fontSize:16}}>{item.msg}</Text>
</View>
<View style={{width:"95%", paddingVertical:4, paddingRight:10}}>
<View style={{flexDirection:"row-reverse"}}>
<TimeAgo style={{fontSize:10, textAlign:"right", color:"#808080"}} time={item.date} />
    <View style={{paddingHorizontal:3, paddingTop:3}}>
        <Image style={{width:7, height:7, resizeMode:"contain"}} source={require("../assets/images/timer_grey.png")}/>
    </View>
</View>
</View>
    </View>
    </View>
</View>
   )
    }
    
  }else{
    if(item.image){
      return(
        <View key={index} style={{width:"100%", paddingVertical:10}}>
<View style={{flexDirection:"row-reverse"}}>
    <View style={{width:"20%"}}>
        <View style={{width:60, height:60,borderRadius:60, borderColor:"#fff", borderWidth:3}}>
            <Image style={{width:55, height:55, resizeMode:"cover",borderRadius:55}} source={{uri:"http://swmcapp.com/"+item.avatar}}/>
        </View>
    </View>
    <View style={{width:"80%", alignItems:"center", alignContent:"center"}}>
<View style={{ maxWidth:"95%", backgroundColor:"#eaeaea", padding:20, borderRadius:10, alignContent:"center", alignItems:"center"}}>
<Image style={{width:250, height:250, resizeMode:"contain"}} source={{uri:"http://swmcapp.com/uploads/"+item.image}}/>
</View>
<View style={{width:"95%", paddingVertical:4, paddingRight:10}}>
<View style={{flexDirection:"row"}}>
    <View style={{paddingHorizontal:3, paddingTop:3}}>
        <Image style={{width:7, height:7, resizeMode:"contain"}} source={require("../assets/images/timer_grey.png")}/>
    </View>
    <TimeAgo style={{fontSize:10, color:"#808080"}} time={item.date} />
</View>
</View>
    </View>
    </View>
</View>
      )
    }else{
      return(
        <View key={index} style={{width:"100%", paddingVertical:10}}>
<View style={{flexDirection:"row-reverse"}}>
    <View style={{width:"20%"}}>
        <View style={{width:60, height:60,borderRadius:60, borderColor:"#fff", borderWidth:3}}>
            <Image style={{width:55, height:55, resizeMode:"cover",borderRadius:55}} source={{uri:"http://swmcapp.com/"+item.avatar}}/>
        </View>
    </View>
    <View style={{width:"80%", alignItems:"center", alignContent:"center"}}>
<View style={{width:"95%", backgroundColor:"#eaeaea", padding:10, borderRadius:10}}>
<Text style={{fontSize:16}}>{item.msg}</Text>
</View>
<View style={{width:"95%", paddingVertical:4, paddingRight:10}}>
<View style={{flexDirection:"row"}}>
    <View style={{paddingHorizontal:3, paddingTop:3}}>
        <Image style={{width:7, height:7, resizeMode:"contain"}} source={require("../assets/images/timer_grey.png")}/>
    </View>
    <TimeAgo style={{fontSize:10, color:"#808080"}} time={item.date} />
</View>
</View>
    </View>
    </View>
</View>
   )
    }
   
  }
                        }

                      }
                      )}
        

  

             </ScrollView>

</View>
</ImageBackground>

{/* ....................FOOTER....................... */}
<View style={{width:"100%", height:60,backgroundColor:"#363d4a", position:"absolute", bottom:this.state.keyboardHeight}}>
    <View style={{flexDirection:"row", height:"100%"}}>
        <View style={{width:"20%", height:"100%", alignContent:"center", alignItems:"center", justifyContent:"center"}}>
        <TouchableOpacity onPress={()=> this.setState({showPopup:true})} style={{width:35, height:35, borderRadius:35, backgroundColor:"#3785ea", alignItems:"center", alignContent:"center", justifyContent:"center"}}>
                <Image style={{width:30, height:30, resizeMode:"contain"}} source={require("../assets/images/plus.png")}/>
            </TouchableOpacity>
        </View>
        <View style={{width:"60%", height:"100%", alignContent:"center", alignItems:"center", justifyContent:"center"}}>
        <View style={{width:"100%",height:"55%",
     borderColor:"#363d4a", borderWidth:1, borderRadius:5, backgroundColor:"#eaeaea"
     }}>
      <View style={{width:"90%", paddingHorizontal:10}}>
      <TextInput
          placeholder="Message..."
          returnKeyType="done"
          ref="newMessage"
          value={this.state.message_text}
          style={{fontSize:18}}
          onBlur={() => this.setState({keyboardHeight:0})}
          onChangeText={message_text => this.setState({ message_text })}
           />
      </View>
   
    </View>
        </View>
        <View style={{width:"20%", height:"100%", alignContent:"center", alignItems:"center", justifyContent:"center"}}>
        <TouchableOpacity onPress={this.sendMessage} style={{width:"80%",height:"55%", alignItems:"center", alignContent:"center",justifyContent:"center",
     borderColor:"#363d4a", borderWidth:1, borderRadius:5, backgroundColor:"#3785ea"
     }}>
     <Text style={{color:"#eaeaea", fontSize:18}}>Send</Text>
    </TouchableOpacity>
        </View>
    </View>
</View>

{/* .................POPUP................ */}

{this.state.showPopup ? (
  <View style={{width:deviceWidth, backgroundColor:"#fff",borderTopLeftRadius:30,borderTopRightRadius:30,borderTopColor:"#80080", position:"absolute", bottom:0}}>
  <TouchableOpacity onPress={this._pickImage} style={{width:"100%", alignContent:"center", alignItems:"center", borderBottomColor:"#808080", borderBottomWidth:0.8, paddingVertical:10}}>
    <Text style={{fontSize:22}}>Gallery</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={this._scanImage} style={{width:"100%", alignContent:"center", alignItems:"center", borderBottomColor:"#808080", borderBottomWidth:0.8, paddingVertical:10}}>
    <Text style={{fontSize:22}}>Scan</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={()=> this.setState({showPopup:false})} style={{width:"100%", alignContent:"center", alignItems:"center", borderBottomColor:"#808080", borderBottomWidth:0.8, paddingVertical:10}}>
    <Text style={{fontSize:22, color:"#ff0000"}}>Cancel</Text>
  </TouchableOpacity>
</View>
) : null}
<Modal isVisible={this.state.isModalLoaderVisible}>
          <View style={{width: "100%",alignItems:"center", alignContent:"center"}}>
           
<ActivityIndicator size={"large"}/>
            
          </View>
        </Modal>

  
  
 </View>
        );
  }
}
export default Page;