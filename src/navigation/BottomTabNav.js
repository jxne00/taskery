import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useThemeContext';
import { HomeStack, CommunityStack, ProfileStack } from './StackNavigator';

const Tab = createBottomTabNavigator();

/**
 * The bottom tab navigator for the app
 * containing home, community and profile tabs
 */
const BottomTabNav = () => {
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
                        case 'CommunityTab':
                            iconName = 'people';
                            color = focused ? theme.text : theme.navInactive;
                            break;
                        case 'ProfileTab':
                            iconName = 'md-person-circle-outline';
                            color = focused ? theme.text : theme.navInactive;
                            break;
                        default:
                            break;
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
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
            <Tab.Screen name="CommunityTab" component={CommunityStack} />
            <Tab.Screen name="ProfileTab" component={ProfileStack} />
        </Tab.Navigator>
    );
};

export default BottomTabNav;
