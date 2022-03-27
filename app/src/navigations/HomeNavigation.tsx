import React from 'react'
//navigator
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeNavigationProps } from '../types/navigations';
//screens
import HomeScreen from '../screens/Home/HomeScreen';
import { bg_LessDarkColor } from '../constants/cssConst';
import RoomListScreen from '../screens/Home/RoomListScreen';

type Props = {

}

const HomeNavigation: React.FC<Props> = ({ }) => {
  const BottomTab = createMaterialBottomTabNavigator<HomeNavigationProps>();
  return (
    <BottomTab.Navigator initialRouteName='RoomListScreen' barStyle={{ backgroundColor: bg_LessDarkColor }}>
      <BottomTab.Screen name='RoomListScreen' component={RoomListScreen}
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