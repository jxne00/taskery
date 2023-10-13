import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Auth/Login';
import Register from '../screens/Auth/Register';
import Onboarding from '../screens/Auth/Onboarding';

const Stack = createStackNavigator();

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
