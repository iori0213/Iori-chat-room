import { CommonActions } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthAPI, FriendAPI } from "../../constants/backendAPI";
import {
  bg_DarkColor,
  bg_LessDarkColor,
  hilight_color,
  windowHeight,
  windowWidth,
} from "../../constants/cssConst";
import {
  ACCESS_KEY,
  REFRESH_KEY,
  SHOWNAME_KEY,
  USERID_KEY,
  USERNAME_KEY,
} from "../../constants/securestoreKey";
import { HomeTabNavigationProps } from "../../types/navigations";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import Friend from "../../components/Home/Friend";
import { ChatContext } from "../../components/Home/ChatContext";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";

type Props = MaterialTopTabScreenProps<
  HomeTabNavigationProps,
  "FriendListScreen"
>;

const FriendListScreen: React.FC<Props> = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [friendArray, setFriendArray] = useState<Profile[]>([]);
  const [friend, setFriend] = useState("");
  const { socket } = useContext(ChatContext);

  //ANCHOR Logout process
  const LogoutProcess = async () => {
    const localRefreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
    if (!localRefreshToken) {
      console.log("No local refresh token");
      return Alert.alert("Error");
    }
    axios({
      method: "post",
      url: `${AuthAPI}/token/logout`,
      headers: { Authorization: `Bearer ${localRefreshToken}` },
    }).then(async (result) => {
      if (result.status != 200) {
        return Alert.alert("Error", result.data.message);
      }
      await SecureStore.deleteItemAsync(ACCESS_KEY);
      await SecureStore.deleteItemAsync(REFRESH_KEY);
      await SecureStore.deleteItemAsync(USERID_KEY);
      await SecureStore.deleteItemAsync(USERNAME_KEY);
      await SecureStore.deleteItemAsync(SHOWNAME_KEY);
      socket?.disconnect();
      navigation.dispatch(
        CommonActions.reset({ routes: [{ name: "AuthNavigation" }] })
      );
    });
  };

  const getFriends = async () => {
    const localAccessToken = await SecureStore.getItemAsync(ACCESS_KEY);
    axios({
      method: "get",
      url: `${FriendAPI}/get`,
      headers: { Authorization: `Bearer ${localAccessToken}` },
    }).then((result) => {
      if (!result.data.success) {
        return Alert.alert("Error", "get friend process failed!");
      }
      setFriendArray(result.data.friendsArray);
    });
  };
  const addFriend = async () => {
    const localAccessToken = await SecureStore.getItemAsync(ACCESS_KEY);
    axios({
      method: "post",
      url: `${FriendAPI}/add`,
      headers: { Authorization: `Bearer ${localAccessToken}` },
      data: { friendName: friend },
    }).then((result) => {
      if (!result.data.success) {
        return Alert.alert("Error", result.data.message);
      }
      const newFriend: Profile = {
        id: result.data.friend.id,
        username: result.data.friend.username,
        showName: result.data.friend.showName,
      };
      setFriendArray((prev) => [newFriend, ...prev]);
      setFriend("");
    });
  };
  const removeFriend = async (friendId: string) => {
    const localAccessToken = await SecureStore.getItemAsync(ACCESS_KEY);
    axios({
      method: "post",
      url: `${FriendAPI}/remove`,
      headers: { Authorization: `Bearer ${localAccessToken}` },
      data: { friendId: friendId },
    }).then((result) => {
      if (!result.data.success) {
        return Alert.alert("Error", result.data.message);
      }
      getFriends();
    });
  };

  const initialize = async () => {
    const username = await SecureStore.getItemAsync(USERNAME_KEY);
    if (!username) {
      return Alert.alert("Error", "local username not found!");
    }
    setUserName(username);
    getFriends();
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <HomeHeader logoutFunc={() => LogoutProcess()} />
        <View style={styles.bodyContainer}>
          <View style={styles.addFriendHeader}>
            <View style={styles.sideBlank}></View>
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={(val) => setFriend(val)}
                value={friend}
                placeholder="add friend name"
                placeholderTextColor="#CCC"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
            <View style={styles.sideBlank}>
              <TouchableOpacity onPress={() => addFriend()}>
                <AntDesign
                  name="adduser"
                  size={windowWidth * 0.08}
                  color={hilight_color}
                />
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={friendArray}
            extraData={friendArray}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return <Friend friend={item} deleteFunc={removeFriend} />;
            }}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default FriendListScreen;

//custom Header
type HomeHeaderProps = {
  logoutFunc: () => void;
};
const HomeHeader: React.FC<HomeHeaderProps> = ({ logoutFunc }) => {
  return (
    <View style={styles.customHeader}>
      <View style={styles.slideNavigatorContainer}></View>
      <View style={styles.titleContainer}>
        <Text style={styles.titleStyle}>Friends</Text>
      </View>
      <View style={styles.slideNavigatorContainer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: bg_LessDarkColor,
  },
  customHeader: {
    flexDirection: "row",
    height: windowHeight * 0.08,
    backgroundColor: bg_LessDarkColor,
  },
  titleContainer: {
    flex: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  titleStyle: {
    fontSize: windowWidth * 0.08,
    color: "#FFF",
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
  addFriendHeader: {
    width: windowWidth,
    height: windowHeight * 0.1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: windowHeight * 0.01,
  },
  sideBlank: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flex: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: windowHeight * 0.05,
    width: windowWidth * 0.75,
    borderRadius: windowWidth * 0.02,
    fontSize: windowWidth * 0.05,
    backgroundColor: bg_LessDarkColor,
    color: "#FFF",
    paddingLeft: windowWidth * 0.03,
  },
  friendlistContainer: {
    width: windowWidth,
  },
});
