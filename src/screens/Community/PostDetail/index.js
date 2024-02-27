import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    ActivityIndicator,
    ScrollView,
    Modal,
    TextInput,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useDispatch } from 'react-redux';
import {
    toggleLike,
    deletePost,
    addComment,
    deleteComment,
} from '../../../services/redux/postSlice';

import { useTheme } from '../../../hooks/useThemeContext';
import useThemeStyles from '../../../hooks/useThemeStyles';
import useHideTabBar from '../../../hooks/useHideTabBar';
import CustomStatusBar from '../../../components/StatusBar';
import { timeSinceDate } from '../../../components/timeConverters';

const PostDetail = ({ navigation, route }) => {
    const { theme } = useTheme();
    const themed = useThemeStyles(theme);

    let { post, user } = route.params;

    const [showComments, setShowComments] = useState(false);
    const [updatingLikes, setUpdatingLikes] = useState(false);
    const [updatingComment, setUpdatingComment] = useState(false);
    const [newComment, setNewComment] = useState('');

    const isOwnPost = post.userId === user.id;

    let postLiked = false;
    if (post.likes && post.likes.length > 0) {
        postLiked = post.likes.includes(user.id);
    }

    // hide bottom tab bar
    useHideTabBar();

    const dispatch = useDispatch();

    const handleLike = () => {
        const postId = post.id;
        const userId = user.id;

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

    const renderComments = () => {
        const comments = post && post.comments ? post.comments : [];

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={showComments}
                onRequestClose={() => setShowComments(false)}>
                <View style={styles.overlay}>
                    {/* close modal when top is clicked */}
                    <TouchableOpacity
                        style={styles.closeTouchableArea}
                        activeOpacity={1}
                        onPress={() => setShowComments(false)}
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
                                onPress={() => setShowComments(false)}
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
        <SafeAreaView style={[themed.container, { flex: 1 }]}>
            <ScrollView style={[themed.container, styles.container]}>
                <View style={[themed.row, styles.headerRow]}>
                    {/* navigate back to timeline */}
                    <Ionicons
                        name="arrow-back-circle"
                        size={25}
                        color={theme.text}
                        style={{ paddingRight: 10 }}
                        onPress={() => navigation.goBack()}
                    />

                    {/* like post */}
                    {updatingLikes ? (
                        <ActivityIndicator size="small" color={theme.text} />
                    ) : (
                        <TouchableOpacity style={themed.row}>
                            <Ionicons
                                name={postLiked ? 'heart' : 'heart-outline'}
                                size={24}
                                color={theme.red}
                                onPress={handleLike}
                            />
                            <Text style={themed.textRegularLight}>
                                {' '}
                                {post.likes ? post.likes.length : 0}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                <Text style={[themed.textBold, styles.title]}>{post.title}</Text>

                <View style={styles.sentence}>
                    <Text style={themed.textRegularLight}>Posted by </Text>
                    <Text style={themed.textSemibold}>
                        {isOwnPost ? 'Me' : post.userName}{' '}
                    </Text>
                    <Text style={themed.textRegularLight}>
                        ({timeSinceDate(post.time_created)})
                    </Text>
                </View>

                <Text style={[themed.textRegular, styles.content]}>{post.content}</Text>
            </ScrollView>

            <View
                style={[
                    styles.likeCommentBar,
                    { backgroundColor: theme.backgroundSec },
                ]}>
                {isOwnPost ? (
                    <TouchableOpacity
                        style={themed.row}
                        onPress={() => handlePostDelete(post.id)}>
                        <Ionicons
                            name="trash"
                            size={24}
                            color={theme.text}
                            style={{ paddingRight: 5 }}
                        />
                        <Text style={themed.textRegular}>Delete</Text>
                    </TouchableOpacity>
                ) : (
                    <View />
                )}

                <TouchableOpacity
                    style={themed.row}
                    onPress={() => setShowComments(true)}>
                    <Ionicons
                        name="chatbubbles-outline"
                        size={24}
                        color={theme.textLight}
                        style={{ paddingRight: 5 }}
                    />
                    <Text style={themed.textRegular}>
                        Comments {post.comments ? `(${post.comments.length})` : ''}
                    </Text>
                </TouchableOpacity>
            </View>

            {showComments && renderComments()}

            <CustomStatusBar />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    headerRow: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        marginTop: 10,
        marginBottom: 5,
        textAlign: 'center',
    },
    sentence: {
        flexDirection: 'row',
        alignSelf: 'center',
    },
    content: {
        fontSize: 18,
        marginTop: 40,
        marginBottom: 20,
    },

    // like and comment bar
    likeCommentBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 30,
    },

    // comments modal
    // modal styles
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    closeTouchableArea: {
        flex: 1,
    },
    modalView: {
        height: '50%',
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    emptyContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalToprow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    icon: {
        position: 'absolute',
        right: 10,
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        flex: 1,
    },

    commentBox: {
        margin: 10,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderWidth: 1,
        borderRadius: 16,
    },

    addCommentBox: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 30,
        borderWidth: 1,
        margin: 10,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputComment: {
        flex: 1,
    },
});

export default PostDetail;
