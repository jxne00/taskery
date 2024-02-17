import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../hooks/useThemeContext';
import useThemeStyles from '../../../hooks/useThemeStyles';

import CustomStatusBar from '../../../components/StatusBar';
import { timeSinceDate } from '../../../components/timeConverters';

const PostDetail = ({ navigation, route }) => {
    const { theme } = useTheme();
    const themed = useThemeStyles(theme);

    const post = route.params.item;
    console.log(post);

    return (
        <SafeAreaView style={[themed.container, { flex: 1 }]}>
            <View style={[themed.container, styles.container]}>
                <Ionicons
                    name="arrow-back-circle"
                    size={25}
                    color={theme.textLight}
                    style={{ paddingRight: 10 }}
                    onPress={() => navigation.goBack()}
                />

                <Text style={[themed.textBold, styles.title]}>{post.title}</Text>
                <View style={styles.sentence}>
                    <Text style={themed.textRegularLight}>Posted by </Text>
                    <Text style={themed.textSemibold}>{post.userName} </Text>
                    <Text style={themed.textRegularLight}>
                        ({timeSinceDate(post.time_created)})
                    </Text>
                </View>

                <Text style={[themed.textRegular, styles.content]}>{post.content}</Text>
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
});

export default PostDetail;
