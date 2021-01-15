import React, { Component, Profiler } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import Chat from '../screens/Chat';
import Home from '../screens/Home';
import Fields from '../screens/Fields';
import Page from '../screens/Page';
import Dashboard from '../screens/Dashboard';
import SavedMessages from '../screens/SavedMessages';
import prc from '../screens/prc';
import ChatScreen from '../screens/ChatScreen';
import StartSaved from '../screens/StartSaved';
import Scrollist from '../screens/Scrollist';
import Profile from '../screens/Profile';
import ChatScreenTesting from "../screens/ChatScreenTesting";




const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="ChatScreenTesting" headerMode={"none"}>
    <Stack.Screen name="ChatScreenTesting" component={ChatScreenTesting}  />

      <Stack.Screen name="Login" component={Login}  />
      <Stack.Screen name="Chat" component={Chat}  />
      <Stack.Screen name="Home" component={Home}  />
      <Stack.Screen name="Fields" component={Fields}  />
      <Stack.Screen name="Page" component={Page}  />
      <Stack.Screen name="ChatDashboard" component={Dashboard}  />
      <Stack.Screen name="Messages" component={SavedMessages}  />
      <Stack.Screen name="Practice" component={prc}  />
      <Stack.Screen name="Chatting" component={ChatScreen}  />
      <Stack.Screen name="start" component={StartSaved}  />
      <Stack.Screen name="scrollList" component={Scrollist}  />
      <Stack.Screen name="profile" component={Profile}  />
      
     
      
    



    </Stack.Navigator>
  </NavigationContainer> 
  );
}

