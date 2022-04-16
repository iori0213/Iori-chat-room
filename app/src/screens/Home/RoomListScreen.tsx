import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, { useContext, useEffect, useState } from "react";
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
import Checkbox from "expo-checkbox";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ChatRoomAPI, FriendAPI } from "../../constants/backendAPI";
import {
  bg_DarkColor,
  bg_LessDarkColor,
  hilight_color,
  windowHeight,
  windowWidth,
} from "../../constants/cssConst";
import { ACCESS_KEY, USERID_KEY } from "../../constants/securestoreKey";

import { HomeTabNavigationProps } from "../../types/navigations";
import { ChatContext } from "../../components/Home/ChatContext";
import LoadingSpinner from "../../components/Auth/LoadingSpinner";
import { Platform } from "react-native";

type Props = NativeStackScreenProps<HomeTabNavigationProps, "RoomListScreen">;

const RoomListScreen: React.FC<Props> = ({ navigation }) => {
  const { socket } = useContext(ChatContext);
  const [fetching, setFetching] = useState(false);
  const [chatName, setChatName] = useState<string>("");
  const [roomList, setRoomList] = useState<Room[]>([]);
  const [showingList, setShowingList] = useState<Room[]>([]);
  //newRoom params
  const [visible, setVisible] = useState<boolean>(false);
  const [roomName, setRoomName] = useState("");
  const [members, setMembers] = useState<MemberCheck[]>([]);

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
      setShowingList(list.data.roomList);
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
      const List: MemberCheck[] = result.data.friendsArray.map(
        (member: Profile) => {
          const memberInfo: MemberCheck = {
            id: member.id,
            username: member.username,
            showName: member.showName,
            join: false,
          };
          return memberInfo;
        }
      );
      setMembers(List);
    });
  };
  const createChatRoom = async () => {
    if (!roomName) {
      return Alert.alert("Error", "room name is missing");
    } else {
      setFetching(true);
      const temp = members.filter((member) => member.join == true);
      const idList = temp.map((member) => member.id);
      socket?.emit("create-room", { roomName: roomName, members: idList });
      setMembers([]);
      setVisible(false);
      setFetching(false);
    }
  };
  const cancelCreate = () => {
    setRoomName("");
    setMembers([]);
    setVisible(false);
  };
  const searchRoom = () => {
    const newRoomList = showingList.filter((room) => {
      if (room.roomname.includes(chatName)) {
        return room;
      }
      return;
    });
    setShowingList(newRoomList);
  };

  useEffect(() => {
    getChatRoom();
    getFriendList();
    socket?.on("new-room", async (data) => {
      const chatRoomMembers: String[] = data.members;
      const userId = await SecureStore.getItemAsync(USERID_KEY);
      if (chatRoomMembers.includes(userId!)) {
        getChatRoom();
      }
    });
    return () => {
      socket?.off("new-room");
    };
  }, [socket]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        {fetching ? (
          <LoadingSpinner />
        ) : (
          <>
            <Modal
              transparent={false}
              visible={visible}
              presentationStyle="fullScreen"
              onShow={() => getFriendList()}
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
                  <View style={styles.modalFriendList}>
                    <View style={styles.modalFriendListTitleContainer}>
                      <Text style={styles.modalFriendListTitle}>Members</Text>
                    </View>
                    <FlatList
                      data={members}
                      extraData={members}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => {
                        return (
                          <View style={styles.modalMemberContainer}>
                            <Checkbox
                              style={{
                                width: windowWidth * 0.07,
                                height: windowWidth * 0.07,
                              }}
                              disabled={false}
                              color={item.join ? bg_LessDarkColor : "#FFF"}
                              value={item.join}
                              onValueChange={() =>
                                setMembers((prev) =>
                                  prev.map((friend) => {
                                    if (friend.id == item.id) {
                                      friend.join = !friend.join;
                                    }
                                    return friend;
                                  })
                                )
                              }
                            />
                            <Text style={styles.modalMemberName}>
                              {item.username}
                            </Text>
                          </View>
                        );
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.modalSubmitContainer}
                    onPress={() => createChatRoom()}
                  >
                    <Text style={styles.modalSubmit}>CREATE</Text>
                  </TouchableOpacity>
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
                  onChangeText={(val) => {
                    setChatName(val);
                    setShowingList(roomList);
                  }}
                  value={chatName}
                  placeholder="Search room name"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  style={styles.searchInput}
                />
                <TouchableOpacity
                  style={styles.goBtn}
                  onPress={() => searchRoom()}
                >
                  <Ionicons
                    name="search"
                    size={windowWidth * 0.07}
                    color="#FFF"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.body}>
              <FlatList
                data={showingList}
                extraData={showingList}
                keyExtractor={(item, index) => index.toString()}
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
          </>
        )}
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
    paddingHorizontal: windowWidth * 0.02,
  },
  title: {
    flex: 9,
  },
  titleText: {
    flex: 1,
    paddingTop: windowHeight * 0.005,
    fontSize: windowWidth * 0.08,
    color: "#FFF",
  },
  addBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: windowWidth * 0.04,
    color: "#FFF",
  },
  goBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    marginTop:
      Platform.OS === "ios" ? windowHeight * 0.025 : windowHeight * 0.01,
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
    width: windowWidth * 0.75,
    marginTop: windowHeight * 0.02,
    backgroundColor: "#FFF",
    borderRadius: windowHeight * 0.03,
    paddingHorizontal: windowWidth * 0.05,
    color: bg_DarkColor,
    fontSize: windowHeight * 0.025,
  },
  modalFriendList: {
    height: windowHeight * 0.65,
    width: windowWidth * 0.8,
    marginTop: windowHeight * 0.02,
    backgroundColor: bg_DarkColor,
    borderTopLeftRadius: windowWidth * 0.1,
    borderTopRightRadius: windowWidth * 0.1,
    borderBottomRightRadius: windowWidth * 0.1,
    borderBottomLeftRadius: windowWidth * 0.1,
  },
  modalFriendListTitleContainer: {
    height: windowHeight * 0.06,
    width: windowWidth * 0.8,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: windowWidth * 0.1,
    borderTopRightRadius: windowWidth * 0.1,
    borderBottomWidth: 3,
    borderBottomColor: bg_LessDarkColor,
  },
  modalFriendListTitle: {
    fontSize: windowHeight * 0.04,
    color: "#FFF",
  },
  modalMemberContainer: {
    height: windowHeight * 0.06,
    width: windowWidth * 0.8,
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: windowWidth * 0.13,
    borderBottomRightRadius: windowWidth * 0.1,
    borderBottomLeftRadius: windowWidth * 0.1,
  },
  modalMemberName: {
    fontSize: windowHeight * 0.04,
    color: "#FFF",
    marginLeft: windowWidth * 0.03,
  },
  modalSubmitContainer: {
    height: windowHeight * 0.06,
    width: windowWidth * 0.4,
    borderRadius: windowHeight * 0.03,
    borderWidth: 2,
    borderColor: hilight_color,
    alignItems: "center",
    justifyContent: "center",
    marginTop: windowHeight * 0.02,
  },
  modalSubmit: {
    fontSize: windowHeight * 0.035,
    color: hilight_color,
  },
});
