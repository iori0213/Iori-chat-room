import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from 'react'
import ProfileScreen from "../screens/User/ProfileScreen";
import { ProfileParamList } from "../types/navigations";
import AuthNavigation from "./AuthNavigation";

interface ProfileNavigationProps {

}

const ProfileNavigation: React.FC<ProfileNavigationProps> = ({ }) => {
  const ProfileStack = createNativeStackNavigator<ProfileParamList>();
  return (
    <ProfileStack.Navigator initialRouteName="ProfileScreen" screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <ProfileStack.Screen name="AuthNavigation" component={AuthNavigation} />
    </ProfileStack.Navigator>
  );
}
export default ProfileNavigation;