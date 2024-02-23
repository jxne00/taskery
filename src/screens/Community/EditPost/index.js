import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import { updatePost } from '../../../services/redux/postSlice';

import { useTheme } from '../../../hooks/useThemeContext';
import useThemeStyles from '../../../hooks/useThemeStyles';
import CustomStatusBar from '../../../components/StatusBar';

const EditPost = ({ route, navigation }) => {
    const { theme } = useTheme();
    const themed = useThemeStyles(theme);

    const { post, user } = route.params;

    // set initial state with existing details
    const [title, setTitle] = useState(post.title);
    const [caption, setCaption] = useState(post.caption);

    const postLoading = useSelector((state) => state.posts.loading.allPosts);

    const handleUpdate = () => {
        const dispatch = useDispatch();

        dispatch(
            updatePost({
                id: route.params.id,
                title,
                caption,
            }),
        );
    };

    useEffect(() => {
        // go back to community screen only after
        // updating is finished
        if (!postLoading) {
            navigation.goBack();
        }
    }, [postLoading, navigation]);

    if (postLoading) {
        return (
            <SafeAreaView style={[themed.container, { flex: 1 }]}>
                <View style={[themed.container, styles.container]}>
                    <Text style={themed.textSemibold}>Updating post...</Text>
                </View>
                <CustomStatusBar />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[themed.container, { flex: 1 }]}>
            <View style={[themed.container, styles.container]}>
                <View style={themed.row}>
                    <Ionicons
                        name="arrow-back-circle"
                        size={25}
                        color={theme.textLight}
                        style={{ paddingRight: 10 }}
                        onPress={() => navigation.goBack()}
                    />
                </View>

                <Text style={[themed.textBold, styles.header]}>Edit Post</Text>

                <View style={styles.inputContainer}>
                    <Text style={themed.textSemibold}>Title</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setTitle(text)}
                        value={title}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={themed.textSemibold}>Caption</Text>
                    <TextInput
                        style={[styles.input, styles.captionInput]}
                        multiline
                        onChangeText={(text) => setCaption(text)}
                        value={caption}
                    />
                </View>

                <TouchableOpacity
                    style={[themed.blackBtn, styles.button]}
                    onPress={handleUpdate}>
                    <Text style={[themed.blackBtnText, { textAlign: 'center' }]}>
                        Update
                    </Text>
                </TouchableOpacity>

                {/* display user's account status */}
                <View style={themed.row}>
                    <Text style={themed.textSemibold}>
                        Note: This post will be set to{' '}
                        {user.is_public ? 'public' : 'private'} following your current
                        privacy status. You can change this in your settings (Profile{' '}
                        {'>'} Settings {'>'} Privacy)
                    </Text>
                </View>
            </View>
            <CustomStatusBar />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        fontSize: 24,
        marginTop: 10,
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        marginTop: 20,
    },
    input: {
        marginTop: 2,
        padding: 10,
        borderRadius: 3,
        borderWidth: 1,
        fontSize: 18,
    },
    captionInput: {
        height: 200,
    },
    button: {
        marginVertical: 20,
        padding: 15,
        borderRadius: 10,
    },
});

export default EditPost;
