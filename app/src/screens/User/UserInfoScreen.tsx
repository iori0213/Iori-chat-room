import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bg_DarkColor } from '../../constants/cssConst';
import { UserInfoScreenProps } from '../../types/screenProps';

const UserInfoScreen: React.FC<UserInfoScreenProps> = ({ }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={{ color: "#FFF" }}>UserInfo Screen</Text>
    </SafeAreaView>
  );
}
export default UserInfoScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: bg_DarkColor,
    alignItems: "center",
    justifyContent: "center",
  }
})