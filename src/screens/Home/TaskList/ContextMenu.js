import React from 'react';
import { Text, StyleSheet } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../theme/ThemeContext';

/**
 * A context menu to edit, duplicate or delete a task
 *
 * @param {function} handleMenuPress - function to handle context menu press
 */
const ContextMenu = ({ handleMenuPress, id }) => {
  const { theme } = useTheme();

  return (
    <Menu onSelect={(value) => handleMenuPress(value, id)}>
      <MenuTrigger>
        <Ionicons name="ellipsis-vertical" size={20} color={theme.text} />
      </MenuTrigger>

      <MenuOptions
        optionsContainerStyle={{
          backgroundColor: theme.background,
          borderColor: theme.text,
          borderWidth: 1,
          borderRadius: 5,
          paddingVertical: 5,
        }}>
        <MenuOption value="edit">
          <Text style={[style.text, { color: theme.text }]}>Edit</Text>
        </MenuOption>

        <MenuOption value="duplicate">
          <Text style={[style.text, { color: theme.text }]}>Duplicate</Text>
        </MenuOption>

        <MenuOption value="delete">
          <Text style={[style.text, { color: theme.text }]}>Delete</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

const style = StyleSheet.create({
  text: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
});

export default ContextMenu;
