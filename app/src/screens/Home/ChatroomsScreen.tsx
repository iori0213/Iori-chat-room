import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bg_DarkColor, bg_LessDarkColor, windowHeight, windowWidth } from '../../constants/cssConst';
import { ChatroomsScreenProps } from '../../types/screenProps';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import axios from 'axios';

import { io } from "socket.io-client";
import { BackendUrl } from "../../constants/backendAPI";
export const socket = io(`${BackendUrl}`);


const ChatroomsScreen: React.FC<ChatroomsScreenProps> = ({ }) => {
  const [chatName, setChatName] = useState<string>("");
  const [roomList, setRoomList] = useState<RoomList[]>([]);
  const [showingList, setShowingList] = useState<RoomList[]>([]);
  const getChatRoom = async () => {
    axios({
      method: "get"
    })
  }
  const createChatRoom = async () => {
    axios({
      method: "get",

    })
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.titleBar}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Chat Rooms</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => createChatRoom()}>
            <MaterialCommunityIcons name="chat-plus" size={windowWidth * 0.1} color="#FFF" />
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
          <TouchableOpacity style={styles.goBtn} onPress={() => console.log("search room")}>
            <Ionicons name="search" size={windowWidth * 0.07} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
      <TestComp />
    </SafeAreaView>
  );
}
export default ChatroomsScreen;
/**
 * socket.on('some-event', (param) => {
      param === {
        email: 'email',
        password: 'password'
      }

      param.email, param.passord
 *                           
 * })
 */

const TestComp: React.FC = () => {
  useEffect(() => {
    socket.on('server-emitted-event', (params) => {
      // do something
    })

    return () => {
      socket.off('server-emitted-event')
    }
  })

  const testHandler = () => {
    socket.emit('some-event', {
      email: 'email',
      password: 'password',

    })
  }

  return (
    <View>
      <Button title='test' onPress={testHandler} />
    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: bg_DarkColor,
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
    textAlignVertical: "center",
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
  }
})

function async() {
  throw new Error('Function not implemented.');
}
