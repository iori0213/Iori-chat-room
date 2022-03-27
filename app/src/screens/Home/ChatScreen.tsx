import React, { useContext, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
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
    navigation.pop();
  };

  useEffect(() => {
    socket?.emit("join-room", { roomId: roomId });
    socket?.on("error-msg", (message: string) => Alert.alert("Error", message));
    socket?.on(
      "join-room-initialize",
      ({ members, msgs }: { members: Profile[]; msgs: Msg[] }) => {
        setMembers(members);
        setMessages(msgs);
      }
    );
    socket?.on("add-msg", (msg: Msg) => {
      console.log(msg);
      setMessages((prev) => {
        return [...prev, msg];
      });
    });
    socket?.on("remove-msg", (id: number) => {});
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
          <Text style={{ fontSize: windowWidth * 0.1, color: "white" }}>
            {roomName}
          </Text>
          <TouchableOpacity style={styles.sideBtn}>
            <Ionicons name="settings" size={windowWidth * 0.08} color="#FFF" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={messages}
          renderItem={({ item }) => {
            return (
              <View>
                <Text style={{ color: "#FFF" }}>{item.msg}</Text>
              </View>
            );
          }}
        />
        <TextInput
          onChangeText={(msg) => setMsgInput(msg)}
          placeholder=""
          placeholderTextColor="#AAA"
          autoComplete="none"
          style={{ color: "#FFF" }}
        />
        <TouchableOpacity
          onPress={() => {
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
    height: windowHeight * 0.1,
    width: windowWidth,
    flexDirection: "row",
  },
  roomName: {},
  sideBtn: {
    flex: 1,
  },
});
