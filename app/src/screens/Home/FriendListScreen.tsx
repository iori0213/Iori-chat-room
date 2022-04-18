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
import { ACCESS_KEY, USERNAME_KEY } from "../../constants/securestoreKey";
import { HomeTabNavigationProps } from "../../types/navigations";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { ChatContext } from "../../components/Home/ChatContext";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import InfoBox from "../../components/Home/InfoBox";
import LoadingSpinner from "../../components/Auth/LoadingSpinner";
import RequestPendingBox from "../../components/Home/RequestPendingBox";
import WaitingReplyBox from "../../components/Home/WaitingReplyBox";
import axios from "axios";
import { FriendAPI } from "../../constants/backendAPI";

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

  const getFriend = async () => {
    const localAccessToken = await SecureStore.getItemAsync(ACCESS_KEY);
    axios({
      method: "get",
      url: `${FriendAPI}/get`,
      headers: { Authorization: `Bearer ${localAccessToken}` },
    })
      .then(({ data }) => {
        setFriendList(data.friendList);
        setUserRequestList(data.userRequestList);
        setFriendRequestList(data.friendRequestList);
      })
      .catch((e) => console.log("Get Friend Problem:", e));

    setFetching(false);
  };

  const addFriend = async () => {
    if (friend == "") {
      return Alert.alert("Error", "Friend name field cannot be empty!");
    }
    setFetching(true);
    socket?.emit("add-friend", { friendName: friend });
    setFriend("");
  };

  const initialize = async () => {
    await SecureStore.getItemAsync(USERNAME_KEY).then((result) => {
      setUserName(result!);
    });
    await getFriend();
  };

  useEffect(() => {
    initialize();
    socket?.on("error-msg", (errorMessage) => {
      return Alert.alert("Error", errorMessage);
    });
    socket?.on(
      "add-friend-cli",
      ({ user, friend }: { user: ProfileWithImg; friend: ProfileWithImg }) => {
        if (user.username == userName || friend.username == userName) {
          setFetching(true);
          getFriend();
          setFetching(false);
        }
      }
    );

    socket?.on(
      "remove-friend-cli",
      ({ user, friend }: { user: string; friend: string }) => {
        if (user == userName || friend == userName) {
          getFriend();
        }
      }
    );

    return () => {
      socket?.off("error-msg");
      socket?.off("add-friend-cli");
      socket?.off("remove-friend-cli");
    };
  }, [userName]);

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
                          <RequestPendingBox
                            key={profile.id}
                            userId={profile.id}
                            username={profile.username}
                            showname={profile.showname}
                            profileImg={profile.profileImg}
                            setFetching={setFetching}
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
                          <WaitingReplyBox
                            key={profile.id}
                            userId={profile.id}
                            username={profile.username}
                            showname={profile.showname}
                            profileImg={profile.profileImg}
                            setFetching={setFetching}
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
                  <PendingHeaderBox
                    sectionTitle="Friend List"
                    show={friendListShow}
                    setShow={setFriendListShow}
                  />
                  {!friendListShow ? (
                    <></>
                  ) : (
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
                  )}
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
