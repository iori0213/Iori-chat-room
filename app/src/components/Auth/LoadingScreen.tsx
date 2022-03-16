import React from 'react'
import { View, ActivityIndicator, Text } from 'react-native';
import { bg_DarkColor, windowHeight, windowWidth } from '../../constants/cssConst';

interface LoadingComponentProps {

}

const LoadingScreen: React.FC<LoadingComponentProps> = ({ }) => {
  return (
    <View style={{ flex: 1, backgroundColor: bg_DarkColor, alignItems: "center", justifyContent: "center" }}>
      {/* App name */}
      <Text style={{
        color: "#FFF",
        fontFamily: "MajorMonoDisplay",
        fontSize: windowWidth * 0.2,
      }}>cHAt RooMs</Text>
      {/* Sub title */}
      <Text style={{
        color: "#FFF",
        fontFamily: "MajorMonoDisplay",
        fontSize: windowWidth * 0.08,
        marginTop: windowHeight * 0.05,
        marginLeft: windowWidth * 0.3,
      }}>bY ioRi</Text>
    </View>
  );
}
export default LoadingScreen;