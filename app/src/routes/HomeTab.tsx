import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import screens
import ChatroomsScreen from '../screens/User/ChatroomsScreen';
import UserInfoScreen from '../screens/User/UserInfoScreen';
import { AppParamList } from '../types/navigations';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const BottomTab = createBottomTabNavigator<AppParamList>();
const RootStack = createNativeStackNavigator<AppParamList>();

const HomeTab: React.FC = ({ }) => {
  return (
    <BottomTab.Navigator initialRouteName='UserInfoScreen' screenOptions={{ headerShown: false }}>
      <BottomTab.Screen name='ChatroomsScreen' component={ChatroomsScreen} />
      <BottomTab.Screen name='UserInfoScreen' component={UserInfoScreen} />
    </BottomTab.Navigator>

  );
}
export default HomeTab;