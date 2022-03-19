import React from 'react'
import { View, ActivityIndicator } from 'react-native';
import { bg_DarkColor } from '../../constants/cssConst';
interface LoadingSpinnerProps {

}
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ }) => {
  return (
    <View style={{ flex: 1, backgroundColor: bg_DarkColor, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size='large' color="#FFFFFF" />
    </View>
  );
}
export default LoadingSpinner;