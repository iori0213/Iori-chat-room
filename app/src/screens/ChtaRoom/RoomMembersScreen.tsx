import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  FlatList,
  Image,
  Platform,
} from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackNavigationProps } from "../../types/navigations";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  bg_DarkColor,
  bg_LessDarkColor,
  windowHeight,
  windowWidth,
} from "../../constants/cssConst";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<
  HomeStackNavigationProps,
  "RoomMembersScreen"
>;

const memberContainer = (
  username: string,
  showname: string,
  profileImg: string
) => {
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
          <Text style={styles.info}>User Name {username}</Text>
        </View>
        <View style={styles.detailInfoContainer}>
          <Text style={styles.info}>Show Name {showname}</Text>
        </View>
      </View>
    </View>
  );
};

const RoomMembersScreen: React.FC<Props> = ({ navigation, route }) => {
  const { roomMembers } = route.params;
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.pop()}
            style={styles.sideBtn}
          >
            <Ionicons
              name="arrow-back"
              size={windowWidth * 0.08}
              color="#FFF"
            />
          </TouchableOpacity>
          <View style={styles.roomNameContainer}>
            <Text style={styles.roomNameText}>Room Members</Text>
          </View>
          <View style={styles.sideBtn}></View>
        </View>
        <View style={styles.body}>
          <FlatList
            data={roomMembers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return memberContainer(
                item.username,
                item.showname,
                item.profileImg
              );
            }}
          />
        </View>
      </SafeAreaView>
      <SafeAreaView style={{ flex: 0, backgroundColor: bg_DarkColor }} />
    </SafeAreaProvider>
  );
};

export default RoomMembersScreen;
const memberContainerHeight = windowHeight * 0.1;
const avatarSize = windowHeight * 0.08;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: bg_LessDarkColor,
  },
  //Headers
  header: {
    height: Platform.OS === "ios" ? windowHeight * 0.08 : windowHeight * 0.11,
    paddingTop: Platform.OS === "ios" ? 0 : windowHeight * 0.02,
    width: windowWidth,
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderBottomColor: bg_DarkColor,
    backgroundColor: bg_LessDarkColor,
  },
  roomNameContainer: {
    flex: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  roomNameText: {
    fontSize: windowWidth * 0.08,
    color: "white",
  },
  sideBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: windowWidth * 0.015,
  },

  //body
  body: {
    flex: 1,
    backgroundColor: bg_DarkColor,
  },

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
  },
  detailInfoContainer: {
    height: memberContainerHeight / 2,
    // paddingVertical: windowHeight * 0.01,
    justifyContent: "center",
  },
  info: {
    fontSize: avatarSize / 3.5,
    color: "#FFF",
  },
});
