import React from 'react'
import { Dimensions, Image, ImageBackground, StyleSheet, View } from 'react-native'
import bgImage from '../../assets/images/Login_Page_Image.jpg';

const LoginCard: React.FC = () => {
  return (
    <ImageBackground source={bgImage} style={styles.bgImageStyle}>
      <View style={styles.backgroundContainer}>

        <View style={styles.cutterContainer}>
          <Image source={bgImage} resizeMethod="auto" style={styles.topCuttingContainer} ></Image >
        </View>
        <View style={styles.mainContainer}>

        </View>
        <View style={styles.cutterContainer}>
          <Image source={bgImage} resizeMethod="auto" style={styles.bottomCuttingConatiner} ></Image >
        </View>
      </View>
    </ImageBackground>
  )
}

export default LoginCard

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const radiusParam = windowWidth * 0.15;
const cardColor = "#99E";
const styles = StyleSheet.create({
  bgImageStyle: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
  },
  backgroundContainer: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cutterContainer: {
    width: windowWidth,
    height: windowHeight * 0.2,
    backgroundColor: cardColor,
  },
  topCuttingContainer: {
    width: windowWidth,
    height: windowHeight * 0.2,
    borderBottomLeftRadius: radiusParam,
  },
  mainContainer: {
    width: windowWidth,
    height: windowHeight * 0.6,
    borderTopRightRadius: radiusParam,
    borderBottomLeftRadius: radiusParam,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cardColor,
  },
  bottomCuttingConatiner: {
    width: windowWidth,
    height: windowHeight * 0.2,
    flexDirection: 'row',
    borderTopRightRadius: radiusParam,
  }
})