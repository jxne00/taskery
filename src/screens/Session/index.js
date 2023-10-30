import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';

import CustomStatusBar from '../../components/StatusBar';
import { useTheme } from '../../hooks/useThemeContext';
import useGlobalStyles from '../../hooks/useGlobalStyles';

import Playlist from './Playlist';
import Timer from './Timer';

/** The session screen to start a productivity session */
const Session = () => {
  const { theme } = useTheme();
  const global = useGlobalStyles();

  return (
    <SafeAreaView style={global.container}>
      <View style={global.container}>
        <Text style={global.text}>
          This is the screen to start a "productivity session"
        </Text>

        <Playlist />

        <Timer />

        <CustomStatusBar />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Session;
