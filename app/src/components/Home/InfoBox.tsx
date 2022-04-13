import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  windowHeight,
  windowWidth,
  bg_LessDarkColor,
} from "../../constants/cssConst";

type Props = {
  username: string;
  showname: string;
  profileImg: string;
};

const InfoBox: React.FC<Props> = ({ username, showname, profileImg }) => {
  return (
    <View style={styles.memberContainer}>
      <View style={styles.avatarContainer}>
        <View style={styles.imgView}>
          <Image
            source={{ uri: "data:image/jpeg;base64," + profileImg }}
            style={styles.imgStyle}
          />
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
    </View>
  );
};

export default InfoBox;

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
    color: "#FFF",
  },
  info: {
    fontSize: avatarSize / 3.5,
    color: "#FFF",
  },
});
