import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * An info icon that shows a modal with text when clicked
 *
 * @param {string} title title of the popup
 * @param {string} text text to display in the popup
 * @param {string} iconColor color of the info icon
 * @param {string} bgColor background color of the popup
 */
const InfoBox = ({ title, text, iconColor, bgColor }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Ionicons name="information-circle-sharp" size={22} color={iconColor} />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={styles.overlay}
          onStartShouldSetResponder={() => setModalVisible(false)}>
          <View style={[styles.tooltip, { backgroundColor: bgColor }]}>
            <View style={styles.row}>
              <Ionicons name="information-circle-sharp" size={22} color="#000000" />

              <Text style={styles.title}>{title}</Text>
            </View>

            <Text style={styles.text}>{text}</Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  tooltip: {
    zIndex: 10000,
    maxWidth: '80%',
    padding: 16,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default InfoBox;
