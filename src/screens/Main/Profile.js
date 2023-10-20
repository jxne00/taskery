import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '../../../utils/theme/ThemeContext';
import useGlobalStyles from '../../../utils/hooks/globalStyles';
import CustomStatusBar from '../../components/StatusBar';

import { auth, db } from '../../../utils/firebase/config';
import { fetchProfile } from '../../../utils/redux/actions/profileActions';
import { toDateDisplay } from '../../../utils/helper';

const Profile = ({ navigation }) => {
  const { theme } = useTheme();
  const global = useGlobalStyles();

  // get profile data from redux store
  const { profileData, profileIsLoading, error } = useSelector(
    (state) => state.profile,
  );
  const dispatch = useDispatch();
  const userId = auth.currentUser?.uid;

  // const [data, setData] = useState(null);
  // const [avatar, setAvatar] = useState(null);

  const avatarImages = {
    // map avatar file names to their respective paths
    'a1.png': require('../../../assets/avatars/a1.png'),
    'a2.png': require('../../../assets/avatars/a2.png'),
    'a3.png': require('../../../assets/avatars/a3.png'),
    'a4.png': require('../../../assets/avatars/a4.png'),
    'a5.png': require('../../../assets/avatars/a5.png'),
    'a6.png': require('../../../assets/avatars/a6.png'),
    'a7.png': require('../../../assets/avatars/a7.png'),
    'a8.png': require('../../../assets/avatars/a8.png'),
  };

  useEffect(() => {
    if (!userId) return;

    // dispatch fetchprofile to redux store
    const unsubscribeProfile = dispatch(fetchProfile(userId));

    // unsubscribe listener on unmount
    return () => {
      unsubscribeProfile();
    };
  }, [userId, dispatch]);

  if (profileIsLoading) {
    return (
      <View style={[global.container, styles.loading]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={global.container}>
      <View style={[global.container, styles.container]}>
        {/* avatar image */}
        <Image
          source={
            profileData?.avatar_path
              ? avatarImages[profileData.avatar_path]
              : require('../../../assets/avatars/a1.png')
          }
          style={styles.avatar}
        />

        <Ionicons
          name="settings"
          size={28}
          style={styles.settingsIcon}
          color={theme.textLight}
          onPress={() => navigation.navigate('Settings')}
        />

        {/* name */}
        <Text style={[global.text, styles.profileName]}>
          {profileData?.name}
        </Text>

        {/* profile visibility */}
        <Text style={[global.text, styles.profileVisibility]}>
          {profileData?.is_public ? 'Public' : 'Private'}
        </Text>

        {/* creation date */}
        <Text style={[global.text, styles.profileCreationDate]}>
          Member since: {toDateDisplay(profileData?.created_at)}
        </Text>

        <CustomStatusBar />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loading: {
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
  },
  settingsIcon: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    margin: 20,
  },
  profileName: {
    fontSize: 26,
    fontFamily: 'Inter-Bold',
  },
  profileVisibility: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginVertical: 10,
  },
  profileCreationDate: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});

export default Profile;
