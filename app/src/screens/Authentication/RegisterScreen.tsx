import React, { useState } from "react";
import axios from "axios";
import {
  Alert,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  bg_DarkColor,
  bg_LessDarkColor,
  cornerRadius,
  windowHeight,
  windowWidth,
} from "../../constants/cssConst";
import { Fontisto, Feather, FontAwesome } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthAPI } from "../../constants/backendAPI";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthNavigationProps } from "../../types/navigations";
import AuthInput from "../../components/Auth/AuthInput";
import SystemNavigationBar from "react-native-system-navigation-bar";

type Props = NativeStackScreenProps<AuthNavigationProps, "RegisterScreen">;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  //useState
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showName, setShowName] = useState("");
  const [password, setPassword] = useState("");

  const RegisterProcess = async () => {
    if (email == "" || name == "" || showName == "" || password == "")
      return Alert.alert("Error", "Missing input value!");
    axios({
      method: "post",
      url: `${AuthAPI}/register`,
      data: {
        email: email,
        name: name,
        showName: showName,
        password: password,
      },
    })
      .then((result) => {
        return Alert.alert("Register", result.data.message, [
          { text: "OK", onPress: () => navigation.pop() },
        ]);
      })
      .catch((e) => {
        return Alert.alert("Register error", e.response.data.message);
      });
  };

  SystemNavigationBar.navigationHide();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor={bg_DarkColor} barStyle="light-content" />
        <KeyboardAvoidingView behavior="position">
          {/* Header */}
          <View style={styles.topContainer}>
            <View style={styles.cuttingTopContainer}>
              <TouchableOpacity
                style={styles.goback}
                onPress={() => navigation.goBack()}
              >
                <FontAwesome
                  name="angle-double-left"
                  size={windowWidth * 0.12}
                  color="#FFF"
                />
              </TouchableOpacity>
              <Text style={styles.headerTextContainer}>reGisteR</Text>
            </View>
          </View>
          {/* Body */}
          <View style={styles.mainContainer}>
            <AuthInput
              InputIcon={
                <Fontisto name="email" size={windowWidth * 0.07} color="#FFF" />
              }
              SetInputState={setEmail}
              PlaceHolder="Enter email"
              PasswordMode={false}
            />
            <AuthInput
              InputIcon={
                <Feather name="user" size={windowWidth * 0.07} color="#FFF" />
              }
              SetInputState={setName}
              PlaceHolder="Enter user name"
              PasswordMode={false}
            />
            <AuthInput
              InputIcon={
                <Feather name="user" size={windowWidth * 0.07} color="#FFF" />
              }
              SetInputState={setShowName}
              PlaceHolder="Enter show name"
              PasswordMode={false}
            />
            <AuthInput
              InputIcon={
                <Fontisto
                  name="locked"
                  size={windowWidth * 0.07}
                  color="#FFF"
                />
              }
              SetInputState={setPassword}
              PlaceHolder="Enter password"
              PasswordMode={true}
            />
          </View>
        </KeyboardAvoidingView>
        {/* Footer */}
        <View style={styles.bottomContainer}>
          <View style={styles.cuttingBottomContainer}>
            {/* Auth container */}
            <TouchableOpacity
              style={styles.authBtn}
              onPress={() => RegisterProcess()}
            >
              <Text style={styles.btnText}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: bg_DarkColor,
  },
  //Header
  topContainer: {
    width: windowWidth,
    height: windowHeight * 0.2,
    backgroundColor: bg_LessDarkColor,
  },
  cuttingTopContainer: {
    flex: 1,
    backgroundColor: bg_DarkColor,
    borderBottomRightRadius: cornerRadius,
    borderTopLeftRadius: windowWidth * 0.4,
    alignItems: "center",
    // justifyContent: "center",
  },
  goback: {
    width: windowWidth * 0.12,
    height: windowWidth * 0.12,
    marginRight: windowWidth * 0.88,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextContainer: {
    color: "#FFF",
    fontFamily: "MajorMonoDisplay",
    fontSize: windowWidth * 0.11,
    paddingTop: windowHeight * 0.02,
  },
  //Body
  mainContainer: {
    width: windowWidth,
    height: windowHeight * 0.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: bg_LessDarkColor,
    borderTopLeftRadius: cornerRadius,
    borderBottomRightRadius: cornerRadius,
  },
  //Footer
  bottomContainer: {
    width: windowWidth,
    height: windowHeight * 0.3,
    backgroundColor: bg_LessDarkColor,
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
    width: windowWidth * 0.5,
    height: windowHeight * 0.07,
    marginTop: cornerRadius / 1.5,
    borderWidth: 1.5,
    borderColor: "#FFF",
    borderRadius: windowHeight * 0.035,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: windowWidth * 0.075,
    color: "#FFF",
  },
});
