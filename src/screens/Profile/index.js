import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../theme/ThemeContext';
import useGlobalStyles from '../../theme/globalStyles';
import CustomStatusBar from '../../components/StatusBar';

import { useFetchUser } from '../../hooks/useFetchUser';
import { auth } from '../../services/firebase';
import { toDateDisplay } from '../../components/timeConverters';

// TODO replace dummyPosts with actual data
import dummyPosts from './dummyPosts';
import PostsList from './PostsList';

/** The profile screen displaying user's profile info */
const Profile = ({ navigation }) => {
  const { theme } = useTheme();
  const global = useGlobalStyles();

  // get profile data from redux store
  const { user, ProfileIsLoading, userError } = useFetchUser();

  const userId = auth.currentUser?.uid;

  const avatarImages = {
    // map avatar file names to their respective paths
    'a1.png': require('../../assets/avatars/a1.png'),
    'a2.png': require('../../assets/avatars/a2.png'),
    'a3.png': require('../../assets/avatars/a3.png'),
    'a4.png': require('../../assets/avatars/a4.png'),
    'a5.png': require('../../assets/avatars/a5.png'),
    'a6.png': require('../../assets/avatars/a6.png'),
    'a7.png': require('../../assets/avatars/a7.png'),
    'a8.png': require('../../assets/avatars/a8.png'),
  };

  return (
    <SafeAreaView style={global.container}>
      <View style={[global.container, styles.container]}>
        {ProfileIsLoading && (
          <ActivityIndicator
            size="large"
            color={theme.text}
            style={{ justifyContent: 'center' }}
          />
        )}

        {!ProfileIsLoading && (
          <>
            {/* avatar image */}
            <Image
              source={
                user?.avatar_path
                  ? avatarImages[user.avatar_path]
                  : require('../../assets/avatars/a1.png')
              }
              style={styles.avatar}
            />

            <Ionicons
              name="settings-outline"
              size={28}
              style={styles.settingsIcon}
              color={theme.text}
              onPress={() =>
                navigation.navigate('Settings', {
                  is_public: user.is_public,
                  userId,
                })
              }
            />

            {/* name */}
            <Text style={[global.text, styles.profileName]}>{user?.name}</Text>

            {/* profile visibility */}
            <View style={[styles.visContainer, { borderColor: theme.textLight }]}>
              <Ionicons
                name={user?.is_public ? 'md-lock-open' : 'md-lock-closed'}
                size={16}
                color={theme.textLight}
              />
              <Text style={[styles.visText, { color: theme.text }]}>
                {user?.is_public ? 'Public' : 'Private'}
              </Text>
            </View>

            {/* creation date (only if public) */}
            {user?.is_public && (
              <Text style={[global.text, styles.profileCreationDate]}>
                Member since: {toDateDisplay(user?.created_at)}
              </Text>
            )}
          </>
        )}

        <View style={[styles.horizontalLine, { backgroundColor: theme.textLight }]} />

        {/* user's posts */}
        <PostsList data={dummyPosts} />

        <CustomStatusBar />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  settingsIcon: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 80,
    margin: 10,
  },
  profileName: {
    fontSize: 30,
    fontFamily: 'Inter-Bold',
    marginTop: 10,
  },
  visContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  visText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 5,
  },
  profileCreationDate: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginTop: 10,
  },

  horizontalLine: {
    width: '98%',
    height: 1,
    marginTop: 10,
  },
});

export default Profile;
