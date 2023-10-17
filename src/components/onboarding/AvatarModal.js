import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Modal } from 'react-native';

/**
 * A modal to allow selection of an avatar image from a list of predefined ones
 *
 * @param {object} props modalVisible, setModalVisible, avatarIndex, setAvatarIndex
 */
const AvatarModal = (props) => {
  const { modalVisible, setModalVisible, avatarIndex, setAvatarIndex } = props;

  // predefined avatar images
  // src: https://www.freepik.com/free-vector/smiling-people-avatar-set-different-men-women-characters-collection_13663484.htm
  const avatars = [
    require('../../../assets/avatars/a1.png'),
    require('../../../assets/avatars/a2.png'),
    require('../../../assets/avatars/a3.png'),
    require('../../../assets/avatars/a4.png'),
    require('../../../assets/avatars/a5.png'),
    require('../../../assets/avatars/a6.png'),
    require('../../../assets/avatars/a7.png'),
    require('../../../assets/avatars/a8.png'),
  ];

  const [chosenAvatar, setChosenAvatar] = useState(avatarIndex);

  // set the chosen avatar
  const handleSetAvatar = () => {
    setAvatarIndex(chosenAvatar);
    setModalVisible(false);
  };

  // close modal and reset chosen avatar
  const handleCancel = () => {
    setChosenAvatar(avatarIndex);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* image of selected avatar */}
      <ImageBackground source={avatars[avatarIndex]} style={styles.avatarImage}>
        <MaterialCommunityIcons
          name="image-edit-outline"
          size={30}
          style={styles.editAvatarBtn}
          onPress={() => setModalVisible(true)}
        />
      </ImageBackground>

      {/* modal to select new avatar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.title}>Select Avatar:</Text>

            {/* display predefined avatar images */}
            <View style={styles.avatarsRow}>
              {avatars.map((avatar, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setChosenAvatar(index)}>
                  <Image
                    source={avatar}
                    style={[
                      styles.avatarImg,
                      chosenAvatar === index && styles.selectedAvatar,
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.buttonContainer, styles.cancelBg]}
                onPress={handleCancel}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.buttonContainer, styles.confirmBg]}
                onPress={handleSetAvatar}>
                <Text style={styles.btnText}>Set Avatar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
    padding: 35,
    alignItems: 'center',
    width: '85%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatarsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  avatarImg: {
    width: 80,
    height: 80,
    margin: 6,
  },
  selectedAvatar: {
    borderWidth: 2,
    borderColor: '#0119b5',
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
  },
});

export default AvatarModal;
