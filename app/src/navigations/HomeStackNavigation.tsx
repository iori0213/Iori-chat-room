import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { AccessContext } from "../components/Home/AccessContext";
import { ChatContext } from "../components/Home/ChatContext";
import { BackendUrl } from "../constants/backendAPI";
import ChatScreen from "../screens/ChtaRoom/ChatScreen";
import RoomMembersScreen from "../screens/ChtaRoom/RoomMembersScreen";
import EditProfileScreen from "../screens/Home/Profile/EditProfileScreen";
//import screens
import { HomeStackNavigationProps } from "../types/navigations";
import HomeNavigation from "./HomeNavigation";
import * as SecureStore from "expo-secure-store";
import { ACCESS_KEY } from "../constants/securestoreKey";

const HomeStack = createNativeStackNavigator<HomeStackNavigationProps>();
const HomeStackNavigation: React.FC = () => {
  const [accessToken, setAccessToken] = useState("");
  const initialize = async () => {
    const localAccessToken = await SecureStore.getItemAsync(ACCESS_KEY);
    setAccessToken(localAccessToken!);
  };
  useEffect(() => {
    initialize();
  }, []);

  const socket = useMemo(() => {
    if (accessToken) {
      return io(BackendUrl, {
        auth: {
          token: accessToken,
        },
      });
    } else {
      return undefined;
    }
  }, [accessToken]);
  return (
    <ChatContext.Provider value={{ socket }}>
      <HomeStack.Navigator
        initialRouteName="HomeNavigation"
        screenOptions={{ headerShown: false }}
      >
        <HomeStack.Screen name="HomeNavigation" component={HomeNavigation} />
        <HomeStack.Screen name="ChatScreen" component={ChatScreen} />
        <HomeStack.Screen
          name="RoomMembersScreen"
          component={RoomMembersScreen}
        />
        <HomeStack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
        />
      </HomeStack.Navigator>
    </ChatContext.Provider>
  );
};
export default HomeStackNavigation;
