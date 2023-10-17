import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
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

import { auth } from '../../../utils/config/firebase';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // password visibility
  const [confirmPassword, setConfirmPassowrd] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /** register new user with firebase auth */
  const handleRegister = () => {
    // ensure no empty fields
    if (!email || !password || !confirmPassword) {
      Alert.alert(
        'Oops',
        'Looks like you missed something.\nPlease fill in all fields and try again.',
      );
      return;
    }

    // ensure password and confirm password match
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
          color="#0c0c0c"
          style={styles.backBtn}
          onPress={handleBackPress}
        />

        <Text style={styles.title}>Create Account</Text>

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
          <View style={styles.inputBox}>
            <TextInput
              value={password}
              style={styles.textInput}
              placeholder="Set a password"
              placeholderTextColor={'#a9a9a9'}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              secureTextEntry={!showPassword}
              onChangeText={(text) => setPassword(text)}
            />

            <Ionicons
              name={showPassword ? 'eye' : 'eye-off'}
              size={24}
              color="#a9a9a9"
              onPress={() => setShowPassword(!showPassword)}
            />
          </View>

          <View style={{ height: 20 }} />

          {/* confirm password input */}
          <Text style={styles.inputLabel}>Confirm Password:</Text>
          <View style={styles.inputBox}>
            <TextInput
              value={confirmPassword}
              style={styles.textInput}
              placeholder="Re-enter password"
              placeholderTextColor={'#a9a9a9'}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              secureTextEntry={!showConfirmPassword}
              onChangeText={(text) => setConfirmPassowrd(text)}
            />

            <Ionicons
              name={showConfirmPassword ? 'eye' : 'eye-off'}
              size={24}
              color="#a9a9a9"
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
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

      <StatusBar style="light" />
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
    alignItems: 'center',
    backgroundColor: '#907563',
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: '20%',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'OpenSans-Bold',
  },
  inputContainer: {
    marginVertical: 20,
    width: '90%',
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 5,
    color: '#FDF3EC',
    fontFamily: 'OpenSans-SemiBold',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FDF3EC',
    borderRadius: 5,
    backgroundColor: '#FDF3EC',
    height: 40,
    paddingRight: 40,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#FDF3EC',
    borderRadius: 5,
    backgroundColor: '#FDF3EC',
    height: 40,
    paddingHorizontal: 12,
    fontSize: 18,
    width: '100%',
    fontFamily: 'OpenSans-Medium',
  },
  registerBtn: {
    backgroundColor: '#171717',
    borderRadius: 20,
    paddingVertical: 12,
    marginRight: '5%',
    alignItems: 'center',
    marginTop: 30,
    alignSelf: 'flex-end',
    width: '40%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'OpenSans-SemiBold',
  },
  toLoginText: {
    marginTop: 'auto',
    marginBottom: 20,
    color: '#fff',
    fontSize: 18,
    fontFamily: 'OpenSans-Medium',
  },
  loginTxt: {
    color: '#7cbaf9',
    fontWeight: 'bold',
    fontFamily: 'OpenSans-Regular',
  },
});

export default Register;
