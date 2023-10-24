import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../services/firebase/config';

/** The login screen to login to app using firebase for auth */
const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // password visibility

  const [isLoading, setIsLoading] = useState(false);
  const [focusedBox, setFocusedBox] = useState(''); // 'email' or 'password'

  const passwordRef = useRef(null);

  /** login authentication with firebase */
  const handleLogin = () => {
    setIsLoading(true);

    // check for empty fields
    if (!email || !password) {
      Alert.alert('Login Failed', 'Please fill in all fields and try again.');
      setIsLoading(false);
      return;
    }

    // firebase auth with email and password
    auth
      .signInWithEmailAndPassword(email, password)
      // .signInWithEmailAndPassword('june@demo.com', 'password')
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
      // catch errors and show alerts
      .catch((error) => {
        const code = error.code;

        if (
          code === 'auth/invalid-email' ||
          code === 'auth/user-not-found' ||
          code === 'auth/wrong-password'
        )
          Alert.alert('Try again', 'Please enter a valid email and password.');
        else alert(error.message);

        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>taskery</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

        <KeyboardAvoidingView behavior="padding" style={styles.inputContainer}>
          {/* email input */}
          <Text style={styles.inputLabel}>Email:</Text>
          <View
            style={[
              styles.inputBox,
              focusedBox === 'email' && styles.focusedBox,
            ]}>
            <Ionicons name="person" size={20} color="#919090" />
            <TextInput
              value={email}
              style={[styles.textInput]}
              placeholder="Enter your email"
              placeholderTextColor={'#999999'}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
              onFocus={() => setFocusedBox('email')}
              onBlur={() => setFocusedBox('')}
              onSubmitEditing={() =>
                passwordRef.current && passwordRef.current.focus()
              }
              returnKeyType="next"
            />
          </View>

          <View style={{ height: 20 }} />

          {/* password input */}
          <Text style={styles.inputLabel}>Password:</Text>
          <View
            style={[
              styles.inputBox,
              focusedBox === 'password' && styles.focusedBox,
            ]}>
            <Ionicons name="md-lock-closed" size={20} color="#919090" />

            <TextInput
              value={password}
              style={styles.textInput}
              placeholder="Enter your password"
              placeholderTextColor={'#999999'}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              onChangeText={(text) => setPassword(text)}
              onFocus={() => setFocusedBox('password')}
              onBlur={() => setFocusedBox('')}
              ref={passwordRef}
              returnKeyType="done"
            />

            {password && (
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'}
                size={22}
                color="#000000"
                style={styles.inputRightIcon}
                onPress={() => setShowPassword(!showPassword)}
              />
            )}
          </View>
        </KeyboardAvoidingView>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          style={styles.loginBtn}>
          <Text style={styles.loginText}>
            {isLoading ? <ActivityIndicator visible={isLoading} /> : 'Login'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          disabled={isLoading}
          style={styles.registerBtn}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>

        <StatusBar style="dark" />
      </View>
    </SafeAreaView>
  );
};

let PRIMARY_COL = '#583492';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDF3EC',
  },
  container: {
    flex: 1,
    backgroundColor: '#FDF3EC',
    alignItems: 'center',
  },
  title: {
    marginTop: 20,
    fontSize: 34,
    marginBottom: 10,
    fontFamily: 'PoetsenOne-Regular',
    textAlign: 'center',
    color: PRIMARY_COL,
  },
  subtitle: {
    fontSize: 16,
    color: '#3c3c3c',
    fontFamily: 'Inter-Medium',
  },

  // text input area
  inputContainer: {
    width: '90%',
    marginTop: '30%',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 5,
    color: PRIMARY_COL,
    fontFamily: 'Inter-Bold',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 10,
    borderRadius: 18,
    backgroundColor: '#d7d6d6',
  },
  inputRightIcon: {
    marginLeft: 'auto',
  },
  textInput: {
    height: 45,
    paddingHorizontal: 12,
    fontSize: 16,
    width: '100%',
    fontFamily: 'Inter-Medium',
  },
  focusedBox: {
    borderColor: PRIMARY_COL,
    borderWidth: 2,
  },

  // buttons
  loginBtn: {
    backgroundColor: PRIMARY_COL,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: 42,
    marginTop: 'auto',
  },
  loginText: {
    color: '#FDF3EC',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  registerBtn: {
    borderBlockColor: '#242424',
    borderWidth: 1,
    height: 42,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
    marginTop: 10,
  },
  registerText: {
    color: '#242424',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
});

export default Login;
