import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import { windowHeight, windowWidth } from '../../constants/cssConst'
import { Entypo } from "@expo/vector-icons/"
import { SimpleLineIcons } from '@expo/vector-icons';

const BackgroundCard: React.FC = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  return (
    <View style={styles.backgroundContainer}>

      {/* Top container */}
      <View style={styles.topContainer}>
        <View style={styles.cuttingTopContainer}>
          <View style={styles.headerContainer}>
            <Entypo name='chat' size={windowWidth * 0.22} color={bg_LightColor} style={styles.iconContainer} />
            <Text style={styles.welcomeContainer}>WELCOME BACK</Text>
          </View>
        </View>
      </View>

      {/* Main container */}
      <View style={styles.mainContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder='Enter email'
            placeholderTextColor="#477"
            onChangeText={(val) => setEmail(val)}
            style={styles.input} />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder='Enter password'
            placeholderTextColor="#477"
            onChangeText={(val) => setPassword(val)}
            style={styles.passwordInput} />
        </View>
      </View>


      {/* Bottom container */}
      <View style={styles.bottomContainer}>
        {/* Auth container */}
        <View style={styles.cuttingBottomContainer}>
          <View style={styles.authBtnContainer}>
            <TouchableOpacity style={styles.authBtn}>
              <Text style={styles.btnText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.authBtn}>
              <Text style={styles.btnText}>SIGN UP</Text>
            </TouchableOpacity>
          </View>
          {/* Oauth2 container */}
          <View style={styles.Oauth2BtnContainer}>
            <TouchableOpacity>
              <SimpleLineIcons name="social-google" size={bottomIconSize} color={bg_LightColor} style={styles.Oauth2Btn} />
            </TouchableOpacity>
            <TouchableOpacity>
              <SimpleLineIcons name="social-facebook" size={bottomIconSize} color={bg_LightColor} style={styles.Oauth2Btn} />
            </TouchableOpacity>
            <TouchableOpacity>
              <SimpleLineIcons name="social-twitter" size={bottomIconSize} color={bg_LightColor} style={styles.Oauth2Btn} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View >
  )
}

export default BackgroundCard


//Css Constants==========================================
//Radius
const cornerRadius = windowWidth * 0.23;
//Colors
const bg_LightColor = "#45c1b9";
const bg_DarkColor = "#171535";
const font_color = "#AFF";
//Bottom icon size
const bottomIconSize = windowWidth * 0.07;

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: bg_DarkColor,
  },
  //Top container========================================
  topContainer: {
    width: windowWidth,
    height: windowHeight * 0.2,
    backgroundColor: bg_LightColor,
  },
  cuttingTopContainer: {
    flex: 1,
    backgroundColor: bg_DarkColor,
    // borderBottomRightRadius: cornerRadius,
    borderBottomLeftRadius: cornerRadius,
  },
  headerContainer: {
    paddingLeft: windowWidth * 0.07,
    paddingTop: windowHeight * 0.027,
    flexDirection: "row",
  },
  iconContainer: {

  },
  welcomeContainer: {
    paddingTop: windowHeight * 0.08,
    color: "#FFF",
    fontFamily: "MajorMonoDisplay",
    fontSize: windowWidth * 0.07,
  },
  //Main container========================================
  mainContainer: {
    width: windowWidth,
    height: windowHeight * 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: bg_LightColor,
    borderTopRightRadius: cornerRadius,
    borderTopLeftRadius: cornerRadius,
    borderBottomRightRadius: cornerRadius,
    borderBottomLeftRadius: cornerRadius,
  },
  inputContainer: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.07,
    borderRadius: windowHeight * 0.035,
    backgroundColor: bg_DarkColor,
    opacity: 0.9,
    marginVertical: windowHeight * 0.03,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  input: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.07,
    borderRadius: windowHeight * 0.035,
    paddingLeft: windowWidth * 0.05,
    color: font_color,
  },
  passwordInput: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.07,
    borderRadius: windowHeight * 0.035,
    paddingLeft: windowWidth * 0.05,
    color: font_color,
  },

  //Bottom container========================================
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
    paddingTop: windowHeight * 0.03,
    alignItems: "center",
    // justifyContent: "center",
  },
  authBtn: {
    width: windowWidth * 0.6,
    height: windowHeight * 0.07,
    marginTop: windowHeight * 0.02,
    borderWidth: 1.5,
    borderColor: bg_LightColor,
    borderRadius: windowHeight * 0.035,
    alignItems: "center",
    justifyContent: "center"
  },
  btnText: {
    fontFamily: "MajorMonoDisplay",
    fontSize: windowWidth * 0.05,
    color: "#FFF",
  },
  Oauth2BtnContainer: {
    width: windowWidth,
    height: windowHeight * 0.15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  Oauth2Btn: {
    marginHorizontal: windowWidth * 0.09,
  }
})