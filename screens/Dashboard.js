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
  ScrollView
} from "react-native";
import Constants from "expo-constants";
// import { TextField } from "react-native-material-textfield";
import { Container, Picker, Content, Button, Row } from "native-base";
import { URL } from "../components/API";
import BaseHeader from "../components/BaseHeader";
import publicIP from 'react-native-public-ip';
// import KeyboardSpacer from 'react-native-keyboard-spacer';
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { TextInput } from "react-native-gesture-handler";
import { MaterialIcons, Ionicons, EvilIcons, MaterialCommunityIcons, Octicons, Feather, Entypo } from '@expo/vector-icons';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider
} from 'react-native-popup-menu';


var deviceHeight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;


export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      isClick:true,
      department: 0,
      pointer:0,
      ip:"",
      images: [],
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
          "image" : this.state.images[this.state.pointer],
          "ip" : ip,
          "help" : department,
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
            AsyncStorage.setItem("userID", JSON.stringify(response.data));
            this.setState({ isLoading: false });
            this.props.navigation.push("Page")
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
  render() {
    const { navigation } = this.props.navigation;
    const fontColor = "#82a601";
    return (
    <ImageBackground source={require("../assets/images/bcgrnd.png")}  style={{flex:1,alignItems:'center'}}>
   
    <MenuProvider>
    <View style={{ width: "100%", justifyContent: "center", alignContent: "center",paddingTop:40 }}>
     

     <View style={{ flexDirection: "row",height:50,paddingHorizontal:5,paddingTop:10,borderBottomWidth:1}}>
          <Text style={{ color: '#003cff', fontSize:20,fontWeight:"bold",marginLeft:15 }}>SWMC</Text>
          <TouchableOpacity style={{marginLeft:"auto",marginRight:40,paddingTop:5}}onPress={()=>this.props.navigation.navigate('Search')}>
          <Octicons style={{ }} name="search" size={24} color="#003cff" />
          </TouchableOpacity>
          <Menu>
      <MenuTrigger>
      <Feather name="more-vertical" size={24} color="#003cff" />
      </MenuTrigger>
      <MenuOptions>
        <MenuOption onSelect={() => alert(`Chat End`)}  >
        <Text style={{color: '#003cff',fontSize:17,fontWeight:"bold"}}>End Chat</Text>
        </MenuOption>
        {/* <MenuOption onSelect={() => alert(`Detail Updated`)} >
          <Text style={{color: '#003cff',fontSize:17,fontWeight:"bold"}}>Update Details</Text>
        </MenuOption> */}
       
      </MenuOptions>
    </Menu>

            
       
        </View>

        <ScrollView >
    <View style={{flexDirection:"row",marginTop:10,borderColor:"#787878",borderBottomWidth:1}}>
    
    <TouchableOpacity style={{width:"25%",alignItems:"center"}}>
      <View style={{width:"90%",paddingLeft:5}}>
      <Image style={styles.box} source={require('../assets/images/Avatars/11.png')}/>
</View>
    </TouchableOpacity>
<TouchableOpacity style={{width:"75%",alignItems:"center",flexDirection:"row"}}
// onPress={()=>this,this.props.navigation.navigate()}
>
<View style={{width:"80%",paddingLeft:5}}>
<View>
  <Text style={{fontSize:20,color:"#003cff",fontWeight:"bold"}}> Morgan Freeman</Text>
</View>
<View style={{paddingTop:5,paddingLeft:5}}>
<Text style={{fontSize:14,color:"#003cff"}}>Hi! how are you ?</Text>
</View>
</View>
<View style={{width:"20%",marginRight:5}}>
<Text style={{fontSize:13,color:"#003cff"}}>9:13 PM</Text>
</View>
</TouchableOpacity>


    </View>
   
    <View style={{flexDirection:"row",marginTop:10,borderBottomWidth:1}}>
    
    <TouchableOpacity style={{width:"25%",alignItems:"center",borderRadius:50}}>
      <View style={{width:"90%",paddingLeft:5}}>
    <Image style={styles.box} source={require('../assets/images/tech.png')}/>
</View>
    </TouchableOpacity>
<TouchableOpacity style={{width:"75%",alignItems:"center",flexDirection:"row"}}
// onPress={()=>this,this.props.navigation.navigate()}
>
<View style={{width:"80%",paddingLeft:5}}>
<View>
  <Text style={{fontSize:20,color:"#003cff",fontWeight:"bold"}}> Technical department</Text>
</View>
<View style={{paddingTop:5,paddingLeft:5}}>
<Text style={{fontSize:14,color:"#003cff"}}>I'm fine,thank you.how can i help you ?</Text>
</View>
</View>
<View style={{width:"20%",marginRight:5}}>
<Text style={{fontSize:13,color:"#003cff"}}>9:13 PM</Text>
</View>
</TouchableOpacity>
</View>

<View style={{flexDirection:"row",marginTop:10,borderColor:"#787878",borderBottomWidth:1}}>
    
    <TouchableOpacity style={{width:"25%",alignItems:"center"}}>
      <View style={{width:"90%",paddingLeft:5}}>
      <Image style={styles.box} source={require('../assets/images/Avatars/11.png')}/>
</View>
    </TouchableOpacity>
<TouchableOpacity style={{width:"75%",alignItems:"center",flexDirection:"row"}}
// onPress={()=>this,this.props.navigation.navigate()}
>
<View style={{width:"80%",paddingLeft:5}}>
<View>
  <Text style={{fontSize:20,color:"#003cff",fontWeight:"bold"}}> Morgan Freeman</Text>
</View>
<View style={{paddingTop:5,paddingLeft:5}}>
<Text style={{fontSize:14,color:"#003cff"}}>Hi! how are you ?</Text>
</View>
</View>
<View style={{width:"20%",marginRight:5}}>
<Text style={{fontSize:13,color:"#003cff"}}>9:13 PM</Text>
</View>
</TouchableOpacity>


    </View>
   
    <View style={{flexDirection:"row",marginTop:10,borderBottomWidth:1}}>
    
    <TouchableOpacity style={{width:"25%",alignItems:"center"}}>
    <View style={{width:"90%",paddingLeft:5}}>
      <Image style={styles.box} source={require('../assets/images/tech.png')}/>
</View>
    </TouchableOpacity>
<TouchableOpacity style={{width:"75%",alignItems:"center",flexDirection:"row"}}
// onPress={()=>this,this.props.navigation.navigate()}
>
<View style={{width:"80%",paddingLeft:5}}>
<View>
  <Text style={{fontSize:20,color:"#003cff",fontWeight:"bold"}}> Technical department</Text>
</View>
<View style={{paddingTop:5,paddingLeft:5}}>
<Text style={{fontSize:14,color:"#003cff"}}>I'm fine,thank you.how can i help you ?</Text>
</View>
</View>
<View style={{width:"20%",marginRight:5}}>
<Text style={{fontSize:13,color:"#003cff"}}>9:13 PM</Text>
</View>
</TouchableOpacity>
</View>






     </ScrollView>
  

    </View>
 
    </MenuProvider>
 

            </ImageBackground>
    
    );
  }
}
const styles = StyleSheet.create({

    getstarted_button: {
      width: "60%",
      paddingVertical: 17,
      position: "absolute", zIndex: 100,
      alignItems: "center",
      backgroundColor: "#208061",
      borderRadius: 50,
      bottom: 40
  
    },
  
  
    search: {
  
      width: "100%",
      marginTop: 10,
      paddingVertical: 10,
  
      backgroundColor: "#F5F5F5",
      borderRadius: 50,
    },
    box: {
  
      width: "100%",
      height: 70,
      resizeMode: "cover",
      borderRadius:50
  
  
  
    },
    popbox: {
      width: '48%', alignContent: "center", alignItems: "center", backgroundColor: "#fff", marginTop: 10,
      shadowColor: "grey",
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowOpacity: 0.60,
      shadowRadius: 2.62,
      elevation: 6,
    }
  });