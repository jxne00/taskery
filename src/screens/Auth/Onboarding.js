import React, { useEffect, useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';

import AvatarModal from '../../components/onboarding/AvatarModal';
import InfoBox from '../../components/shared/InfoBox';

import { auth, db } from '../../services/firebase/config';

/**
 * The onboarding screen for setting up the user's profile details
 * (name, avatar image)
 */
const Onboarding = ({ navigation }) => {
  const [name, setName] = useState('');
  const [chosenAvatar, setChosenAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNextPress = () => {
    console.log('todo: store details to firebase');
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

let PRIMARY_COL = '#583492';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDF3EC',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FDF3EC',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    color: PRIMARY_COL,
    marginBottom: 10,
    fontFamily: 'PoetsenOne-Regular',
  },
  subtitle: {
    fontSize: 16,
    color: '#232323',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },

  inputContainer: {
    marginTop: 30,
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    color: PRIMARY_COL,
    fontFamily: 'Inter-Bold',
    paddingRight: 5,
  },
  textInput: {
    padding: 10,
    borderBottomColor: '#5d5d5d',
    borderBottomWidth: 1,
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Inter-Medium',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  nextBtn: {
    backgroundColor: PRIMARY_COL,
    paddingVertical: 8,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '40%',
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 18,
    marginRight: 10,
    fontFamily: 'Inter-SemiBold',
  },
});

export default Onboarding;
