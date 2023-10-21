import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Modal,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { fetchAvatarUrls } from '../../../utils/firebase/helper';

/**
 * an avatar image that shows a modal when clicked.
 * users can choose from default avatar images
 * or upload one from their device.
 *
 * @param {object} props modalVisible, setModalVisible, chosenAvatar, setChosenAvatar
 */
const AvatarModal = ({ chosenAvatar, setChosenAvatar }) => {
  const [avatarUrls, setAvatarUrls] = useState([]);
  const [current, setCurrent] = useState(0); // avatar that user clicks on

  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [currentTab, setCurrentTab] = useState('default'); // 'default' or 'upload'
  const [image, setImage] = useState(null); // image uploaded from device

  // fetch avatar urls from firebase storage
  useEffect(() => {
    const fetchUrls = async () => {
      setIsLoading(true);

      try {
        const urls = await fetchAvatarUrls();
        setAvatarUrls(urls);
      } catch (err) {
        alert('Error fetching avatar images', err.message);
      }

      setIsLoading(false);
    };

    fetchUrls();
  }, []);

  // set a random avatar as the default
  const getRandAvatar = () => {
    const rand = Math.floor(Math.random() * avatarUrls.length);
    setCurrent(rand);
  };

  // set the chosen avatar
  const handleSubmit = () => {
    setChosenAvatar(current);

    setCurrent(0);
    setModalVisible(false);
  };

  // close modal without setting avatar
  const handleCancel = () => {
    setCurrent(0);
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
      setImage(result.uri);
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
      setImage(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* image of selected avatar */}
      {isLoading ? (
        <ActivityIndicator size="small" color="#000000" />
      ) : (
        <ImageBackground
          source={{
            uri: avatarUrls[chosenAvatar],
          }}
          style={[
            styles.avatarImage,
            !chosenAvatar && { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
          ]}>
          <MaterialCommunityIcons
            name="image-edit-outline"
            size={26}
            style={styles.editAvatarBtn}
            onPress={() => setModalVisible(true)}
          />
        </ImageBackground>
      )}

      {/* modal to select new avatar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {/* buttons to set the tab to display */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                onPress={() => setCurrentTab('default')}
                style={[
                  styles.tab,
                  currentTab === 'default' && styles.activeTab,
                ]}>
                <Text style={styles.tabText}>Default</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCurrentTab('upload')}
                style={[
                  styles.tab,
                  currentTab === 'upload' && styles.activeTab,
                ]}>
                <Text style={styles.tabText}>Upload</Text>
              </TouchableOpacity>
            </View>

            {/* if "default" tab is selected, show a list a avatars to choose from */}
            {currentTab === 'default' && (
              <>
                <Text style={styles.title}>Select Avatar:</Text>

                {/* display default avatar images from firebase storage */}
                <View style={styles.avatarsRow}>
                  {avatarUrls.map((url, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setCurrent(index)}>
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

                {/* cancel & confirm buttons */}
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.buttonContainer, styles.cancelBg]}
                    onPress={handleCancel}>
                    <Text style={styles.btnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.buttonContainer, styles.confirmBg]}
                    onPress={handleSubmit}>
                    <Text style={styles.btnText}>Set Avatar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* if "upload" tab is selected, show a button to upload an image from device */}
            {currentTab === 'upload' && (
              <>
                <Text style={styles.title}>Upload Avatar:</Text>

                <View style={styles.imageBox}>
                  {image ? (
                    // show image if there is one
                    <Image
                      source={{ uri: image }}
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    // show 'upload' or 'camera' icon if there is no image
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}>
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

                {/* cancel & confirm buttons */}
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={[styles.buttonContainer, styles.cancelBg]}>
                    <Text style={styles.btnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={[styles.buttonContainer, styles.confirmBg]}>
                    <Text style={styles.btnText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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

  // tabs
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

  // "default" tab
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
    margin: 4,
  },
  selectedAvatar: {
    borderWidth: 2,
    borderColor: '#0072e3',
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
  cancelBg: {
    backgroundColor: '#5f5f5f',
  },
  confirmBg: {
    backgroundColor: '#15a472',
  },
  btnText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },

  // "upload" tab
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
});

export default AvatarModal;
