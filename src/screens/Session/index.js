import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

import CustomStatusBar from '../../components/StatusBar';
import useThemeStyles from '../../hooks/useThemeStyles';

import Playlist from './Playlist';
import Timer from './Timer';

/** The session screen to start a productivity session */
const Session = () => {
    const themed = useThemeStyles();

    return (
        <SafeAreaView style={themed.container}>
            <View style={themed.container}>
                <Text style={[themed.headerText, styles.header]}>Session</Text>
                <Text style={[themed.textRegular, styles.header]}>
                    Set a timer and start a productivity session!
                </Text>

                <Playlist />

                <Timer />

                <CustomStatusBar />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        alignSelf: 'center',
    },
});

export default Session;
