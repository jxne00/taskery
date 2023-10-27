import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthStack } from './StackNavigator';
import BottomTabNav from './BottomTabNav';

const Stack = createStackNavigator();

/** the main navigator of the app */
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AuthStack"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false, // prevent swipe to go back
        }}>
        <Stack.Screen name="AuthStack" component={AuthStack} />
        <Stack.Screen name="HomeTabs" component={BottomTabNav} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
