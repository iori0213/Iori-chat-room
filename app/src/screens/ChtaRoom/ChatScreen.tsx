import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  bg_DarkColor,
  bg_LessDarkColor,
  windowHeight,
  windowWidth,
} from "../../constants/cssConst";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackNavigationProps } from "../../types/navigations";
import * as SecureStore from "expo-secure-store";
import { ChatContext } from "../../components/Home/ChatContext";
import LoadingSpinner from "../../components/Auth/LoadingSpinner";
import Message from "../../components/Home/Message";
import UserMessage from "../../components/Home/UserMessage";
import { USERID_KEY } from "../../constants/securestoreKey";
import { ActivityIndicator } from "react-native-paper";

type Props = NativeStackScreenProps<HomeStackNavigationProps, "ChatScreen">;

const ChatScreen: React.FC<Props> = ({ route, navigation }) => {
  const [fetching, serFetching] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [userId, setUserId] = useState("");
  let userid = "";
  const { roomId, roomName } = route.params;
  const [messages, setMessages] = useState<Msg[]>([]);
  const [members, setMembers] = useState<ProfileWithImg[]>([]);
  const { socket } = useContext(ChatContext);

  const [msgInput, setMsgInput] = useState("");

  const goBack = () => {
    socket?.off("add-msg");
    socket?.off("remove-msg");
    socket?.emit("leave-room");
    navigation.pop();
  };

  const getMoreMsg = () => {
    setLoadingMsg((Prev) => !Prev);
    const lastMsg = messages[messages.length - 1];
    socket?.emit("get-more-msg", { msg: lastMsg });
  };

  const quitChatRoom = () => {};

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

  useEffect(() => {
    socket?.emit("join-room", { roomId: roomId });
    socket?.on("error-msg", (errorMessage) => {
      return Alert.alert("Error", errorMessage);
    });
    socket?.on(
      "join-room-initialize",
      async ({ members, msgs }: { members: ProfileWithImg[]; msgs: Msg[] }) => {
        const localUserId = await SecureStore.getItemAsync(USERID_KEY);
        userid = localUserId!;
        setUserId(localUserId!);
        setMembers(members);
        setMessages(msgs);
        serFetching(false);
      }
    );
    socket?.on("add-msg", (msg: Msg) => {
      if (userid == msg.sender.id) {
        setMsgInput("");
      }
      setMessages((prev) => {
        return [msg, ...prev];
      });
    });
    socket?.on("remove-msg", (id: string) => {
      setMessages((prev) => {
        return prev.filter((msg) => msg.id != id);
      });
    });
    socket?.on("update-msg", (updateMsg: UpdateMsg) => {
      setMessages((Prev) =>
        Prev.map((msg) => {
          if (msg.id == updateMsg.id) {
            msg.msg = updateMsg.msg;
          }
          return msg;
        })
      );
    });
    socket?.on(
      "add-more-msg",
      ({ newMsgs, notify }: { newMsgs: Msg[]; notify?: string }) => {
        setMessages((Prev) => [...Prev, ...newMsgs]);
        setLoadingMsg((Prev) => !Prev);
        if (notify) {
          setIsEnd(true);
          return Alert.alert("oops", notify);
        }
      }
    );
    return () => {
      socket?.off("join-room-initialize");
      socket?.off("add-msg");
      socket?.off("remove-msg");
      socket?.off("update-msg");
      socket?.off("add-more-msg");
      socket?.off("error-msg");
    };
  }, [socket]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        {fetching ? (
          <LoadingSpinner />
        ) : (
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => goBack()} style={styles.sideBtn}>
                <Ionicons
                  name="arrow-back"
                  size={windowWidth * 0.08}
                  color="#FFF"
                />
              </TouchableOpacity>
              <View style={styles.roomNameContainer}>
                <Text style={styles.roomNameText}>{roomName}</Text>
              </View>
              <TouchableOpacity
                style={styles.sideBtn}
                onPress={() =>
                  navigation.navigate("RoomMembersScreen", {
                    roomMembers: members,
                  })
                }
              >
                <Ionicons
                  name="settings"
                  size={windowWidth * 0.08}
                  color="#FFF"
                />
              </TouchableOpacity>
            </View>
            <KeyboardAvoidingView
              style={styles.body}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <View style={styles.msgList}>
                <FlatList
                  data={messages}
                  keyExtractor={(item) => item.id}
                  inverted={true}
                  onEndReached={() => {
                    if (messages.length >= 15 && !isEnd) {
                      getMoreMsg();
                    }
                  }}
                  onEndReachedThreshold={0}
                  showsHorizontalScrollIndicator={false}
                  extraData={messages}
                  renderItem={({ item }) => {
                    const tempMember = members.filter(
                      (member) => member.id == item.sender.id
                    );
                    return item.sender.id == userId ? (
                      <UserMessage
                        avatar={tempMember[0].profileImg}
                        msgId={item.id}
                        username={item.sender.username}
                        msg={item.msg}
                        created={item.createdAt}
                      />
                    ) : (
                      <Message
                        avatar={tempMember[0].profileImg}
                        msgId={item.id}
                        username={item.sender.username}
                        msg={item.msg}
                        created={item.createdAt}
                      />
                    );
                  }}
                />
              </View>
              <View style={styles.footer}>
                <TextInput
                  onChangeText={(msg) => setMsgInput(msg)}
                  value={msgInput}
                  placeholder=""
                  placeholderTextColor="#AAA"
                  autoCapitalize="none"
                  style={styles.input}
                />
                <TouchableOpacity
                  onPress={() => {
                    if (!msgInput) {
                      return Alert.alert("Error", "cannot send empty message!");
                    }
                    socket?.emit("send-msg", { msg: msgInput });
                  }}
                  style={styles.textSubmitBtn}
                >
                  <AntDesign
                    name="rightcircle"
                    size={windowHeight * 0.04}
                    color="#FFF"
                  />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </>
        )}
        {!loadingMsg ? (
          <></>
        ) : (
          <View style={styles.loadingSpinner}>
            <ActivityIndicator color="#FFF" size="large" />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default ChatScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: bg_LessDarkColor,
  },
  header: {
    height: windowHeight * 0.08,
    width: windowWidth,
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderBottomColor: bg_DarkColor,
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
  body: {
    flex: 1,
    backgroundColor: bg_DarkColor,
  },
  msgList: {
    flex: 1,
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    width: windowWidth,
    backgroundColor: bg_LessDarkColor,
    height: windowHeight * 0.06,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 0.5,
    borderTopColor: bg_DarkColor,
  },
  input: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.04,
    borderRadius: windowHeight * 0.02,
    backgroundColor: "#FFF",
    paddingHorizontal: windowWidth * 0.04,
    fontSize: windowHeight * 0.025,
  },
  textSubmitBtn: {
    marginLeft: windowWidth * 0.03,
  },
  loadingSpinner: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
