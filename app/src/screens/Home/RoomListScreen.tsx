import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { io } from "socket.io-client";
import { BackendUrl, ChatRoomAPI } from "../../constants/backendAPI";
import {
  bg_DarkColor,
  bg_LessDarkColor,
  windowHeight,
  windowWidth,
} from "../../constants/cssConst";
import { ACCESS_KEY } from "../../constants/securestoreKey";

import { HomeNavigationProps } from "../../types/navigations";

export const socket = io(`${BackendUrl}`);

type Props = NativeStackScreenProps<HomeNavigationProps, "RoomListScreen">;

const RoomListScreen: React.FC<Props> = ({ navigation }) => {
  const [chatName, setChatName] = useState<string>("");
  const [roomList, setRoomList] = useState<Room[]>([]);
  const [showingList, setShowingList] = useState<Room[]>([]);

  const getChatRoom = async () => {
    const localAccessToken = await SecureStore.getItemAsync(ACCESS_KEY);
    axios({
      method: "get",
      url: `${ChatRoomAPI}/list`,
      headers: { Authorization: `Bearer ${localAccessToken}` },
    }).then((list) => {
      if (!list.data.success) {
        Alert.alert("Error", list.data.message);
      }
      setRoomList(list.data.roomList);
    });
  };
  const createChatRoom = async () => {
    axios({
      method: "get",
    });
  };

  useEffect(() => {
    getChatRoom();

    return () => {};
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.titleBar}>
            <View style={styles.title}>
              <Text style={styles.titleText}>Chat Rooms</Text>
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => createChatRoom()}
            >
              <MaterialCommunityIcons
                name="chat-plus"
                size={windowWidth * 0.1}
                color="#FFF"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.searchBar}>
            <TextInput
              onChangeText={(val) => setChatName(val)}
              placeholder="Search room name"
              placeholderTextColor="#999"
              autoCapitalize="none"
              style={styles.searchInput}
            />
            <TouchableOpacity
              style={styles.goBtn}
              onPress={() => console.log("search room")}
            >
              <Ionicons name="search" size={windowWidth * 0.07} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.body}>
          <FlatList
            data={roomList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ChatScreen", {
                      roomId: item.id,
                      roomName: item.roomname,
                    })
                  }
                  style={{
                    width: 50,
                    height: 25,
                    borderWidth: 1,
                    borderColor: "white",
                  }}
                >
                  <Text style={{ color: "white" }}>{item.roomname}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default RoomListScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: bg_LessDarkColor,
    // alignItems: "center",
    // justifyContent: "center",
  },
  header: {
    width: windowWidth,
    height: windowHeight * 0.12,
    backgroundColor: bg_LessDarkColor,
  },
  titleBar: {
    height: windowHeight * 0.06,
    width: windowWidth,
    flexDirection: "row",
  },
  title: {
    flex: 9,
  },
  titleText: {
    flex: 1,
    paddingTop: windowHeight * 0.005,
    fontSize: windowWidth * 0.08,
    color: "#FFF",
    paddingLeft: windowWidth * 0.02,
  },
  addBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: windowWidth * 0.03,
  },
  searchBar: {
    height: windowHeight * 0.04,
    width: windowWidth,
    paddingHorizontal: windowWidth * 0.02,
    flexDirection: "row",
    marginVertical: windowHeight * 0.01,
  },
  searchInput: {
    flex: 9,
    borderRadius: windowHeight * 0.02,
    paddingLeft: windowWidth * 0.04,
    backgroundColor: bg_DarkColor,
    color: "#FFF",
  },
  goBtn: {
    flex: 1,
    paddingLeft: windowWidth * 0.01,
  },
  body: {
    flex: 1,
    backgroundColor: bg_DarkColor,
  },
});
