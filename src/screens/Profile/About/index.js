import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomStatusBar from '../../../components/StatusBar';
import { useTheme } from '../../../hooks/useThemeContext';
import useThemeStyles from '../../../hooks/useThemeStyles';

const About = ({ navigation }) => {
    const { theme } = useTheme();
    const themed = useThemeStyles();

    return (
        <SafeAreaView style={themed.container}>
            <View style={[themed.container, styles.container]}>
                <View style={styles.titleRow}>
                    <Ionicons
                        name="md-arrow-back"
                        size={28}
                        color={theme.text}
                        onPress={() => navigation.goBack()}
                    />
                    <Text style={themed.headerText}>About taskery</Text>
                    <View style={{ width: 28 }} />
                </View>

                <View
                    style={[
                        styles.sectionBox,
                        { backgroundColor: theme.backgroundSec },
                    ]}>
                    <Text style={themed.subHeaderText}>Aim of the app</Text>
                    <View
                        style={[
                            styles.horizontalLine,
                            { backgroundColor: theme.textLight },
                        ]}
                    />
                    <Text style={themed.textRegular}>
                        taskery is a productivity app that aims to to transform task
                        management into a shared, social experience that not only drives
                        individual productivity but also fosters a supportive network of
                        achievement and success.
                    </Text>
                </View>

                <View
                    style={[
                        styles.sectionBox,
                        { backgroundColor: theme.backgroundSec },
                    ]}>
                    <Text style={themed.subHeaderText}>Technologies used</Text>
                    <View
                        style={[
                            styles.horizontalLine,
                            { backgroundColor: theme.textLight },
                        ]}
                    />
                    <Text style={themed.textRegular}>
                        taskery is developed with React Native, and managed through
                        Expo. It employs Firebase Auth for authentication, and Cloud
                        Firestore for data storage. State management is handled using
                        the Redux Toolkit with Redux Thunk as middleware.
                    </Text>
                </View>

                <View
                    style={[
                        styles.sectionBox,
                        { backgroundColor: theme.backgroundSec },
                    ]}>
                    <Text style={themed.subHeaderText}>About the developer</Text>
                    <View
                        style={[
                            styles.horizontalLine,
                            { backgroundColor: theme.textLight },
                        ]}
                    />
                    <Text style={themed.textRegular}>
                        This app is developed by June, a university student whose
                        personal quest to overcome a lack of motivation for task
                        completion sparked the idea of turning everyday task management
                        into a more engaging and fulfilling experience.
                    </Text>
                </View>

                <CustomStatusBar />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    sectionBox: {
        marginVertical: 15,
        padding: 12,
        borderRadius: 12,
    },
    horizontalLine: {
        height: 1,
        marginTop: 4,
        marginBottom: 8,
        width: '95%',
    },
});

export default About;
