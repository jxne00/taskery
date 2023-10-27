import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AvatarModal from './AvatarModal';
import InfoBox from '../../../components/InfoBox';

import styles from './styles';

import { auth, db } from '../../../services/firebase/firebaseConfig';

/**
 * The onboarding screen for setting up the user's profile details
 * (name, avatar image)
 */
const Onboarding = ({ navigation }) => {
  const [name, setName] = useState('');
  const [chosenAvatar, setChosenAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNextPress = () => {
    // TODO store onboarding details to firestore
    console.log('todo: store details to firestore');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to taskery!</Text>

        <Text style={styles.subtitle}>Set up your profile to get started.</Text>

        <AvatarModal
          chosenAvatar={chosenAvatar}
          setChosenAvatar={setChosenAvatar}
        />

        <View style={styles.inputContainer}>
          {/* name input */}
          <View style={styles.row}>
            <Text style={styles.inputLabel}>Name</Text>
            <InfoBox
              title={'Privacy Notice'}
              text={
                'Your profile name and avatar will be visible to other users in the community.\nYou can change these details anytime you want later in the Settings.'
              }
              iconColor={'#3c3c3c'}
              bgColor={'#c7c7c7'}
            />
          </View>

          <TextInput
            value={name}
            style={styles.textInput}
            placeholder="Enter a name, nickname or alias"
            placeholderTextColor={'#afafaf'}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            onChangeText={(text) => setName(text)}
          />

          {/* button */}
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => handleNextPress()}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Text style={styles.nextBtnText}>Continue</Text>
                <Ionicons
                  name="arrow-forward-circle-outline"
                  color={'#fff'}
                  size={24}
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default Onboarding;
