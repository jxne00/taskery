import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const TagComponent = (props) => {
  const {
    tag,
    setTag,
    tags,
    presetColors,
    selectedColor,
    setSelectedColor,
    addTag,
    removeTag,
    theme,
  } = props;

  return (
    <View style={styles.tagsContainer}>
      {/* tag color choices */}
      <View style={styles.colorContainer}>
        {presetColors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.colorOption, { backgroundColor: color }]}
            onPress={() => setSelectedColor(color)}>
            {selectedColor === color && <Text>✔</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {/* add new tag */}
      <View style={styles.tagRow}>
        <TextInput
          value={tag}
          onChangeText={setTag}
          placeholder="Add Tag"
          placeholderTextColor={theme.textLight}
          style={styles.tagInput}
          autoCapitalize="none"
          autoComplete="off"
        />
        <Text onPress={addTag} style={[global.text, styles.addTagBtn]}>
          Add
        </Text>
      </View>

      {/* list of added tags */}
      {tags.map((t, index) => (
        <View key={index} style={styles.row}>
          <AntDesign
            name={'closecircle'}
            size={24}
            color={theme.btnRed}
            style={styles.Xicon}
            onPress={() => removeTag(index)}
          />
          <View
            style={[styles.tag, { backgroundColor: t.color, marginRight: 10 }]}
          />
          <Text style={global.text}>{t.name}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tagsContainer: {
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    flex: 1,
    fontFamily: 'Inter-Regular',
  },
  addTagBtn: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d4d4d4',
    backgroundColor: '#1e1c1c',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 14,
  },
  colorOption: {
    width: 25,
    height: 25,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },

  tag: {
    padding: 10,
    borderRadius: 5,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  Xicon: {
    marginRight: 12,
  },
});

export default TagComponent;
