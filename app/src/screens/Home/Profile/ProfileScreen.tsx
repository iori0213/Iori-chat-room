import {
  Alert,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import {
  bg_DarkColor,
  bg_LessDarkColor,
  windowHeight,
  windowWidth,
} from "../../../constants/cssConst";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import LoadingSpinner from "../../../components/Auth/LoadingSpinner";
import * as SecureStore from "expo-secure-store";
import {
  ACCESS_KEY,
  REFRESH_KEY,
  SHOWNAME_KEY,
  USERID_KEY,
  USERNAME_KEY,
} from "../../../constants/securestoreKey";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { AuthAPI, UserAPI } from "../../../constants/backendAPI";
import { ChatContext } from "../../../components/Home/ChatContext";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome,
} from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeTabNavigationProps } from "../../../types/navigations";
import * as NavigationBar from "expo-navigation-bar";

type Props = NativeStackScreenProps<HomeTabNavigationProps, "ProfileScreen">;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { socket } = useContext(ChatContext);
  const [fetching, setFetching] = useState(true);

  //userInfo state
  const [email, setEmail] = useState("");
  const [uniquename, setUniquename] = useState("");
  const [showname, setShowname] = useState("");
  const [avatarImg, setAvatarImg] = useState("");

  //ANCHOR Logout process
  const logoutProcess = async () => {
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
      // socket?.emit("logout");
      socket?.disconnect();
      navigation.dispatch(
        CommonActions.reset({ routes: [{ name: "AuthNavigation" }] })
      );
    });
  };

  //initialize process
  const initialize = async () => {
    const localAccessToken = await SecureStore.getItemAsync(ACCESS_KEY);
    await axios({
      method: "get",
      url: `${UserAPI}/userinfo`,
      headers: { Authorization: `Bearer ${localAccessToken}` },
    })
      .then((res) => {
        setEmail(res.data.userInfo.email);
        setUniquename(res.data.userInfo.username);
        setShowname(res.data.userInfo.showname);
        setAvatarImg(res.data.userInfo.profileImg);
      })
      .catch((e) => {
        return Alert.alert("Error", e.response.data.message);
      });
    setFetching(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      initialize();
    }, [])
  );

  if (Platform.OS === "android") {
    NavigationBar.setBackgroundColorAsync(bg_LessDarkColor);
    NavigationBar.setBorderColorAsync(bg_DarkColor);
    NavigationBar.setButtonStyleAsync("light");
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          backgroundColor={bg_LessDarkColor}
          barStyle="light-content"
        />
        <View style={styles.background}>
          {/* header ==================================================================================*/}
          <View style={styles.customHeader}>
            <View style={styles.slideNavigatorContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("EditProfileScreen", {
                    img: avatarImg,
                    showname: showname,
                    username: uniquename,
                    email: email,
                  })
                }
              >
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
                        logoutProcess();
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
          {/* body ==================================================================================*/}
          {fetching ? (
            <LoadingSpinner />
          ) : (
            <>
              <View style={styles.AvatarContainer}>
                {avatarImg == "" ? (
                  <FontAwesome
                    name="user-circle"
                    size={windowWidth * 0.4}
                    color={bg_LessDarkColor}
                    style={{ borderRadius: windowWidth * 0.2 }}
                  />
                ) : (
                  <Image
                    source={{ uri: "data:image/jpeg;base64," + avatarImg }}
                    style={styles.avatarImg}
                  />
                )}
              </View>
              <View style={styles.infoList}>
                <InfoBox
                  infoType="Show Name"
                  info={showname != "" ? showname : "Not set yet"}
                />
                <InfoBox infoType="Unique Name" info={uniquename} />
                <InfoBox infoType="Email" info={email} />
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
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
        <Text style={styles.infoTypeText}>{infoType}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{info}</Text>
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
    // marginTop: windowHeight * 0.02,
    width: windowWidth,
    height: windowHeight * 0.08,
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: bg_LessDarkColor,
  },
  infoTypeContainer: {
    flex: 1,
    borderRightWidth: 2,
    borderRightColor: bg_LessDarkColor,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  infoTypeText: {
    color: "#FFF",
    fontSize: windowHeight * 0.02,
    marginLeft: windowWidth * 0.1,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  infoText: {
    color: "#FFF",
    fontSize: windowHeight * 0.02,
    marginLeft: windowWidth * 0.05,
  },
  //================================

  AvatarContainer: {
    marginTop: windowHeight * 0.05,
    marginBottom: windowHeight * 0.02,
    height: windowWidth * 0.4,
    width: windowWidth * 0.4,
    borderRadius: windowWidth * 0.2,
    overflow: "hidden",
  },
  avatarImg: {
    height: windowWidth * 0.4,
    width: windowWidth * 0.4,
    borderRadius: windowWidth * 0.2,
    resizeMode: "contain",
  },
  infoList: {
    width: windowWidth,
    borderTopWidth: 2,
    borderTopColor: bg_LessDarkColor,
  },
});
