import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import navigations
import AuthNavigation from '../navigations/AuthNavigation';
import HomeNavigation from '../navigations/HomeNavigation';

type StackParamList = {
  AuthNavigation: undefined;
  HomeNavigation: undefined;
}
const RootRouter: React.FC = () => {
  const Stack = createNativeStackNavigator<StackParamList>()
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='AuthNavigation' screenOptions={{ headerShown: false }}>
        <Stack.Screen name='AuthNavigation' component={AuthNavigation} />
        <Stack.Screen name='HomeNavigation' component={HomeNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default RootRouter;