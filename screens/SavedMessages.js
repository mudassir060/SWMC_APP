import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Picker, Dimensions, ImageBackground, TextInput, AsyncStorage,  Keyboard,  Alert,ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons, MaterialCommunityIcons ,Octicons, Entypo} from '@expo/vector-icons';
import Constants from "expo-constants";
import { Linking } from 'react-native'
import TimeAgo from 'react-native-timeago';
// import { TextField } from "react-native-material-textfield";
import { Container, Input, Content, Button } from "native-base";
import { URL } from "../components/API";
import BaseHeader from "../components/BaseHeader";
import publicIP from 'react-native-public-ip';
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
// import KeyboardSpacer from 'react-native-keyboard-spacer';
// import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
import Footer from './Footer';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient';

var deviceHeight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;



export default class SavedMessages extends Component {
  // const [started, setStarted] = useState(false)
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      address:"",
      phone:"",
      chat_id:0,
      user_id:0,
      user_name : "",
      user_data : [],
      user_image : "",
      messages: [],
      ip:"",
      departments_data: [],
      message_text: "",
      keyboardHeight: 0,
      showPopup: false,
      show_loan: false,
      isModalLoaderVisible: false,
    };
  
  }
 
   toggleLoaderModal = () => {
    this.setState({isModalLoaderVisible: !this.state.isModalLoaderVisible});
  };

  componentDidMount() {
    AsyncStorage.getItem("userID").then(user_data => {
      const val = JSON.parse(user_data);
      console.log("><<><><><><M>><M<>M<M<M<")
      console.log(val)
      console.log("><<><><><><M>><M<>M<M<M<")
      if (val) {
        // console.log("val========================================================");
      // console.log(val);
        this.setState({
          user_name : val.user_name,
          chat_id : val.chat_id,
          user_id : val.user_id
        });
        this.state.user_name = val.user_name;
        // // console.log(val.user_id)
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
            //  // console.log("Response =>");
            //  // console.log(response);
          })
          .catch(error =>  console.log("Please Check Your Internet Connection"));
      }
    });
    AsyncStorage.getItem("user_image").then(image => {
      const val_image = JSON.parse(image);
      
      if (val_image) {
        // console.log("val========================================================");
        // console.log(val_image);
        // console.log("val========================================================");
        this.setState({
          user_image : val_image
        });
        this.state.user_image = val_image;
       
      }
    });
    
     AsyncStorage.getItem("other_data").then(data => {
      const val_data = JSON.parse(data);
      
      if (val_data) {
        console.log("val========================================================");
        console.log(val_data);
        console.log("val========================================================");
        this.setState({
          user_data : val_data
        });
        this.state.user_data = val_data;
       
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
    publicIP()
    .then(ip => {
      // // console.log(ip);
      this.setState({ip : ip})
      // '47.122.71.234'
    })
    .catch(error => {
      // console.log(error);
      // 'Unable to get IP address.'
    });
    // this.getPermissionAsync();
    // this.getCameraPermissionAsync();
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
        // this.setState({ image: result.uri });
        this.toggleLoaderModal();
        fetch(URL+"upload_file", {
          method: "POST",
          body: JSON.stringify({
            chat_id : this.state.chat_id,
            address : this.state.address,
            phone : this.state.phone,
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
            address : this.state.address,
            phone : this.state.phone,
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
    // // console.log("user Data");
    // // console.log(this.state.user_data);
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
         // console.log("Response =>===================================");
         // console.log(response);
        if (response.response == "success") {
        // // console.log("Chat Messages")
        // // console.log(response)
        this.setState({messages:response.data})
      
        } else {
          Alert.alert("Sorry", response.message, [{ text: "OK" }], {
            cancelable: true
          });
          this.setState({ isLoading: false });
        }
      })
      .catch(error => {
        // console.log("Please Check Your Internet Connection");
        this.setState({ isLoading: false });
      });
  }
  sendMessage = () => {
      if(this.state.message_text != ""){
        this.toggleLoaderModal();
// console.log("chat_id")
// console.log(this.state.chat_id)
// console.log("user_id")
// console.log(this.state.user_id)
// console.log("message_text")
// console.log(this.state.message_text)
// console.log("ip")
// console.log(this.state.ip)
        
        fetch(URL+"send-message", {
          method: "POST",
          body: JSON.stringify({
            chatID : this.state.chat_id,
            address : this.state.address,
            phone : this.state.phone,
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
             // console.log("Response =>ojiouhuijniojuoijoiju")
            if (response.response == "success") {
            // // console.log("Send Messages")
            // // console.log(response)
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
          AsyncStorage.removeItem('userID');
          AsyncStorage.removeItem('user_image');
         this.props.navigation.push("Login");
        }},
        {
          text: 'Cancel',
          onPress: () =>console.log('Cancel Pressed'),
          style: 'cancel',
        }
       
      ],
      {cancelable: false},
    );
  }

_keyboardDidShow = e => {
var KeyboardHeight = e.endCoordinates.height;
this.setState({
  keyboardHeight: KeyboardHeight ,
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
    let image_path=this.state.user_image;
    let image_uri="";
     image_uri=this.state.user_image
     // console.log("final Image")
     // console.log(image_uri)
    //  if(image_uri){
    //   let ispresant=image_uri.indexOf("http");
    //   // console.log("-------1321313213--------")
    //   // console.log(ispresant)
    //   if(ispresant==-1){
    //     image_path="http://swmcapp.com/"+this.state.user_image;
    //   }else{
    //     image_path=image_uri
    //   }
    //  }
     // console.log("final image_path")
     // console.log(image_path)
    return (
<View style={{flex:1,backgroundColor:"#fff", marginTop:22}}>
<View style={{ alignItems: 'center' }}>
          {/* <HeaderScreen title={"Search Display"} filter={true} back={true} navigation={this.props.navigation} /> */}
          <View style={{width:"100%", padding:10, backgroundColor:'#8757C7',flexDirection:"row"}}>

          <TouchableOpacity style={{ alignItems:"center",marginTop:5}}
          onPress={() =>this.props.navigation.navigate('Messages')}
          >
                  <Entypo name="chevron-thin-left" size={24} color="#2F368E" />
                </TouchableOpacity>
                
          <View style={{ width: "100%",marginLeft:60 }}>
            <Text style={{ color: "#fff", fontSize: 25, fontWeight: "bold" }}>Messages</Text>
          </View>
          </View>
         
          {/* <TouchableOpacity style={{width:"10%",marginLeft:"auto"}}onPress={()=>this.props.navigation.navigate('ChatDashboard')}>
                <Entypo name="cross" size={24} color="#003cff" />
                </TouchableOpacity> */}



          {/* <View style={{ width: "90%", justifyContent: "center", alignContent: "center",marginTop:20 }}>
                <TextInput
                  style={{ fontSize: 20,paddingHorizontal:5 }}
                  placeholder="Search Messages"
                  onChangeText={(search) => {
                    this.setState({search_text : search});
                    // this.getSearchedAnimals();
                  }}
                  value={this.state.search_text}
                />
                </View>  */}
         
          {/* <LinearGradient style={{width:"100%",height:"100%",borderTopRightRadius:35}} colors={['#9733EE', '#1D2B64']}> */}
         
          <ScrollView  style={{}}>
          <View style={{ width: "100%", flexDirection: "row", marginTop: 20, }}>
              <TouchableOpacity style={{ width: "20%", alignItems: "center",borderTopRightRadius:15 }}>
                <View style={{ width: "90%", paddingLeft: 10 }}>
                  <Image style={styles.box} source={{uri:this.state.user_image}} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: "60%", borderColor: "#DBDBDB", borderBottomWidth: 1,paddingBottom:2 }}>
             
                  <View style={{paddingHorizontal:8,paddingTop:5}}>
                    <Text style={{ fontSize: 20 , fontWeight: "bold" }}> Jane</Text>
                  </View>
                  <View style={{  paddingTop: 5,paddingHorizontal:10}}>
                    <Text style={{ fontSize: 14 ,fontWeight:"bold" }}>Hey!Wanna Cath up for movie  ?</Text>
                  </View>
                  </TouchableOpacity>
               
                <View style={{width:"20%",alignItems:"center",alignContent:"center", borderColor: "#DBDBDB", borderBottomWidth: 1,paddingBottom:15 }}>
                <View style={{ width: "100%",paddingTop:28 }}>
                    <Text style={{ fontSize: 13  }}> 2 hours ago </Text>
                  </View>
                  {/* <View style={{ paddingTop:2,marginLeft:"auto",paddingRight:20}}>
                    <Octicons name="primitive-dot" size={24} color="#fff" />
                  </View> */}
                </View>
             </View>  
             <View style={{ width: "100%", flexDirection: "row", marginTop: 20, }}>
              <TouchableOpacity style={{ width: "20%", alignItems: "center",borderTopRightRadius:15 }}>
                <View style={{ width: "90%", paddingLeft: 10 }}>
                  <Image style={styles.box} source={{uri:this.state.user_image}} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: "60%", borderColor: "#DBDBDB", borderBottomWidth: 1,paddingBottom:2 }}>
             
                  <View style={{paddingHorizontal:8,paddingTop:5}}>
                    <Text style={{ fontSize: 20 , fontWeight: "bold" }}> Jane</Text>
                  </View>
                  <View style={{  paddingTop: 5,paddingHorizontal:10}}>
                    <Text style={{ fontSize: 14 ,fontWeight:"bold" }}>Hey!Wanna Cath up for movie  ?</Text>
                  </View>
                  </TouchableOpacity>
               
                <View style={{width:"20%",alignItems:"center",alignContent:"center", borderColor: "#DBDBDB", borderBottomWidth: 1,paddingBottom:15 }}>
                <View style={{ width: "100%",paddingTop:28 }}>
                    <Text style={{ fontSize: 13  }}> 2 hours ago </Text>
                  </View>
                  {/* <View style={{ paddingTop:2,marginLeft:"auto",paddingRight:20}}>
                    <Octicons name="primitive-dot" size={24} color="#fff" />
                  </View> */}
                </View>
             </View>
            
</ScrollView>
         
          {/* </LinearGradient> */}

           
            
          

         

        </View>

        <Footer title={"Messages"} BG={"#8757C7"} back={false} navigation={this.props.navigation} /> 
      
</View>

       
     
    

     
    )




  }

}
const styles = StyleSheet.create({

  search: {

    width: "100%",
    marginTop: 10,
    paddingVertical: 15,

    backgroundColor: "#F5F5F5",
    borderRadius: 50,
  },
  box: {

    width: "100%",
    height: 60,
    resizeMode: "cover",
    borderRadius: 80
    ,borderWidth:3,borderColor:"#000"


  },
  getstarted_button: {
    width: "40%",
right:-30,
    paddingVertical: 100,
    paddingHorizontal:100,
    position: "absolute", zIndex: 100,
    alignItems: "center",
    bottom: 150,
   
   

  },
})

// <View style={{width:"100%",marginTop:30}}>
// <View style={styles.getstarted_button} >
// <ActionButton buttonColor="#9b59b6">
//      <ActionButton.Item buttonColor='#9b59b6' title="jkljkljkljljl"  onPress={() => this.exitChat()}>
//        {/* <Icon name="android-create" style={styles.actionButtonIcon} /> */}
//        <SimpleLineIcons name="logout" size={24} color="black" />
//      </ActionButton.Item>
//      <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() =>this.props.navigation.navigate("Chat")}>
//      <Entypo name="chat" size={24} color="black" />

//      </ActionButton.Item>
//      <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() =>this.props.navigation.navigate("Chat")}>
//      <Entypo name="chat" size={24} color="black" />

//      </ActionButton.Item>
    
  
//    </ActionButton>
// </View>
// </View> 