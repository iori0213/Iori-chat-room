import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//import screens
import ProfileScreen from "../screens/Home/Profile/ProfileScreen";
import EditProfileScreen from "../screens/Home/Profile/EditProfileScreen";

import { ProfileNavigationProps } from "../types/navigations";
const RootStack = createNativeStackNavigator<ProfileNavigationProps>();
const ProfileNavigation: React.FC = () => {
  return (
    <RootStack.Navigator
      initialRouteName="ProfileScreen"
      screenOptions={{ headerShown: false }}
    >
      <RootStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <RootStack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
      />
    </RootStack.Navigator>
  );
};
export default ProfileNavigation;
