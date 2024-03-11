import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useThemeContext';
import useThemeStyles from '../../hooks/useThemeStyles';
import useFetchUser from '../../hooks/useFetchUser';
import useFetchTasks from '../../hooks/useFetchTasks';
import ErrorMessage from '../../components/UI/ErrorMsg';
import CustomStatusBar from '../../components/UI/StatusBar';
import { auth } from '../../services/firebase';
import styles from './styles';

/**
 * The profile screen displaying user's profile information
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

    // calculate total tasks and completion rate
    let totalTasks = 0;
    let completedTasks = 0;
    let completionRate = 0;

    if (tasks) {
        totalTasks = tasks.length;
        completedTasks = tasks.filter((task) => task.is_complete).length;
        completionRate = Math.round((completedTasks / totalTasks) * 100);
    }

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
                            style={[
                                styles.statBox,
                                {
                                    borderColor: theme.textLight,
                                    backgroundColor: theme.background,
                                },
                            ]}>
                            <Text style={[themed.textSemibold, { fontSize: 18 }]}>
                                Total Tasks Created
                            </Text>
                            <Text style={[themed.textRegular, { fontSize: 18 }]}>
                                {totalTasks > 0 ? totalTasks : '0'}
                            </Text>
                        </View>

                        <View
                            style={[
                                styles.statBox,
                                {
                                    borderColor: theme.textLight,
                                    backgroundColor: theme.background,
                                },
                            ]}>
                            <Text style={[themed.textSemibold, { fontSize: 18 }]}>
                                Completed
                            </Text>
                            <Text style={[themed.textRegular, { fontSize: 18 }]}>
                                {completedTasks} (
                                {completionRate > 0 ? completionRate : '0'}%)
                            </Text>
                        </View>
                    </View>
                )}

                <CustomStatusBar />
            </View>
        </SafeAreaView>
    );
};

export default Profile;
