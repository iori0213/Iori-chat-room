import { CommonActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import React from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthAPI } from '../../constants/backendAPI';
import { bg_DarkColor, bg_LessDarkColor, font_color, windowHeight, windowWidth } from '../../constants/cssConst';
import { ACCESS_KEY, REFRESH_KEY } from '../../constants/securestoreKey';
import { AppParamList } from '../../types/navigations';
import { HomeScreenProps } from '../../types/screenProps';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type HomeHeaderProps = {
  userName: string;
  logoutFunc: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ userName, logoutFunc }) => {
  return (
    <View style={styles.customHeader}>
      <View style={styles.slideNavigatorContainer}></View>
      <View style={styles.titleContainer}><Text style={styles.titleStyle}>{userName}</Text></View>
      <View style={styles.slideNavigatorContainer}>
        <TouchableOpacity onPress={() => Alert.alert("Logout check", "Do you want to logout?", [
          {
            text: "No",
            onPress: () => { return }
          },
          {
            text: "Yes",
            onPress: () => { logoutFunc() }
          }
        ])}>
          <MaterialCommunityIcons name="logout" size={windowWidth * 0.09} color={font_color} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const HomeScreen: React.FC<HomeScreenProps> = ({ }) => {
  const navigation = useNavigation<NativeStackNavigationProp<AppParamList>>();
  //ANCHOR Logout process
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
      <HomeHeader userName="Bryan" logoutFunc={() => LogoutProcess()} />
      <View style={styles.bodyContainer}>
        <Text style={{ color: "white" }}>UserInfo Screen</Text>
      </View>
    </SafeAreaView>
  );
}
export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: bg_LessDarkColor,
  },
  customHeader: {
    flexDirection: 'row',
    height: windowHeight * 0.08,
    backgroundColor: bg_LessDarkColor
  },
  titleContainer: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  titleStyle: {
    fontSize: windowWidth * 0.08,
    color: "#FFF",
    fontFamily: "Roboto_Bold"
  },
  slideNavigatorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

  },
  bodyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: bg_DarkColor,
  }
})