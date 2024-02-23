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
        Alert.alert('Delete Post', 'Are you sure you want to delete?', [
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

    const CommentsModal = () => {
        // get comments from post
        const comments = allPosts.find((post) => post.id === selectedPostID).comments;

        // close modal
        const handleModalClose = () => {
            setSelectedPostID(null);
            setCommentsVisible(false);
        };

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={commentsVisible}
                onRequestClose={() => handleModalClose}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>
                            Comments
                            {comments && ` (${comments.length})`}
                        </Text>

                        <View style={styles.commentsContainer}>
                            {comments && comments.length > 0 ? (
                                comments.map((comment) => (
                                    <View
                                        key={comment.id}
                                        style={styles.commentContainer}>
                                        <Text style={styles.comment}>
                                            {comment.content}
                                        </Text>
                                        <Text style={styles.commentAuthor}>
                                            - {comment.name} (
                                            {timeSinceDate(comment.time_created)})
                                        </Text>
                                    </View>
                                ))
                            ) : (
                                // if no comments
                                <Text style={themed.textRegularLight}>
                                    Be the first to comment!
                                </Text>
                            )}
                        </View>

                        {/* close modal */}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleModalClose}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    const renderPost = ({ item }) => {
        // set post id and show comments modal
        const handleCommentPress = () => {
            setSelectedPostID(item.id);
            setCommentsVisible(true);
        };

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
                        navigation.navigate('PostDetail', { item });
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
                                            color={theme.darkgray}
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
                            onPress={handleCommentPress}>
                            <AntDesign
                                name="message1"
                                size={20}
                                color={theme.darkgray}
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
                        data={allPosts}
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
