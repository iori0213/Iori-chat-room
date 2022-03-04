import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//import routes
import LoginScreen from "../screens/Authentication/Login.screen";
import RegisterScreen from "../screens/Authentication/Register.screen";
import HomeScreen from "../screens/Home.screen";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
}

const RootStack = createNativeStackNavigator<RootStackParamList>();

const AuthRouter: React.FC = () => {


  return (
    <NavigationContainer>
      {/* can add  */}
      <RootStack.Navigator initialRouteName="Home" screenOptions={{ gestureEnabled: false, headerShown: false }}>
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="Register" component={RegisterScreen} />
        <RootStack.Screen name="Home" component={HomeScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default AuthRouter
