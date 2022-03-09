import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
//import navigations
import AuthNavigation from '../navigations/AuthNavigation';

const RootRouter: React.FC = () => {
  return (
    <NavigationContainer>
      <AuthNavigation />
    </NavigationContainer>
  );
}
export default RootRouter;