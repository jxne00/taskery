import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { fetchAllPosts } from '../../services/redux/postSlice';
import { toDateDisplay } from '../../components/timeConverters';

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

    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        console.log(allPosts);
        dispatch(fetchAllPosts());
    }, [dispatch]);

    // refetch posts on refresh
    const handleRefresh = () => {
        setRefreshing(true);
        dispatch(fetchAllPosts());
        setRefreshing(false);
    };

    const renderPost = ({ item }) => {
        return (
            <View style={[styles.postContainer, { borderColor: theme.textLight }]}>
                <Text style={[themed.textRegularLight, styles.createdDate]}>
                    {toDateDisplay(item.time_created)}
                </Text>

                {/* TODO display post user's name & avatar */}

                <Text style={themed.subHeaderText}>{item.title}</Text>

                {item.content && (
                    <Text style={[themed.textRegular, styles.content]}>
                        {item.content}
                    </Text>
                )}

                {/* likes and comments */}
                <View style={styles.statRow}>
                    <TouchableOpacity
                        style={themed.row}
                        onPress={() => {
                            // TODO like post (make heart full if already liked)
                            console.log('TODO: like post');
                        }}>
                        <AntDesign
                            name="hearto"
                            size={20}
                            color={theme.red}
                            style={{ marginRight: 3 }}
                        />
                        <Text style={themed.textRegular}>{item.numLikes}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={themed.row}
                        onPress={() => {
                            // TODO comments page
                            console.log('TODO: show comments');
                        }}>
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

                {postsError && <Text style={themed.text}>Error: {postsError}</Text>}

                {!postsLoading && allPosts.length === 0 && (
                    <Text style={themed.text}>No posts yet!</Text>
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
                    />
                )}
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
        width: '50%',
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
    createdDate: {
        textAlign: 'right',
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
});

export default Community;
