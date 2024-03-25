import React from 'react';
import { View, Platform, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStack } from './StackNavigator';
import BottomTabNav from './BottomTabNav';

const Stack = createStackNavigator();

/**
 * Add padding to the top of the app for android devices
 * to avoid status bar overlapping the screen content
 */
const androidPadding = (Component) => (props) => {
    if (Platform.OS === 'android') {
        return (
            <View style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
                <Component {...props} />
            </View>
        );
    }

    return <Component {...props} />;
};

const PaddedContainer = androidPadding(NavigationContainer);

/**
 * The main navigator for the app containing auth and home stacks
 */
const AppNavigator = () => {
    return (
        <PaddedContainer>
            <Stack.Navigator
                initialRouteName="AuthStack"
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: false, // prevent swipe to go back
                }}>
                <Stack.Screen name="AuthStack" component={AuthStack} />
                <Stack.Screen name="HomeTabs" component={BottomTabNav} />
            </Stack.Navigator>
        </PaddedContainer>
    );
};

export default AppNavigator;
