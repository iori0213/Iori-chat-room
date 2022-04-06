import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//import navigations
import AuthNavigation from "../navigations/AuthNavigation";
//import secureStore
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { AuthAPI } from "../constants/backendAPI";
import { ACCESS_KEY, REFRESH_KEY } from "../constants/securestoreKey";
import LoadingSpinner from "../components/Auth/LoadingSpinner";
import { RootNavigationProps } from "../types/navigations";
import HomeStackNavigation from "../navigations/HomeStackNavigation";
import { AccessContext } from "../components/Home/AccessContext";

const RootRouter: React.FC = () => {
  const Stack = createNativeStackNavigator<RootNavigationProps>();
  //fetching data status
  const [fetching, setFetching] = useState<boolean>(true);
  // ANCHOR start token validation to do conditional navigation
  const [access, setAccess] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const tokenValidation = async () => {
    const localAccessToken = await SecureStore.getItemAsync(ACCESS_KEY);
    const localRefreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
    if (!localAccessToken || !localRefreshToken) {
      return false;
    }
    const accessResult = await axios({
      method: "post",
      url: `${AuthAPI}/token/access`,
      headers: { Authorization: `Bearer ${localAccessToken}` },
    });
    if (accessResult.data.success) {
      setAccessToken(localAccessToken);
      return true;
    }
    const refreshResult = await axios({
      method: "post",
      url: `${AuthAPI}/token/refresh`,
      headers: { Authorization: `Bearer ${REFRESH_KEY}` },
    });
    if (refreshResult.status != 200) {
      return false;
    }
    await SecureStore.setItemAsync(ACCESS_KEY, refreshResult.data.accessToken);
    return true;
  };

  useEffect(() => {
    try {
      tokenValidation().then((isAccess) => {
        if (isAccess) {
          setAccess(true);
        } else {
          setAccess(false);
        }
        setFetching(false);
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  return fetching ? (
    <LoadingSpinner />
  ) : (
    <AccessContext.Provider value={{ accessToken }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={access ? "ChatNavigation" : "AuthNavigation"}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="AuthNavigation" component={AuthNavigation} />
          <Stack.Screen name="ChatNavigation" component={HomeStackNavigation} />
        </Stack.Navigator>
      </NavigationContainer>
    </AccessContext.Provider>
  );
};
export default RootRouter;
