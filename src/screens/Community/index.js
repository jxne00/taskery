import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';

import CustomStatusBar from '../../components/StatusBar';
import { useTheme } from '../../hooks/useThemeContext';
import useThemeStyles from '../../hooks/useThemeStyles';
import CommentsModal from '../../components/Modals/CommentsModal';

import {
    fetchAllPosts,
    deletePost,
    toggleLike,
    addComment,
    deleteComment,
} from '../../services/redux/postSlice';
import useFetchUser from '../../hooks/useFetchUser';
import { timeSinceDate } from '../../components/timeConverters';

/** The community screen that shows posts shared by other uses */
const Community = ({ navigation }) => {
    const themed = useThemeStyles();
    const { theme } = useTheme();

    const dispatch = useDispatch();

    // fetch user data
    const { user, userLoading, userError } = useFetchUser();

    // retrieve posts content from redux store
    const allPosts = useSelector((state) => state.posts.allPosts);
    const postsLoading = useSelector((state) => state.posts.loading.allPosts);
    const postsError = useSelector((state) => state.posts.error);

    const likesLoading = useSelector((state) => state.posts.loading.likes);

    const [currentView, setCurrentView] = useState('allPosts'); // allPosts, myPosts

    const [refreshing, setRefreshing] = useState(false);
    const [selectedPostID, setSelectedPostID] = useState(null);
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [updatingLikes, setUpdatingLikes] = useState(false);

    useEffect(() => {
        dispatch(fetchAllPosts());
    }, [dispatch]);

    // refetch posts when screen is pulled down
    const handleRefresh = () => {
        setRefreshing(true);
        dispatch(fetchAllPosts());
        setRefreshing(false);
    };

    const handleLike = (postId, userId) => {
        setUpdatingLikes(postId);
        dispatch(toggleLike({ postId, userId })).then(() => {
            setUpdatingLikes(false);
        });
    };

    const handlePostDelete = (postId) => {
        // delete confirmation
        Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: () => {
                    dispatch(deletePost(postId));
                },
            },
        ]);
    };

    if (commentsVisible) {
        return (
            <CommentsModal
                visible={commentsVisible}
                onClose={() => {
                    setCommentsVisible(false);
                    setSelectedPostID(null);
                }}
                post={allPosts.find((post) => post.id === selectedPostID)}
                userId={user.id}
            />
        );
    }

    const renderPost = ({ item }) => {
        // check if post is by current user
        const isOwnPost = user.id === item.userId;

        const likeCount = item.likes ? item.likes.length : 0;
        const commentCount = item.comments ? item.comments.length : 0;

        let userHasLiked = false;
        if (item.likes) {
            userHasLiked = item.likes.includes(user.id);
        }

        return (
            <View style={[styles.postContainer, { borderColor: theme.textLight }]}>
                {/* go to details page on press */}
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('PostDetail', {
                            post: item,
                            user,
                        });
                    }}>
                    <Text style={themed.subHeaderText}>{item.title}</Text>

                    {item.content && (
                        <Text style={[themed.textRegular, styles.content]}>
                            {item.content}
                        </Text>
                    )}
                </TouchableOpacity>

                {/* likes and comments */}
                <View style={styles.statRow}>
                    <View style={themed.row}>
                        {/* show delete if post is by current user */}
                        {isOwnPost ? (
                            <View>
                                <AntDesign
                                    name="delete"
                                    size={20}
                                    color={theme.red}
                                    onPress={() => handlePostDelete(item.id)}
                                />
                            </View>
                        ) : (
                            <View style={themed.row}>
                                <AntDesign
                                    name="user"
                                    size={16}
                                    color={theme.text}
                                    style={{ marginRight: 3 }}
                                />
                                <Text style={themed.textRegularLight}>
                                    {item.userName}
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={themed.row}>
                        <TouchableOpacity
                            style={themed.row}
                            onPress={() => handleLike(item.id, user.id)}>
                            {likesLoading && updatingLikes === item.id ? (
                                <ActivityIndicator size="small" color={theme.text} />
                            ) : (
                                <>
                                    {userHasLiked ? (
                                        <AntDesign
                                            name="heart"
                                            size={20}
                                            color={theme.red}
                                            style={{ marginRight: 3 }}
                                        />
                                    ) : (
                                        <AntDesign
                                            name="hearto"
                                            size={20}
                                            color={theme.textLight}
                                            style={{ marginRight: 3 }}
                                        />
                                    )}
                                    <Text style={themed.textRegularLight}>
                                        {likeCount}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[themed.row, { marginLeft: 12 }]}
                            onPress={() => {
                                setSelectedPostID(item.id);
                                setCommentsVisible(true);
                            }}>
                            <AntDesign
                                name="message1"
                                size={20}
                                color={theme.textLight}
                                style={{ marginRight: 3 }}
                            />
                            <Text style={themed.textRegularLight}>{commentCount}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={themed.container}>
            <View style={themed.container}>
                <View style={[themed.row, styles.topRow]}>
                    <Text
                        style={[
                            themed.textPoetsen,
                            styles.title,
                            { color: theme.text },
                        ]}>
                        COMMUNITY POSTS
                    </Text>
                    <AntDesign
                        name="pluscircle"
                        size={24}
                        color={theme.text}
                        style={{ marginRight: 15 }}
                        onPress={() => navigation.navigate('CreatePost', { user })}
                    />
                </View>

                <View style={[styles.halfLine, { backgroundColor: theme.gray }]} />

                {/* tabs to select view option  */}
                <View style={[themed.row, styles.viewSelect]}>
                    <TouchableOpacity
                        style={themed.row}
                        onPress={() => setCurrentView('allPosts')}>
                        <Text
                            style={
                                currentView === 'allPosts'
                                    ? themed.textSemibold
                                    : themed.textRegular
                            }>
                            Posts
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={themed.row}
                        onPress={() => setCurrentView('myPosts')}>
                        <Text
                            style={
                                currentView === 'myPosts'
                                    ? themed.textSemibold
                                    : themed.textRegular
                            }>
                            My Posts
                        </Text>
                    </TouchableOpacity>
                </View>

                {postsError && (
                    <Text style={themed.textRegular}>Error: {postsError}</Text>
                )}

                {postsLoading ? (
                    <ActivityIndicator
                        size="large"
                        color={theme.text}
                        style={themed.loadingCenter}
                    />
                ) : (
                    <FlatList
                        data={
                            currentView === 'allPosts'
                                ? allPosts.filter((post) => post.userId !== user.id)
                                : allPosts.filter((post) => post.userId === user.id)
                        }
                        renderItem={renderPost}
                        keyExtractor={(item) => item.id}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        ListEmptyComponent={
                            <Text style={themed.textRegular}>No posts found</Text>
                        }
                    />
                )}

                {selectedPostID && <CommentsModal />}
            </View>
            <CustomStatusBar />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    title: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 24,
    },
    halfLine: {
        width: '45%',
        height: 2,
        marginLeft: 15,
        marginBottom: 10,
    },
    postContainer: {
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        width: '95%',
        alignSelf: 'center',
    },
    topRow: {
        justifyContent: 'space-between',
    },
    createdDate: {
        fontSize: 12,
    },
    content: {
        marginTop: 5,
        marginBottom: 10,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 2,
    },

    viewSelect: {
        justifyContent: 'space-around',
        marginBottom: 10,
    },

    // comments modal
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    modalView: {
        margin: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    commentsContainer: {
        width: '100%',
        marginBottom: 10,
    },
    commentContainer: {
        width: '100%',
        marginBottom: 10,
    },
    comment: {
        fontSize: 16,
        marginBottom: 5,
    },
    commentAuthor: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    button: {
        backgroundColor: '#2196F3',
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Community;
