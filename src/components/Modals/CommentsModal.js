import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    FlatList,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import { addComment } from '../../services/redux/postSlice';
import { timeSinceDate } from '../timeConverters';

import { useTheme } from '../../hooks/useThemeContext';
import useThemeStyles from '../../hooks/useThemeStyles';
import useFetchUser from '../../hooks/useFetchUser';

const CommentsModal = ({ visible, onClose, post, userId }) => {
    const { theme } = useTheme();
    const themed = useThemeStyles(theme);

    const [newComment, setNewComment] = useState('');
    const [updatingComment, setUpdatingComment] = useState(false);

    const { user } = useFetchUser(userId);

    let comments =
        post && post.comments && post.comments.length > 0 ? post.comments : null;

    const dispatch = useDispatch();

    useEffect(() => {
        comments =
            post && post.comments && post.comments.length > 0 ? post.comments : null;
    }, [post]);

    const handleAddComment = () => {
        if (newComment) {
            setUpdatingComment(true);

            const commentToAdd = {
                postId: post.id,
                userId,
                name: user.name,
                time_created: new Date().toISOString(),
                content: newComment,
            };

            dispatch(addComment(commentToAdd)).then(() => {
                setUpdatingComment(false);
                setNewComment('');
            });
        }
    };

    const renderComment = ({ item }) => {
        return (
            <View
                style={[
                    styles.commentBox,
                    {
                        backgroundColor: theme.backgroundSec,
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
                    <Text style={[themed.textSemibold, { fontSize: 16 }]}>
                        {item.name}
                    </Text>

                    <Text style={[themed.textRegularLight, { fontSize: 14 }]}>
                        {timeSinceDate(item.time_created)}
                    </Text>
                </View>

                <Text style={themed.textRegular}>{item.content}</Text>
            </View>
        );
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}>
            <View style={styles.transparentView}>
                <View
                    style={[
                        styles.modalView,
                        {
                            backgroundColor: theme.background,
                            borderColor: theme.gray,
                        },
                    ]}>
                    <View style={styles.topRow}>
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
                            renderItem={renderComment}
                        />
                    ) : (
                        <View
                            style={[
                                styles.emptyContent,
                                { backgroundColor: theme.background },
                            ]}>
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
                            <TouchableOpacity onPress={handleAddComment}>
                                <Ionicons name="send" size={22} color={theme.text} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    transparentView: {
        flex: 1,
        justifyContent: 'flex-end',
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
    topRow: {
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

export default CommentsModal;
