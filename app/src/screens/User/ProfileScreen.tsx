import { CommonActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import React from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthAPI } from '../../constants/backendAPI';
import { bg_DarkColor, windowHeight } from '../../constants/cssConst';
import { ACCESS_KEY, REFRESH_KEY } from '../../constants/securestoreKey';
import { AppParamList } from '../../types/navigations';
import { UserInfoScreenProps } from '../../types/screenProps';

type CustomHeader = {
  userName: string;
  logoutFunc: () => void;
}

const CustomHeader: React.FC<CustomHeader> = ({ userName, logoutFunc }) => {
  return (
    <View style={styles.customHeader}>
      <View style={styles.slideNavigatorContainer}></View>
      <View style={styles.titleContainer}><Text>{userName}</Text></View>
      <View style={styles.slideNavigatorContainer}>
        <TouchableOpacity onPress={() => logoutFunc()}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
const ProfileScreen: React.FC<UserInfoScreenProps> = ({ }) => {
  const navigation = useNavigation<NativeStackNavigationProp<AppParamList>>();
  const LogoutProcess = async () => {
    const localRefreshToken = await SecureStore.getItemAsync(REFRESH_KEY)
    if (!localRefreshToken) { console.log("No local refresh token"); return Alert.alert("Error") }
    axios({
      method: "post",
      url: `${AuthAPI}/token/logout`,
      headers: { "Authorization": `Bearer ${localRefreshToken}` },
    }).then(async (result) => {
      if (result.status != 200) { return Alert.alert("Error", result.data.message) }
      await SecureStore.deleteItemAsync(ACCESS_KEY);
      await SecureStore.deleteItemAsync(REFRESH_KEY);
      navigation.dispatch(CommonActions.reset({ routes: [{ name: "AuthNavigation" }] }))
    })
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <CustomHeader userName="Bryan" logoutFunc={() => navigation.navigate("RootNavigation")} /> */}
      <CustomHeader userName="Bryan" logoutFunc={() => LogoutProcess()} />
      <View style={styles.bodyContainer}>
        <Text style={{ color: bg_DarkColor }}>UserInfo Screen</Text>
      </View>
    </SafeAreaView>
  );
}
export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",

  },
  customHeader: {
    flexDirection: 'row',
    height: windowHeight * 0.1,
    borderWidth: 1,
    borderColor: 'red',
  },
  titleContainer: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  slideNavigatorContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "blue",
    alignItems: "center",
    justifyContent: "center",

  },
  bodyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }
})