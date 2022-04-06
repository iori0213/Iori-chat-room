import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//import screens
import LoginScreen from "../screens/Authentication/LoginScreen";
import RegisterScreen from "../screens/Authentication/RegisterScreen";
import { AuthNavigationProps } from "../types/navigations";
import HomeStackNavigation from "./HomeStackNavigation";

const RootStack = createNativeStackNavigator<AuthNavigationProps>();
const AuthNavigation: React.FC = () => {
  return (
    <RootStack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{ headerShown: false }}
    >
      <RootStack.Screen name="LoginScreen" component={LoginScreen} />
      <RootStack.Screen name="RegisterScreen" component={RegisterScreen} />
      <RootStack.Screen
        name="HomeStackNavigation"
        component={HomeStackNavigation}
      />
    </RootStack.Navigator>
  );
};
export default AuthNavigation;
