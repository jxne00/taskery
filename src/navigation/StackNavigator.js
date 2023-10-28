import { SafeAreaView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { MenuProvider } from 'react-native-popup-menu';

import { useTheme } from '../theme/ThemeContext';
import CustomStatusBar from '../components/StatusBar';

// auth screens
import Login from '../screens/LoginScreen';
import Register from '../screens/LoginScreen/Register';
import Onboarding from '../screens/LoginScreen/Onboarding';

// main screens
import Home from '../screens/HomeScreen';
import Profile from '../screens/ProfileScreen';
import Community from '../screens/CommunityScreen';
import Settings from '../screens/ProfileScreen/Settings';

const StackA = createStackNavigator();
const StackH = createStackNavigator();
const StackP = createStackNavigator();
const StackC = createStackNavigator();

/**
 * navigation stack for auth screens (Login, Register, Onboarding)
 */
const AuthStack = () => {
  return (
    <StackA.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // prevent swipe to go back
      }}>
      <StackA.Screen name="Login" component={Login} />
      <StackA.Screen name="Register" component={Register} />
      <StackA.Screen name="Onboarding" component={Onboarding} />
    </StackA.Navigator>
  );
};

/** navigation stack for home screen */
const HomeStack = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
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
      <CustomStatusBar />
    </SafeAreaView>
  );
};

/** navigation stack for community screen */
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

/** navigation stack for profile screen */
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

export { AuthStack, HomeStack, CommunityStack, ProfileStack };
