import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  bg_DarkColor,
  windowHeight,
  windowWidth,
} from "../../constants/cssConst";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ChatNavigationProps } from "../../types/navigations";
import { ChatContext } from "../../components/Home/ChatContext";
import { TextInput } from "react-native-paper";

type Props = NativeStackScreenProps<ChatNavigationProps, "ChatScreen">;

const ChatScreen: React.FC<Props> = ({ route, navigation }) => {
  const { roomId, roomName } = route.params;
  const [messages, setMessages] = useState<Msg[]>([]);
  const [members, setMembers] = useState<Profile[]>([]);
  const { socket } = useContext(ChatContext);

  const [msgInput, setMsgInput] = useState("");

  const goBack = () => {
    socket?.off("add-msg", (msg: Msg) => {});
    socket?.off("remove-msg", (id: number) => {});
    socket?.emit("leave-room");
    navigation.pop();
  };

  useEffect(() => {
    socket?.emit("join-room", { roomId: roomId });
    socket?.on("error-msg", (errorMessage) =>
      Alert.alert("Error", errorMessage)
    );
    socket?.on(
      "join-room-initialize",
      ({ members, msgs }: { members: Profile[]; msgs: Msg[] }) => {
        setMembers(members);
        setMessages(msgs);
      }
    );
    socket?.on("add-msg", (msg: Msg) => {
      setMsgInput("");
      setMessages((prev) => {
        return [msg, ...prev];
      });
    });
    socket?.on("remove-msg", (id: string) => {
      setMessages((prev) => {
        return prev.filter((msg) => msg.id != id);
      });
    });
    return () => {
      socket?.off("join-room-initialize");
      socket?.off("add-msg");
      socket?.off("remove-msg");
    };
  }, [socket]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
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
          <TouchableOpacity style={styles.sideBtn}>
            <Ionicons name="settings" size={windowWidth * 0.08} color="#FFF" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          inverted={true}
          onEndReached={() => console.log("need to load more msg!!")}
          extraData={messages}
          renderItem={({ item }) => {
            return (
              <View key={item.id} style={{ flexDirection: "row" }}>
                <Text style={{ color: "#FFF" }}>{item.id + " "}</Text>
                <Text style={{ color: "#FFF" }}>
                  {item.sender.username + ": "}
                </Text>
                <Text style={{ color: "#FFF" }}>{item.msg + " "}</Text>
                <Text style={{ color: "#FFF" }}>{item.createdAt + "  "}</Text>
                <TouchableOpacity
                  onPress={() => socket?.emit("delete-msg", { id: item.id })}
                >
                  <Text style={{ color: "pink" }}>DELETE</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
        <TextInput
          onChangeText={(msg) => setMsgInput(msg)}
          value={msgInput}
          placeholder=""
          placeholderTextColor="#AAA"
          autoComplete="off"
          autoCapitalize="none"
          style={{ color: "#FFF" }}
        />
        <TouchableOpacity
          onPress={() => {
            if (!msgInput) {
              return Alert.alert("Error", "cannot send empty message!");
            }
            socket?.emit("send-msg", { msg: msgInput });
          }}
        >
          <Text style={{ fontSize: 20, color: "#FFF" }}>push msg</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default ChatScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: bg_DarkColor,
  },
  header: {
    height: windowHeight * 0.06,
    width: windowWidth,
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderBottomColor: "#111",
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
  chatBody: {
    flex: 1,
    backgroundColor: bg_DarkColor,
  },
});
