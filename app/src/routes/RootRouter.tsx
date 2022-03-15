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
import { ACCESS_KEY, REFRESH_KEY } from '../constants/securestoreKey';
import RootNavigation from '../navigations/RootNavigation';


const RootRouter: React.FC = () => {
  // ANCHOR start token validation to do conditional navigation
  const [access, setAccess] = useState<boolean>(false);
  const trying = async () => {
    const localAccessToken = await SecureStore.getItemAsync(ACCESS_KEY);
    const localRefreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
    if (!localAccessToken || !localRefreshToken) { return setAccess(false) }
    axios({ method: 'post', url: `${AuthAPI}/token/access`, headers: { "Authorization": `Bearer ${localAccessToken}` } })
      .then(async (stage1) => {
        if (stage1.status == 200) { return setAccess(true) }
        return axios({
          method: 'post',
          url: `${AuthAPI}/token/refresh`,
          headers: { "Authorization": `Bearer ${REFRESH_KEY}` }
        }).then(async (stage2) => {
          if (stage2.status != 200) { return setAccess(false) }
          await SecureStore.setItemAsync(ACCESS_KEY, stage2.data.accessToken);
          return setAccess(true);
        })
      })
  }

  try {
    trying();
  } catch (error) {
    console.log(error)
  } finally {
    return (
      <NavigationContainer>
        <RootNavigation Access={access} />
      </NavigationContainer>
    );
  }

}
export default RootRouter;