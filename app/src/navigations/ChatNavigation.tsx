import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//import screens
import { ChatNavigationProps } from '../types/navigations';
import ChatScreen from '../screens/Home/ChatScreen';
import HomeNavigation from './HomeNavigation';

const RootStack = createNativeStackNavigator<ChatNavigationProps>();
const ChatNavigation: React.FC = () => {
  return (
    <RootStack.Navigator initialRouteName='HomeNavigation' screenOptions={{ headerShown: false }}>
      <RootStack.Screen name='HomeNavigation' component={HomeNavigation} />
      <RootStack.Screen name='ChatScreen' component={ChatScreen} />
    </RootStack.Navigator>
  );
}
export default ChatNavigation;