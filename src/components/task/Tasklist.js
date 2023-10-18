import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import { useTheme } from '../../../utils/theme/ThemeContext';
import ContextMenu from './ContextMenu';

/**
 * a flatlist of tasks with its details
 * @param {array} tasklist - list of tasks
 * @param {function} handleEdit - handle editing of task
 * @param {function} handleDelete - handle deleting of task
 */
const Tasklist = ({ tasklist, handleEdit, handleDelete }) => {
  const { theme } = useTheme();

  const handleMenuPress = (value, id) => {
    if (value === 'edit') {
      handleEdit(id);
    }
    if (value === 'delete') {
      handleDelete(id);
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
            size={18}
            color={item.status ? theme.green : theme.appName}
          />{' '}
          {item.status ? 'Completed' : 'Not Done'}
        </Text>

        {/* deadline */}
        <Text style={[styles.taskDeadline, { color: theme.textLight }]}>
          <AntDesign name="calendar" size={18} color={theme.textLight} />{' '}
          {item.deadline}
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
                  {
                    backgroundColor: theme.backgroundSec,
                    borderColor: tag.color,
                  },
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
        <ContextMenu handleMenuPress={handleMenuPress} id={item.id} />
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
    width: '90%',
  },
  taskContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 10,
  },
  toprow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskStatus: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  taskDeadline: {
    fontSize: 18,
    fontFamily: 'OpenSans-Medium',
  },
  taskTitle: {
    marginTop: 6,
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
  },
  taskDetail: {
    fontSize: 18,
    fontFamily: 'OpenSans-Medium',
  },
  tagContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  tagBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginRight: 6,
    borderWidth: 2,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 14,
    marginLeft: 5,
    fontFamily: 'OpenSans-SemiBold',
  },
  btmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default Tasklist;
