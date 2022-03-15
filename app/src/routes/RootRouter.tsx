import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import navigations
import AuthNavigation from '../navigations/AuthNavigation';
import HomeNavigation from '../navigations/HomeNavigation';
//import secureStore
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { AuthAPI } from '../constants/backendAPI';

type StackParamList = {
  AuthNavigation: undefined;
  HomeNavigation: undefined;
}
const RootRouter: React.FC = () => {
  const Stack = createNativeStackNavigator<StackParamList>()
  // ANCHOR start token validation to do conditional navigation
  const [access, setAccess] = useState(false);
  const validateTokens = async () => {
    let localAccessToken = await SecureStore.getItemAsync("AccessToken");
    let localRefreshToken = await SecureStore.getItemAsync("RefreshToken");
    if (!localAccessToken || !localRefreshToken) { return (setAccess(false), console.log("Error : Local tokens missing!")) }
    axios({
      method: "POST",
      url: `${AuthAPI}/token/access`,
      headers: { "Authorization": `Bearer ${localAccessToken}` }
    }).then((accessTokenResult) => {
      if (accessTokenResult.status == 200) { return setAccess(true) }
      axios({
        method: "POST",
        url: `${AuthAPI}/token/refresh`,
        headers: { "Authorization": `Bearer ${localRefreshToken}` }
      }).then((refreshTokenResult) => {
        if (refreshTokenResult.status != 200) { return (setAccess(false), console.log("Error : Invalid refreshToken!")) }
        return (validateTokens);
      })
    })
  }
  useEffect(() => {
    validateTokens();
  }, [])



  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={(access) ? "HomeNavigation" : "AuthNavigation"} screenOptions={{ headerShown: false }}>
        <Stack.Screen name='AuthNavigation' component={AuthNavigation} />
        <Stack.Screen name='HomeNavigation' component={HomeNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default RootRouter;