import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../../services/firebase';
import styles from './styles';

/** The registration screen to create new user account */
const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassowrd] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedBox, setFocusedBox] = useState(''); // 'email', 'password','password2'
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  /** register new user with firebase auth */
  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      setErrorMsg('Please fill in all fields and try again.');
      return;
    }

    // password & confirm password must match
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please try again.');
      return;
    }

    setIsLoading(true);

    // create user using firebase auth
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        resetInputFields();
        navigation.navigate('Onboarding');
      })
      .catch((err) => {
        if (err.code === 'auth/email-already-in-use')
          setErrorMsg('Email is already is use. Please choose another email.');
        else setErrorMsg(err.message);
      })
      .finally(() => setIsLoading(false));
  };

  /** go back to login screen */
  const handleBackPress = () => {
    resetInputFields();
    navigation.goBack();
  };

  /** reset state of all fields */
  const resetInputFields = () => {
    setEmail('');
    setPassword('');
    setConfirmPassowrd('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrorMsg(null);
  };

  /** dismisses the keyboard */
  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setFocusedBox('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
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
              style={[styles.inputBox, focusedBox === 'email' && styles.focusedBox]}>
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

          {/* error message //TODO set haptic feedback */}
          {errorMsg && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={20} color="#af0000" />
              <Text style={styles.errorMsg}>{errorMsg}</Text>
            </View>
          )}

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
          <StatusBar style="dark" />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Register;
