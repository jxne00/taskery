import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { auth } from '../../../utils/lib/firebase';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // password visibility
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);

    // check for empty fields
    if (!email || !password) {
      Alert.alert(
        'Oops',
        'Looks like you missed something.\nPlease fill in all fields and try again.',
      );
      setIsLoading(false);
      return;
    }

    // sign in using firebase auth
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;

        if (user) {
          console.log('User ', user.email, ' logged in successfully.');
          // clear input fields
          setEmail('');
          setPassword('');
          setShowPassword(false);
          // navigate to main screens
          navigation.navigate('HomeTabs');

          setIsLoading(false);
        }
      })
      .catch((error) => {
        const code = error.code;
        // show alert if login details are invalid.
        if (code === 'auth/invalid-email' || code === 'auth/user-not-found')
          Alert.alert(
            'Try again',
            'User does not exist. Please enter a valid email and password.',
          );
        else if (code === 'auth/wrong-password')
          Alert.alert(
            'Try again',
            'Incorrect password. Please enter a valid email and password.',
          );
        else alert(error.message);

        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Taskery</Text>

        <Text style={styles.title}>Login</Text>

        <View style={styles.inputContainer}>
          {/* email input */}
          <Text style={styles.inputLabel}>Email:</Text>
          <TextInput
            value={email}
            style={styles.textInput}
            placeholder="Enter your email"
            placeholderTextColor={'#a9a9a9'}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
          />

          <View style={{ height: 20 }} />

          {/* password input */}
          <Text style={styles.inputLabel}>Password:</Text>
          <TextInput
            value={password}
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderTextColor={'#a9a9a9'}
            secureTextEntry
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          style={styles.loginBtn}>
          <Text style={styles.loginBtnText}>
            {isLoading ? <ActivityIndicator visible={isLoading} /> : 'Login'}
          </Text>
        </TouchableOpacity>

        <Text
          style={styles.register}
          onPress={() => navigation.navigate('Register')}>
          Register for an account?
        </Text>

        <StatusBar style="light" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#907563',
  },
  container: {
    flex: 1,
    backgroundColor: '#907563',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ebd8cc',
    position: 'absolute',
    top: '5%',
    left: 0,
    right: 0,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#ffffff',
    marginBottom: 20,
  },
  inputContainer: {
    marginVertical: 20,
    width: '90%',
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 8,
    color: '#FDF3EC',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#FDF3EC',
    borderRadius: 20,
    backgroundColor: '#FDF3EC',
    height: 42,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 18,
  },
  loginBtn: {
    backgroundColor: '#1d1d1d',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    marginVertical: 20,
  },
  loginBtnText: {
    color: '#FDF3EC',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  register: {
    fontSize: 17,
    textAlign: 'center',
    marginTop: 22,
    textDecorationLine: 'underline',
    color: '#e6cdaa',
  },
});

export default Login;
