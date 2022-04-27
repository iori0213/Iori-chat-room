import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  FlatList,
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
import { Ionicons, AntDesign, Entypo } from "@expo/vector-icons";
import InfoBox from "../../components/Home/InfoBox";

type Props = NativeStackScreenProps<
  HomeStackNavigationProps,
  "RoomMembersScreen"
>;

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
          <TouchableOpacity style={styles.sideBtn}>
            <AntDesign name="adduser" size={windowWidth * 0.08} color="#FFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <FlatList
            data={roomMembers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <InfoBox
                  username={item.username}
                  showname={item.showname}
                  profileImg={item.profileImg}
                />
              );
            }}
          />
          <View style={styles.footer}>
            <TouchableOpacity style={styles.quitBtnContainer}>
              <Entypo name="log-out" size={windowWidth * 0.06} color="#FFF" />
              <Text style={styles.quitBtnText}>Quit Chat Room</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <SafeAreaView style={{ flex: 0, backgroundColor: bg_DarkColor }} />
    </SafeAreaProvider>
  );
};

export default RoomMembersScreen;

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
    alignItems: "center",
  },
  footer: {
    width: windowWidth,
    height: windowHeight * 0.12,
    alignItems: "center",
    justifyContent: "center",
  },
  quitBtnContainer: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.08,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: bg_LessDarkColor,
    borderRadius: 15,
    flexDirection: "row",
  },
  quitBtnText: {
    fontSize: windowWidth * 0.06,
    color: "#FFF",
    marginLeft: windowWidth * 0.02,
  },
});
