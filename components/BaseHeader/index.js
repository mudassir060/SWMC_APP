import React, { Component } from "react";
import { Header, Button, Left, Right, Icon, Container, Form, Textarea } from "native-base";
// import { inject } from "mobx-react/native"; 
// import IconBadge from "react-native-icon-badge";
import {
  Dimensions,
  Platform,
  Modal,
  Text,
  TouchableHighlight,
  View,
  Alert,
  Image
} from "react-native";
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants'
var deviceHeight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;

// @inject("routerActions")
class BaseHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.navigate = this.props.navigation.navigate;
  }
 
  render() {
    const navigation = this.props.navigation;
    return (
      <View style={{width:deviceWidth,backgroundColor:"#000",borderTopRightRadius:30,borderBottomLeftRadius:80}}>
      <StatusBar style style="light" />
<View style={{width:"100%",alignContent:"center", alignItems:"center"}}>
<Image style={{width:"98%", height:300, resizeMode:"contain"}} source={require("../../assets/images/logo_cmy.png")}/>
{/* <StatusBar style="light" /> */}
</View>

      </View>
     );
  }
}


export default BaseHeader;
