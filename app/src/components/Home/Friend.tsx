import React, { useState } from "react";
import { Alert, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  bg_DarkColor,
  bg_LessDarkColor,
  hilight_color,
  windowHeight,
  windowWidth,
} from "../../constants/cssConst";
import { AntDesign } from "@expo/vector-icons";

interface FriendProps {
  friend: Profile;
  deleteFunc: (friendId: string) => void;
}

const Friend: React.FC<FriendProps> = ({ friend, deleteFunc }) => {
  const [focus, setFocus] = useState(false);
  return (
    <TouchableOpacity
      style={styles.container}
      onLongPress={() => setFocus((prev) => !prev)}
    >
      <Text style={styles.name}>{friend.username}</Text>
      {!focus ? (
        <></>
      ) : (
        <View style={styles.btnContainer}>
          <View style={styles.cancelBtn}>
            <TouchableOpacity onPress={() => setFocus((prev) => !prev)}>
              <AntDesign
                name="close"
                size={windowWidth * 0.08}
                color={bg_DarkColor}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.deleteBtn}>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Remove Friend",
                  `Do you want to remove friend ${friend.username} ?`,
                  [
                    {
                      text: "Cancel",
                      onPress: () => {
                        return;
                      },
                    },
                    {
                      text: "Confrim",
                      onPress: () => {
                        deleteFunc(friend.id);
                      },
                    },
                  ]
                )
              }
            >
              <AntDesign
                name="deleteuser"
                size={windowWidth * 0.08}
                color={bg_DarkColor}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};
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
    paddingLeft: windowWidth * 0.07,
    paddingRight: windowWidth * 0.03,
    marginBottom: windowHeight * 0.01,
  },
  name: {
    flex: 7,
    fontSize: windowWidth * 0.06,
    color: "#FFF",
    paddingTop: windowHeight * 0.01,
  },
  btnContainer: {
    flex: 4,
    flexDirection: "row",
  },
  deleteBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: windowWidth * 0.02,
    backgroundColor: "coral",
    marginLeft: windowWidth * 0.02,
    marginVertical: windowHeight * 0.003,
  },
  cancelBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: windowWidth * 0.02,
    backgroundColor: "lightblue",
    marginLeft: windowWidth * 0.01,
    marginVertical: windowHeight * 0.002,
  },
});
