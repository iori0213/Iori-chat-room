import React from 'react'
//navigator
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppParamList } from '../types/navigations';
//screens
import ChatroomsScreen from '../screens/User/ChatroomsScreen';
import ProfileScreen from '../screens/User/ProfileScreen';

interface HomeNavigationProps {

}
const HomeNavigation: React.FC<HomeNavigationProps> = ({ }) => {
  const BottomTab = createBottomTabNavigator<AppParamList>();
  return (
    <BottomTab.Navigator initialRouteName='ChatroomsScreen' screenOptions={{ headerShown: false }}>
      <BottomTab.Screen name='ChatroomsScreen' component={ChatroomsScreen} />
      <BottomTab.Screen name='ProfileScreen' component={ProfileScreen} />
    </BottomTab.Navigator>
  );
}


export default HomeNavigation;