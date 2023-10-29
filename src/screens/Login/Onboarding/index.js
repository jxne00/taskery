import React, { useState } from 'react';
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

import SetAvatar from './SetAvatar';
import { auth, db, storage } from '../../../services/firebase';
import InfoBox from '../../../components/InfoBox';
import styles from './styles';

/**
 * The onboarding screen for setting up the user's profile details
 * (name, avatar image)
 */
const Onboarding = ({ navigation }) => {
  const [name, setName] = useState('');
  const [chosenAvatar, setChosenAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const userId = auth.currentUser.uid;

  /** store the user's profile detail into firestore */
  const finishOnboarding = () => {
    if (name.length === 0) {
      setErrorMsg('Please set a name, nickname or alias');
      return;
    }

    setIsLoading(true);

    if (chosenAvatar) {
      // store image & get download url
      const avatarUrl = storeAvatar();

      // update user document in firestore
      avatarUrl
        .then((url) => {
          if (url) {
            db.collection('users')
              .doc(userId)
              .set({
                name,
                avatar_path: url,
              })
              .then(() => {
                setIsLoading(false);
                // go to home screen on success
                navigation.navigate('HomeTabs');
              });
          } else {
            db.collection('users')
              .doc(userId)
              .set({
                name,
              })
              .then(() => {
                setIsLoading(false);
                // go to home screen on success
                navigation.navigate('HomeTabs');
              });
          }
        })
        .catch((err) => {
          setIsLoading(false);
          Alert.alert('Error setting up profile: ', err.message);
        });
    }
  };

  /** store user's avatar image to firebase storage */
  const storeAvatar = async () => {
    // store in storage path 'usersAvatar/{userId}'
    const storageRef = storage.ref(`usersAvatar/${userId}`);

    // convert to blob and upload
    const response = await fetch(chosenAvatar);
    const blob = await response.blob();
    await storageRef.put(blob);

    // return download url
    const url = await storageRef.getDownloadURL();
    return url;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to taskery!</Text>

        <Text style={styles.subtitle}>Set up your profile to get started.</Text>

        <SetAvatar chosenAvatar={chosenAvatar} setChosenAvatar={setChosenAvatar} />

        <View style={styles.inputContainer}>
          {/* name input */}
          <View style={styles.row}>
            <Text style={styles.inputLabel}>Name</Text>
            <InfoBox
              title={'Privacy Notice'}
              text={
                'Your profile name and avatar will be visible to other users in the community. You can edit these details anytime you want in the Settings later.'
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

          {/* error message */}
          {errorMsg && <Text style={styles.errorMsg}>{errorMsg}</Text>}

          {/* button */}
          <TouchableOpacity style={styles.nextBtn} onPress={finishOnboarding}>
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
