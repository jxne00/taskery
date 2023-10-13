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

import { auth } from '../../../utils/lib/firebase';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    if (!email || !password) {
      Alert.alert(
        'Oops',
        'Looks like you missed something.\nPlease fill in all fields and try again.',
      );
      return;
    }

    setIsLoading(true);

    auth
      .createUserWithEmailAndPassword(email, password)
      .then(setIsLoading(false))
      .then(() => {
        navigation.navigate('Onboarding');

        // clear all input fields
        setEmail('');
        setPassword('');
      })
      .catch((error) => {
        // check for existing email error
        if (error.code === 'auth/email-already-in-use')
          alert('Email is already is use.');
        else alert(error.message);
      });
  };

  const handleBackPress = () => {
    navigation.navigate('Login');

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
          color="black"
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
            placeholderStyle={styles.placeholder}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
          />

          {/* password input */}
          <Text style={styles.inputLabel}>Password:</Text>
          <TextInput
            value={password}
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderStyle={styles.placeholder}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />

          {/* signup button */}
          <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>
        </View>
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
    padding: 20,
    justifyContent: 'center',
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
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  inputContainer: {
    marginTop: 30,
  },
  inputLabel: {
    fontSize: 18,
    marginBottom: 5,
    marginLeft: 8,
    color: '#fff',
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 40,
    marginBottom: 20,
    fontSize: 18,
  },
  placeholder: {
    color: '#ccc',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  registerBtn: {
    backgroundColor: '#171717',
    borderRadius: 20,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'flex-end',
    width: '40%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Register;
