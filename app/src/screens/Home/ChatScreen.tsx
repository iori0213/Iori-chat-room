import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { bg_DarkColor, windowHeight, windowWidth } from '../../constants/cssConst';
import { AntDesign } from '@expo/vector-icons';
import { socket } from './RoomListScreen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChatNavigationProps } from '../../types/navigations';

type Props = NativeStackScreenProps<ChatNavigationProps, "ChatScreen">

const ChatScreen: React.FC<Props> = ({ route }) => {
  const { roomId } = route.params;
  const [messages, setMessages] = useState<Msg[]>([]);
  const [members, setMembers] = useState<BasicProfile[]>([]);

  useEffect(() => {
    socket.emit("join-room", { roomId: roomId })
    socket.on("join-room-initialize", (roomIfno) => { })
    socket.on("add-msg", (msg: Msg) => { })
    socket.on("remove-msg", (id: number) => { })
    return () => {
      socket.off("add-msg", (msg: Msg) => { })
      socket.off("remove-msg", (id: number) => { })
    }
  }, [])

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.sideBtn}><AntDesign name="adduser" size={windowWidth * 0.08} color="#FFF" /></TouchableOpacity>
          <Text></Text>
          <TouchableOpacity style={styles.sideBtn}><AntDesign name="adduser" size={windowWidth * 0.08} color="#FFF" /></TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
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
  roomName: {

  },
  sideBtn: {
    flex: 1,
  }
})