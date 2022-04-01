import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext, useMemo } from "react";
import { io } from "socket.io-client";
import { AccessContext } from "../components/Home/AccessContext";
import { ChatContext } from "../components/Home/ChatContext";
import { BackendUrl } from "../constants/backendAPI";
import ChatScreen from "../screens/ChtaRoom/ChatScreen";
//import screens
import { ChatNavigationProps } from "../types/navigations";
import HomeNavigation from "./HomeNavigation";

const ChatStack = createNativeStackNavigator<ChatNavigationProps>();
const ChatNavigation: React.FC = () => {
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
      <ChatStack.Navigator
        initialRouteName="HomeNavigation"
        screenOptions={{ headerShown: false }}
      >
        <ChatStack.Screen name="HomeNavigation" component={HomeNavigation} />
        <ChatStack.Screen name="ChatScreen" component={ChatScreen} />
      </ChatStack.Navigator>
    </ChatContext.Provider>
  );
};
export default ChatNavigation;
