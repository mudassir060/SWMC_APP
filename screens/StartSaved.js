import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, Image, StyleSheet, Picker, Dimensions, ImageBackground, TextInput,
} from 'react-native';

import { Ionicons, EvilIcons, MaterialIcons, Entypo, AntDesign, FontAwesome } from '@expo/vector-icons';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

import Footer from './Footer';
export default class Workouts extends Component {
  // const [started, setStarted] = useState(false)
  constructor(props) {
    super(props);
    this.state = {
      started: false,
      login_email: "",
      login_password: "",
      register_email: "",
      register_password: "",
    }

  }
  closeDrawer= () => {
    this.drawer._root.close()
  };
openDrawer = () => { this.drawer._root.open() };
  render() {
    return (

      <View style={{ flex: 1, alignItems: "center", backgroundColor: "#fff" }}>


        <Footer title={"workouts"} back={false} navigation={this.props.navigation} />

      </View>
//  </Drawer>



    );
  }

}
const styles = StyleSheet.create({
  pic: {


    height: 250,
    width: "100%",


  },
  login_button: {
    width: "90%",

    marginTop: 10,
    paddingVertical: 13,
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "#808080",
    borderRadius: 10
  },
  facebook: {

    width: "90%",

    marginTop: 30,
    paddingVertical: 13,
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "#005f9A",
    borderRadius: 10
  },
});