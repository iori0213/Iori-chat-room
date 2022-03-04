import React, { useEffect } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Text } from "react-native";
import Center from "../components/Center";

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = (props) => {

  useEffect(() => {

  }, [])

  return (
    <Center>
      <Text>this is just for debugger.</Text>
    </Center>
  )
}

export default HomeScreen