import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { storage } from '../../../services/firebase';

/**
 * An avatar image that shows a modal when clicked.
 * Choose from default avatars or upload from device.
 */
const SetAvatar = ({ chosenAvatar, setChosenAvatar }) => {
  const [avatarUrls, setAvatarUrls] = useState([]);
  const [current, setCurrent] = useState(0); // index of pressed avatar

  const [currentTab, setCurrentTab] = useState('default'); // 'default' or 'upload'
  const [image, setImage] = useState(null); // image from device

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    /** fetch avatar urls from firebase storage */
    const fetchAvatarUrls = async () => {
      let avatars = [];

      // get files name a1.png - a8.png from "/avatars" folder
      for (let i = 1; i <= 8; i++) {
        const path = `avatars/a${i}.png`;
        const url = await storage.ref(path).getDownloadURL();
        avatars.push(url);
      }

      setAvatarUrls(avatars);
    };

    fetchAvatarUrls().catch((err) => {
      alert('Error fetching avatar urls: ', err);
    });
  }, []);

  /** set a random avatar as the default */
  const getRandAvatar = () => {
    const rand = Math.floor(Math.random() * avatarUrls.length);
    setCurrent(rand);
  };

  /** set the chosen avatar */
  const handleConfirm = () => {
    if (currentTab === 'default' && avatarUrls[current]) {
      setChosenAvatar(avatarUrls[current]);
    }
    if (currentTab === 'upload' && image) {
      setChosenAvatar(image);
    }

    setCurrent(0);
    setModalVisible(false);
  };

  /** close modal without setting avatar */
  const handleCancel = () => {
    setCurrent(0);
    setImage(null);
    setModalVisible(false);
  };

  /** pick image from device's gallery */
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.5,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
    });

    // set image to user's uploaded image
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  /** capture image using camera */
  const takePhoto = async () => {
    if (Platform.OS === 'web') {
      return;
    }

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
      quality: 0.5, // mid quality
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* image of selected avatar */}
      <ImageBackground
        source={{ uri: chosenAvatar }}
        style={[
          styles.avatarImage,
          !chosenAvatar && { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
        ]}>
        <MaterialCommunityIcons
          name={chosenAvatar ? 'image-edit' : 'image-plus'}
          size={26}
          style={styles.editAvatarBtn}
          onPress={() => setModalVisible(true)}
        />

        {chosenAvatar && (
          // button to delete avatar image
          <MaterialCommunityIcons
            name="delete-outline"
            size={26}
            style={styles.deleteAvatarBtn}
            onPress={() => setChosenAvatar(null)}
          />
        )}
      </ImageBackground>

      {/* ==== modal to select new avatar ==== */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.tabRow}>
              {/* 'default' tab button */}
              <TouchableOpacity
                onPress={() => setCurrentTab('default')}
                style={[styles.tab, currentTab === 'default' && styles.activeTab]}>
                <Text style={styles.tabText}>Default</Text>
              </TouchableOpacity>

              {/* 'upload' tab button */}
              <TouchableOpacity
                onPress={() => setCurrentTab('upload')}
                style={[styles.tab, currentTab === 'upload' && styles.activeTab]}>
                <Text style={styles.tabText}>Upload</Text>
              </TouchableOpacity>
            </View>

            {/* show a list of preset avatars on 'default' tabs */}
            {currentTab === 'default' && (
              <>
                <Text style={styles.title}>Select Avatar:</Text>

                {/* display a list of default avatar images */}
                <View style={styles.avatarsRow}>
                  {avatarUrls.map((url, index) => (
                    <TouchableOpacity key={index} onPress={() => setCurrent(index)}>
                      <Image
                        source={{ uri: url }}
                        style={[
                          styles.avatarImg,
                          current === index && styles.selectedAvatar,
                        ]}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                <FontAwesome
                  name="random"
                  size={28}
                  color="#333333"
                  style={{ marginTop: 20 }}
                  onPress={getRandAvatar}
                />
              </>
            )}

            {/* show device image upload or camera on 'upload' tab */}
            {currentTab === 'upload' && (
              <>
                <Text style={styles.title}>Upload Avatar:</Text>

                <View style={styles.imageBox}>
                  {image ? (
                    // show image if there is one
                    <Image source={{ uri: image }} style={styles.uploadedImage} />
                  ) : (
                    // show 'upload' or 'camera' icon if there is no image
                    <View style={styles.iconRow}>
                      {/* icon to select image from gallery */}
                      <MaterialCommunityIcons
                        name="upload"
                        size={40}
                        color="#333333"
                        style={{ marginRight: 20 }}
                        onPress={pickImage}
                      />
                      {/* icon to capture image with camera */}
                      <MaterialCommunityIcons
                        name="camera"
                        size={40}
                        color="#333333"
                        onPress={takePhoto}
                      />
                    </View>
                  )}
                </View>

                {/* show button to delete image if there is one */}
                {image && (
                  <MaterialCommunityIcons
                    name="delete"
                    size={30}
                    color="#333333"
                    onPress={() => setImage(null)}
                  />
                )}
              </>
            )}

            {/* cancel & confirm buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={handleCancel}
                style={[styles.buttonContainer, { backgroundColor: '#5f5f5f' }]}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirm}
                style={[styles.buttonContainer, { backgroundColor: '#15a472' }]}>
                <Text style={styles.btnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatarImage: {
    width: 130,
    height: 130,
  },
  editAvatarBtn: {
    color: '#ffffff',
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000000',
    opacity: 0.7,
    padding: 3,
  },
  deleteAvatarBtn: {
    color: '#f1f1f1',
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#383838',
    opacity: 0.7,
    padding: 3,
  },

  // ====== MODAL STYLES ======
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalView: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '90%',
  },

  // tab button styles
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderColor: '#ccc',
  },
  tab: {
    padding: 10,
    borderBottomWidth: 3,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: '#0072e3',
  },
  tabText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },

  // "default" tab styles
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontFamily: 'Inter-Bold',
  },
  avatarsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  avatarImg: {
    width: width / 4,
    height: width / 4,
    margin: 2,
  },

  // "upload" tab styles
  imageBox: {
    width: width / 2,
    height: width / 2,
    borderWidth: 2,
    borderColor: '#333333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  // cancel & confirm buttons
  selectedAvatar: {
    borderWidth: 2,
    borderColor: '#5119c0',
    borderRadius: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonContainer: {
    width: '40%',
    padding: 10,
    borderRadius: 10,
    margin: 8,
  },

  btnText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
});

export default SetAvatar;
