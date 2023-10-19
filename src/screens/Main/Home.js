import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import CustomStatusBar from '../../components/StatusBar';
import { useTheme } from '../../../utils/theme/ThemeContext';
import useGlobalStyles from '../../../utils/hooks/globalStyles';

import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../../../utils/redux/actions/taskActions';
import { auth } from '../../../utils/firebase/config';

import Tasklist from '../../components/task/Tasklist';
import TaskDetails from '../../components/task/TaskDetails';

const Home = () => {
  const { theme, themeType } = useTheme();
  const global = useGlobalStyles();
  const dispatch = useDispatch(); // redux dispatch

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const userId = auth.currentUser.uid; // current user's id
  const { tasks, isLoading, error } = useSelector((state) => state.tasks);

  // fetch tasks
  useEffect(() => {
    const unsubscribe = dispatch(fetchTasks(userId));

    return () => {
      unsubscribe();
    };
  }, [userId]);

  // go to create task screen with pre-filled details
  const handleEdit = (id) => {
    const task = tasks[id];

    // show create task modal
    setShowTaskModal(true);
    setEditTask(task);
  };

  // delete task
  const handleDelete = (id) => {
    console.log('(TODO!!!) delete task with id: ', id);
  };

  // display loading indicator while fetching tasks
  const showLoading = () => {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.textLight} />
      </View>
    );
  };

  // display error message if error
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: theme.red }}>{error}</Text>
      </View>
    );
  }

  // display message if no tasks
  if (!tasks) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: theme.textLight }}>No tasks add yet!</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={global.container}>
      <View style={[global.container, styles.container]}>
        {/* Header row */}
        <View style={styles.row}>
          <Text style={[styles.appName, { color: theme.appName }]}>
            taskery
          </Text>

          <MaterialIcons
            name="today"
            size={30}
            color={theme.text}
            style={styles.calendarIcon}
          />
        </View>

        {/* List of tasks */}
        <Text style={[global.text, styles.tasksTitle]}>Tasks</Text>

        {isLoading ? (
          showLoading()
        ) : (
          <Tasklist
            tasklist={Object.values(tasks)}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        )}

        {/* button to create new task */}
        <TouchableOpacity
          style={[styles.addTaskBtn, { backgroundColor: theme.blue }]}
          onPress={() => setShowTaskModal(true)}>
          <Text
            style={[
              styles.addTaskTxt,
              { color: themeType === 'light' ? theme.navActive : theme.text },
            ]}>
            New Task
          </Text>

          <MaterialIcons
            name="add-task"
            size={26}
            color={themeType === 'light' ? theme.navActive : theme.text}
          />
        </TouchableOpacity>

        {/* "task details" modal */}
        <TaskDetails
          modalVisible={showTaskModal}
          setShowTaskModal={setShowTaskModal}
          userId={userId}
          editTask={editTask}
          setEditTask={setEditTask}
        />

        <CustomStatusBar />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginTop: 10,
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontFamily: 'OpenSans-Bold',
  },
  tasksTitle: {
    fontSize: 26,
    fontFamily: 'OpenSans-Bold',
  },
  calendarIcon: {
    marginLeft: 'auto',
  },
  addTaskBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    padding: 12,
  },
  addTaskTxt: {
    fontSize: 18,
    marginRight: 5,
    fontFamily: 'OpenSans-Bold',
  },
});

export default Home;
