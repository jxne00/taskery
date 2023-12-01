// TODO a modal displaying details of post

import React from 'react';
import { StyleSheet, Modal, Text, View, Alert, TouchableOpacity } from 'react-native';

import { useTheme } from '../../../hooks/useThemeContext';

const PostDetails = ({ post }) => {
    const { theme } = useTheme();

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={[styles.modalText, { color: theme.text }]}>
                        Hello World!
                    </Text>

                    <TouchableOpacity
                        style={[styles.openButton, { backgroundColor: '#2196F3' }]}
                        onPress={() => {
                            // setModalVisible(!modalVisible);
                        }}>
                        <Text style={[styles.textStyle, { color: theme.text }]}>
                            Hide Modal
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        // margin: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 35,
        // alignItems: 'center',
        // shadowColor: '#000',
        // shadowOffset: {
        //   width: 0,
        //   height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    openButton: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        fontFamily: 'Inter-Regular',
        textAlign: 'center',
    },
});

export default PostDetails;
