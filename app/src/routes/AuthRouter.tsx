import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//import routes
import LoginScreen from "../screens/Authentication/Login.screen";
import RegisterScreen from "../screens/Authentication/Register.screen";
import MainScreen from "../screens/Main.screen";




const stack = createNativeStackNavigator();

const AuthRouter: React.FC = () => {


  return (
    <NavigationContainer>
      {/* can add  */}
      <stack.Navigator initialRouteName="Login" screenOptions={{ gestureEnabled: false, headerShown: false }}>
        <stack.Screen name="Login" component={LoginScreen} />
        <stack.Screen name="Register" component={RegisterScreen} />
        <stack.Screen name="Main" component={MainScreen} />
      </stack.Navigator>
    </NavigationContainer>
  )
}

export default AuthRouter
