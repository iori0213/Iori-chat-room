import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { io } from "socket.io-client";
import { BackendUrl, ChatRoomAPI, FriendAPI } from "../../constants/backendAPI";
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
  //newRoom params
  const [visible, setVisible] = useState<boolean>(false);
  const [friendList, setFriendList] = useState<Profile[]>([]);
  const [roomName, setRoomName] = useState("");
  const [members, setMembers] = useState<Profile[]>([]);

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
  const getFriendList = async () => {
    const localAccessToken = await SecureStore.getItemAsync(ACCESS_KEY);
    axios({
      method: "get",
      url: `${FriendAPI}/get`,
      headers: { Authorization: `Bearer ${localAccessToken}` },
    }).then((result) => {
      if (!result.data.success) {
        return Alert.alert("Error", "get friend process failed!");
      }
      setFriendList(result.data.friendsArray);
    });
  };
  const createChatRoom = async () => {
    // socket.emit()
  };
  const cancelCreate = () => {
    setRoomName("");
    setFriendList([]);
    setVisible(false);
  };

  useEffect(() => {
    getChatRoom();
    return () => {};
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <Modal
          transparent={false}
          visible={visible}
          presentationStyle="fullScreen"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => cancelCreate()}
                style={styles.modalGoback}
              >
                <Ionicons
                  name="arrow-back"
                  size={windowWidth * 0.08}
                  color="#FFF"
                />
              </TouchableOpacity>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>Create Room</Text>
              </View>
              <View style={styles.modalGoback}></View>
            </View>
            <View style={styles.modalBody}>
              <TextInput
                onChangeText={(msg) => setRoomName(msg)}
                value={roomName}
                placeholder="enter new room name"
                placeholderTextColor="#AAA"
                autoCapitalize="none"
                style={styles.modalInput}
              />
            </View>
          </View>
        </Modal>
        <View style={styles.header}>
          <View style={styles.titleBar}>
            <View style={styles.title}>
              <Text style={styles.titleText}>Chat Rooms</Text>
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setVisible((prev) => !prev)}
            >
              <MaterialCommunityIcons
                name="chat-plus"
                size={windowWidth * 0.08}
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
                  style={styles.chatRoom}
                >
                  <Text style={styles.roomName}>{item.roomname}</Text>
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
    marginRight: windowWidth * 0.03,
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
  chatRoom: {
    width: windowWidth,
    height: windowHeight * 0.1,
    fontSize: windowHeight * 0.1,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: bg_LessDarkColor,
  },
  roomName: {
    fontSize: windowHeight * 0.06,
    paddingLeft: windowWidth * 0.03,
    color: "#FFF",
  },

  //for modal
  modalContainer: {
    flex: 1,
    backgroundColor: bg_LessDarkColor,
  },
  modalHeader: {
    marginTop: windowHeight * 0.015,
    flex: 1,
    flexDirection: "row",
  },
  modalTitleContainer: {
    flex: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: windowHeight * 0.04,
    color: "#FFF",
  },
  modalGoback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    flex: 9,
    alignItems: "center",
  },
  modalInput: {
    height: windowHeight * 0.06,
    width: windowWidth * 0.8,
    marginTop: windowHeight * 0.02,
    backgroundColor: "#FFF",
    borderRadius: windowHeight * 0.03,
    paddingLeft: windowWidth * 0.05,
    color: bg_DarkColor,
    fontSize: windowHeight * 0.03,
  },
  modalSubmit: {},
});
