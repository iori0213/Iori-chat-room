import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
} from "react-native";

import { Feather, AntDesign } from "@expo/vector-icons";
import {
  bg_DarkColor,
  bg_LessDarkColor,
  bg_userMsg,
  windowHeight,
  windowWidth,
} from "../../constants/cssConst";
import { ChatContext } from "./ChatContext";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

interface UserMessageProps {
  avatar: string;
  msgId: string;
  username: string;
  showname: string;
  msg: string;
  created: string;
}

const UserMessage: React.FC<UserMessageProps> = ({
  avatar,
  msgId,
  username,
  showname,
  msg,
  created,
}) => {
  const { socket } = useContext(ChatContext);
  const [avatarBase64, setAvatarBase64] = useState("");
  const [modify, setModify] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editMsg, setEditMsg] = useState("");

  dayjs.extend(localizedFormat);
  const time = dayjs(created).format("YYYY/MM/DD h:mm a");

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
  useEffect(() => {
    if (avatar == "") {
      return;
    }
    setAvatarBase64(avatar);

    return () => {};
  }, []);

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
            <TouchableOpacity
              style={styles.modifyEditBtn}
              onPress={() => {
                setEditMsg(msg);
                setEdit((prev) => !prev);
                setModify((prev) => !prev);
              }}
            >
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
            <Text style={styles.time}>{time}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.info}>
          <View style={styles.headerContainer}>
            {avatar == "" ? (
              <Feather name="user" size={headerSize} color={bg_LessDarkColor} />
            ) : (
              <Image
                source={{ uri: "data:image/jpeg;base64," + avatarBase64 }}
                style={styles.avatarImg}
              />
            )}
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{showname}</Text>
          </View>
        </View>
      </View>
      {!edit ? (
        <></>
      ) : (
        <View style={styles.editContainer}>
          <View style={styles.editInput}>
            <TextInput
              value={editMsg}
              onChangeText={(msg) => setEditMsg(msg)}
              autoCapitalize="none"
              style={styles.editTextInput}
            />
          </View>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setEdit((prev) => !prev)}
          >
            <AntDesign
              name="close"
              size={windowHeight * 0.04}
              color={bg_DarkColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => {
              socket?.emit("edit-msg", { id: msgId, msg: editMsg });
              setEditMsg("");
              setEdit((prev) => !prev);
            }}
          >
            <AntDesign
              name="rightcircle"
              size={windowHeight * 0.04}
              color="darkturquoise"
            />
          </TouchableOpacity>
        </View>
      )}
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
    overflow: "hidden",
  },
  avatarImg: {
    height: headerSize,
    width: headerSize,
    borderRadius: headerSize / 2,
    resizeMode: "contain",
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
    backgroundColor: bg_userMsg,
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

  editContainer: {
    height: windowHeight * 0.04,
    marginVertical: windowHeight * 0.005,
    flexDirection: "row",
  },
  editInput: {
    width: windowWidth * 0.6,
    height: windowHeight * 0.04,
    marginRight: windowWidth * 0.01,
    borderRadius: (windowHeight * 0.04) / 2,
    backgroundColor: "#FFF",
  },
  editTextInput: {
    flex: 1,
    paddingHorizontal: windowWidth * 0.03,
    fontSize: windowHeight * 0.02,
    color: bg_DarkColor,
  },
  cancelBtn: {
    width: windowHeight * 0.04,
    height: windowHeight * 0.04,
    marginRight: windowWidth * 0.01,
    borderRadius: windowHeight * 0.04,
    backgroundColor: "coral",
  },
  submitBtn: {
    width: windowHeight * 0.04,
    height: windowHeight * 0.04,
    borderRadius: windowHeight * 0.04,
  },
});
