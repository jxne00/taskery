import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AvatarModal from '../../components/modals/AvatarModal';

import { Ionicons } from '@expo/vector-icons';

import { auth, db } from '../../../utils/config/firebase';

const Onboarding = ({ navigation }) => {
  const [name, setName] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNextPress = () => {
    setIsLoading(true);

    // get current user
    const user = auth.currentUser;

    if (user.uid) {
      db.collection('users')
        .doc(user.uid)
        .set(
          {
            name: name,
            avatar_path: `a${avatarIndex + 1}.png`,
            is_public: false,
            created_at: new Date(),
          },
          { merge: true },
        )
        .then(() => {
          setIsLoading(false);
          // navigate to main screens
          navigation.navigate('HomeTabs');
        })
        .catch((error) => {
          Alert.alert('Error', error.message);
        });
    } else {
      setIsLoading(false);
      Alert.alert('Error', 'User not found.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Taskery!</Text>

        <Text style={styles.subtitle}>Set up your profile to get started.</Text>

        <Text style={styles.subsubtitle}>
          Your name and avatar will be visible to other users in the community.
          Feel free to use a nickname or alias if you prefer.
        </Text>

        <AvatarModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          avatarIndex={avatarIndex}
          setAvatarIndex={setAvatarIndex}
        />

        <View style={styles.inputContainer}>
          {/* name input */}
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            value={name}
            style={styles.textInput}
            placeholder="Enter your name, nickname or alias"
            placeholderTextColor={'#afafaf'}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            onChangeText={(text) => setName(text)}
          />

          {/* next button */}
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => handleNextPress()}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <View style={styles.nextBtnContainer}>
                <Text style={styles.nextBtnText}>Continue</Text>
                <Ionicons
                  name="arrow-forward-circle-outline"
                  color={'#fff'}
                  size={28}
                />
              </View>
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
    backgroundColor: '#907563',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ebd8cc',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#f3eae4',
    marginBottom: 20,
    textAlign: 'center',
  },
  subsubtitle: {
    fontSize: 18,
    color: '#ede4dd',
    marginBottom: 30,
    textAlign: 'center',
  },

  inputContainer: {
    marginTop: 30,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff',
  },
  textInput: {
    padding: 10,
    borderBottomColor: '#d6d6d6',
    borderBottomWidth: 1,
    fontSize: 18,
    color: '#e9e9e9',
  },

  nextBtn: {
    backgroundColor: '#258952',
    padding: 10,
    borderRadius: 5,
    marginTop: '20%',
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  nextBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 10,
  },
});

export default Onboarding;
