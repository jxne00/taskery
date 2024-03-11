import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    SafeAreaView,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../services/firebase';
import ErrorMessage from '../../components/UI/ErrorMsg';
import styles from './styles';

/**
 * The login screen component that allows users to login to
 * with an email and password.
 */
const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // password visibility
    const [isLoading, setIsLoading] = useState(false);
    const [focusedBox, setFocusedBox] = useState(''); // 'email' or 'password'
    const [errorMsg, setErrorMsg] = useState(null);

    const passwordRef = useRef(null);

    /** reset all fields */
    const resetFields = () => {
        setEmail('');
        setPassword('');
        setShowPassword(false);
        setErrorMsg(null);
    };

    /** navigate to registration screen */
    const registerPressed = () => {
        resetFields();
        navigation.navigate('Register');
    };

    /** login authentication with Firebase */
    const handleLogin = () => {
        setIsLoading(true);
        setErrorMsg(null);

        // check for empty fields
        if (!email || !password) {
            setErrorMsg('Please fill in all fields and try again.');
            setIsLoading(false);
            return;
        }

        // authenticate user with firebase
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                resetFields();
                navigation.navigate('HomeTabs');
            })
            .catch((err) => {
                // set error message to display
                if (
                    err.code === 'auth/invalid-email' ||
                    err.code === 'auth/wrong-password' ||
                    err.code === 'auth/invalid-login-credentials'
                ) {
                    setErrorMsg('Invalid Email or Password. Please try again.');
                } else {
                    setErrorMsg(err.message || 'Sign in failed. Please try again.');
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
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
                    <Text style={styles.title}>taskery</Text>
                    <Text style={styles.subtitle}>Login to your account</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Email:</Text>
                        <View
                            style={[
                                styles.inputBox,
                                focusedBox === 'email' && styles.focusedBox,
                            ]}>
                            <Ionicons name="person" size={20} color="#919090" />

                            {/* email input */}
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

                        <Text style={styles.inputLabel}>Password:</Text>
                        <View
                            style={[
                                styles.inputBox,
                                focusedBox === 'password' && styles.focusedBox,
                            ]}>
                            <Ionicons name="md-lock-closed" size={20} color="#919090" />

                            {/* password input */}
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

                            {/* show & hide password text */}
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
                    </View>

                    {/* error message */}
                    {errorMsg && (
                        <ErrorMessage errorMsg={errorMsg} style={styles.errorMsg} />
                    )}

                    {/* buttons */}
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={isLoading}
                            style={styles.loginBtn}>
                            <Text style={styles.loginText}>
                                {isLoading ? (
                                    <ActivityIndicator visible={isLoading} />
                                ) : (
                                    'Login'
                                )}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={registerPressed}
                            disabled={isLoading}
                            style={styles.registerBtn}>
                            <Text style={styles.registerText}>Register</Text>
                        </TouchableOpacity>
                    </View>
                    <StatusBar style="dark" />
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default Login;
