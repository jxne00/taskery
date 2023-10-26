import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import { useTheme } from '../../../theme/ThemeContext';
import { toDateDisplay } from '../../../components/helper/timeConverters';

/**
 * a flatlist of tasks with its details
 * @param {array} tasklist - list of tasks
 * @param {function} handleEdit - handle editing of task
 * @param {function} handleDelete - handle deleting of task
 */
const TaskList = ({ tasklist, handleEdit, handleDelete }) => {
  const { theme } = useTheme();

  const handleMenuPress = (value, id) => {
    switch (value) {
      case 'edit':
        handleEdit(id);
        break;
      case 'delete':
        handleDelete(id);
        break;
      case 'duplicate':
        // TODO implement duplicate task
        console.log('duplicate pressed');
        break;
      default:
        break;
    }
  };

  // render flatlist item
  const renderTask = ({ item }) => (
    <View style={[styles.taskContainer, { borderColor: theme.textLight }]}>
      <View style={styles.toprow}>
        {/* task completion status */}
        <Text style={[styles.taskStatus, { color: theme.textLight }]}>
          <AntDesign
            name={item.status ? 'checkcircle' : 'closecircle'}
            size={16}
            color={item.status ? theme.green : theme.appName}
          />{' '}
          {item.status ? 'Completed' : 'Not Done'}
        </Text>

        {/* deadline */}
        <Text style={[styles.taskDeadline, { color: theme.textLight }]}>
          <AntDesign name="calendar" size={16} color={theme.textLight} />{' '}
          {toDateDisplay(item.deadline)}
        </Text>
      </View>

      <Text style={[styles.taskTitle, { color: theme.text }]}>
        {item.title}
      </Text>

      {/* details of task */}
      {item.details && (
        <Text style={[styles.taskDetail, { color: theme.text }]}>
          {item.details}
        </Text>
      )}

      <View style={styles.btmRow}>
        {/* tags */}
        {item.tags && (
          <View style={styles.tagContainer}>
            {item.tags.map((tag) => (
              <View
                key={tag.name}
                style={[
                  styles.tagBox,
                  { backgroundColor: theme.backgroundSec },
                ]}>
                <AntDesign name="tag" size={16} color={tag.color} />
                <Text style={[styles.tagText, { color: theme.text }]}>
                  {tag.name}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* context menu */}
        <Menu onSelect={(value) => handleMenuPress(value, item.id)}>
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
              <Text style={[styles.MenuOptionText, { color: theme.text }]}>
                Edit
              </Text>
            </MenuOption>

            <MenuOption value="duplicate">
              <Text style={[styles.MenuOptionText, { color: theme.text }]}>
                Duplicate
              </Text>
            </MenuOption>

            <MenuOption value="delete">
              <Text style={[styles.MenuOptionText, { color: theme.text }]}>
                Delete
              </Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );

  return (
    <FlatList
      data={tasklist}
      keyExtractor={(item) => item.id}
      renderItem={renderTask}
      style={styles.flatlist}
    />
  );
};

const styles = StyleSheet.create({
  flatlist: {
    width: '94%',
  },
  taskContainer: {
    padding: 10,
    borderWidth: 1,
    marginVertical: 6,
    borderRadius: 6,
  },
  toprow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskStatus: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  taskDeadline: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  taskTitle: {
    marginTop: 6,
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
  },
  taskDetail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  tagContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  tagBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    marginRight: 6,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 14,
    marginLeft: 5,
    fontFamily: 'Inter-SemiBold',
  },
  btmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  MenuOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
});

export default TaskList;
