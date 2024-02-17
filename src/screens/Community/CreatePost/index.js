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

import { addPost } from '../../../services/redux/postSlice';

import { useTheme } from '../../../hooks/useThemeContext';
import useThemeStyles from '../../../hooks/useThemeStyles';
import CustomStatusBar from '../../../components/StatusBar';

const CreatePost = ({ navigation, route }) => {
    const { theme } = useTheme();
    const themed = useThemeStyles(theme);

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

        const post = {
            title,
            content: caption,
            is_public: user.is_public,
            time_created: new Date(),
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
        marginTop: 20,
        padding: 15,
        borderRadius: 10,
    },
});

export default CreatePost;
