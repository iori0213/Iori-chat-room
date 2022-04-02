import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  bg_DarkColor,
  bg_LessDarkColor,
  windowHeight,
  windowWidth,
} from "../../constants/cssConst";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import LoadingSpinner from "../../components/Auth/LoadingSpinner";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { HomeNavigationProps } from "../../types/navigations";
import * as SecureStore from "expo-secure-store";
import {
  ACCESS_KEY,
  REFRESH_KEY,
  SHOWNAME_KEY,
  USERID_KEY,
  USERNAME_KEY,
} from "../../constants/securestoreKey";
import { CommonActions } from "@react-navigation/native";
import axios from "axios";
import { AuthAPI } from "../../constants/backendAPI";
import { ChatContext } from "../../components/Home/ChatContext";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

type Props = MaterialTopTabScreenProps<HomeNavigationProps, "ProfileScreen">;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { socket } = useContext(ChatContext);
  const [fetching, setFetching] = useState(true);

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

  //initialize process
  const initialize = async () => {
    // axios({
    //   method: "post",
    //   url:`${}`
    // });
    setFetching(false);
  };

  useEffect(() => {
    initialize();

    return () => {};
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.background}>
          <ProfileHeader logoutFunc={LogoutProcess} />
          {fetching ? (
            <LoadingSpinner />
          ) : (
            <>
              <TouchableOpacity style={styles.AvatarContainer}>
                <Image
                  source={require("./350px-Minato_Aqua.png")}
                  style={styles.avatarImg}
                />
              </TouchableOpacity>
              <InfoBox infoType="Email" info="1111@gmail.com" />
            </>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

//custom Header
type ProfileHeaderProps = {
  logoutFunc: () => void;
};
const ProfileHeader: React.FC<ProfileHeaderProps> = ({ logoutFunc }) => {
  return (
    <View style={styles.customHeader}>
      <View style={styles.slideNavigatorContainer}>
        <TouchableOpacity onPress={() => console.log("edit profile function")}>
          <FontAwesome5
            name="user-edit"
            size={windowWidth * 0.08}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.titleStyle}>Profile</Text>
      </View>
      <View style={styles.slideNavigatorContainer}>
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Logout check", "Do you want to logout?", [
              {
                text: "No",
                onPress: () => {
                  return;
                },
              },
              {
                text: "Yes",
                onPress: () => {
                  logoutFunc();
                },
              },
            ])
          }
        >
          <MaterialCommunityIcons
            name="logout"
            size={windowWidth * 0.09}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

type InfoContainerProps = {
  infoType: string;
  info: string;
};
const InfoBox: React.FC<InfoContainerProps> = ({ infoType, info }) => {
  return (
    <View style={styles.infoBoxContainer}>
      <View style={styles.infoTypeContainer}>
        <Text style={styles.infoTypeText}>type</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>ok?</Text>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: bg_LessDarkColor,
  },
  background: {
    flex: 1,
    backgroundColor: bg_DarkColor,
    alignItems: "center",
  },
  //ProfileHeader===================
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
    flex: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  //================================

  //InfoBox=========================
  infoBoxContainer: {
    marginTop: windowHeight * 0.02,
    width: windowWidth * 0.8,
    height: windowHeight * 0.06,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "yellow",
  },
  infoTypeContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "red",
  },
  infoTypeText: {
    color: "#FFF",
  },
  infoContainer: {
    flex: 3,
    borderWidth: 1,
    borderColor: "green",
  },
  infoText: {
    color: "#FFF",
  },
  //================================

  AvatarContainer: {
    marginTop: windowHeight * 0.05,
    height: windowWidth * 0.4,
    width: windowWidth * 0.4,
    borderRadius: windowWidth * 0.2,
    borderWidth: 1,
    borderColor: "yellow",
  },
  avatarImg: {
    height: windowWidth * 0.4,
    width: windowWidth * 0.4,
    borderRadius: windowWidth * 0.2,
    resizeMode: "contain",
  },
});
