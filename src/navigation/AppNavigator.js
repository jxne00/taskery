import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthStack } from './StackNavigator';
import BottomTabNav from './BottomTabNav';

const Stack = createStackNavigator();

/**
 * The main navigator for the app containing auth and home stacks
 */
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
