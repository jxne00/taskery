import React, { useState } from 'react';
import {
    Alert,
    Text,
    View,
    StyleSheet,
    TextInput,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import { useTheme } from '../../../hooks/useThemeContext';
import useThemeStyles from '../../../hooks/useThemeStyles';
import CustomStatusBar from '../../../components/StatusBar';
import Spacer from '../../../components/Spacer';
import SetAvatar from '../../../components/SetAvatar';
import { updateProfile } from '../../../services/redux/userSlice';

const EditProfile = ({ route, navigation }) => {
    const { theme } = useTheme();
    const themed = useThemeStyles();
    const dispatch = useDispatch();
    const { user, userId } = route.params;

    const [chosenAvatar, setChosenAvatar] = useState(user?.avatar_path);
    const [name, setName] = useState(user?.name);
    const [isLoading, setIsLoading] = useState(false);

    // TODO implement edit profile functionality
    const handleEditProfile = async () => {
        if (!name) {
            Alert.alert('Please set a name, nickname or alias');
            return;
        }

        setIsLoading(true);

        // update profile info in firestore & redux
        dispatch(updateProfile({ userId, name, avatar: chosenAvatar }))
            .then(() => {
                navigation.navigate('Profile');
            })
            .catch((err) => {
                Alert.alert('Error updating profile', err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <SafeAreaView style={themed.container}>
            <View style={themed.container}>
                {isLoading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color={'#fff'} />
                        <Text style={styles.loadingText}>updating profile...</Text>
                    </View>
                )}

                <View style={styles.header}>
                    <Ionicons
                        name="arrow-back-circle-outline"
                        size={26}
                        color={theme.text}
                        onPress={() => navigation.goBack()}
                    />

                    <Text style={themed.headerText}>Edit Profile</Text>

                    <Text
                        style={[styles.doneText, { color: theme.green }]}
                        onPress={handleEditProfile}>
                        Done
                    </Text>
                </View>

                <Spacer height={30} />

                {/* avatar */}
                <SetAvatar
                    chosenAvatar={chosenAvatar}
                    setChosenAvatar={setChosenAvatar}
                />

                <Spacer height={30} />

                {/* name */}
                <View
                    style={[
                        styles.inputContainer,
                        { borderBottomColor: theme.textLight },
                    ]}>
                    <Text style={themed.textSemibold}>Name:</Text>
                    <TextInput
                        placeholder={name}
                        value={name}
                        onChangeText={(text) => setName(text)}
                        style={[themed.textRegular, { paddingVertical: 5 }]}
                        autoCapitalize="none"
                        autoCompleteType="off"
                        autoCorrect={false}
                    />
                </View>

                <Spacer height={30} />
            </View>
            <CustomStatusBar />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    doneText: {
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
    },
    inputContainer: {
        marginHorizontal: 30,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderRadius: 8,
    },

    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 22,
        fontFamily: 'Inter-Medium',
        color: '#cecece',
    },
});

export default EditProfile;
