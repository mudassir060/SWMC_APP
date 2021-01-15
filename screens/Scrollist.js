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
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from "expo-constants";
// import { TextField } from "react-native-material-textfield";
import { Container, Picker, Content, Button } from "native-base";
import { URL } from "../components/API";
import BaseHeader from "../components/BaseHeader";
import publicIP from 'react-native-public-ip';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, Ionicons, EvilIcons, MaterialCommunityIcons, Octicons, Feather, Entypo,AntDesign  } from '@expo/vector-icons';

// import KeyboardSpacer from 'react-native-keyboard-spacer';
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { TextInput } from "react-native-gesture-handler";
var deviceHeight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;


export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      name_err: "",
      department_err: "",
      email: "",
      email_err: "",
      department: 0,
      pointer:0,
      ip:"",
      images: [],
      user_avatar:"",
      departments_data:[],
      isLoading:false,
      loader:true,
    };
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
    this.fetchDepartments();
    this.fetchAvatars();
   
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
     this.setState({departments_data : response.data, loader:false})
    })
    .catch(error => alert("Please Check Your Internet Connection"));
 }
 fetchAvatars = () => {
  fetch(URL+"get-avatars", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(async response => {
       console.log("Response =>");
       console.log(response.data);
     this.setState({images : response.data, loader:false})
    })
    .catch(error => alert("Please Check Your Internet Connection"));
 }
  onDepartmentSelect(value) {
    // console.log(value);

    this.setState({
      department: value
    });
    this.state.department = value;
  }
nextImage = () => {
const {pointer , images} = this.state;
let lengthOfArr = this.state.images.length;

if (pointer == lengthOfArr - 1){
 this.setState({pointer : 0});
}else{
  this.setState({pointer : pointer + 1})
}
// alert(pointer);
}
backImage = () => {
  const {pointer , images} = this.state;
  let lengthOfArr = this.state.images.length;
  
  if (pointer == 0){
   this.setState({pointer : lengthOfArr - 1});
  }else{
    this.setState({pointer : pointer - 1})
  }
  // alert(pointer);
  }
  submit = () => {
    Alert.alert(
      "SWMC_app",
      "Login Successfully",
      [
       
        { text: "OK"}
      ],
      { cancelable: false }
    );
    const {name , email, department,ip} = this.state;
 
    let email_reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let l_email = email.toLowerCase();
   
    if (name == "" && email == "" && department == 0) {
      this.setState({
        email_err: "Email should not be empty",
        name_err: "Name should not be empty",
        department_err: "Select Department"
      });
    }

    if (name == "") {
      this.setState({ name_err: "Required" });
    } else {
      this.setState({
        name_err: ""
      });
    }
   
    if (email == "") {
      this.setState({ email_err: "Required" });
    } else {
      // if(email_reg.test(email) === false){
      if(l_email.indexOf("@swmc.com") == -1){
        this.setState({
          email_err: "Invalid Email Address"
        });
      }else{
        this.setState({
          email_err: ""
        });
      }
     
    }
    if (department == 0) {
      this.setState({ department_err: "Required" });
    } else {
      this.setState({
        department_err: ""
      });
    }
    if(name != "" && email != "" && l_email.indexOf("@swmc.com") != -1 && department != 0){
      this.setState({ isLoading: true });
      console.log(l_email+"--"+name+"--"+ip+"--"+department+"--"+this.state.images[this.state.pointer]);
      fetch(URL+"create-user", {
        method: "POST",
        body: JSON.stringify({
          "email" : l_email,
          "name" : name,
          // "image" : this.state.images[this.state.pointer],
          "image" : this.state.user_avatar,
          "ip" : ip,
          "help" : department,
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(async response => {
           console.log("Response =>=?");
           console.log(response);
          if (response.response == "success") {
            AsyncStorage.setItem("userID", JSON.stringify(response.data));
            AsyncStorage.setItem("user_image", JSON.stringify(this.state.user_avatar));
            // AsyncStorage.setItem("user_image", JSON.stringify(this.state.images[this.state.pointer]));
            this.setState({ isLoading: false });
            this.props.navigation.push("start")
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
  }
  getPermissionAsync = async () => {
    if (Platform.OS !== 'web') {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
    }
};
 
  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({user_avatar:result.uri})
      // setImage(result.uri);
    }
  };

  
  render()
   {
    const { navigation } = this.props.navigation;
    const fontColor = "#82a601";
    console.log("---------------")
    console.log("http://swmcapp.com/"+this.state.images[this.state.pointer])
    let image_path=""
    let image_uri="";
     image_uri=this.state.images[this.state.pointer]
     if(image_uri){
      let ispresant=image_uri.indexOf("http");
      console.log("-------1321313213--------")
      console.log(ispresant)
      if(ispresant==-1){
        image_path="http://swmcapp.com/"+this.state.images[this.state.pointer];
      }else{
        image_path=image_uri
      }
     }
    return (
<ImageBackground source={require("../assets/images/bcgrnd.png")} style={{width:deviceWidth,height:deviceHeight}}>

<View style={{width:"100%",bottom:0, backgroundColor: '#f3f3f3'}}>
        {/*Rest of App come ABOVE the action button component!*/}
        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#9b59b6' title="jkljkljkljljl" onPress={() => this.props.navigation.navigate("Login")}>
            {/* <Icon name="android-create" style={styles.actionButtonIcon} /> */}
            <AntDesign name="login" size={24} color="black" />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {}}>
            <Icon name="android-notifications-none" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => {}}>
            <Icon name="android-done-all" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>



</ImageBackground>


     
     

      
    )


    

  }

}
const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
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



  },

})

