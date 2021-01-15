import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Picker, Dimensions, TextInput, ScrollView, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons, Ionicons, EvilIcons, MaterialCommunityIcons, Octicons, Feather, Entypo } from '@expo/vector-icons';
import Constants from 'expo-constants';
// import HeaderScreen from './HeaderScreen';
// import FooterScreen from './FooterScreen';
import { color } from 'react-native-reanimated';
import { isRequired } from 'react-native/Libraries/DeprecatedPropTypes/DeprecatedColorPropType';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider
} from 'react-native-popup-menu';

var deviceHeight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;



export default class ChatScreen extends Component {
  // const [started, setStarted] = useState(false)
  constructor(props) {
    super(props);
    this.state = {
      search: "",
    }
    console.log("search")
    console.log(this.props.search);
  }

  render() {
    return (

      <ImageBackground source={require("../assets/images/bcgrnd.png")} style={{ width: deviceWidth, height: deviceHeight }}>
       <MenuProvider>

       <View style={{ alignItems: 'center',marginTop:50 }}>
        
          <ScrollView>


            <View style={{ width: "100%", flexDirection: "row", marginTop:5, borderColor: "#DBDBDB", borderBottomWidth: 1, paddingBottom: 10 }}>
              <View style={{ width: "10%",paddingTop:10 }} >
              <Entypo name="chevron-thin-left" size={24} color="#22c0f1" />
              </View>
              <TouchableOpacity style={{ width: "20%", alignItems: "center" }}>
                <View style={{ width: "90%" }}>
                  <Image style={styles.box} source={require('../assets/profile.png')} />
                </View>
              </TouchableOpacity>
             
              <TouchableOpacity style={{ width: "70%"}}>
              <View style={{  width: "100%",flexDirection: "row",paddingHorizontal:5 }}>
                  <View style={{ }}>
                    <Text style={{ fontSize: 20, color: "#000000", fontWeight: "bold" }}> Ali Malik</Text>
                  </View>
             
                  <Menu style={{marginLeft:"auto"}}>      
      <MenuTrigger>
      <MaterialIcons name="more-horiz" size={24} color="#22c0f1" />
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

                  <View style={{ width: "100%", paddingTop: 1,paddingHorizontal:10 }}>
                    <Text style={{ fontSize: 16, color: "#929292",fontWeight:"bold" }}>Active Now</Text>
                 
                 
                </View>
              </TouchableOpacity>
            </View>

            


          </ScrollView>



        </View>




       </MenuProvider>
      
      </ImageBackground>
    
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



  },

})

