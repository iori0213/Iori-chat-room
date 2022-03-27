import React from 'react'
//navigator
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AppNavigationProps } from '../types/navigations';
//screens
import HomeScreen from '../screens/Home/HomeScreen';
import { bg_LessDarkColor } from '../constants/cssConst';
import ChatNavigation from './ChatNavigation';

interface HomeNavigationProps {

}

const HomeNavigation: React.FC<HomeNavigationProps> = ({ }) => {
  const BottomTab = createMaterialBottomTabNavigator<AppNavigationProps>();
  return (
    <BottomTab.Navigator initialRouteName='ChatNavigation' barStyle={{ backgroundColor: bg_LessDarkColor }}>
      <BottomTab.Screen name='ChatNavigation' component={ChatNavigation}
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