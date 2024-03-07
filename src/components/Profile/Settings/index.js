import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../../hooks/useThemeContext';
import useGlobalStyles from '../../../hooks/useGlobalStyles';
import { updateVisibility } from '../../../services/redux/userSlice';
import { auth } from '../../../services/firebase';
import CustomStatusBar from '../../UI/StatusBar';
import InfoBox from '../../UI/InfoBox';
import Spacer from '../../UI/Spacer';

/** The settings screen to manage app & account settings */
const Settings = ({ navigation, route }) => {
    const { userId, is_public } = route.params;
    const { theme, themeMode, setThemeMode, themeType } = useTheme();
    const global = useGlobalStyles();
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.user.isLoading);

    const [selectedPrivacy, setSelectedPrivacy] = useState(null);

    useEffect(() => {
        setSelectedPrivacy(is_public);
    }, [userId]);

    useEffect(() => {
        // update visibility
        if (userId && selectedPrivacy !== is_public) {
            // confirm before making status public
            if (selectedPrivacy === true) {
                Alert.alert(
                    'Public Account',
                    'By setting your account to public, your posts will be visible to other users on the community feed.',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => setSelectedPrivacy(is_public),
                            style: 'cancel',
                        },
                        {
                            text: 'Confirm',
                            onPress: () =>
                                dispatch(
                                    updateVisibility({
                                        userId,
                                        updated: selectedPrivacy,
                                    }),
                                ),
                        },
                    ],
                    { cancelable: false },
                );
            } else {
                dispatch(updateVisibility({ userId, updated: selectedPrivacy }));
            }
        }
    }, [selectedPrivacy]);

    // signout user using firebase
    const handleSignout = async () => {
        try {
            await auth.signOut();
            navigation.navigate('Login');
        } catch (err) {
            alert('Error signing out: ', err);
        }
    };

    return (
        <SafeAreaView style={global.container}>
            <View style={global.container}>
                {/* back button */}
                <Ionicons
                    name="md-arrow-back"
                    size={28}
                    color={theme.text}
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                />

                <Text style={[global.text, styles.title]}>Settings</Text>

                <View style={[styles.themeBox, { borderColor: theme.textLight }]}>
                    <Text style={[global.text, styles.themeTitle]}>Appearance</Text>

                    {/* toggle between dark, light or system theme */}
                    {['Light', 'Dark', 'System'].map((mode) => (
                        <TouchableOpacity
                            key={mode}
                            onPress={() => setThemeMode(mode.toLowerCase())}
                            style={styles.option}>
                            <Text style={[global.text, styles.optionText]}>
                                {mode} {mode === 'System' ? '(default)' : ''}
                            </Text>

                            <FontAwesome
                                name={
                                    themeMode === mode.toLowerCase()
                                        ? 'check-square-o'
                                        : 'square-o'
                                }
                                size={22}
                                color={theme.text}
                                onPress={() => setThemeMode(mode.toLowerCase())}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                <Spacer height={20} />

                {/* privacy */}
                <View style={[styles.themeBox, { borderColor: theme.textLight }]}>
                    <Text style={[global.text, styles.themeTitle]}>
                        Account Privacy
                    </Text>

                    <View style={styles.option}>
                        <View style={global.row}>
                            <InfoBox
                                title="Account Privacy"
                                text="By setting your account to 'public', your posts will be visible to other users on the community feed."
                                iconColor={theme.text}
                                bgColor={themeType === 'light' ? '#ebebeb' : '#bcbcbc'}
                            />
                            <Text style={[global.text, styles.optionText]}>Public</Text>
                        </View>
                        {isLoading ? (
                            <ActivityIndicator size="small" color={theme.textLight} />
                        ) : (
                            // checkbox to toggle privacy status
                            <FontAwesome
                                name={selectedPrivacy ? 'check-square-o' : 'square-o'}
                                size={22}
                                color={theme.text}
                                onPress={() => setSelectedPrivacy(!selectedPrivacy)}
                            />
                        )}
                    </View>
                </View>

                <Spacer height={60} />

                <TouchableOpacity
                    style={[styles.pageButtons, { borderBottomColor: theme.textLight }]}
                    onPress={() => navigation.navigate('About')}>
                    <Text style={global.text}>About</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.signOutBtn, { backgroundColor: theme.darkGray }]}
                    onPress={handleSignout}>
                    <Text
                        style={[
                            styles.signOutTxt,
                            {
                                color:
                                    themeType === 'light'
                                        ? theme.background
                                        : theme.text,
                            },
                        ]}>
                        Sign Out
                    </Text>
                </TouchableOpacity>
                <CustomStatusBar />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'Inter-Bold',
    },
    backBtn: {
        margin: 12,
    },
    themeBox: {
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 14,
    },
    themeTitle: {
        fontSize: 18,
        marginBottom: 10,
        textDecorationLine: 'underline',
        fontFamily: 'Inter-Bold',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    optionText: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
    },
    signOutBtn: {
        width: '80%',
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginTop: 'auto',
        marginBottom: 20,
    },
    signOutTxt: {
        padding: 10,
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
    },
    pageButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 10,
        borderBottomWidth: 1,
        width: '80%',
        paddingVertical: 10,
    },
});

export default Settings;
