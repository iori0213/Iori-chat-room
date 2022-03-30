import React, { useState } from "react";
//API
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { AuthAPI } from "../../constants/backendAPI";
//components
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthInput from "../../components/Auth/AuthInput";
//navigation
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CommonActions } from "@react-navigation/native";
import { AuthNavigationProps } from "../../types/navigations";
//css const
import {
  bg_DarkColor,
  bg_LightColor,
  bottomIconSize,
  cornerRadius,
  hilight_color,
  windowHeight,
  windowWidth,
} from "../../constants/cssConst";
//import vector icons
import { Entypo, SimpleLineIcons, Fontisto } from "@expo/vector-icons/";
import {
  ACCESS_KEY,
  REFRESH_KEY,
  SHOWNAME_KEY,
  USERID_KEY,
  USERNAME_KEY,
} from "../../constants/securestoreKey";

type Props = NativeStackScreenProps<AuthNavigationProps, "LoginScreen">;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  //useState
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const LoginProcess = async () => {
    if (email == "" || password == "") {
      return Alert.alert("Error", "email or password input is missing!");
    }
    axios({
      method: "post",
      url: `${AuthAPI}/login`,
      data: {
        email: email,
        password: password,
      },
    })
      .then(async (loginResult) => {
        //ANCHOR saving basic info
        // prettier-ignore
        await SecureStore.setItemAsync(ACCESS_KEY, loginResult.data.accessToken);
        // prettier-ignore
        await SecureStore.setItemAsync(REFRESH_KEY, loginResult.data.refreshToken);
        // prettier-ignore
        await SecureStore.setItemAsync(USERID_KEY, loginResult.data.profile.id);
        // prettier-ignore
        await SecureStore.setItemAsync(USERNAME_KEY, loginResult.data.profile.username);
        // prettier-ignore
        await SecureStore.setItemAsync(SHOWNAME_KEY, loginResult.data.profile.showname);
        navigation.dispatch(
          CommonActions.reset({ routes: [{ name: "ChatNavigation" }] })
        );
      })
      .catch((e) => Alert.alert("Error", e.response.data.message));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.topContainer}>
        <View style={styles.cuttingTopContainer}>
          <View style={styles.headerContainer}>
            <Entypo
              name="chat"
              size={windowWidth * 0.25}
              color={bg_LightColor}
              style={styles.iconContainer}
            />
            <Text style={styles.headerTextContainer}>WelcoMe bacK</Text>
          </View>
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
            <Fontisto name="locked" size={windowWidth * 0.07} color="#FFF" />
          }
          SetInputState={setPassword}
          PlaceHolder="Enter password"
          PasswordMode={true}
        />
      </View>
      {/* Footer */}
      <View style={styles.bottomContainer}>
        <View style={styles.cuttingBottomContainer}>
          {/* Auth container */}
          <View style={styles.authBtnContainer}>
            <TouchableOpacity
              style={styles.authBtn}
              onPress={async () => await LoginProcess()}
            >
              <Text style={styles.btnText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.authBtn}
              onPress={async () => navigation.navigate("RegisterScreen")}
            >
              <Text style={styles.btnText}>REGISTER</Text>
            </TouchableOpacity>
          </View>
          {/* Oauth2 container */}
          <View style={styles.Oauth2BtnContainer}>
            <TouchableOpacity>
              <SimpleLineIcons
                name="social-google"
                size={bottomIconSize}
                color={bg_LightColor}
                style={styles.Oauth2Btn}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <SimpleLineIcons
                name="social-facebook"
                size={bottomIconSize}
                color={bg_LightColor}
                style={styles.Oauth2Btn}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <SimpleLineIcons
                name="social-twitter"
                size={bottomIconSize}
                color={bg_LightColor}
                style={styles.Oauth2Btn}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: bg_DarkColor,
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
    borderBottomLeftRadius: cornerRadius,
    borderTopRightRadius: windowHeight * 0.3,
  },
  headerContainer: {
    paddingLeft: windowWidth * 0.1,
    paddingTop: windowHeight * 0.01,
    flexDirection: "row",
  },
  iconContainer: {},
  headerTextContainer: {
    marginLeft: windowWidth * -0.15,
    paddingTop: windowHeight * 0.11,
    color: "#FFF",
    fontFamily: "MajorMonoDisplay",
    fontSize: windowWidth * 0.085,
  },
  //Body
  mainContainer: {
    width: windowWidth,
    height: windowHeight * 0.4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: bg_LightColor,
    borderTopRightRadius: cornerRadius,
    borderBottomLeftRadius: cornerRadius,
  },
  //Footer
  bottomContainer: {
    width: windowWidth,
    height: windowHeight * 0.4,
    backgroundColor: bg_LightColor,
  },
  cuttingBottomContainer: {
    flex: 1,
    backgroundColor: bg_DarkColor,
    borderTopRightRadius: cornerRadius,
  },
  //AuthBtn
  authBtnContainer: {
    width: windowWidth,
    height: windowHeight * 0.25,
    paddingTop: windowHeight * 0.02,
    alignItems: "center",
    // justifyContent: "center",
  },
  authBtn: {
    width: windowWidth * 0.6,
    height: windowHeight * 0.07,
    marginTop: windowHeight * 0.03,
    borderWidth: 1.5,
    borderColor: bg_LightColor,
    borderRadius: windowHeight * 0.035,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: windowWidth * 0.075,
    color: bg_LightColor,
  },
  Oauth2BtnContainer: {
    width: windowWidth,
    height: windowHeight * 0.15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingBottom: windowHeight * 0.05,
  },
  Oauth2Btn: {
    marginHorizontal: windowWidth * 0.09,
  },
});

export default LoginScreen;
