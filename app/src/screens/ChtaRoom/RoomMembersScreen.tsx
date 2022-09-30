import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Platform,
  Alert,
  Modal,
  StatusBar,
} from "react-native";
import React, { useContext, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackNavigationProps } from "../../types/navigations";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  bg_DarkColor,
  bg_LessDarkColor,
  bg_LightColor,
  windowHeight,
  windowWidth,
} from "../../constants/cssConst";
import { Ionicons, AntDesign, Entypo } from "@expo/vector-icons";
import InfoBox from "../../components/Home/InfoBox";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { ACCESS_KEY } from "../../constants/securestoreKey";
import { ChatRoomAPI, FriendAPI } from "../../constants/backendAPI";
import { ChatContext } from "../../components/Home/ChatContext";
import CreateRoomInfoBox from "../../components/Home/CreateRoomInfoBox";
import LoadingSpinner from "../../components/Auth/LoadingSpinner";
import * as NavigationBar from "expo-navigation-bar";

type Props = NativeStackScreenProps<
  HomeStackNavigationProps,
  "RoomMembersScreen"
>;

const RoomMembersScreen: React.FC<Props> = ({ navigation, route }) => {
  const { roomMembers, roomId } = route.params;
  const { socket } = useContext(ChatContext);
  const [modalFetching, setModalFetching] = useState(false);
  const [visible, setVisible] = useState(false);
  const [friends, setFriends] = useState<MemberCheck[]>([]);
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
        socket?.emit("leave-room");
        navigation.pop(2);
      })
      .catch((e) => Alert.alert("Error", e));
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

  const getFriendList = async () => {
    const localAccessToken = await SecureStore.getItemAsync(ACCESS_KEY);
    axios({
      method: "get",
      url: `${FriendAPI}/get`,
      headers: { Authorization: `Bearer ${localAccessToken}` },
    })
      .then(({ data }) => {
        const List: MemberCheck[] = data.friendList.map(
          (member: ProfileWithImg) => {
            let duplicate = false;
            roomMembers.map((oldMember) => {
              if (oldMember.id == member.id) {
                duplicate = true;
              }
            });
            if (!duplicate) {
              const memberInfo: MemberCheck = {
                id: member.id,
                username: member.username,
                showName: member.showname,
                profileImg: member.profileImg,
                join: false,
              };
              return memberInfo;
            }
          }
        );

        setFriends(List.filter((friend) => friend != undefined));
        setModalFetching(false);
      })
      .catch((e) => Alert.alert("Error", e));
  };

  const addMember = () => {
    let submitNewMembers = friends.map((friend) => {
      if (friend.join == true) {
        return friend.id;
      }
    });
    if (submitNewMembers.length == 0) {
      return Alert.alert("Error", "Atleast need to choose a friend to add.");
    }
    socket?.emit("add-member", {
      members: submitNewMembers,
    });
    setVisible(false);
    // navigation.pop();
    return;
  };

  const cancel = () => {
    setFriends([]);
    setVisible(false);
  };

  if (Platform.OS === "android") {
    NavigationBar.setBackgroundColorAsync(bg_LightColor);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          backgroundColor={bg_LessDarkColor}
          barStyle="light-content"
        />
        {/* modal start ==================================================== */}
        <Modal
          transparent={false}
          visible={visible}
          presentationStyle="fullScreen"
          onShow={() => getFriendList()}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => cancel()}
                style={styles.modalGoback}
              >
                <Ionicons
                  name="arrow-back"
                  size={windowWidth * 0.08}
                  color="#FFF"
                />
              </TouchableOpacity>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>Add New Member</Text>
              </View>
              <View style={styles.modalGoback}></View>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.modalFriendList}>
                <View style={styles.modalFriendListTitleContainer}>
                  <Text style={styles.modalFriendListTitle}>Your Friends</Text>
                </View>
                {modalFetching ? <LoadingSpinner /> : <></>}
                <FlatList
                  data={friends}
                  extraData={friends}
                  keyExtractor={(_item, index) => index.toString()}
                  renderItem={({ item }) => {
                    return (
                      <CreateRoomInfoBox
                        username={item.username}
                        showname={item.showName}
                        profileImg={item.profileImg}
                        checked={item.join}
                        toggleFunction={() => {
                          setFriends((prev) =>
                            prev.map((friend) => {
                              if (friend.id == item.id) {
                                friend.join = !friend.join;
                              }
                              return friend;
                            })
                          );
                        }}
                      />
                    );
                  }}
                />
              </View>
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.modalSubmitContainer}
                  onPress={() => addMember()}
                >
                  <Text style={styles.modalSubmit}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* screen ====================================================*/}
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
          <TouchableOpacity
            style={styles.sideBtn}
            onPress={() => {
              setModalFetching(true);
              setVisible(true);
            }}
          >
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
    height: windowHeight * 0.08,
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
    backgroundColor: "#F77",
    borderRadius: 15,
    flexDirection: "row",
  },
  quitBtnText: {
    fontSize: windowWidth * 0.06,
    color: "#FFF",
    marginLeft: windowWidth * 0.02,
  },

  //for modal
  modalContainer: {
    flex: 1,
    backgroundColor: bg_LessDarkColor,
  },
  modalHeader: {
    marginTop: Platform.OS === "ios" ? windowHeight * 0.035 : 0,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitleContainer: {
    flex: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: windowHeight * 0.035,
    color: "#FFF",
  },
  modalGoback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    flex: 11,
    alignItems: "center",
    backgroundColor: bg_DarkColor,
  },
  modalInput: {
    height: windowHeight * 0.05,
    width: windowWidth * 0.75,
    marginTop: windowHeight * 0.02,
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: windowWidth * 0.03,
    color: bg_DarkColor,
    fontSize: windowHeight * 0.025,
  },
  modalFriendList: {
    flex: 1,
    backgroundColor: bg_DarkColor,
  },
  modalFriendListTitleContainer: {
    height: windowHeight * 0.07,
    width: windowWidth,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 3,
    borderBottomColor: bg_LessDarkColor,
  },
  modalFriendListTitle: {
    fontSize: windowHeight * 0.025,
    color: "#FFF",
  },
  modalMemberContainer: {
    height: windowHeight * 0.1,
    width: windowWidth,
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: windowWidth * 0.03,
    borderBottomWidth: 2,
    borderBottomColor: bg_LessDarkColor,
  },
  modalMemberName: {
    fontSize: windowHeight * 0.04,
    color: "#FFF",
    marginLeft: windowWidth * 0.03,
  },
  modalFooter: {
    width: windowWidth,
    height: windowHeight * 0.15,
    alignItems: "center",
    justifyContent: "center",
  },
  modalSubmitContainer: {
    height: windowHeight * 0.06,
    width: windowWidth * 0.4,
    borderRadius: windowHeight * 0.01,
    borderWidth: 2,
    borderColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  modalSubmit: {
    fontSize: windowHeight * 0.035,
    color: "#FFF",
  },
});
