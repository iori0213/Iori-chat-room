import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
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
import { CommonActions } from "@react-navigation/native";
import axios from "axios";
import { AuthAPI, UserAPI } from "../../../constants/backendAPI";
import { ChatContext } from "../../../components/Home/ChatContext";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { ProfileNavigationProps } from "../../../types/navigations";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<
  ProfileNavigationProps,
  "EditProfileScreen"
>;

const EditProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const { img, username, showname, email } = route.params;

  const { socket } = useContext(ChatContext);
  const [fetching, setFetching] = useState(true);

  //edit state
  const [editEmail, setEditEmail] = useState(email);
  const [editUniquename, setEditUniquename] = useState(username);
  const [editShowname, setEditShowname] = useState(showname);
  const [editAvatarImg, setEditAvatarImg] = useState(img);

  const update = async () => {
    const localAccessToken = await SecureStore.getItemAsync(ACCESS_KEY);
    if (editShowname == "") {
      return Alert.alert("Error", "Show Name can not be empty!");
    }
    // if (editAvatarImg != img) {
    // }
    // if (editShowname != showname) {
    // }
    axios({
      method: "post",
      url: `${UserAPI}/update`,
      headers: { Authorization: `Bearer ${localAccessToken}` },
      data: { showname: editShowname },
    })
      .then((res) => {
        navigation.goBack();
      })
      .catch((e) => {
        return Alert.alert("Error", e.response.data.message);
      });
  };

  //loading process
  const loading = async () => {
    setFetching(false);
  };

  useEffect(() => {
    loading();

    return () => {};
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.background}>
          {/* header =====================================================================================================*/}
          <View style={styles.customHeader}>
            <View style={styles.slideNavigatorContainer}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  name="arrow-back"
                  size={windowWidth * 0.08}
                  color="#FFF"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.titleStyle}>Edit Profile</Text>
            </View>
            <View style={styles.slideNavigatorContainer}>
              <TouchableOpacity onPress={() => update()}>
                <Entypo name="save" size={windowWidth * 0.09} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
          {/* body ======================================================================================================*/}
          {fetching ? (
            <LoadingSpinner />
          ) : (
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.avoidingView}
            >
              <TouchableOpacity style={styles.AvatarContainer}>
                <Image
                  source={require("./350px-Minato_Aqua.png")}
                  style={styles.avatarImg}
                />
              </TouchableOpacity>
              <View style={styles.infoList}>
                {/* show name ========================================================================================== */}
                <View style={styles.infoBoxContainer}>
                  <View style={styles.infoTypeContainer}>
                    <Text style={styles.infoTypeText}>Show Name</Text>
                  </View>
                  <View style={styles.infoContainer}>
                    <TextInput
                      onChangeText={(val) => setEditShowname(val)}
                      value={editShowname}
                      autoCapitalize="none"
                      style={styles.showNameInput}
                    />
                  </View>
                </View>
                {/* show name ========================================================================================== */}
                <InfoBox infoType="Unique Name" info={editUniquename} />
                <InfoBox infoType="Email" info={email} />
              </View>
              <TouchableOpacity></TouchableOpacity>
            </KeyboardAvoidingView>
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

export default EditProfileScreen;

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
  avoidingView: {
    flex: 1,
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
  showNameInput: {
    width: windowWidth * 0.35,
    borderBottomWidth: 1.5,
    borderBottomColor: "#FFF",
    backgroundColor: bg_DarkColor,
    color: "#FFF",
    fontSize: windowHeight * 0.02,
    marginLeft: windowWidth * 0.05,
  },

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
