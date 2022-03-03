import React from "react";
import axios from "axios"
import * as SecureStore from 'expo-secure-store';
import { ImageBackground, View, StyleSheet, Text, Dimensions } from "react-native";
import BackgroundCard from "../../components/Auth/BackgroundCard"
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = (props) => {



  return (
    <SafeAreaView style={styles.safeArea}>
      <BackgroundCard></BackgroundCard>
    </SafeAreaView>
  )
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
})

export default LoginScreen