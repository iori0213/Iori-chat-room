import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  windowHeight,
  windowWidth,
  bg_LessDarkColor,
  bg_LightColor,
  bg_DarkColor,
  hilight_color,
} from "../../constants/cssConst";
import { Feather } from "@expo/vector-icons";

type Props = {
  username: string;
  showname: string;
  profileImg: string;
  checked: boolean;
  toggleFunction: () => void;
};

const CreateRoomInfoBox: React.FC<Props> = ({
  username,
  showname,
  profileImg,
  checked,
  toggleFunction,
}) => {
  const color = checked ? { color: hilight_color } : { color: "#FFF" };
  return (
    <TouchableOpacity
      // prettier-ignore
      style={[styles.memberContainer, checked? {backgroundColor: bg_LessDarkColor, borderBottomColor: bg_DarkColor,}: {borderBottomColor: bg_LessDarkColor,}]}
      onPress={() => toggleFunction()}
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
          <Text style={[styles.infoTitle, color]}>User Name</Text>
          <Text style={[styles.info, , color]}>{username}</Text>
        </View>
        <View style={styles.detailInfoContainer}>
          <Text style={[styles.infoTitle, , color]}>Show Name</Text>
          <Text style={[styles.info, , color]}>{showname}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CreateRoomInfoBox;

const memberContainerHeight = windowHeight * 0.1;
const avatarSize = windowHeight * 0.08;

const styles = StyleSheet.create({
  //memberContainer
  memberContainer: {
    width: windowWidth,
    height: memberContainerHeight,
    flexDirection: "row",
    borderBottomWidth: 2,
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
    paddingLeft: windowHeight * 0.01,
    justifyContent: "center",
  },
  detailInfoContainer: {
    height: memberContainerHeight / 2.5,
    flexDirection: "row",
    alignItems: "center",
  },
  infoTitle: {
    width: windowWidth * 0.3,
    fontSize: avatarSize / 3.5,
  },
  info: {
    fontSize: avatarSize / 3.5,
  },
});
