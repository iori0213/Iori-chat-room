import * as SecureStore from "expo-secure-store";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  bg_DarkColor,
  bg_LessDarkColor,
  windowHeight,
  windowWidth,
} from "../../constants/cssConst";
import { USERNAME_KEY } from "../../constants/securestoreKey";
import { HomeTabNavigationProps } from "../../types/navigations";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { ChatContext } from "../../components/Home/ChatContext";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import InfoBox from "../../components/Home/InfoBox";
import LoadingSpinner from "../../components/Auth/LoadingSpinner";

type Props = MaterialTopTabScreenProps<
  HomeTabNavigationProps,
  "FriendListScreen"
>;

const FriendListScreen: React.FC<Props> = () => {
  const [userName, setUserName] = useState("");
  const [friend, setFriend] = useState("");
  const { socket } = useContext(ChatContext);
  const [friendList, setFriendList] = useState<ProfileWithImg[]>([]);
  const [friendListShow, setFriendListShow] = useState(true);
  const [userRequestList, setUserRequestList] = useState<ProfileWithImg[]>([]);
  const [userRequestListShow, setUserRequestListShow] = useState(true);
  const [friendRequestList, setFriendRequestList] = useState<ProfileWithImg[]>(
    []
  );
  const [friendRequestListShow, setFriendRequestListShow] = useState(true);
  const [fetching, setFetching] = useState(true);

  const addFriend = async () => {
    if (friend == "") {
      return Alert.alert("Error", "Friend name field cannot be empty!");
    }
    socket?.emit("add-friend", { friendName: friend });
  };

  const initialize = async () => {
    const localUserName = await SecureStore.getItemAsync(USERNAME_KEY);
    setUserName(localUserName!);
    setFetching(false);
  };

  useEffect(() => {
    socket?.emit("get-friend");
    socket?.on(
      "get-friend-cli",
      async ({
        friendList,
        userRequestList,
        friendRequestList,
      }: {
        friendList: ProfileWithImg[];
        userRequestList: ProfileWithImg[];
        friendRequestList: ProfileWithImg[];
      }) => {
        console.log("get friend started");
        console.log(friendList);
        if (friendList.length !== 0) {
          setFriendList(friendList);
        } else {
          console.log("no friends");
        }
        if (userRequestList.length !== 0) {
          setUserRequestList(userRequestList);
        } else {
          console.log("no user request");
        }
        if (friendRequestList.length !== 0) {
          setFriendRequestList(friendRequestList);
        } else {
          console.log("no friend request");
        }
      }
    );
    initialize();
    socket?.on(
      "add-friend-cli",
      ({
        user,
        friend,
        active,
      }: {
        user: ProfileWithImg;
        friend: ProfileWithImg;
        active: boolean;
      }) => {
        if (user.username == userName || friend.username == userName) {
          if (active) {
            if (user.username == userName) {
              setFriendRequestList((prev) =>
                prev.filter((request) => {
                  request.id != friend.id;
                })
              );
              setFriendList((prev) => [friend, ...prev]);
              return;
            } else if (friend.username == userName) {
              setUserRequestList((prev) =>
                prev.filter((request) => request.id != user.id)
              );
              return;
            }
          } else {
            if (user.username == userName) {
              setUserRequestList((prev) => [friend, ...prev]);
              return;
            } else if (friend.username == userName) {
              setFriendRequestList((prev) => [user, ...prev]);
            }
          }
        }
      }
    );

    return () => {
      socket?.off("get-friend-cli");
      socket?.off("add-friend-cli");
    };
  }, []);

  type pendingProps = {
    sectionTitle: string;
    show: boolean;
    setShow: (value: React.SetStateAction<boolean>) => void;
  };
  const PendingHeaderBox: React.FC<pendingProps> = ({
    sectionTitle,
    show,
    setShow,
  }) => {
    return (
      <View style={styles.pendingHeader}>
        <View style={styles.sideFolderHolder}></View>
        <View style={styles.pendingHeaderTextContainer}>
          <Text style={styles.pendingHeaderText}>{sectionTitle}</Text>
        </View>
        <TouchableOpacity
          style={styles.sideFolderHolder}
          onPress={() => setShow((prev) => !prev)}
        >
          {show ? (
            <MaterialIcons
              name="unfold-more"
              size={windowHeight * 0.03}
              color="#FFF"
            />
          ) : (
            <MaterialIcons
              name="unfold-less"
              size={windowHeight * 0.03}
              color="#FFF"
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <HomeHeader />
        <View style={styles.bodyContainer}>
          {/* add friend zone */}
          <View style={styles.addFriendHeader}>
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={(val) => setFriend(val)}
                value={friend}
                placeholder="add friend name"
                placeholderTextColor="#CCC"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
            <View style={styles.sideBlank}>
              <TouchableOpacity onPress={() => addFriend()}>
                <AntDesign
                  name="adduser"
                  size={windowHeight * 0.04}
                  color="#FFF"
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* add friend zone============================================================= */}
          {/* other pending list============================================================= */}
          {fetching ? (
            <LoadingSpinner />
          ) : (
            <View>
              {friendRequestList.length === 0 ? (
                <></>
              ) : (
                <View
                  style={[
                    styles.pendingContainer,
                    { borderBottomWidth: friendRequestListShow ? 0 : 2 },
                  ]}
                >
                  <PendingHeaderBox
                    sectionTitle="Friend Request"
                    show={friendRequestListShow}
                    setShow={setFriendRequestListShow}
                  />
                  {!friendRequestListShow ? (
                    <></>
                  ) : (
                    <View style={styles.pendingBody}>
                      {friendRequestList.map((profile) => {
                        return (
                          <InfoBox
                            key={profile.id}
                            username={profile.username}
                            showname={profile.showname}
                            profileImg={profile.profileImg}
                          />
                        );
                      })}
                    </View>
                  )}
                </View>
              )}
              {/* your pending list============================================================= */}
              {userRequestList.length === 0 ? (
                <></>
              ) : (
                <View
                  style={[
                    styles.pendingContainer,
                    { borderBottomWidth: userRequestListShow ? 0 : 2 },
                  ]}
                >
                  <PendingHeaderBox
                    sectionTitle="Waiting For Reply"
                    show={userRequestListShow}
                    setShow={setUserRequestListShow}
                  />
                  {!userRequestListShow ? (
                    <></>
                  ) : (
                    <View style={styles.pendingBody}>
                      {userRequestList.map((profile) => {
                        return (
                          <InfoBox
                            key={profile.id}
                            username={profile.username}
                            showname={profile.showname}
                            profileImg={profile.profileImg}
                          />
                        );
                      })}
                    </View>
                  )}
                </View>
              )}
              {/* friendList============================================================= */}
              {friendList.length === 0 ? (
                <></>
              ) : (
                <View>
                  <View style={styles.pendingHeader}>
                    <Text style={styles.pendingHeaderTextContainer}>
                      Friend List
                    </Text>
                  </View>
                  <FlatList
                    data={friendList}
                    extraData={friendList}
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
                </View>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default FriendListScreen;

const HomeHeader: React.FC = () => {
  return (
    <View style={styles.customHeader}>
      <View style={styles.slideNavigatorContainer}></View>
      <View style={styles.titleContainer}>
        <Text style={styles.titleStyle}>Friends</Text>
      </View>
      <View style={styles.slideNavigatorContainer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: bg_LessDarkColor,
  },
  customHeader: {
    flexDirection: "row",
    height: windowHeight * 0.05,
    backgroundColor: bg_LessDarkColor,
  },
  titleContainer: {
    flex: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  titleStyle: {
    fontSize: windowWidth * 0.08,
    color: "#FFF",
  },
  slideNavigatorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bodyContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: bg_DarkColor,
  },
  addFriendHeader: {
    width: windowWidth,
    height: windowHeight * 0.06,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: bg_LessDarkColor,
    borderBottomWidth: 3,
    borderBottomColor: bg_DarkColor,
  },
  sideBlank: {
    width: windowWidth * 0.1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    width: windowWidth * 0.88,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  input: {
    height: windowHeight * 0.04,
    width: windowWidth * 0.87,
    borderRadius: (windowHeight * 0.04) / 2,
    fontSize: windowWidth * 0.04,
    backgroundColor: bg_DarkColor,
    color: "#FFF",
    paddingLeft: windowWidth * 0.04,
  },
  pendingContainer: {
    borderBottomColor: bg_DarkColor,
  },
  pendingHeader: {
    width: windowWidth,
    height: windowHeight * 0.03,
    backgroundColor: bg_LessDarkColor,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  sideFolderHolder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pendingHeaderTextContainer: {
    flex: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  pendingHeaderText: {
    fontSize: windowHeight * 0.02,
    color: "#FFF",
  },
  pendingBody: {
    maxHeight: windowHeight * 0.2,
  },
});
