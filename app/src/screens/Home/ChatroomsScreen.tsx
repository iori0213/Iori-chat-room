import React, { useEffect } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { socket } from '../../../App';
import { bg_DarkColor } from '../../constants/cssConst';
import { ChatroomsScreenProps } from '../../types/screenProps';


const ChatroomsScreen: React.FC<ChatroomsScreenProps> = ({ }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={{ color: "#FFF" }}>Chatrooms</Text>
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
    alignItems: "center",
    justifyContent: "center",
  }
})