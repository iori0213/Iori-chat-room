import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bg_DarkColor } from '../../constants/cssConst';
import { ChatroomsScreenProps } from '../../types/screenProps';


const ChatroomsScreen: React.FC<ChatroomsScreenProps> = ({ }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={{ color: "#FFF" }}>Chatrooms</Text>
    </SafeAreaView>
  );
}
export default ChatroomsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: bg_DarkColor,
    alignItems: "center",
    justifyContent: "center",
  }
})