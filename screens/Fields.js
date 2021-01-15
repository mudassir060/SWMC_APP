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
import { Container, Picker, Content, Button } from "native-base";
import { URL } from "../components/API";
import BaseHeader from "../components/BaseHeader";
import publicIP from 'react-native-public-ip';
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
var deviceHeight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;

class Fields extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
      loan: "",
      phone: "",
      user_data:[],
      ip:"",
     
      isLoading:false,
      loader:true,
    };
  }
  componentDidMount() {
    AsyncStorage.getItem("userID").then(user_data => {
      const val = JSON.parse(user_data);
      console.log(val);
      if (val) {
        this.setState({
          user_data: val
        });
       
      }
    });
   
  }

  submit = () => {
 
    const {loan, phone} = this.state;
 
 
    if (loan == "" && phone == "") {
      this.setState({
        loan_err: "Loan Number should not be empty",
        phone_err: "Phone Number should not be empty",
      });
    }

    if (loan == "") {
      this.setState({ loan_err: "Required" });
    } else {
      this.setState({
        loan_err: ""
      });
    }
   
    if (phone == "") {
      this.setState({ phone_err: "Required" });
    } else {
      this.setState({
        phone_err: ""
      });
    }
  
    if(loan != "" && phone != ""){
      this.setState({ isLoading: true });
      console.log(loan+"--"+phone);
      
      fetch(URL+"update-fields", {
        method: "POST",
        body: JSON.stringify({
          "userID" : this.state.user_data.user_id,
          "loan_number" : loan,
          "phone_number" : phone,
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
            this.setState({ isLoading: false });
            this.props.navigation.navigate("Chat")
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
      <Container>
      <View style={{width:"100%", height:50, backgroundColor:"#0050bc", justifyContent:"center", marginTop:Constants.statusBarHeight}}>
<TouchableOpacity onPress={() => {this.props.navigation.goBack();}}>

<Image style={{width:30, height:30}} source={require("../assets/images/backWhite.png")}/>
</TouchableOpacity>
</View>
        <Content>
          <ScrollView>
            <View
              style={{
                width: "100%",
                alignItems: "center",
                alignContent: "center"
              }}
            >
             
              <View style={{ width: "90%", marginVertical: 10 }}>
                {/* <TextField
                  labelPadding={1}
                  autoCorrect={false}
                  keyboardType={"numeric"}
                  returnKeyType={"done"}
                  blurOnSubmit={true}
                  label="Loan Number *"
                  tintColor={"#000"}
                  baseColor="#808080"
                  error={this.state.loan_err}
                  onChangeText={loan => this.setState({ loan })}
                /> */}
              </View>
              
              <View style={{ width: "90%", marginVertical: 10 }}>
                {/* <TextField
                  labelPadding={1}
                  autoCorrect={false}
                  keyboardType={"phone-pad"}
                  returnKeyType={"done"}
                  blurOnSubmit={true}
                  label="Phone Number *"
                  tintColor={"#000"}
                  baseColor="#808080"
                  error={this.state.phone_err}
                  onChangeText={phone => this.setState({ phone })}
                /> */}
              </View>
               <View style={{ width: "80%", marginTop: 30 }}>
                {this.state.isLoading ? (
                  <Button
                    bordered
                    style={{
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      borderColor: fontColor,
                      borderRadius: 5,
                      backgroundColor: "#0050bc"
                    }}
                  >
                    <ActivityIndicator color={"#fd7e14"} size={"small"} />
                  </Button>
                ) : (
                  <Button
                    bordered
                    onPress={this.submit}
                    style={{
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      borderColor: fontColor,
                      borderRadius: 5,
                      backgroundColor: "#0050bc"
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#fd7e14",
                        fontSize: 17,
                        fontWeight:"bold"
                      }}
                    >
                      Start Chatting
                    </Text>
                  </Button>
                )}
              </View>
            </View>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
export default Fields;