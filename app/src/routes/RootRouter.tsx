import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//import screens
import LoginScreen from "../screens/Authentication/LoginScreen";
import RegisterScreen from "../screens/Authentication/RegisterScreen";
import HomeScreen from '../screens/Home.screen';
import ChatroomsScreen from '../screens/User/ChatroomsScreen';
import UserInfoScreen from '../screens/User/UserInfoScreen';
import { RootStackParamList, AppParamList } from '../types/navigations';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<AppParamList>();
const RootRouter: React.FC = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName='LoginScreen' screenOptions={{ headerShown: false }}>
        <RootStack.Screen name='LoginScreen' component={LoginScreen} />
        <RootStack.Screen name='RegisterScreen' component={RegisterScreen} />
        <RootStack.Screen name='ChatroomsScreen' component={ChatroomsScreen} />
        <RootStack.Screen name='UserInfoScreen' component={UserInfoScreen} />
        {/* <RootStack.Screen name='HomeScreen' component={HomeScreen} /> */}
      </RootStack.Navigator>
      <Tab.Navigator>
        <Tab.Screen name='ChatroomsScreen' component={ChatroomsScreen} />
        <Tab.Screen name='UserInfoScreen' component={UserInfoScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
export default RootRouter;