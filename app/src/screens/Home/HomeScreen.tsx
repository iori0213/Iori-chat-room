import { CommonActions } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View, FlatList, TextInput } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthAPI, FriendAPI } from '../../constants/backendAPI';
import { bg_DarkColor, bg_LessDarkColor, hilight_color, windowHeight, windowWidth } from '../../constants/cssConst';
import { ACCESS_KEY, REFRESH_KEY } from '../../constants/securestoreKey';
import { HomeNavigationProps } from '../../types/navigations';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import Friend from '../../components/Home/Friend';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type Props = BottomTabScreenProps<HomeNavigationProps, "HomeScreen">

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [friendArray, setFriendArray] = useState<BasicProfile[]>([]);
  const [friend, setFriend] = useState<string>();
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
  const getFriends = async () => {
    const localAccessToken = await SecureStore.getItemAsync(ACCESS_KEY);
    axios({
      method: "get",
      url: `${FriendAPI}/get`,
      headers: { "Authorization": `Bearer ${localAccessToken}` },
    }).then((result) => {
      if (!result.data.success) { return Alert.alert("Error", "get friend process failed!") }
      setFriendArray(result.data.friendsArray)
    })
  }
  const addFriend = async () => {
    const localAccessToken = await SecureStore.getItemAsync(ACCESS_KEY);
    axios({
      method: "post",
      url: `${FriendAPI}/add`,
      headers: { "Authorization": `Bearer ${localAccessToken}` },
      data: { friendName: friend }
    }).then((result) => {
      if (!result.data.success) { return Alert.alert("Error", result.data.message) }
      getFriends();
    })
  }
  const removeFriend = async (friendId: string) => {
    const localAccessToken = await SecureStore.getItemAsync(ACCESS_KEY);
    axios({
      method: "post",
      url: `${FriendAPI}/remove`,
      headers: { "Authorization": `Bearer ${localAccessToken}` },
      data: { friendId: friendId }
    }).then((result) => {
      if (!result.data.success) { return Alert.alert("Error", result.data.message) };
      getFriends();
    })
  }

  useEffect(() => {
    getFriends();
  }, [])

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <HomeHeader userName="Bryan" logoutFunc={() => LogoutProcess()} />
        <View style={styles.bodyContainer}>
          <Text style={styles.friendListHeader}>Friend List</Text>
          <View style={styles.addFriendHeader}>
            <View style={styles.slideNavigatorContainer}></View>
            <View style={styles.titleContainer}>
              <TextInput
                onChangeText={(val) => setFriend(val)}
                placeholder="add friend name"
                placeholderTextColor="#999"
                autoCapitalize='none'
                style={styles.input}
              />
            </View>
            <View style={styles.slideNavigatorContainer}>
              <TouchableOpacity onPress={() => addFriend()}>
                <AntDesign name="adduser" size={windowWidth * 0.08} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={friendArray}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              return <Friend friend={item} deleteFunc={removeFriend} />;
            }}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
export default HomeScreen;


//custom Header
type HomeHeaderProps = {
  userName: string;
  logoutFunc: () => void;
}
const HomeHeader: React.FC<HomeHeaderProps> = ({ userName, logoutFunc }) => {
  return (
    <View style={styles.customHeader}>
      <View style={styles.slideNavigatorContainer}></View>
      <View style={styles.titleContainer}>
        <Text style={styles.titleStyle}>{userName}</Text>
      </View>
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
          <MaterialCommunityIcons name="logout" size={windowWidth * 0.09} color={hilight_color} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

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
  },
  friendListHeader: {
    paddingTop: windowHeight * 0.03,
    fontSize: windowWidth * 0.06,
    color: "#FFF",
  },
  addFriendHeader: {
    width: windowWidth,
    height: windowHeight * 0.1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  input: {
    height: windowHeight * 0.05,
    width: windowWidth * 0.65,
    borderRadius: windowWidth * 0.02,
    fontSize: windowWidth * 0.05,
    backgroundColor: bg_LessDarkColor,
    color: "#FFF",
    paddingLeft: windowWidth * 0.03,
  },
  friendlistContainer: {
    width: windowWidth,
  },
})