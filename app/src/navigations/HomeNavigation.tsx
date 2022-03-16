import React from 'react'
//navigator
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AppParamList } from '../types/navigations';
//screens
import ChatroomsScreen from '../screens/Home/ChatroomsScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import { bg_LessDarkColor } from '../constants/cssConst';

const HomeIcon = () => { <Ionicons name="home" size={24} color="#FFF" /> };
const ChatIcon = () => { <Ionicons name="ios-chatbox-ellipses-outline" size={24} color="#FFF" /> };

interface HomeNavigationProps {

}
const HomeNavigation: React.FC<HomeNavigationProps> = ({ }) => {
  const BottomTab = createMaterialBottomTabNavigator<AppParamList>();
  return (
    <BottomTab.Navigator initialRouteName='ChatroomsScreen' barStyle={{ backgroundColor: bg_LessDarkColor }}>
      <BottomTab.Screen name='ChatroomsScreen' component={ChatroomsScreen}
        options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ color }) => (<Ionicons name="ios-chatbox-ellipses-outline" size={24} color={color} />)
        }} />
      <BottomTab.Screen name='HomeScreen' component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (<Ionicons name="home" size={24} color={color} />)
        }} />
    </BottomTab.Navigator>
  );
}


export default HomeNavigation;