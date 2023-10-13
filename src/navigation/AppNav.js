import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';

import AuthStack from './AuthStack';
import { HomeStack, CommunityStack, ProfileStack } from './MainStack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'HomeTab':
              iconName = 'home';
              break;
            case 'CommunityTab':
              iconName = 'earth';
              break;
            case 'ProfileTab':
              iconName = 'user';
              break;
            default:
              break;
          }
          return <AntDesign name={iconName} size={size} color={color} />;
        },
        tabBarLabel: ({ color }) => {
          let labelName;
          switch (route.name) {
            case 'HomeTab':
              labelName = 'Home';
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
            <Text style={{ color: color, fontSize: 10 }}>{labelName}</Text>
          );
        },
      })}>
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="CommunityTab" component={CommunityStack} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AuthStack"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="AuthStack" component={AuthStack} />
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
