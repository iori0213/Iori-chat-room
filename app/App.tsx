import React, { useState } from 'react';
import 'react-native-gesture-handler';
import { LogBox, View, Text } from 'react-native';
import AuthRouter from './src/routes/AuthRouter';



// //intialize the font loading process
// //import useFonts hook & AppLoading
import { useFonts } from "expo-font";
import AppLoading from 'expo-app-loading'
// //import Roboto
// import {
//   Roboto_400Regular as Roboto_Regular,
//   Roboto_100Thin as Roboto_Thin,
//   Roboto_700Bold as Roboto_Bold
// } from '@expo-google-fonts/roboto';
// //import Dancing
// import {
//   DancingScript_400Regular as Dancing_Regular,
//   DancingScript_700Bold as Dancing_Bold
// } from '@expo-google-fonts/dancing-script';



export default function App() {
  //start setting the font would use into the useFonts hook
  let [fontsLoaded] = useFonts({
    "Roboto_Regular": require("@expo-google-fonts/roboto/Roboto_400Regular.ttf"),
    // Roboto_Thin,
    // Roboto_Bold,
    // Dancing_Regular,
    // Dancing_Bold,
  });
  if (!fontsLoaded) {
    console.log("App loading")
    return <AppLoading />
  }

  LogBox.ignoreLogs(['Remote debugger']);
  return (
    <AuthRouter />
  );
}