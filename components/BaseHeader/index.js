import React, { Component } from "react";
import { Header, Button, Left, Right, Icon, Container, Form, Textarea } from "native-base";
// import { inject } from "mobx-react/native"; 
// import IconBadge from "react-native-icon-badge";
import {
  Dimensions,
  Platform,
  StatusBar,
  Modal,
  Text,
  TouchableHighlight,
  View,
  Alert,
  Image
} from "react-native";
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
      <View style={{width:deviceWidth, marginTop: Constants.statusBarHeight}}>
<View style={{width:"100%",alignContent:"center", alignItems:"center"}}>
<Image style={{width:"80%", height:80, resizeMode:"contain"}} source={require("../../assets/images/logo_cmy.png")}/>
</View>
<View style={{width:"100%", alignContent:"center", alignItems:"center"}}>
  <View style={{width:"70%", borderBottomWidth:0.8, borderBottomColor:"#EAEAEA", marginTop:10}}></View>
</View>
      </View>
     );
  }
}


export default BaseHeader;
