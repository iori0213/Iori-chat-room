import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//import screens
import { ChatNavigationProps } from '../types/navigations';
import RoomListScreen from '../screens/Home/RoomListScreen';
import ChatScreen from '../screens/Home/ChatScreen';

const RootStack = createNativeStackNavigator<ChatNavigationProps>();
const ChatNavigation: React.FC = () => {
  return (
    <RootStack.Navigator initialRouteName='RoomListScreen' screenOptions={{ headerShown: false }}>
      <RootStack.Screen name='RoomListScreen' component={RoomListScreen} />
      <RootStack.Screen name='ChatScreen' component={ChatScreen} />
    </RootStack.Navigator>
  );
}
export default ChatNavigation;