import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import ErrorMessage from '../../components/ErrorMsg';
import CustomStatusBar from '../../components/StatusBar';

import { useTheme } from '../../hooks/useThemeContext';
import useGlobalStyles from '../../hooks/useGlobalStyles';
import useFetchUser from '../../hooks/useFetchUser';
import { auth } from '../../services/firebase';
import { fetchUserPosts } from '../../services/redux/postSlice';

import PostsList from './PostsList';

/**
 * The profile screen displaying user's profile info and posts.
 */
const Profile = ({ navigation }) => {
    const { theme } = useTheme();
    const global = useGlobalStyles();
    const dispatch = useDispatch();
    const userId = auth.currentUser?.uid;

    const [avatarLoading, setAvatarLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // get profile data from redux store
    const { user, ProfileIsLoading, userError } = useFetchUser();

    // fetch user's posts from firestore
    const userPosts = useSelector((state) => state.posts.userPosts);
    const postsLoading = useSelector((state) => state.posts.loading.userPosts);
    const postsError = useSelector((state) => state.posts.error);

    useEffect(() => {
        dispatch(fetchUserPosts(userId));
    }, [dispatch, userId]);

    // refetch posts on refresh
    const handleRefresh = () => {
        setRefreshing(true);
        dispatch(fetchUserPosts(userId));
        setRefreshing(false);
    };

    return (
        <SafeAreaView style={global.container}>
            <View style={[global.container, styles.container]}>
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
                <View style={global.row}>
                    <Text style={[global.text, styles.profileName]}>{user.name}</Text>

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

                {postsError && <ErrorMessage errorMsg="Error loading posts!" />}

                {postsLoading ? (
                    // show loading while fetching posts
                    <ActivityIndicator
                        size="small"
                        color={theme.text}
                        style={{ paddingTop: 20 }}
                    />
                ) : (
                    // list of user's posts
                    <PostsList
                        data={userPosts}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                )}

                {/* if 0 posts */}
                {!postsLoading &&
                    userPosts.length === 0 &&
                    !postsError &&
                    !refreshing && (
                        <Text style={theme.textLight}>You have no posts yet.</Text>
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
        fontFamily: 'Inter-Bold',
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
        marginTop: 10,
    },
});

export default Profile;
