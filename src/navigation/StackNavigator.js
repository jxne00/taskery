import { SafeAreaView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { MenuProvider } from 'react-native-popup-menu';
import { useTheme } from '../hooks/useThemeContext';
import CustomStatusBar from '../components/UI/StatusBar';
// auth screens
import Login from '../screens/Login';
import Register from '../screens/Register';
import Onboarding from '../components/Onboarding';
// main screens and components
import Home from '../screens/Home';
import CalendarView from '../components/Home/Calendar';
import Profile from '../screens/Profile';
import EditProfile from '../components/Profile/EditProfile';
import Settings from '../components/Profile/Settings';
import About from '../components/Profile/About';
import Community from '../screens/Community';
import CreatePost from '../components/Community/CreatePost';
import PostDetail from '../components/Community/PostDetail';

const StackA = createStackNavigator();
const StackH = createStackNavigator();
const StackP = createStackNavigator();
const StackC = createStackNavigator();

/**
 * Navigation stack for auth screen components.
 * Includes: Login, Register, Onboarding
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

/**
 * Navigation stack for home screen components.
 * Includes: Home, Calendar
 */
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
                    <StackH.Screen name="Calendar" component={CalendarView} />
                </StackH.Navigator>
            </MenuProvider>
            <CustomStatusBar />
        </SafeAreaView>
    );
};

/**
 * Navigation stack for community screen components.
 * Includes: Community, CreatePost, PostDetail
 */
const CommunityStack = () => {
    return (
        <StackC.Navigator
            initialRouteName="Community"
            screenOptions={{
                headerShown: false,
            }}>
            <StackC.Screen name="Community" component={Community} />
            <StackC.Screen name="CreatePost" component={CreatePost} />
            <StackC.Screen name="PostDetail" component={PostDetail} />
        </StackC.Navigator>
    );
};

/**
 * Navigation stack for profile screen components.
 * Includes: Profile, EditProfile, Settings, About
 */
const ProfileStack = () => {
    return (
        <StackP.Navigator
            initialRouteName="Profile"
            screenOptions={{
                headerShown: false,
            }}>
            <StackP.Screen name="Profile" component={Profile} />
            <StackP.Screen name="EditProfile" component={EditProfile} />
            <StackP.Screen name="Settings" component={Settings} />
            <StackP.Screen name="About" component={About} />
        </StackP.Navigator>
    );
};

export { AuthStack, HomeStack, CommunityStack, ProfileStack };
