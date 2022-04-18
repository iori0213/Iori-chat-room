import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import {
  windowHeight,
  windowWidth,
  bg_LessDarkColor,
} from "../../../constants/cssConst";
import { Feather, Entypo } from "@expo/vector-icons";
import { ChatContext } from "../ChatContext";

type Props = {
  userId: string;
  username: string;
  showname: string;
  profileImg: string;
  setFetching: (value: React.SetStateAction<boolean>) => void;
};

const FriendListBox: React.FC<Props> = ({
  userId,
  username,
  showname,
  profileImg,
  setFetching,
}) => {
  const { socket } = useContext(ChatContext);

  const [removeMode, setRemoveMode] = useState(false);

  const removeFriend = () => {
    setFetching((prev) => !prev);
    socket?.emit("remove-friend", {
      friendId: userId,
    });
  };
  const removeFriendCheck = () => {
    setRemoveMode((prev) => !prev);
    return Alert.alert(
      "Remove Friend Check",
      `Do you want to remove friend: ${username} ?`,
      [
        {
          text: "No",
          onPress: () => {
            return;
          },
        },
        {
          text: "Yes",
          onPress: () => {
            removeFriend();
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.memberContainer}
      onLongPress={() => setRemoveMode((prev) => !prev)}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.imgView}>
          {profileImg == "" ? (
            <Feather
              name="user"
              size={avatarSize}
              color={bg_LessDarkColor}
              style={{ backgroundColor: "#FFF" }}
            />
          ) : (
            <Image
              source={{ uri: "data:image/jpeg;base64," + profileImg }}
              style={styles.imgStyle}
            />
          )}
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.detailInfoContainer}>
          <Text style={styles.infoTitle}>User Name</Text>
          <Text style={styles.info}>{username}</Text>
        </View>
        <View style={styles.detailInfoContainer}>
          <Text style={styles.infoTitle}>Show Name</Text>
          <Text style={styles.info}>{showname}</Text>
        </View>
      </View>
      {!removeMode ? (
        <></>
      ) : (
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setRemoveMode((prev) => !prev)}
          >
            <Entypo name="cross" size={avatarSize * 0.5} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => removeFriendCheck()}
          >
            <Feather name="user-x" size={avatarSize * 0.5} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default FriendListBox;

const memberContainerHeight = windowHeight * 0.1;
const avatarSize = windowHeight * 0.08;

const styles = StyleSheet.create({
  //memberContainer
  memberContainer: {
    width: windowWidth,
    height: memberContainerHeight,
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: bg_LessDarkColor,
  },
  avatarContainer: {
    width: memberContainerHeight,
    height: memberContainerHeight,
    alignItems: "center",
    justifyContent: "center",
  },
  imgView: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    overflow: "hidden",
  },
  imgStyle: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    resizeMode: "contain",
  },

  infoContainer: {
    flex: 1,
    maxWidth: windowWidth * 0.6,
    paddingLeft: windowHeight * 0.01,
    justifyContent: "center",
  },
  detailInfoContainer: {
    height: memberContainerHeight / 2.5,
    flexDirection: "row",
    alignItems: "center",
  },
  infoTitle: {
    width: windowWidth * 0.26,
    fontSize: avatarSize / 4,
    color: "#FFF",
  },
  info: {
    fontSize: avatarSize / 4,
    color: "#FFF",
  },
  btnContainer: {
    width: windowWidth * 0.3,
    height: memberContainerHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  btn: {
    width: avatarSize * 0.75,
    height: avatarSize * 0.75,
    borderRadius: (avatarSize * 0.75) / 2,
    backgroundColor: bg_LessDarkColor,
    alignItems: "center",
    justifyContent: "center",
  },
});
