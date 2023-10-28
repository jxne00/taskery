import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '../../theme/ThemeContext';
import useGlobalStyles from '../../theme/globalStyles';
import CustomStatusBar from '../../components/StatusBar';

import { auth, db } from '../../services/firebase';
import { fetchUser } from '../../services/redux/userSlice';
import { toDateDisplay } from '../../components/timeConverters';

// TODO replace dummyPosts with actual data
import dummyPosts from './dummyPosts';

/** The profile screen displaying user's profile info */
const Profile = ({ navigation }) => {
  const { theme } = useTheme();
  const global = useGlobalStyles();

  // get profile data from redux store
  const user = useSelector((state) => state.user.data);
  const isLoading = useSelector((state) => state.user.isLoading);
  const error = useSelector((state) => state.user.error);

  const dispatch = useDispatch();
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

  useEffect(() => {
    if (userId) {
      dispatch(fetchUser(userId));
    }
  }, [userId, dispatch]);

  const renderPost = ({ item }) => {
    return (
      <View style={[styles.postContainer, { borderColor: theme.textLight }]}>
        <Text style={[styles.postTitle, { color: theme.text }]}>{item.title}</Text>

        {item.caption && (
          <Text style={[styles.postCaption, { color: theme.text }]}>
            {item.caption}
          </Text>
        )}

        <View style={{ height: 20 }} />

        {/* likes and comments */}
        <View style={styles.statRow}>
          <TouchableOpacity style={global.row}>
            <Ionicons
              name="md-heart-outline"
              size={20}
              color={theme.red}
              style={{ marginRight: 3 }}
            />
            <Text style={[global.text, { color: theme.text }]}>{item.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={global.row}
            // TODO: show comments
            onPress={() => {
              console.log('TODO: show comments');
            }}>
            <Text style={[global.text, { color: theme.textLight }]}>
              {item.comments} {item.comments === 1 ? 'comment' : 'comments'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={global.container}>
      <View style={[global.container, styles.container]}>
        {isLoading && (
          <ActivityIndicator
            size="large"
            color={theme.text}
            style={{ justifyContent: 'center' }}
          />
        )}

        {!isLoading && (
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
              name="settings"
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
        <FlatList
          data={dummyPosts}
          renderItem={(item) => renderPost(item)}
          keyExtractor={(item) => item.id.toString()}
          style={{ width: '100%' }}
          ListHeaderComponent={
            <Text style={[styles.postSectionHeader, { color: theme.text }]}>Posts</Text>
          }
        />

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

  // posts
  postSectionHeader: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    marginLeft: 13,
    marginTop: 20,
  },
  postContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    width: '95%',
    alignSelf: 'center',
  },
  postTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    paddingBottom: 5,
  },
  postCaption: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default Profile;
