import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ErrorMessage from '../../components/ErrorMsg';
import CustomStatusBar from '../../components/StatusBar';

import { useTheme } from '../../hooks/useThemeContext';
import useThemeStyles from '../../hooks/useThemeStyles';
import useFetchUser from '../../hooks/useFetchUser';
import useFetchTasks from '../../hooks/useFetchTasks';

import { auth } from '../../services/firebase';

/**
 * The profile screen displaying user's profile info and posts.
 */
const Profile = ({ navigation }) => {
    const { theme } = useTheme();
    const themed = useThemeStyles();
    const userId = auth.currentUser?.uid;

    const [avatarLoading, setAvatarLoading] = useState(true);

    // get profile data from redux store
    const { user, ProfileIsLoading, userError } = useFetchUser();

    // get user's tasks
    const { tasks, tasksLoading, tasksError } = useFetchTasks('all', 'asc', true);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const completionRate = ((completedTasks / totalTasks) * 100).toFixed(2);

    return (
        <SafeAreaView style={themed.container}>
            <View style={[themed.container, styles.container]}>
                {/* show loading until avatar image is loaded */}
                {avatarLoading && (
                    <ActivityIndicator
                        size="small"
                        color={theme.text}
                        style={{ paddingTop: 20 }}
                    />
                )}

                {/* avatar image */}
                <Image
                    source={{ uri: user?.avatar_path }}
                    style={[
                        styles.avatar,
                        !user.avatar_path && {
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        },
                    ]}
                    onLoadStart={() => setAvatarLoading(true)}
                    onLoadEnd={() => setAvatarLoading(false)}
                />

                {/* settings */}
                <Ionicons
                    name="settings-outline"
                    size={28}
                    style={styles.settingsIcon}
                    color={theme.text}
                    onPress={() =>
                        navigation.navigate('Settings', {
                            is_public: user.is_public,
                            userId,
                        })
                    }
                />

                {/* show loading while fetching profile info */}
                {ProfileIsLoading && (
                    <ActivityIndicator
                        size="large"
                        color={theme.text}
                        style={{ paddingTop: 20 }}
                    />
                )}

                {userError && <ErrorMessage errorMsg="Error loading profile!" />}

                {/* if user is loaded */}
                <View style={themed.row}>
                    <Text style={[themed.textSemibold, styles.profileName]}>
                        {user.name}
                    </Text>

                    <Ionicons
                        name="create-outline"
                        size={28}
                        color={theme.text}
                        onPress={() =>
                            navigation.navigate('EditProfile', {
                                user: user,
                                userId: userId,
                            })
                        }
                    />
                </View>

                {/* profile visibility */}
                <View style={[styles.visContainer, { borderColor: theme.textLight }]}>
                    <Ionicons
                        name={user?.is_public ? 'md-lock-open' : 'md-lock-closed'}
                        size={16}
                        color={theme.textLight}
                    />
                    <Text style={[styles.visText, { color: theme.text }]}>
                        {user?.is_public ? 'Public' : 'Private'}
                    </Text>
                </View>

                <View
                    style={[
                        styles.horizontalLine,
                        { backgroundColor: theme.textLight },
                    ]}
                />

                {/* show loading while fetching tasks */}
                {tasksLoading && (
                    <ActivityIndicator
                        size="large"
                        color={theme.text}
                        style={{ paddingTop: 20 }}
                    />
                )}

                {tasksError && <ErrorMessage errorMsg="Error loading tasks!" />}

                {/* if tasks are loaded */}
                {tasks && (
                    <View style={styles.statsContainer}>
                        <Text style={[themed.textBold, styles.statTitle]}>
                            Statistics
                        </Text>

                        <View
                            style={[styles.statBox, { borderColor: theme.textLight }]}>
                            <Text style={[themed.textSemibold, { fontSize: 18 }]}>
                                Total Tasks Created
                            </Text>
                            <Text style={themed.textRegular}>{totalTasks}</Text>
                        </View>

                        <View
                            style={[styles.statBox, { borderColor: theme.textLight }]}>
                            <Text style={[themed.textSemibold, { fontSize: 18 }]}>
                                Completed
                            </Text>
                            <Text style={themed.textRegular}>{completionRate}%</Text>
                        </View>
                    </View>
                )}

                <CustomStatusBar />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    settingsIcon: {
        position: 'absolute',
        top: 10,
        right: 15,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 80,
        margin: 10,
    },
    profileName: {
        fontSize: 30,
        paddingRight: 5,
    },
    visContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 10,
        marginTop: 10,
    },
    visText: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        marginLeft: 5,
    },

    horizontalLine: {
        width: '98%',
        height: 1,
        marginTop: 20,
    },

    // stats
    statsContainer: {
        width: '100%',
        paddingHorizontal: 20,
    },
    statTitle: {
        fontSize: 22,
        marginTop: 20,
    },

    statBox: {
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        marginVertical: 10,
        borderRadius: 8,
    },
});

export default Profile;
