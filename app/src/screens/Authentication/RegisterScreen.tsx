import React, { useState } from "react";
import axios from "axios"
import * as SecureStore from 'expo-secure-store';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { bg_DarkColor, bg_LightColor, cornerRadius, inputIconSize, placeholderColor, windowHeight, windowWidth } from "../../constants/cssConst"
import AuthInput from "../../components/Auth/AuthInput";
import { Fontisto, Feather } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context";
interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = (props) => {
  //useState
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.topContainer}>
        <View style={styles.cuttingTopContainer}>
          <Text style={styles.headerTextContainer}>reGisteR</Text>
        </View>
      </View>
      {/* Body */}
      <View style={styles.mainContainer}>
        <AuthInput
          InputIcon={<Fontisto name="email" size={windowWidth * 0.07} color="#FFF" />}
          SetInputState={setEmail}
          PlaceHolder="Enter email"
          PasswordMode={false}
        />
        <AuthInput
          InputIcon={<Feather name="user" size={windowWidth * 0.07} color="#FFF" />}
          SetInputState={setUsername}
          PlaceHolder="Enter username"
          PasswordMode={false}
        />
        <AuthInput
          InputIcon={<Fontisto name="locked" size={windowWidth * 0.07} color="#FFF" />}
          SetInputState={setPassword}
          PlaceHolder="Enter password"
          PasswordMode={true}
        />
      </View>
      {/* Footer */}
      <View style={styles.bottomContainer}>
        <View style={styles.cuttingBottomContainer}>
          {/* Auth container */}
          <TouchableOpacity style={styles.authBtn} onPress={() => console.log("ohhhhh")}>
            <Text style={styles.btnText}>SUBMIT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: bg_DarkColor
  },
  //Header
  topContainer: {
    width: windowWidth,
    height: windowHeight * 0.2,
    backgroundColor: bg_LightColor,
  },
  cuttingTopContainer: {
    flex: 1,
    backgroundColor: bg_DarkColor,
    borderBottomRightRadius: cornerRadius,
    borderTopLeftRadius: windowWidth * 0.4,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextContainer: {
    color: "#FFF",
    fontFamily: "MajorMonoDisplay",
    fontSize: windowWidth * 0.085,
  },
  //Body
  mainContainer: {
    width: windowWidth,
    height: windowHeight * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: bg_LightColor,
    borderTopLeftRadius: cornerRadius,
    borderBottomRightRadius: cornerRadius,
  },
  //Footer
  bottomContainer: {
    width: windowWidth,
    height: windowHeight * 0.3,
    backgroundColor: bg_LightColor,
  },
  cuttingBottomContainer: {
    flex: 1,
    backgroundColor: bg_DarkColor,
    borderTopLeftRadius: cornerRadius,
    borderBottomRightRadius: windowHeight * 0.3,
    alignItems: "center",
    // justifyContent: "center",
  },
  authBtn: {
    width: windowWidth * 0.6,
    height: windowHeight * 0.07,
    marginTop: cornerRadius / 1.5,
    borderWidth: 1.5,
    borderColor: bg_LightColor,
    borderRadius: windowHeight * 0.035,
    alignItems: "center",
    justifyContent: "center"
  },
  btnText: {
    fontFamily: "Roboto_Thin",
    fontSize: windowWidth * 0.075,
    color: "#FFF",
  },
})