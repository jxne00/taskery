import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import styles from './styles';
import { auth } from '../../../services/firebase';

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
      .then(() => {
        setIsLoading(false);
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

          <View style={[styles.inputBox, focusedBox === 'email' && styles.focusedBox]}>
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
              onSubmitEditing={() => passwordRef.current && passwordRef.current.focus()}
              returnKeyType="next"
            />
          </View>

          <View style={{ height: 20 }} />

          {/* password input */}
          <Text style={styles.inputLabel}>Password:</Text>

          <View
            style={[styles.inputBox, focusedBox === 'password' && styles.focusedBox]}>
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
            style={[styles.inputBox, focusedBox === 'password2' && styles.focusedBox]}>
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

            {confirmPassword && (
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
            <ActivityIndicator size="small" color="#ffffff" />
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

export default Register;
