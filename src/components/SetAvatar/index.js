import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Modal,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../services/firebase';
import styles from './styles';

/**
 * A modal to set user's avatar
 * @param {string} chosenAvatar - user's current avatar
 * @param {function} setChosenAvatar - function to set the chosen avatar
 * @param {object} theme - theme object
 */
const SetAvatar = ({ chosenAvatar, setChosenAvatar, theme }) => {
    const [avatarUrls, setAvatarUrls] = useState([]);
    const [current, setCurrent] = useState(0); // index of pressed avatar
    const [currentTab, setCurrentTab] = useState('default'); // 'default' or 'upload'
    const [image, setImage] = useState(null); // image from device
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingStates, setLoadingStates] = useState({});
    const [loading, setLoading] = useState(false);

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

    /** activate the loading state for avatar images */
    const handleLoadStart = (index) => {
        setLoadingStates((prevState) => ({ ...prevState, [index]: true }));
    };

    /** end the loading state for avatar images */
    const handleLoadEnd = (index) => {
        setLoadingStates((prevState) => ({ ...prevState, [index]: false }));
    };

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
            <View>
                {loading && (
                    <ActivityIndicator
                        size="large"
                        color={theme ? theme.text : '#000000'}
                    />
                )}

                <Image
                    source={{ uri: chosenAvatar }}
                    style={[
                        styles.avatarImage,
                        !chosenAvatar && { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
                    ]}
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                />
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={styles.editAvatarBtn}>
                    <Ionicons name="pencil" size={28} />
                </TouchableOpacity>
            </View>

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
                                style={[
                                    styles.tab,
                                    currentTab === 'default' && styles.activeTab,
                                ]}>
                                <Text style={styles.tabText}>Default</Text>
                            </TouchableOpacity>

                            {/* 'upload' tab button */}
                            <TouchableOpacity
                                onPress={() => setCurrentTab('upload')}
                                style={[
                                    styles.tab,
                                    currentTab === 'upload' && styles.activeTab,
                                ]}>
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
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => setCurrent(index)}>
                                            <View style={styles.imageContainer}>
                                                {loadingStates[index] && (
                                                    <ActivityIndicator
                                                        size="small"
                                                        color="#252525"
                                                    />
                                                )}
                                                <Image
                                                    source={{ uri: url }}
                                                    style={[
                                                        styles.avatarImg,
                                                        current === index &&
                                                            styles.selectedAvatar,
                                                    ]}
                                                    onLoadStart={() =>
                                                        handleLoadStart(index)
                                                    }
                                                    onLoadEnd={() =>
                                                        handleLoadEnd(index)
                                                    }
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <Ionicons
                                    name="shuffle"
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
                                        <Image
                                            source={{ uri: image }}
                                            style={styles.uploadedImage}
                                        />
                                    ) : (
                                        // show 'upload' or 'camera' icon if there is no image
                                        <View>
                                            {/* select image from gallery */}
                                            <TouchableOpacity
                                                onPress={pickImage}
                                                style={styles.iconRow}>
                                                <Ionicons
                                                    name="push"
                                                    size={30}
                                                    color="#262626"
                                                    style={{ marginRight: 10 }}
                                                />
                                                <Text style={styles.iconRowText}>
                                                    Upload
                                                </Text>
                                            </TouchableOpacity>

                                            {/* capture image with camera */}
                                            <TouchableOpacity
                                                onPress={takePhoto}
                                                style={styles.iconRow}>
                                                <Ionicons
                                                    name="camera"
                                                    size={30}
                                                    color="#262626"
                                                    style={{ marginRight: 10 }}
                                                />
                                                <Text style={styles.iconRowText}>
                                                    Capture
                                                </Text>
                                            </TouchableOpacity>
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
                                style={[
                                    styles.buttonContainer,
                                    { backgroundColor: '#5f5f5f' },
                                ]}>
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleConfirm}
                                style={[
                                    styles.buttonContainer,
                                    { backgroundColor: '#15a472' },
                                ]}>
                                <Text style={styles.btnText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default SetAvatar;
