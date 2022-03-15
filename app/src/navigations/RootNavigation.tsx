import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigation from './AuthNavigation';
import HomeNavigation from './HomeNavigation';

interface RootNavigationProps {
  Access: boolean;
}

type StackParamList = {
  AuthNavigation: undefined;
  HomeNavigation: undefined;
}
const RootNavigation: React.FC<RootNavigationProps> = ({ Access }) => {
  const Stack = createNativeStackNavigator<StackParamList>()
  console.log("ACCESS: ", Access);
  return (
    <Stack.Navigator initialRouteName={Access ? "HomeNavigation" : "AuthNavigation"} screenOptions={{ headerShown: false }}>
      <Stack.Screen name='AuthNavigation' component={AuthNavigation} />
      <Stack.Screen name='HomeNavigation' component={HomeNavigation} />
    </Stack.Navigator>
  );
}
export default RootNavigation;