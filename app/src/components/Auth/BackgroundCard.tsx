import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import { windowHeight, windowWidth } from '../../constants/cssConst'
import { Entypo, SimpleLineIcons, Ionicons, Fontisto } from "@expo/vector-icons/"

const BackgroundCard: React.FC = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passSecure, setPassSecure] = useState(true);

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
          <View style={styles.inputIconContainer}>
            <Fontisto name="email" size={inputIconSize} color="#FFF" />
          </View>
          <TextInput
            placeholder='Enter email'
            placeholderTextColor={placeholderColor}

            onChangeText={(val) => setEmail(val)}
            value={email}
            // autoCompleteType="email"
            style={styles.input} />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inputIconContainer}>
            <Fontisto name="locked" size={inputIconSize} color="#FFF" />
          </View>
          <TextInput
            placeholder='Enter password'
            placeholderTextColor={placeholderColor}
            onChangeText={(val) => setPassword(val)}
            value={password}
            secureTextEntry={passSecure}
            style={styles.passwordInput} />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setPassSecure(!passSecure)}>
            <Ionicons name={(passSecure) ? "eye-off-outline" : "eye-outline"} size={inputIconSize} color="#FFF" />
          </TouchableOpacity>
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
const placeholderColor = "#477";
//Size
const inputIconSize = windowWidth * 0.07;
const bottomIconSize = windowWidth * 0.07;
const inputFontSize = windowWidth * 0.04;

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
    borderBottomLeftRadius: cornerRadius,
    borderTopRightRadius: cornerRadius,
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
    borderBottomLeftRadius: cornerRadius,
  },
  inputContainer: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.07,
    borderRadius: windowHeight * 0.035,
    backgroundColor: bg_DarkColor,
    opacity: 0.9,
    marginVertical: windowHeight * 0.03,
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "row"
  },
  inputIconContainer: {
    width: windowWidth * 0.15,
    height: windowHeight * 0.07,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: windowWidth * 0.02
  },
  input: {
    width: windowWidth * 0.75,
    height: windowHeight * 0.07,
    borderRadius: windowHeight * 0.035,
    color: font_color,
    fontSize: inputFontSize,
  },
  passwordInput: {
    width: windowWidth * 0.6,
    height: windowHeight * 0.07,
    borderTopLeftRadius: windowHeight * 0.035,
    borderBottomLeftRadius: windowHeight * 0.035,
    color: font_color,
    fontSize: inputFontSize,
  },
  eyeIcon: {
    width: windowWidth * 0.15,
    height: windowHeight * 0.07,
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: cornerRadius,
    borderBottomRightRadius: cornerRadius,

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
    justifyContent: "center"
  },
  btnText: {
    fontFamily: "MajorMonoDisplay",
    fontSize: windowWidth * 0.08,
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