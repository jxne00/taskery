import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { auth } from '../../../utils/lib/firebase';

const Profile = ({ navigation }) => {
  // signout user
  const handleSignout = () => {
    auth
      .signOut()
      .then(() => navigation.navigate('Login'))
      .catch((error) => {
        console.log('Error signing out: ', error);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text>This is the profile screen</Text>
        <Ionicons
          name="settings"
          size={24}
          color="black"
          onPress={() => navigation.navigate('Settings')}
        />

        <TouchableOpacity
          style={{ marginTop: 20, backgroundColor: '#b1a7f9' }}
          onPress={handleSignout}>
          <Text>Sign Out</Text>
        </TouchableOpacity>

        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Profile;
