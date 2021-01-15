import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage, AppRegistry,  TouchableOpacity,
  Animated, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppNavigator from './navigation/AppNavigator';
import LoginNavigator from './navigation/LoginNavigator';
var deviceHeight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : true,
      loggedIn : false,
      change:false,
      opacity: new Animated.Value(1),
      opacity_other: new Animated.Value(0),
    }
  }
  onLoad = () => {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      console.log("this")
      this.setState({change:true});
      this.onLoad_other();
    });
  }
  onLoad_other = () => {
    Animated.timing(this.state.opacity_other, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      this.setState({loading:false})
    });
  }
  async componentWillMount() {
  this.onLoad();
    await Promise.all([
      Asset.loadAsync([
        require('./assets/images/icon.png'),
        require('./assets/images/splash.png'),
        require('./assets/images/Avatars/0.png'),
        require('./assets/images/Avatars/1.png'),
        require('./assets/images/Avatars/2.png'),
        require('./assets/images/Avatars/3.png'),
        require('./assets/images/Avatars/4.png'),
        require('./assets/images/Avatars/5.png'),
        require('./assets/images/Avatars/6.png'),
        require('./assets/images/Avatars/7.png'),
        require('./assets/images/Avatars/8.png'),
        require('./assets/images/Avatars/9.png'),
        require('./assets/images/Avatars/10.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free to
        // remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
    AsyncStorage.getItem("userID").then(user_data => {
      const val = JSON.parse(user_data);
      if(val){
        
        this.setState({
          loggedIn: true,
        });
      }
     
    });
    // this.setState({ loading: false });
  }
 

  render() {
    if (this.state.loading) {
      return (
        <View style={{width:deviceWidth,height:deviceHeight, alignContent:"center",alignItems:"center", justifyContent:"center"}}>
<View style={{width:"70%",height:"100%", alignContent:"center", alignItems:"center", justifyContent:"center"}}>
{this.state.change ? (
  <Animated.View style={[
          {
            opacity: this.state.opacity_other,
            width:"100%",
            transform: [
              {
                scale: this.state.opacity_other.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.85, 1],
                })
              },
            ],
          }
        ]}>
          <Image style={{width:"100%", resizeMode:"contain"}} source={require('./assets/images/Brandmark2.png')} />
        </Animated.View>
) : (
  <Animated.View style={[
          {
            opacity: this.state.opacity,
            width:"100%",
            transform: [
              {
                scale: this.state.opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.85, 1],
                })
              },
            ],
          }
        ]}>
          <Image style={{width:"100%", resizeMode:"contain"}} source={require('./assets/images/bcgrnd.png')} />
        </Animated.View>
)}

</View>



        </View>
 
      );
    }
    if (this.state.loggedIn){
      return (
        <LoginNavigator />
      );
    }else{
      return (
        <AppNavigator />
      );
    }
    // else{
    //   return (
    //     <AppNavigator />
    //   );
    // }
 
    
  }
 
}
AppRegistry.registerComponent('SWMC App', () => App);
const styles = StyleSheet.create({
  MainContainer: {
    width: deviceWidth,
    height: deviceHeight,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent:"center"
  },

  imageStyle: {
    width: "100%",
    height: "50%",
    resizeMode:"contain",
    borderRadius: 6,
  },

  button: {
    width: '80%',
    backgroundColor: '#BAF5B5',
    borderRadius: 6,
    marginTop: 20,
  },

  TextStyle: {
    color: '#000',
    textAlign: 'center',
    padding: 5,
    fontSize: 18,
  },
});

