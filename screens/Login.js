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
import { LinearGradient } from 'expo-linear-gradient';

import Icon from 'react-native-vector-icons/Ionicons';
import Constants from "expo-constants";
import { Container, Picker, Content, Button } from "native-base";
import { URL } from "../components/API";
import BaseHeader from "../components/BaseHeader";
import publicIP from 'react-native-public-ip';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, Ionicons, EvilIcons, MaterialCommunityIcons, Octicons, Feather, Entypo,AntDesign  } from '@expo/vector-icons';

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
      address: "",
      name_err: "",
      address_err: "",
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
      this.setState({ip : ip})
    })
    .catch(error => {
      console.log(error);
    });
    this.fetchDepartments();
    // this.fetchAvatars();
   
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
//  fetchAvatars = () => {
//   fetch(URL+"get-avatars", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     }
//   })
//     .then(res => res.json())
//     .then(async response => {
//        console.log("Response =>");
//        console.log(response.data);
//      this.setState({images : response.data, loader:false})
//     })
//     .catch(error => alert("Please Check Your Internet Connection"));
//  }
  onDepartmentSelect(value) {
    console.log(value);
    var check_selected_array_object = this.state.departments_data.find(
      task => task.id === value
    );
    console.log("check_selected_array_object");
    console.log(check_selected_array_object);
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
  
    const {user_avatar,name , email, department,ip} = this.state;
 
    let email_reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let l_email = email.toLowerCase();
   
    if (name == "" && email == "" && department == 0 ) {
      Alert.alert(
        "SWMC_app",
        "please enter all fields",
        [
         
          { text: "OK"}
        ],
        { cancelable: false }
      );
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
            console.log("this.state.address")
            console.log(this.state.address)
            console.log(this.state.department)
            // console.log("this.state.address")
            let arr = {};
            arr.address= this.state.address;
            arr.email= this.state.email;
            var check_selected_array_object = this.state.departments_data.find(
              task => task.id === this.state.department
            );
            if(check_selected_array_object){

              arr.department= check_selected_array_object.name;
            }else{
              arr.department= 'N/A';

            }
            AsyncStorage.setItem("userID", JSON.stringify(response.data));
            AsyncStorage.setItem("user_image", JSON.stringify(this.state.user_avatar));
            AsyncStorage.setItem("other_data", JSON.stringify(arr));
            console.log("arr")
            console.log(arr)
            // AsyncStorage.setItem("user_image", JSON.stringify(this.state.images[this.state.pointer]));
            this.setState({ isLoading: false });
            this.props.navigation.push("Chat")
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
      AsyncStorage.setItem("user_image", JSON.stringify(result.uri));
      // setImage(result.uri);
    }
  };

  render() {
    const { navigation } = this.props.navigation;
    const fontColor = "#82a601";
    console.log("---------------")
    console.log("http://swmcapp.com/"+this.state.images[this.state.pointer])
    let image_path="";
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
      
 

<LinearGradient style={{flex:1}} colors={['#f7bb97','#dd5e89' ]}>
<ImageBackground source={require("../assets/images/bcgrnd.png")} imageStyle={{resizeMode:"cover", overlayColor:"grey"}} style={{flex:1 }}>
<ScrollView>
    <View style={{flex:1}}>

    <BaseHeader
         navigation={this.props.navigation}
         title={"Customer Care"}
         logo={true}
       />
       <Content>
        
           <View
             style={{
               width: "100%",
               alignItems: "center",
               alignContent: "center"
             }}
           >
             <View
               style={{
                 width: "90%",
                 marginVertical: 10,
                 alignItems: "center",
                 justifyContent: "center"
               }}
             >
               
              <View style={{marginTop:25  }}>
                            <TouchableOpacity style={{borderRadius:20,borderWidth:1,borderColor:"grey",padding:5,backgroundColor:"#fff",marginTop:10}} onPress={() => this.pickImage()}>
                                <Text>Choose Image</Text>
                            </TouchableOpacity>
                            {this.state.user_avatar? (<Image source={{ uri: this.state.user_avatar }} style={{width:80, height: 80,borderRadius:50,marginTop:10 }} />):null }
                            </View>
                           

             </View>
             </View>
             <View style={{paddingHorizontal:25,paddingBottom:100}}>
            
       
             <View style={{ width: "95%", justifyContent: "center", alignContent: "center",marginTop:25,borderWidth:2,borderColor:"#fff",paddingTop:5,paddingBottom:5,borderRadius:8,backgroundColor: 'rgba(238,238,238,0.2)' }}>
                <TextInput
                  style={{ fontSize: 15,paddingHorizontal:10 ,fontWeight:"bold",color:"#fff"}}
                  placeholder="Full Name"
                  placeholderTextColor="#fff"
                  onChangeText={(name) => {
                    this.setState({name});
                  }}
                  value={this.state.name}
                />
               
                </View> 
                <View>
                  <Text style={{color:"red"}}>{this.state.name_err}</Text>
                </View>
                <View style={{ width: "95%", justifyContent: "center", alignContent: "center",marginTop:15,borderWidth:2,borderColor:"#fff",paddingTop:5,paddingBottom:5,borderRadius:8,backgroundColor: 'rgba(238,238,238,0.2)'}}>
                <TextInput
                  style={{ fontSize: 15,paddingHorizontal:10,fontWeight:"bold",color:"#fff" }}
                  placeholder="Email Address"
                  placeholderTextColor="#fff"
                  onChangeText={(email) => {
                    this.setState({email});
                  }}
                  value={this.state.email}
                />
              
                </View> 
                <View>
                  <Text style={{color:"red"}}>{this.state.email_err}</Text>
                </View>
             <View style={{ width: "95%",marginTop:20}}>
               <View
                 style={{
                  backgroundColor: 'rgba(238,238,238,0.2)',
                   borderWidth: 0.8,
             
                   borderColor: "#808080",
                   padding: 0,
                   marginTop: 10,
                
                 }}
               >
                 <Picker
                   mode="dropdown"
                  
                   style={{ width: undefined, height: 40,color:"#fff" }}
                   placeholder="how we can help you ?"
                   placeholderStyle={{ }}
                   placeholderIconColor="#fff"
                   textStyle={{fontSize: 12}}
                   selectedValue={this.state.department}
                   onValueChange={this.onDepartmentSelect.bind(this)}
                 >
                   <Picker.Item label="What can we help you with?" value={0}  />
                   {
                     this.state.departments_data.map((item, index) => {
  return(
   <Picker.Item key={index} label={item.name} value={item.id} />
  )
   })
                    }
                  
                 
                 </Picker>
               </View>
               <Text style={{color:"#00ACD9"}}>{this.state.department_err}</Text>
              
             </View>
             <View style={{ width: "100%",marginTop:100,alignItems:"center",alignContent:"center"}}>
          
               <TouchableOpacity  style={styles.login_button} onPress={() => this.submit()} >
               <Text style={{ color: '#eb7b65',fontSize:20 }}>Login</Text>
                </TouchableOpacity>



             </View>
         

             </View>

          
        
       </Content>
 



    </View>
    </ScrollView>
   
   
   

    </ImageBackground>



</LinearGradient>





     
  



   
    

  
    
      
        
   
    
    );
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
  login_button: {
    width: "95%",
    paddingVertical: 10,
    alignItems: "center",
    alignContent: "center",

    backgroundColor: "#fff",
    borderRadius: 10,
  },
 
})





















































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
             