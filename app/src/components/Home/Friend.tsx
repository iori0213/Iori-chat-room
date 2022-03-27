import React from 'react'
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { bg_LessDarkColor, hilight_color, windowHeight, windowWidth } from '../../constants/cssConst';
import { AntDesign } from '@expo/vector-icons';

interface FriendProps {
  friend: BasicProfile;
  deleteFunc: (friendId: string) => void;
}

const Friend: React.FC<FriendProps> = ({ friend, deleteFunc }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{friend.username}</Text>
      <View style={styles.btn}>
        <TouchableOpacity onPress={() => Alert.alert(
          "Remove Friend",
          `Do you want to remove friend ${friend.username} ?`,
          [
            {
              text: "Cancel",
              onPress: () => { return }
            },
            {
              text: "Confrim",
              onPress: () => { deleteFunc(friend.id) }
            }
          ]
        )}>
          <AntDesign name="deleteuser" size={windowWidth * 0.08} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
export default Friend;

const styles = StyleSheet.create({
  container: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.06,
    borderWidth: 1.5,
    borderColor: hilight_color,
    flexDirection: "row",
    backgroundColor: bg_LessDarkColor,
    borderRadius: windowHeight * 0.02,
    paddingHorizontal: windowWidth * 0.07,
    marginBottom: windowHeight * 0.01,
  },
  name: {
    flex: 8.5,
    fontSize: windowWidth * 0.06,
    color: "#FFF",
    paddingTop: windowHeight * 0.01,
  },
  btn: {
    flex: 1.5,
    alignItems: "center",
    justifyContent: "center",
  }
})