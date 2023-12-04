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
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { fetchAllPosts, fetchComments } from '../../services/redux/postSlice';
import { timeSinceDate } from '../../components/timeConverters';

import { AntDesign } from '@expo/vector-icons';
import CustomStatusBar from '../../components/StatusBar';
import { useTheme } from '../../hooks/useThemeContext';
import useThemeStyles from '../../hooks/useThemeStyles';

/** The community screen that shows posts shared by other uses */
const Community = () => {
    const themed = useThemeStyles();
    const { theme } = useTheme();

    const dispatch = useDispatch();

    // get all posts from redux store
    const allPosts = useSelector((state) => state.posts.allPosts);
    const postsLoading = useSelector((state) => state.posts.loading.allPosts);
    const postsError = useSelector((state) => state.posts.error);
    const commentsLoading = useSelector((state) => state.posts.loading.comments);

    const [refreshing, setRefreshing] = useState(false);
    const [selectedPostID, setSelectedPostID] = useState(null);
    const [commentsVisible, setCommentsVisible] = useState(false);

    useEffect(() => {
        dispatch(fetchAllPosts());
    }, [dispatch]);

    // fetch comments for selected post
    useEffect(() => {
        if (selectedPostID) {
            dispatch(fetchComments(selectedPostID));
        }
    }, [selectedPostID, dispatch]);

    // refetch posts on refresh
    const handleRefresh = () => {
        setRefreshing(true);
        dispatch(fetchAllPosts());
        setRefreshing(false);
    };

    // TODO like post (make heart full if already liked)
    const handleLike = () => {
        console.log('TODO: like post');
    };

    const CommentsModal = () => {
        // get comments from post
        const comments = allPosts.find((post) => post.id === selectedPostID).comments;
        console.log('(CommentsModal) Display comments: ', comments);

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

                        {/* comments */}
                        {comments && comments.length > 0 && (
                            <View style={styles.commentsContainer}>
                                {comments.map((comment) => (
                                    <View
                                        key={comment.id}
                                        style={styles.commentContainer}>
                                        <Text style={styles.comment}>
                                            {comment.content}
                                        </Text>
                                        <Text style={styles.commentAuthor}>
                                            - {comment.name} (
                                            {timeSinceDate(comment.time_created)} ago)
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}

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

        return (
            <View style={[styles.postContainer, { borderColor: theme.textLight }]}>
                {/* TODO display post user's name & avatar */}
                <View style={[themed.row, styles.topRow]}>
                    <View style={themed.row}>
                        <AntDesign
                            name="user"
                            size={16}
                            color={theme.text}
                            style={{ marginRight: 3 }}
                        />
                        <Text style={themed.textRegularLight}>{item.userName}</Text>
                    </View>

                    <Text style={[themed.textRegularLight, styles.createdDate]}>
                        {timeSinceDate(item.time_created)}
                    </Text>
                </View>

                <Text style={themed.subHeaderText}>{item.title}</Text>

                {item.content && (
                    <Text style={[themed.textRegular, styles.content]}>
                        {item.content}
                    </Text>
                )}

                {/* likes and comments */}
                <View style={styles.statRow}>
                    <TouchableOpacity style={themed.row} onPress={handleLike}>
                        <AntDesign
                            name="hearto"
                            size={20}
                            color={theme.red}
                            style={{ marginRight: 3 }}
                        />
                        <Text style={themed.textRegular}>{item.numLikes}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={themed.row} onPress={handleCommentPress}>
                        <Text style={themed.textRegularLight}>
                            {item.numComments}{' '}
                            {item.numComments === 1 ? 'comment' : 'comments'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={themed.container}>
            <View style={themed.container}>
                <Text style={[themed.headerText, styles.title]}>Community Posts</Text>

                <View style={[styles.halfLine, { backgroundColor: theme.blue }]} />

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

                {selectedPostID && !commentsLoading && <CommentsModal />}
            </View>
            <CustomStatusBar />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    title: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    halfLine: {
        width: '45%',
        height: 2,
        marginLeft: 15,
        marginBottom: 10,
    },
    postContainer: {
        padding: 10,
        marginBottom: 10,
        marginHorizontal: 5,
        borderBottomWidth: 1,
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
