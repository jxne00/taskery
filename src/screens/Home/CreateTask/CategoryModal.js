import react, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

const CategoryModal = (props) => {
  const {
    showCategoryModal,
    setShowCategoryModal,
    selectedCategory,
    setSelectedCategory,
    theme,
  } = props;

  const categories = [
    { id: 1, name: 'Work', value: 'Work' },
    { id: 2, name: 'School', value: 'School' },
    { id: 3, name: 'Personal', value: 'Personal' },
    { id: 4, name: 'No Category', value: null },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showCategoryModal}
      onRequestClose={() => setShowCategoryModal(false)}>
      <View style={styles.container}>
        <View
          style={[
            styles.innerContainer,
            { backgroundColor: theme.background },
          ]}>
          <Text style={styles.title}>Select Category:</Text>

          {/* display button for each category */}
          <View styles={styles.row}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.value)}
                style={[
                  styles.btn,
                  {
                    backgroundColor:
                      selectedCategory && selectedCategory === category.value
                        ? theme.orange
                        : theme.background,
                  },
                ]}>
                <Text style={styles.btnText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* button to close modal */}
          <TouchableOpacity
            style={[
              styles.btn,
              { backgroundColor: theme.blue, alignSelf: 'flex-end' },
            ]}
            onPress={() => setShowCategoryModal(false)}>
            <Text style={[styles.closeBtnText, { color: '#fff' }]}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  innerContainer: {
    borderRadius: 20,
    padding: 20,
    width: '90%',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontFamily: 'Inter-Bold',
  },
  row: {
    flexDirection: 'row',
  },
  btn: {
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    margin: 4,
  },
  btnText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    padding: 8,
  },
  closeBtnText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    padding: 8,
  },
});

export default CategoryModal;
