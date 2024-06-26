import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import useHideTabBar from '../../../hooks/useHideTabBar';
import { useTheme } from '../../../hooks/useThemeContext';
import useThemeStyles from '../../../hooks/useThemeStyles';
import { addPost } from '../../../services/redux/postSlice';
import CustomStatusBar from '../../UI/StatusBar';

/**
 * Screen to create a new post on the community timeline.
 */
const CreatePost = ({ navigation, route }) => {
    const { theme } = useTheme();
    const themed = useThemeStyles(theme);

    useHideTabBar();

    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState('');

    const user = route.params.user;

    const dispatch = useDispatch();

    const createPost = (userId) => {
        // check if title and caption are empty
        if (!title || !caption) {
            alert('Please fill out all fields');
            return;
        }

        const current = new Date();

        const post = {
            title,
            content: caption,
            is_public: user.is_public,
            time_created: current.getTime(),
            userName: user.name,
            userId,
        };

        // add post to firestore and redux store
        dispatch(addPost(post))
            .then(() => {
                console.log('post added');
                setTitle('');
                setCaption('');
                navigation.navigate('Community');
            })
            .catch((error) => {
                console.log('error adding post');
                alert(error);
            });
    };

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

                <Text style={[themed.textBold, styles.header]}>New Post</Text>

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
                    onPress={() => createPost(user.id)}>
                    <Text style={[themed.blackBtnText, { textAlign: 'center' }]}>
                        Create
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

export default CreatePost;
