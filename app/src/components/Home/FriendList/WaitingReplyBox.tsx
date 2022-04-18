import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext } from "react";
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

const WaitingReplyBox: React.FC<Props> = ({
  userId,
  username,
  showname,
  profileImg,
  setFetching,
}) => {
  const { socket } = useContext(ChatContext);
  const cancel = () => {
    setFetching((prev) => !prev);
    socket?.emit("remove-friend", {
      friendId: userId,
    });
  };

  return (
    <View style={styles.memberContainer}>
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
          <Text style={styles.info}>{username}</Text>
        </View>
      </View>
      <View style={styles.btnBox}>
        <TouchableOpacity
          style={styles.btnContainer}
          onPress={() =>
            Alert.alert(
              "Cancel Friend Request",
              "Do you want to cancel the friend invitation?",
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
                    cancel();
                  },
                },
              ]
            )
          }
        >
          <Entypo name="cross" size={avatarSize * 0.7} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WaitingReplyBox;

const memberContainerHeight = windowHeight * 0.07;
const avatarSize = windowHeight * 0.05;

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
    width: memberContainerHeight + windowHeight * 0.03,
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
    paddingLeft: windowHeight * 0.01,
    paddingRight: windowHeight * 0.01,
    alignItems: "center",
    flexDirection: "row",
  },
  detailInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoTitle: {
    width: windowWidth * 0.2,
    fontSize: avatarSize / 2,
    color: "#FFF",
  },
  info: {
    flex: 1,
    fontSize: avatarSize * 0.65,
    color: "#FFF",
  },
  btnBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  btnContainer: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    marginRight: windowHeight * 0.01,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: bg_LessDarkColor,
  },
  btnStyle: {},
});
