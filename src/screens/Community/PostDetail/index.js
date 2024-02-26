import React, { useState, useEffect, useDebugValue } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../hooks/useThemeContext';
import useThemeStyles from '../../../hooks/useThemeStyles';

import CustomStatusBar from '../../../components/StatusBar';
import { timeSinceDate } from '../../../components/timeConverters';

import CommentsModal from '../../../components/Modals/CommentsModal';

import useHideTabBar from '../../../hooks/useHideTabBar';

import { useDispatch } from 'react-redux';
import { toggleLike, deletePost } from '../../../services/redux/postSlice';

const PostDetail = ({ navigation, route }) => {
    const { theme } = useTheme();
    const themed = useThemeStyles(theme);

    let { post, user } = route.params;

    const [showComments, setShowComments] = useState(false);
    const [updatingLikes, setUpdatingLikes] = useState(false);

    const isOwnPost = post.userId === user.id;

    let postLiked = false;
    if (post.likes && post.likes.length > 0) {
        postLiked = post.likes.includes(user.id);
    }

    // hide bottom tab bar
    useHideTabBar();

    useEffect(() => {
        post, (user = route.params);
    }, [route.params]);

    const dispatch = useDispatch();

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

    if (showComments) {
        return (
            <CommentsModal
                visible={showComments}
                onClose={() => setShowComments(false)}
                post={post}
                userId={user.id}
            />
        );
    }

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
                                onPress={() => handleLike(post.id, user.id)}
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
});

export default PostDetail;
