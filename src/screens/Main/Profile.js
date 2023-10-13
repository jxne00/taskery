import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
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
    <View style={styles.container}>
      <Text>This is the profile screen</Text>

      <TouchableOpacity
        style={{ marginTop: 20, backgroundColor: '#b1a7f9' }}
        onPress={handleSignout}>
        <Text>Sign Out</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Profile;
