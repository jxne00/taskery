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
import { useTheme } from '../../hooks/useThemeContext';
import useGlobalStyles from '../../hooks/useGlobalStyles';
import CustomStatusBar from '../../components/StatusBar';
import useFetchUser from '../../hooks/useFetchUser';
import { auth } from '../../services/firebase';

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

  return (
    <SafeAreaView style={global.container}>
      <View style={[global.container, styles.container]}>
        {/* avatar image */}
        <Image
          source={{ uri: user?.avatar_path }}
          style={[
            styles.avatar,
            !user.avatar_path && { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
          ]}
        />

        {/* settings */}
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
        <View style={global.row}>
          <Text style={[global.text, styles.profileName]}>{user.name}</Text>

          <Ionicons
            name="create-outline"
            size={28}
            color={theme.text}
            onPress={() =>
              navigation.navigate('EditProfile', {
                user: user,
                userId: userId,
              })
            }
          />
        </View>

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
    paddingRight: 5,
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

  horizontalLine: {
    width: '98%',
    height: 1,
    marginTop: 10,
  },
});

export default Profile;
