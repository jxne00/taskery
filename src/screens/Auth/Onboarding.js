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
import * as ImagePicker from 'expo-image-picker';

import AvatarModal from '../../components/onboarding/AvatarModal';

import { auth, db } from '../../../utils/firebase/config';

/**
 * This screen is for setting up the user's profile details
 * (name, avatar image)
 */
const Onboarding = ({ navigation }) => {
  const [name, setName] = useState('');
  const [chosenAvatar, setChosenAvatar] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploaded, setUploaded] = useState(null);

  // pick image from device's gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    // set the user's uploaded image
    if (!result.canceled) {
      console.log('selected image: ', result);

      const response = await fetch(result.uri);
      setUploaded(await response.blob());
    } else {
      alert('You did not select any image.');
    }
  };

  // capture image using camera
  const takePhoto = async () => {
    // get permisson to access camera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    // return if permission not granted
    if (status !== 'granted') {
      alert('Please allow camera access to use this feature.');
      return;
    }

    // open camera
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log('picture taken: ', result);
    } else {
      console.log('no image selected');
    }
  };

  const handleNextPress = () => {
    console.log('store details to firebase');
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
          chosenAvatar={chosenAvatar}
          setChosenAvatar={setChosenAvatar}
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

          {/* button */}
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
    textAlign: 'center',
    color: '#ebd8cc',
    marginBottom: 10,
    fontFamily: 'OpenSans-Bold',
  },
  subtitle: {
    fontSize: 20,
    color: '#f3eae4',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
  },
  subsubtitle: {
    fontSize: 18,
    color: '#ede4dd',
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
  },

  inputContainer: {
    marginTop: 30,
  },
  inputLabel: {
    fontSize: 18,
    marginBottom: 5,
    color: '#fff',
    fontFamily: 'OpenSans-Bold',
  },
  textInput: {
    padding: 10,
    borderBottomColor: '#d6d6d6',
    borderBottomWidth: 1,
    fontSize: 18,
    color: '#e9e9e9',
    fontFamily: 'OpenSans-Regular',
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
    textAlign: 'center',
    marginRight: 10,
    fontFamily: 'OpenSans-SemiBold',
  },
});

export default Onboarding;
