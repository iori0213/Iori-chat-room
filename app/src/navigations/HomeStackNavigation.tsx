import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext, useMemo } from "react";
import { io } from "socket.io-client";
import { AccessContext } from "../components/Home/AccessContext";
import { ChatContext } from "../components/Home/ChatContext";
import { BackendUrl } from "../constants/backendAPI";
import ChatScreen from "../screens/ChtaRoom/ChatScreen";
import EditProfileScreen from "../screens/Home/Profile/EditProfileScreen";
//import screens
import { HomeStackNavigationProps } from "../types/navigations";
import HomeNavigation from "./HomeNavigation";

const HomeStack = createNativeStackNavigator<HomeStackNavigationProps>();
const HomeStackNavigation: React.FC = () => {
  const accessContext = useContext(AccessContext);
  const socket = useMemo(() => {
    const accessToken = accessContext.accessToken;
    if (accessToken) {
      return io(BackendUrl, {
        auth: {
          token: accessToken,
        },
      });
    } else {
      return undefined;
    }
  }, [accessContext.accessToken]);
  return (
    <ChatContext.Provider value={{ socket }}>
      <HomeStack.Navigator
        initialRouteName="HomeNavigation"
        screenOptions={{ headerShown: false }}
      >
        <HomeStack.Screen name="HomeNavigation" component={HomeNavigation} />
        <HomeStack.Screen name="ChatScreen" component={ChatScreen} />
        <HomeStack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
        />
      </HomeStack.Navigator>
    </ChatContext.Provider>
  );
};
export default HomeStackNavigation;
