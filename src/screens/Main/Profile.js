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

import { useTheme } from '../../../utils/theme/ThemeContext';
import useGlobalStyles from '../../../utils/hooks/globalStyles';
import CustomStatusBar from '../../components/StatusBar';

import { auth, db } from '../../../utils/config/firebase';

const Profile = ({ navigation }) => {
  const { theme } = useTheme();
  const global = useGlobalStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [avatar, setAvatar] = useState(null);

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

  // get profile data from firestore "users" collection
  useEffect(() => {
    setIsLoading(true);
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error getting user', 'User not found');
      setIsLoading(false);
      return;
    }

    db.collection('users')
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setData(doc.data());

          setAvatar(avatarImages[doc.data().avatar_path]);
          console.log('Document data:', doc.data());
        } else {
          Alert.alert('Error getting document', 'Document not found');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        Alert.alert('Error getting data', err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
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
          source={avatar ? avatar : require('../../../assets/avatars/a1.png')}
          style={styles.avatar}
        />

        {/* name */}
        <Text style={[global.text, styles.profileName]}>{data?.name}</Text>

        <Ionicons
          name="settings"
          size={28}
          style={styles.settingsIcon}
          color={theme.textLight}
          onPress={() => navigation.navigate('Settings')}
        />

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
    fontWeight: 'bold',
  },
});

export default Profile;
