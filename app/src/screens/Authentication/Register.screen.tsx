import React, { useState } from "react";
import axios from "axios"
import * as SecureStore from 'expo-secure-store';
import { Text, View } from "react-native";
import { bg_DarkColor, inputIconSize, placeholderColor } from "../../constants/cssConst"
import AuthInput from "../../components/Auth/AuthInput";
import { Fontisto, Ionicons } from "@expo/vector-icons"
interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = (props) => {
  const [password, setPassword] = useState("");

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: bg_DarkColor }}
    >
      <AuthInput
        InputIcon={<Fontisto name="locked" size={inputIconSize} color="#FFF" />}
        SetInput={setPassword}
        PlaceHolder="Enter password"
        PlaceHolderColor={placeholderColor}
        PasswordMode={true}
      ></AuthInput>
    </View>
  )
}

export default RegisterScreen