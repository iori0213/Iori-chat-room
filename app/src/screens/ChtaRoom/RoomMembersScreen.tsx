import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  FlatList,
  Platform,
  Alert,
} from "react-native";
import React, { useContext } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackNavigationProps } from "../../types/navigations";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  bg_DarkColor,
  bg_LessDarkColor,
  windowHeight,
  windowWidth,
} from "../../constants/cssConst";
import { Ionicons, AntDesign, Entypo } from "@expo/vector-icons";
import InfoBox from "../../components/Home/InfoBox";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { ACCESS_KEY } from "../../constants/securestoreKey";
import { ChatRoomAPI } from "../../constants/backendAPI";
import { ChatContext } from "../../components/Home/ChatContext";

type Props = NativeStackScreenProps<
  HomeStackNavigationProps,
  "RoomMembersScreen"
>;

const RoomMembersScreen: React.FC<Props> = ({ navigation, route }) => {
  const { roomMembers, roomId } = route.params;
  const { socket } = useContext(ChatContext);
  const quitChatRoom = async () => {
    const localAccessToken = await SecureStore.getItemAsync(ACCESS_KEY);
    axios({
      method: "post",
      url: `${ChatRoomAPI}/quit`,
      headers: { Authorization: `Bearer ${localAccessToken}` },
      data: {
        roomId: roomId,
      },
    })
      .then((result) => {
        if (!result.data.success) {
          Alert.alert("Error", result.data.message);
        }
        socket?.off("add-msg");
        socket?.off("remove-msg");
        socket?.emit("leave-room");
        navigation.pop(2);
      })
      .catch((e) => Alert.alert("Error", e.response.data.message));
  };
  const quitChatRoomAlert = () => {
    Alert.alert(
      "Quit chat room",
      "Are you sure you want to quite the chat room?",
      [
        {
          text: "No",
          onPress: () => {
            return;
          },
        },
        {
          text: "Yes",
          onPress: () => {
            quitChatRoom();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.pop()}
            style={styles.sideBtn}
          >
            <Ionicons
              name="arrow-back"
              size={windowWidth * 0.08}
              color="#FFF"
            />
          </TouchableOpacity>
          <View style={styles.roomNameContainer}>
            <Text style={styles.roomNameText}>Room Members</Text>
          </View>
          <TouchableOpacity style={styles.sideBtn}>
            <AntDesign name="adduser" size={windowWidth * 0.08} color="#FFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <FlatList
            data={roomMembers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <InfoBox
                  username={item.username}
                  showname={item.showname}
                  profileImg={item.profileImg}
                />
              );
            }}
          />
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.quitBtnContainer}
              onPress={() => quitChatRoomAlert()}
            >
              <Entypo name="log-out" size={windowWidth * 0.06} color="#FFF" />
              <Text style={styles.quitBtnText}>Quit Chat Room</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <SafeAreaView style={{ flex: 0, backgroundColor: bg_DarkColor }} />
    </SafeAreaProvider>
  );
};

export default RoomMembersScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: bg_LessDarkColor,
  },
  //Headers
  header: {
    height: Platform.OS === "ios" ? windowHeight * 0.08 : windowHeight * 0.11,
    paddingTop: Platform.OS === "ios" ? 0 : windowHeight * 0.02,
    width: windowWidth,
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderBottomColor: bg_DarkColor,
    backgroundColor: bg_LessDarkColor,
  },
  roomNameContainer: {
    flex: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  roomNameText: {
    fontSize: windowWidth * 0.08,
    color: "white",
  },
  sideBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: windowWidth * 0.015,
  },

  //body
  body: {
    flex: 1,
    backgroundColor: bg_DarkColor,
    alignItems: "center",
  },
  footer: {
    width: windowWidth,
    height: windowHeight * 0.12,
    alignItems: "center",
    justifyContent: "center",
  },
  quitBtnContainer: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.08,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: bg_LessDarkColor,
    borderRadius: 15,
    flexDirection: "row",
  },
  quitBtnText: {
    fontSize: windowWidth * 0.06,
    color: "#FFF",
    marginLeft: windowWidth * 0.02,
  },
});
