import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login';
import Register from '../screens/Register';
import Onboarding from '../screens/Onboarding';

const Stack = createStackNavigator();

/**
 * navigation stack for auth related screens
 * (Login, Register, Onboarding)
 */
const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // prevent swipe to go back
      }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
    </Stack.Navigator>
  );
};

export default AuthStack;
