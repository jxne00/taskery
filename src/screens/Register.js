import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { auth } from '../services/firebase/config';

/** The registration screen to create new user account */
const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassowrd] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [focusedBox, setFocusedBox] = useState(''); // 'email', 'password','password2'

  const [isLoading, setIsLoading] = useState(false);

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  /** register new user with firebase auth */
  const handleRegister = () => {
    // ensure no empty fields
    if (!email || !password || !confirmPassword) {
      Alert.alert('Login Failed', 'Please fill in all fields and try again.');
      return;
    }

    // check if password and confirm password match
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match.', 'Please re-enter your password.');
      return;
    }

    setIsLoading(true);

    // create user using firebase auth
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(setIsLoading(false))
      .then(() => {
        navigation.navigate('Onboarding');

        // clear all input fields
        setEmail('');
        setPassword('');
      })

      // catch errors and show alert
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use')
          alert('Email is already is use.');
        else alert(error.message);
      });
  };

  /** go back to login screen */
  const handleBackPress = () => {
    navigation.goBack();

    // clear all input fields
    setEmail('');
    setPassword('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Ionicons
          name="md-arrow-back"
          size={28}
          style={styles.backBtn}
          onPress={handleBackPress}
        />

        <Text style={styles.title}>Create Account</Text>

        <View style={styles.inputContainer}>
          {/* email input */}
          <Text style={styles.inputLabel}>Email:</Text>

          <View
            style={[
              styles.inputBox,
              focusedBox === 'email' && styles.focusedBox,
            ]}>
            <Ionicons name="person" size={20} color="#a9a9a9" />
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
            <Ionicons name="md-lock-closed" size={20} color="#a9a9a9" />

            <TextInput
              value={password}
              style={styles.textInput}
              placeholder="Set a password"
              placeholderTextColor={'#a9a9a9'}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              secureTextEntry={!showPassword}
              textContentType="oneTimeCode"
              onChangeText={(text) => setPassword(text)}
              onFocus={() => setFocusedBox('password')}
              onBlur={() => setFocusedBox('')}
              ref={passwordRef}
              onSubmitEditing={() =>
                confirmPasswordRef.current && confirmPasswordRef.current.focus()
              }
              returnKeyType="next"
            />

            {password && (
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'}
                size={22}
                style={styles.inputRightIcon}
                onPress={() => setShowPassword(!showPassword)}
              />
            )}
          </View>

          <View style={{ height: 20 }} />

          {/* confirm password input */}
          <Text style={styles.inputLabel}>Confirm Password:</Text>
          <View
            style={[
              styles.inputBox,
              focusedBox === 'password2' && styles.focusedBox,
            ]}>
            <Ionicons name="md-lock-closed" size={20} color="#a9a9a9" />

            <TextInput
              value={confirmPassword}
              style={styles.textInput}
              placeholder="Re-enter password"
              placeholderTextColor={'#a9a9a9'}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              secureTextEntry={!showConfirmPassword}
              textContentType="oneTimeCode"
              onChangeText={(text) => setConfirmPassowrd(text)}
              onFocus={() => setFocusedBox('password2')}
              onBlur={() => setFocusedBox('')}
              ref={confirmPasswordRef}
              returnKeyType="done"
            />

            {showConfirmPassword && (
              <Ionicons
                name={showConfirmPassword ? 'eye' : 'eye-off'}
                size={22}
                style={styles.inputRightIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            )}
          </View>
        </View>

        {/* signup button */}
        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.toLoginText}>
          Already have an account?{' '}
          <Text style={styles.loginTxt} onPress={() => navigation.goBack()}>
            Login
          </Text>
        </Text>
      </View>

      <StatusBar style="dark" />
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
    alignItems: 'center',
    backgroundColor: '#FDF3EC',
  },

  backBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    color: '#0c0c0c',
  },

  title: {
    fontSize: 28,
    marginTop: '20%',
    textAlign: 'center',
    color: '#1b1b1b',
    fontFamily: 'Inter-Bold',
  },

  inputContainer: {
    width: '90%',
    marginTop: '20%',
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
    borderWidth: 1,
    borderColor: '#8f8f8f',
    borderRadius: 15,
    backgroundColor: '#f4f2f1',
  },
  inputRightIcon: {
    marginLeft: 'auto',
  },
  textInput: {
    height: 44,
    paddingHorizontal: 12,
    fontSize: 16,
    width: '100%',
    fontFamily: 'Inter-Medium',
  },
  focusedBox: {
    borderColor: PRIMARY_COL,
    borderWidth: 2,
  },

  registerBtn: {
    backgroundColor: PRIMARY_COL,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    width: '90%',
    marginTop: 'auto',
  },
  buttonText: {
    color: '#FDF3EC',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  toLoginText: {
    marginVertical: 18,
    color: '#292929',
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  loginTxt: {
    color: PRIMARY_COL,
    fontFamily: 'Inter-Medium',
  },
});

export default Register;
