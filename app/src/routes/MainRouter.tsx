import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from '@react-navigation/drawer';
//import routes
import LoginScreen from "../screens/Authentication/Login.screen";
import MainScreen from "../screens/Main.screen";

const stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const AppRouter: React.FC = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Main">
        <Drawer.Screen name="Main" component={MainScreen} />
      </Drawer.Navigator>
      <stack.Navigator screenOptions={{ gestureEnabled: false, headerShown: false }}>
        <stack.Screen name="Main" component={MainScreen} />
        <stack.Screen name="Login" component={LoginScreen} />
      </stack.Navigator>
    </NavigationContainer>
  )
}

export default AppRouter