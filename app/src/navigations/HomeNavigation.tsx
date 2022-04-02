import React from "react";
//navigator
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons } from "@expo/vector-icons";
import { HomeNavigationProps } from "../types/navigations";
//screens
import HomeScreen from "../screens/Home/HomeScreen";
import { bg_LessDarkColor } from "../constants/cssConst";
import RoomListScreen from "../screens/Home/RoomListScreen";

type Props = {};

const HomeNavigation: React.FC<Props> = ({}) => {
  const BottomTab = createMaterialTopTabNavigator<HomeNavigationProps>();
  return (
    <BottomTab.Navigator
      initialRouteName="RoomListScreen"
      tabBarPosition="bottom"
      screenOptions={{
        tabBarStyle: { backgroundColor: bg_LessDarkColor },
        tabBarActiveTintColor: "#FFF",
        tabBarIndicatorStyle: {
          backgroundColor: "white",
          height: 1,
        },
        tabBarLabelStyle: { color: "#FFF" },
      }}
    >
      <BottomTab.Screen
        name="RoomListScreen"
        component={RoomListScreen}
        options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="ios-chatbox-ellipses-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

export default HomeNavigation;
