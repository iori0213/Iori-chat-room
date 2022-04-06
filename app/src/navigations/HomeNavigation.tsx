import React from "react";
//navigator
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { HomeTabNavigationProps } from "../types/navigations";
//screens
import HomeScreen from "../screens/Home/FriendListScreen";
import { bg_LessDarkColor } from "../constants/cssConst";
import RoomListScreen from "../screens/Home/RoomListScreen";
import ProfileScreen from "../screens/Home/Profile/ProfileScreen";

type Props = {};

const HomeNavigation: React.FC<Props> = ({}) => {
  const BottomTab = createMaterialTopTabNavigator<HomeTabNavigationProps>();
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
        name="FriendListScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: "Friends",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="users" size={22} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="md-person-sharp" size={24} color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

export default HomeNavigation;
