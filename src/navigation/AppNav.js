import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

import Session from '../screens/Session/Session';

import AuthStack from './AuthStack';
import { HomeStack, CommunityStack, ProfileStack } from './MainStack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/** bottom tab navigator of main screens */
const HomeTabs = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.text,
          paddingTop: 6,
        },
        // set the icon for each tab
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'HomeTab':
              iconName = 'home';
              color = focused ? theme.text : theme.navInactive;
              break;
            case 'SessionTab':
              iconName = 'bulb1';
              color = focused ? theme.text : theme.navInactive;
              break;
            case 'CommunityTab':
              iconName = 'earth';
              color = focused ? theme.text : theme.navInactive;
              break;
            case 'ProfileTab':
              iconName = 'user';
              color = focused ? theme.text : theme.navInactive;
              break;
            default:
              break;
          }
          return <AntDesign name={iconName} size={size} color={color} />;
        },
        // text label color
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.navInactive,
        // set the label for each tab
        tabBarLabel: ({ color }) => {
          let labelName;
          switch (route.name) {
            case 'HomeTab':
              labelName = 'Home';
              break;
            case 'SessionTab':
              labelName = 'Session';
              break;
            case 'CommunityTab':
              labelName = 'Community';
              break;
            case 'ProfileTab':
              labelName = 'Profile';
              break;
            default:
              break;
          }
          return (
            <Text
              style={{
                color: color,
                fontSize: 11,
                fontFamily: 'Inter-Medium',
              }}>
              {labelName}
            </Text>
          );
        },
      })}>
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="SessionTab" component={Session} />
      <Tab.Screen name="CommunityTab" component={CommunityStack} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} />
    </Tab.Navigator>
  );
};

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
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
