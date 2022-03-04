import React, { useEffect } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Text } from "react-native";

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = (props) => {

  useEffect(() => {

  }, [])

  return (
    <Text>this is just for debugger.</Text>
  )
}

export default HomeScreen