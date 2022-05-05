import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { Feather } from "@expo/vector-icons";
import {
  bg_LessDarkColor,
  windowHeight,
  windowWidth,
} from "../../constants/cssConst";

interface MessageProps {
  avatar: string;
  msgId: string;
  username: string;
  showname: string;
  msg: string;
  created: string;
}

const Message: React.FC<MessageProps> = ({
  avatar,
  msgId,
  username,
  showname,
  msg,
  created,
}) => {
  const time = new Date(created).toLocaleString();
  const [avatarBase64, setAvatarBase64] = useState("");
  useEffect(() => {
    setAvatarBase64(avatar);
    return () => {};
  }, []);

  return (
    <View style={styles.Container}>
      <View style={styles.mainContainer}>
        <View style={styles.info}>
          <View style={styles.headerContainer}>
            {avatarBase64 == "" ? (
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
        <View style={styles.msgContainer}>
          <Text style={styles.msg}>{msg}</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{time}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
export default Message;

//css constant
const headerSize = windowWidth * 0.1;

const styles = StyleSheet.create({
  Container: {
    width: windowWidth * 0.96,
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
    backgroundColor: bg_LessDarkColor,
    marginLeft: windowWidth * 0.01,
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
});
