import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bg_DarkColor, windowHeight, windowWidth } from '../../constants/cssConst';
import { AppParamList } from '../../types/navigations';
import { UserInfoScreenProps } from '../../types/screenProps';
import { StackActions } from '@react-navigation/native';

type CustomHeader = {
  userName: string;
  logoutFunc: () => void;
}

const CustomHeader: React.FC<CustomHeader> = ({ userName, logoutFunc }) => {
  return (
    <View style={styles.customHeader}>
      <View style={styles.slideNavigatorContainer}></View>
      <View style={styles.titleContainer}><Text>{userName}</Text></View>
      <View style={styles.slideNavigatorContainer}>
        <TouchableOpacity onPress={() => logoutFunc()}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
const ProfileScreen: React.FC<UserInfoScreenProps> = ({ }) => {
  const navigation = useNavigation<NativeStackNavigationProp<AppParamList>>();
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <CustomHeader userName="Bryan" logoutFunc={() => navigation.navigate("RootNavigation")} /> */}
      <CustomHeader userName="Bryan" logoutFunc={() => navigation.dispatch(StackActions.popToTop())} />
      <View style={styles.bodyContainer}>
        <Text style={{ color: bg_DarkColor }}>UserInfo Screen</Text>
      </View>
    </SafeAreaView>
  );
}
export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",

  },
  customHeader: {
    flexDirection: 'row',
    height: windowHeight * 0.1,
    borderWidth: 1,
    borderColor: 'red',
  },
  titleContainer: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  slideNavigatorContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "blue",
    alignItems: "center",
    justifyContent: "center",

  },
  bodyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }
})