import React, { useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import * as Icon from "@expo/vector-icons"
import { windowWidth, windowHeight, bg_DarkColor, font_color, inputFontSize, inputIconSize, cornerRadius } from '../../constants/cssConst';
type AuthInputProps = {
  InputIcon: React.ReactNode;
  SetInput: (val: string) => void;
  PlaceHolder: string;
  PlaceHolderColor: string;
  //PasswordMode switch
  PasswordMode: boolean;
}

const AuthInput: React.FC<AuthInputProps> = ({ InputIcon, SetInput, PlaceHolder, PlaceHolderColor, PasswordMode }) => {
  const [passSecure, setPassSecure] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputIconContainer}>
        {InputIcon}
      </View>
      <TextInput
        onChangeText={(val) => SetInput(val)}
        placeholder={PlaceHolder}
        placeholderTextColor={PlaceHolderColor}
        style={styles.input}
        secureTextEntry={(PasswordMode) ? passSecure : false}
      />
      {(PasswordMode) ? <TouchableOpacity style={styles.eyeIcon} onPress={() => setPassSecure(!passSecure)}>
        <Icon.Ionicons name={(passSecure) ? "eye-off-outline" : "eye-outline"} size={inputIconSize} color="#FFF" />
      </TouchableOpacity> : <></>}
    </View>
  );
}
export default AuthInput;

const styles = StyleSheet.create({
  inputContainer: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.07,
    borderRadius: windowHeight * 0.035,
    backgroundColor: "#533",
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
    flex: 1,
    height: windowHeight * 0.07,
    borderRadius: windowHeight * 0.035,
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

})