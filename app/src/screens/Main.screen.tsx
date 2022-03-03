import React, { useEffect } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Text } from "react-native";

interface mainScreenProps {
  navigation: any;
}

const MainScreen: React.FC<mainScreenProps> = (props) => {

  useEffect(() => {

  }, [])

  return (
    <Text>this is just for debugger.</Text>
  )
}

export default MainScreen