import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Modal,
    TextInput,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import CustomStatusBar from '../../components/UI/StatusBar';
import { timeSinceDate } from '../../components/timeConverters';
import {
    fetchAllPosts,
    deletePost,
    toggleLike,
    addComment,
    deleteComment,
} from '../../services/redux/postSlice';
import useFetchUser from '../../hooks/useFetchUser';
import { useTheme } from '../../hooks/useThemeContext';
import useThemeStyles from '../../hooks/useThemeStyles';
import styles from './styles';

/**
 * The community screen that displays posts shared by other uses
 */
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
    const [updatingComment, setUpdatingComment] = useState(false);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        dispatch(fetchAllPosts());
    }, [dispatch]);

    // refetch posts when screen is pulled down
    const handleRefresh = () => {
        setRefreshing(true);
        dispatch(fetchAllPosts());
        setRefreshing(false);
    };

    const getAllPosts = allPosts.filter((post) => post.userId !== user.id) || [];
    const getMyPosts = allPosts.filter((post) => post.userId === user.id) || [];

    const handleLike = (postId, userId) => {
        setUpdatingLikes(postId);
        dispatch(toggleLike({ postId, userId })).then(() => {
            setUpdatingLikes(false);
        });
    };

    const handleAddComment = (postId, userId) => {
        if (newComment) {
            setUpdatingComment(true);

            const commentToAdd = {
                postId,
                userId,
                name: user.name,
                time_created: new Date().getTime(),
                content: newComment,
            };

            dispatch(addComment(commentToAdd)).then(() => {
                setUpdatingComment(false);
                setNewComment('');
            });
        }
    };

    const handleDelComment = (commentId) => {
        Alert.alert('Delete Comment', 'Are you sure you want to delete this comment?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    setUpdatingComment(true);
                    dispatch(
                        deleteComment({
                            postId: selectedPostID,
                            commentId,
                        }),
                    ).then(() => {
                        setUpdatingComment(false);
                    });
                },
            },
        ]);
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

    const renderPost = ({ item }) => {
        // check if post is by current user
        const isOwnPost = user.id === item.userId;

        const likeCount = item.likes ? item.likes.length : 0;
        const commentCount = item.comments ? item.comments.length : 0;

        let userHasLiked = false;
        if (item.likes) {
            userHasLiked = item.likes.includes(user.id);
        }

        /** Restricts content length to 100 characters */
        const checkLength = (content) => {
            const limit = 100;
            if (content.length > limit) {
                return (
                    <Text>
                        {content.substring(0, limit)}
                        <Text style={{ color: theme.textLight }}>... read more</Text>
                    </Text>
                );
            } else {
                return content;
            }
        };

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
                            {checkLength(item.content)}
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

    const renderComments = (post) => {
        const userId = user.id;
        const comments = post && post.comments ? post.comments : [];
        const isOwnPost = post && post.userId === userId;

        const onClose = () => {
            setCommentsVisible(false);
            setSelectedPostID(null);
        };

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={commentsVisible}
                onRequestClose={onClose}>
                <View style={styles.overlay}>
                    {/* close modal when top is clicked */}
                    <TouchableOpacity
                        style={styles.closeTouchableArea}
                        activeOpacity={1}
                        onPress={onClose}
                    />

                    <View
                        style={[
                            styles.modalView,
                            {
                                backgroundColor: theme.background,
                                borderColor: theme.gray,
                            },
                        ]}>
                        <View style={styles.modalToprow}>
                            <Text style={[themed.textBold, styles.title]}>
                                Comments
                                {comments ? ` (${comments.length})` : ' (0)'}
                            </Text>

                            <Ionicons
                                name="close-circle-outline"
                                size={26}
                                color={theme.text}
                                style={styles.icon}
                                onPress={onClose}
                            />
                        </View>

                        {/* list of comments */}
                        {comments && comments.length > 0 ? (
                            <FlatList
                                data={comments}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => {
                                    const isOwnComment = item.userId === user.id;

                                    return (
                                        <View
                                            style={[
                                                styles.commentBox,
                                                {
                                                    backgroundColor:
                                                        theme.backgroundSec,
                                                    borderColor: theme.gray,
                                                },
                                            ]}>
                                            <View
                                                style={[
                                                    themed.row,
                                                    {
                                                        justifyContent: 'space-between',
                                                        marginBottom: 10,
                                                    },
                                                ]}>
                                                <Text
                                                    style={[
                                                        themed.textSemibold,
                                                        { fontSize: 16 },
                                                    ]}>
                                                    {item.name}
                                                </Text>

                                                <View style={themed.row}>
                                                    <Text
                                                        style={[
                                                            themed.textRegularLight,
                                                            { fontSize: 14 },
                                                        ]}>
                                                        {timeSinceDate(
                                                            item.time_created,
                                                        )}{' '}
                                                    </Text>
                                                    {(isOwnPost || isOwnComment) && (
                                                        <Ionicons
                                                            name="trash"
                                                            size={20}
                                                            color={theme.red}
                                                            onPress={() =>
                                                                handleDelComment(
                                                                    item.id,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </View>
                                            </View>

                                            <Text style={themed.textRegular}>
                                                {item.content}
                                            </Text>
                                        </View>
                                    );
                                }}
                            />
                        ) : (
                            // if no comments
                            <View style={styles.emptyContent}>
                                <Text
                                    style={[
                                        themed.textRegularLight,
                                        { textAlign: 'center' },
                                    ]}>
                                    Be the first to comment!
                                </Text>
                            </View>
                        )}

                        {/* comment input */}
                        <View style={styles.addCommentBox}>
                            <TextInput
                                style={[styles.inputComment, themed.textRegular]}
                                placeholder="Add a comment..."
                                placeholderTextColor={theme.textLight}
                                value={newComment}
                                onChangeText={(text) => setNewComment(text)}
                            />
                            {updatingComment ? (
                                <ActivityIndicator size="small" color={theme.text} />
                            ) : (
                                <TouchableOpacity
                                    onPress={() => handleAddComment(post.id, user.id)}>
                                    <Ionicons
                                        name="send"
                                        size={22}
                                        color={theme.text}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <SafeAreaView style={themed.container}>
            <View style={themed.container}>
                <View style={[themed.row, styles.topRow]}>
                    <Text
                        style={[
                            themed.textPoetsen,
                            styles.pageTitle,
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
                        data={currentView === 'allPosts' ? getAllPosts : getMyPosts}
                        renderItem={renderPost}
                        keyExtractor={(item) => item.id}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        ListEmptyComponent={
                            <Text
                                style={[
                                    themed.textRegular,
                                    {
                                        textAlign: 'center',
                                        marginTop: 20,
                                        color: theme.textLight,
                                    },
                                ]}>
                                No posts found
                            </Text>
                        }
                    />
                )}

                {/* comments modal */}
                {commentsVisible &&
                    renderComments(allPosts.find((p) => p.id === selectedPostID))}
            </View>

            <CustomStatusBar />
        </SafeAreaView>
    );
};

export default Community;
