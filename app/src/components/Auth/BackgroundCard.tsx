import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { windowHeight, windowWidth } from '../../constants/cssConst'


const BackgroundCard: React.FC = () => {

  return (
    <View style={styles.backgroundContainer}>
      <View style={styles.topContainer}>
        <View style={styles.cuttingTopContainer}>
          <Text style={styles.welcomeContainer}>Welcome back!</Text>
        </View>
      </View>
      <View style={styles.mainContainer}></View>
      <View style={styles.cuttingBottomContainer}></View>
    </View >
  )
}

export default BackgroundCard

const cornerRadius = windowWidth * 0.13;

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#171535',
  },
  topContainer: {
    width: windowWidth,
    height: windowHeight * 0.2,
    backgroundColor: "#45c1b9",
  },
  cuttingTopContainer: {
    width: windowWidth,
    height: windowHeight * 0.2,
    backgroundColor: "#171535",
    borderBottomRightRadius: cornerRadius,
  },
  welcomeContainer: {
    paddingLeft: windowWidth * 0.2,
    paddingTop: windowHeight * 0.1,
    color: "#FFF",
    fontFamily: "Roboto_Regular",
    fontSize: 30
  },
  cuttingBottomContainer: {
    width: windowWidth,
    height: windowHeight * 0.3,
    backgroundColor: "#171535",
  },
  mainContainer: {
    width: windowWidth,
    height: windowHeight * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#45c1b9",
    borderTopLeftRadius: cornerRadius,
    borderBottomRightRadius: cornerRadius,
    borderBottomLeftRadius: cornerRadius,
  }
})