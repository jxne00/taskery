import { createStackNavigator } from '@react-navigation/stack';
import { MenuProvider } from 'react-native-popup-menu';

import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Community from '../screens/Community';

import Settings from '../screens/Settings';

const StackH = createStackNavigator();
const StackP = createStackNavigator();
const StackC = createStackNavigator();

const HomeStack = () => {
  return (
    <MenuProvider>
      <StackH.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false, // prevent swipe to go back
        }}>
        <StackH.Screen name="Home" component={Home} />
      </StackH.Navigator>
    </MenuProvider>
  );
};

const CommunityStack = () => {
  return (
    <StackC.Navigator
      initialRouteName="Community"
      screenOptions={{
        headerShown: false,
      }}>
      <StackC.Screen name="Community" component={Community} />
    </StackC.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <StackP.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false,
      }}>
      <StackP.Screen name="Profile" component={Profile} />
      <StackP.Screen name="Settings" component={Settings} />
    </StackP.Navigator>
  );
};

export { HomeStack, CommunityStack, ProfileStack };
