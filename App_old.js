
import { Asset } from 'expo-asset';




var deviceHeight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;
import React, { Component } from "react";

import {  Platform, StatusBar, StyleSheet, View, AsyncStorage, AppRegistry,  TouchableOpacity, Animated, Dimensions, Image} from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import LoginNavigator from './navigation/LoginNavigator';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { AppLoading } from 'expo';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:true,
      loggedIn:false,
    };
  }
  async componentDidMount() {
    AsyncStorage.getItem("userID").then(user_data => {
      const val = JSON.parse(user_data);
      console.log(val);
      if(val){
        this.setState({loggedIn:true})
      }
     
    });
    await Promise.all([
      await Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
       })
     ])
     this.setState({loading:false});
  }
  render(){
    if (this.state.loading) {
      return <AppLoading />;
    }
    if(this.state.loggedIn){
      return(
        <LoginNavigator/>
      )
    }else{
      return(
        <AppNavigator/>
      )
    }


  }

}

