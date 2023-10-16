import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { auth, db } from '../../utils/config/firebase';
import { useTheme } from '../../utils/theme/ThemeContext';

const Tasklist = () => {
  const { theme } = useTheme();

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // get user id
  const userId = auth.currentUser.uid;

  // get tasks from firestore: users/{userId}/tasks
  useEffect(() => {
    try {
      setIsLoading(true);

      db.collection('users')
        .doc(userId)
        .collection('tasks')
        .onSnapshot((snapshot) => {
          const tasks = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(tasks);
          setIsLoading(false);
        });

      setIsLoading(false);
    } catch (error) {
      alert(error);
    }
  }, []);

  // show loading indicator while getting tasks
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.textLight} />
      </View>
    );
  }

  // render flatlist item
  const renderTask = ({ item }) => (
    <View style={[styles.taskContainer, { borderColor: theme.textLight }]}>
      <View style={styles.toprow}>
        {/* task completion status */}
        <Text style={[styles.taskStatus, { color: theme.textLight }]}>
          <AntDesign
            name={item.status ? 'checkcircle' : 'closecircle'}
            size={18}
            color={item.status ? theme.green : theme.red}
          />{' '}
          {item.status ? 'Completed' : 'Not Done'}
        </Text>

        {/* deadline */}
        <Text style={[styles.taskDeadline, { color: theme.textLight }]}>
          <AntDesign name="calendar" size={18} color={theme.textLight} />{' '}
          {item.deadline?.toDate().toLocaleDateString()}
        </Text>
      </View>

      <Text style={[styles.taskTitle, { color: theme.text }]}>
        {item.title}
      </Text>

      {/* details of task (only if available) */}
      {item.details && (
        <Text style={[styles.taskDetail, { color: theme.text }]}>
          {item.details}
        </Text>
      )}

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
                  borderColor: theme.textLight,
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
    </View>
  );

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={renderTask}
      style={{ width: '90%' }}
    />
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  taskTitle: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  taskDetail: {
    fontSize: 18,
  },
  tagContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  tagBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 15,
    marginLeft: 5,
  },
});

export default Tasklist;
