import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
} from "react-native";
import React, { createRef, useEffect, useState } from "react";
import {
  bg_DarkColor,
  bg_LessDarkColor,
  bg_LightColor,
  windowHeight,
  windowWidth,
} from "../../../constants/cssConst";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import LoadingSpinner from "../../../components/Auth/LoadingSpinner";
import * as SecureStore from "expo-secure-store";
import { ACCESS_KEY } from "../../../constants/securestoreKey";
import axios from "axios";
import { UserAPI } from "../../../constants/backendAPI";
import {
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { HomeStackNavigationProps } from "../../../types/navigations";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import Modal from "react-native-modal";

import * as ImagePicker from "expo-image-picker";
import * as NavigationBar from "expo-navigation-bar";

type Props = NativeStackScreenProps<
  HomeStackNavigationProps,
  "EditProfileScreen"
>;

const EditProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const { img, username, showname, email } = route.params;

  const [fetching, setFetching] = useState(true);

  //edit state
  const [editEmail, setEditEmail] = useState(email);
  const [editUniquename, setEditUniquename] = useState(username);
  const [editShowname, setEditShowname] = useState(showname);
  const shownameInput = createRef<TextInput>();
  const [editAvatarImg, setEditAvatarImg] = useState(img);

  //Bottom Sheet
  const [bottomModalShow, setBottomModalShow] = useState(false);

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      return Alert.alert("Error", "Permission to access Camera is required!");
    }
    setBottomModalShow(false);
    const pickerResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.1,
    });

    //if canceled
    if (pickerResult.cancelled === true) {
      return;
    }
    setEditAvatarImg(pickerResult.base64 ? pickerResult.base64 : "");
  };

  const selectImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      return Alert.alert("Error", "Permission to access Library is required!");
    }
    setBottomModalShow(false);
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.1,
    });

    //if canceled
    if (pickerResult.cancelled === true) {
      return;
    }
    setEditAvatarImg(pickerResult.base64 ? pickerResult.base64 : "");
  };

  //update function
  const update = async () => {
    setFetching(true);
    const localAccessToken = await SecureStore.getItemAsync(ACCESS_KEY);
    if (editShowname == "") {
      return Alert.alert("Error", "Show Name can not be empty!");
    }
    if (editAvatarImg != img) {
      axios({
        method: "post",
        url: `${UserAPI}/update`,
        headers: { Authorization: `Bearer ${localAccessToken}` },
        data: { showname: editShowname, profileImg: editAvatarImg },
      })
        .then((res) => {
          setFetching(false);
          return Alert.alert("Success", "Update process complete.", [
            { text: "OK", onPress: () => navigation.pop() },
          ]);
        })
        .catch((e) => {
          return Alert.alert("Error", e.response.data.message);
        });
    } else {
      axios({
        method: "post",
        url: `${UserAPI}/update`,
        headers: { Authorization: `Bearer ${localAccessToken}` },
        data: { showname: editShowname, profileImg: "" },
      })
        .then((res) => {
          setFetching(false);
          return Alert.alert("Success", "Update process complete.", [
            { text: "OK", onPress: () => navigation.pop() },
          ]);
        })
        .catch((e) => {
          return Alert.alert("Error", e.response.data.message);
        });
    }
  };

  //loading process
  const loading = async () => {
    setFetching(false);
  };

  useEffect(() => {
    loading();
    return () => {};
  }, []);

  //Bottom Sheet Component
  const ModalConent: React.FC = () => {
    return (
      <View style={styles.bsBody}>
        <View style={styles.headerHandler}></View>
        <Text style={styles.bsTitle}>Upload Photo</Text>
        <Text style={styles.bsSubTitle}>Choose Your Profile Photo</Text>
        <TouchableOpacity
          onPress={() => takePhoto()}
          style={[styles.bsBtn, { backgroundColor: bg_LessDarkColor }]}
        >
          <Text style={styles.bgBtnText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => selectImage()}
          style={[styles.bsBtn, { backgroundColor: bg_LessDarkColor }]}
        >
          <Text style={styles.bgBtnText}>Choose From Library</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setBottomModalShow(false)}
          style={[styles.bsBtn, { backgroundColor: "lightcoral" }]}
        >
          <Text style={styles.bgBtnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (Platform.OS === "android") {
    NavigationBar.setBackgroundColorAsync(bg_LightColor);
  }

  return (
    <SafeAreaProvider>
      {Platform.OS === "ios" ? (
        <SafeAreaView style={{ flex: 0, backgroundColor: bg_LessDarkColor }} />
      ) : null}
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          backgroundColor={bg_LessDarkColor}
          barStyle="light-content"
        />
        <View style={styles.background}>
          {/* header =====================================================================================================*/}
          <View style={styles.customHeader}>
            <View style={styles.slideNavigatorContainer}>
              <TouchableOpacity onPress={() => navigation.pop()}>
                <Ionicons
                  name="arrow-back"
                  size={windowWidth * 0.08}
                  color="#FFF"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.titleStyle}>Edit Profile</Text>
            </View>
            <View style={styles.slideNavigatorContainer}>
              <TouchableOpacity onPress={() => update()}>
                <Ionicons
                  name="md-save-sharp"
                  size={windowWidth * 0.09}
                  color="#FFF"
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* body ======================================================================================================*/}
          {fetching ? (
            <LoadingSpinner />
          ) : (
            <View style={styles.body}>
              <TouchableOpacity
                style={styles.AvatarContainer}
                onPress={() => setBottomModalShow(true)}
              >
                {editAvatarImg == "" ? (
                  <View
                    style={[
                      styles.avatarImg,
                      { backgroundColor: bg_LessDarkColor },
                    ]}
                  >
                    <View style={styles.cameraIconContainer}>
                      <View style={styles.cameraIconBorder}>
                        <Entypo
                          name="camera"
                          size={windowHeight * 0.05}
                          color="#FFF"
                          style={styles.cameraIcon}
                        />
                      </View>
                    </View>
                  </View>
                ) : (
                  <ImageBackground
                    source={{ uri: "data:image/jpeg;base64," + editAvatarImg }}
                    style={styles.avatarImg}
                    imageStyle={styles.avatarImg}
                  >
                    <View style={styles.cameraIconContainer}>
                      <MaterialCommunityIcons
                        name="camera"
                        size={windowHeight * 0.05}
                        color="#FFF"
                        style={styles.cameraIcon}
                      />
                    </View>
                  </ImageBackground>
                )}
              </TouchableOpacity>
              <View style={styles.infoList}>
                {/* show name ========================================================================================== */}
                <View style={styles.infoBoxContainer}>
                  <View style={styles.infoTypeContainer}>
                    <Text style={styles.infoTypeText}>Show Name</Text>
                  </View>
                  <View style={styles.inputContainer}>
                    <TouchableOpacity
                      style={styles.editPenIcon}
                      onPress={() => shownameInput.current?.focus()}
                    >
                      <Feather
                        name="edit"
                        size={windowHeight * 0.032}
                        color="#FFF"
                      />
                    </TouchableOpacity>
                    <TextInput
                      ref={shownameInput}
                      onChangeText={(val) => setEditShowname(val)}
                      value={editShowname}
                      autoCapitalize="none"
                      style={styles.showNameInput}
                    />
                  </View>
                </View>
                {/* show name ========================================================================================== */}
                <InfoBox infoType="Unique Name" info={editUniquename} />
                <InfoBox infoType="Email" info={email} />
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
      {bottomModalShow ? (
        <Modal
          children={<ModalConent />}
          isVisible={bottomModalShow}
          style={{
            margin: 0,
            justifyContent: "flex-end",
          }}
          onBackdropPress={() => setBottomModalShow(false)}
          onSwipeCancel={() => setBottomModalShow(false)}
          swipeDirection="down"
        />
      ) : (
        <></>
      )}
    </SafeAreaProvider>
  );
};

type InfoContainerProps = {
  infoType: string;
  info: string;
};
const InfoBox: React.FC<InfoContainerProps> = ({ infoType, info }) => {
  return (
    <View style={styles.infoBoxContainer}>
      <View style={styles.infoTypeContainer}>
        <Text style={styles.infoTypeText}>{infoType}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{info}</Text>
      </View>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: bg_DarkColor,
  },
  background: {
    flex: 1,
    backgroundColor: bg_DarkColor,
    alignItems: "center",
  },
  body: {
    flex: 1,
    alignItems: "center",
  },
  //ProfileHeader===================
  customHeader: {
    flexDirection: "row",
    height: windowHeight * 0.08,
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
    flex: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  //================================
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  editPenIcon: {
    marginLeft: windowWidth * 0.05,
  },
  showNameInput: {
    width: windowWidth * 0.35,
    height: windowHeight * 0.032,
    borderRadius: (windowHeight * 0.032) / 2,
    backgroundColor: bg_LessDarkColor,
    color: "#FFF",
    fontSize: windowHeight * 0.02,
    marginLeft: windowWidth * 0.01,
    paddingHorizontal: windowWidth * 0.025,
  },

  //InfoBox=========================
  infoBoxContainer: {
    // marginTop: windowHeight * 0.02,
    width: windowWidth,
    height: windowHeight * 0.08,
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: bg_LessDarkColor,
  },
  infoTypeContainer: {
    flex: 1,
    borderRightWidth: 2,
    borderRightColor: bg_LessDarkColor,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  infoTypeText: {
    color: "#FFF",
    fontSize: windowHeight * 0.02,
    marginLeft: windowWidth * 0.1,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  infoText: {
    color: "#FFF",
    fontSize: windowHeight * 0.02,
    marginLeft: windowWidth * 0.05,
  },
  //================================

  AvatarContainer: {
    marginTop: windowHeight * 0.05,
    marginBottom: windowHeight * 0.02,
    height: windowWidth * 0.4,
    width: windowWidth * 0.4,
    borderRadius: windowWidth * 0.2,
    overflow: "hidden",
  },
  avatarImg: {
    height: windowWidth * 0.4,
    width: windowWidth * 0.4,
    borderRadius: windowWidth * 0.2,
    resizeMode: "contain",
  },
  cameraIconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraIconBorder: {
    alignItems: "center",
    justifyContent: "center",
    height: windowHeight * 0.07,
    width: windowHeight * 0.07,
    borderWidth: 2,
    borderColor: "#FFF",
    borderRadius: (windowHeight * 0.07) / 6,
  },
  cameraIcon: {
    opacity: 0.9,
  },
  infoList: {
    width: windowWidth,
    borderTopWidth: 2,
    borderTopColor: bg_LessDarkColor,
  },

  //Bottom Sheet
  headerHandler: {
    width: windowWidth * 0.3,
    height: windowHeight * 0.015,
    borderRadius: windowHeight * 0.0075,
    backgroundColor: "#AAA",
  },
  bsBody: {
    flex: 0.4,
    width: windowWidth,
    height: windowHeight * 0.4,
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingTop: windowHeight * 0.01,
  },
  bsTitle: {
    fontSize: windowHeight * 0.03,
    color: bg_DarkColor,
    marginTop: windowHeight * 0.02,
  },
  bsSubTitle: {
    fontSize: windowHeight * 0.015,
    color: "#999",
    marginBottom: windowHeight * 0.01,
  },
  bsBtn: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.065,
    borderRadius: windowHeight * 0.02,
    marginTop: windowHeight * 0.017,
    alignItems: "center",
    justifyContent: "center",
  },
  bgBtnText: {
    color: "#FFF",
    fontSize: windowWidth * 0.06,
  },
});
