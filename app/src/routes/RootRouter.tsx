import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//import navigations
import AuthNavigation from "../navigations/AuthNavigation";
import { AuthAPI } from "../constants/backendAPI";
import LoadingSpinner from "../components/Auth/LoadingSpinner";
import { RootNavigationProps } from "../types/navigations";
import HomeStackNavigation from "../navigations/HomeStackNavigation";
import customAxiosInstance from "../utils/customAxiosInstance";
import { View } from "react-native";
import { bg_DarkColor } from "../constants/cssConst";

const RootRouter: React.FC = () => {
  const Stack = createNativeStackNavigator<RootNavigationProps>();
  //fetching data status
  const [fetching, setFetching] = useState<boolean>(true);
  // ANCHOR start token validation to do conditional navigation
  const [access, setAccess] = useState<boolean>();
  const tokenValidation = () => {
    customAxiosInstance({
      method: "post",
      url: `${AuthAPI}/token/access`,
    })
      .then((res) => {
        if (res.status === 200) {
          setAccess(true);
        } else {
          setAccess(false);
        }
      })
      .catch((e) => {
        console.log("RootRouter error:", e.response.data.message);
        setAccess(false);
      });
  };

  useEffect(() => {
    if (access === undefined) {
      tokenValidation();
    }
  }, []);

  useEffect(() => {
    if (access !== undefined) {
      setFetching(false);
    }
  }, [access]);

  return fetching ? (
    <View style={{ flex: 1, backgroundColor: bg_DarkColor }}>
      <LoadingSpinner />
    </View>
  ) : (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={access ? "HomeStackNavigation" : "AuthNavigation"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="AuthNavigation" component={AuthNavigation} />
        <Stack.Screen
          name="HomeStackNavigation"
          component={HomeStackNavigation}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default RootRouter;
