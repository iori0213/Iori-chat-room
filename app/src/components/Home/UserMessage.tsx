import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";

import { Feather, AntDesign } from "@expo/vector-icons";
import {
  bg_DarkColor,
  bg_LessDarkColor,
  windowHeight,
  windowWidth,
} from "../../constants/cssConst";
import { ChatContext } from "./ChatContext";

interface UserMessageProps {
  msgId: string;
  username: string;
  msg: string;
  created: string;
  deleteFunc?: () => void;
  editFunc?: () => void;
}

const UserMessage: React.FC<UserMessageProps> = ({
  msgId,
  username,
  msg,
  created,
  deleteFunc,
  editFunc,
}) => {
  const { socket } = useContext(ChatContext);
  const [modify, setModify] = useState(false);

  const deleteCheck = () => {
    return Alert.alert(
      "Delete message",
      "Are you sure you want to delete this message?",
      [
        {
          text: "Cancel",
          onPress: () => {
            setModify(false);
            return;
          },
        },
        {
          text: "Confirm",
          onPress: () => {
            socket?.emit("delete-msg", { id: msgId });
            setModify(false);
            return;
          },
        },
      ]
    );
  };

  return (
    <View style={styles.Container}>
      <View style={styles.mainContainer}>
        {!modify ? (
          <></>
        ) : (
          <View style={styles.modifiContainer}>
            <TouchableOpacity
              style={styles.modifyCancelBtn}
              onPress={() => setModify((Prev) => !Prev)}
            >
              <AntDesign
                name="close"
                size={modifyBtnSize * 0.8}
                color={bg_DarkColor}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.modifyEditBtn}>
              <Feather
                name="edit"
                size={modifyBtnSize * 0.8}
                color={bg_DarkColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modifyDeleteBtn}
              onPress={() => deleteCheck()}
            >
              <AntDesign
                name="delete"
                size={modifyBtnSize * 0.8}
                color={bg_DarkColor}
              />
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.msgContainer}
          onLongPress={() => {
            setModify((Prev) => !Prev);
          }}
        >
          <Text style={styles.msg}>{msg}</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{created}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.info}>
          <View style={styles.headerContainer}>
            <Feather name="user" size={headerSize} color={bg_LessDarkColor} />
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{username}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserMessage;

//css constant
const headerSize = windowWidth * 0.1;
const modifyBtnSize = windowWidth * 0.07;

const styles = StyleSheet.create({
  Container: {
    width: windowWidth * 0.96,
    alignItems: "flex-end",
    marginBottom: windowHeight * 0.01,
  },
  mainContainer: {
    flexDirection: "row",
  },
  info: {
    flex: 1,
    maxWidth: headerSize,
    paddingTop: windowHeight * 0.003,
  },
  headerContainer: {
    height: headerSize,
    width: headerSize,
    borderRadius: headerSize / 2,
    backgroundColor: "#FFF",
  },
  nameContainer: {
    width: headerSize,
    alignItems: "center",
    justifyContent: "center",
    marginTop: windowHeight * 0.003,
  },
  name: {
    fontSize: windowHeight * 0.015,
    color: "#FFF",
  },
  msgContainer: {
    maxWidth: windowWidth * 0.6,
    backgroundColor: bg_LessDarkColor,
    marginRight: windowWidth * 0.01,
    paddingVertical: windowWidth * 0.01,
    paddingHorizontal: windowWidth * 0.02,
    borderRadius: windowWidth * 0.03,
  },
  msg: {
    fontSize: windowHeight * 0.025,
    color: "#FFF",
  },
  timeContainer: {
    marginTop: windowHeight * 0.007,
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  time: {
    fontSize: windowHeight * 0.015,
    color: "#EEE",
  },
  modifiContainer: {
    marginTop: windowHeight * 0.01,
    marginRight: windowWidth * 0.01,
    flexDirection: "row",
  },
  modifyCancelBtn: {
    width: modifyBtnSize,
    height: modifyBtnSize,
    backgroundColor: "lightblue",
    borderRadius: modifyBtnSize / 4,
    alignItems: "center",
    justifyContent: "center",
  },
  modifyEditBtn: {
    width: modifyBtnSize,
    height: modifyBtnSize,
    backgroundColor: "darkturquoise",
    borderRadius: modifyBtnSize / 4,
    marginLeft: windowHeight * 0.005,
    alignItems: "center",
    justifyContent: "center",
  },
  modifyDeleteBtn: {
    width: modifyBtnSize,
    height: modifyBtnSize,
    backgroundColor: "coral",
    borderRadius: modifyBtnSize / 4,
    marginLeft: windowHeight * 0.005,
    alignItems: "center",
    justifyContent: "center",
  },
});
