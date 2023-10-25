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

import CustomStatusBar from '../../components/shared/StatusBar';
import { useTheme } from '../../theme/ThemeContext';
import useGlobalStyles from '../../theme/globalStyles';

import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../../services/redux/taskActions';
import { fetchProfile } from '../../services/redux/profileActions';
import { auth } from '../../services/firebase/config';

import Tasklist from './TaskList/Tasklist';
import TaskDetails from './CreateTask/TaskDetails';

/** The home screen that displays a list of tasks */
const Home = () => {
  const { theme, themeType } = useTheme();
  const global = useGlobalStyles();
  const dispatch = useDispatch(); // redux dispatch

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const userId = auth.currentUser?.uid; // current user's id

  // get tasks and profile state from redux store
  const { tasks, isLoading, error } = useSelector((state) => state.tasks);
  // const { profileData } = useSelector((state) => state.profile);

  useEffect(() => {
    if (!userId) return;

    // dispatch fetch tasks and profile to redux store
    const unsubscribeTasks = dispatch(fetchTasks(userId));
    const unsubscribeProfile = dispatch(fetchProfile(userId));

    // unsubscribe listeners on unmount
    return () => {
      unsubscribeTasks();
      unsubscribeProfile();
    };
  }, [userId, dispatch]);

  /** go to create task screen with pre-filled details */
  const handleEdit = (id) => {
    const task = tasks[id];

    // show create task modal
    setShowTaskModal(true);
    setEditTask(task);
  };

  /** delete task */
  const handleDelete = (id) => {
    // TODO delete task
    console.log('(TODO!!!) delete task with id: ', id);
  };

  /** display loading indicator while fetching tasks */
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
            // TODO implement calendar function
            onPress={() => console.log('calendar (TODO!!!)')}
          />
        </View>

        {/* List of tasks */}
        <View style={styles.titleRow}>
          <Text style={[global.text, styles.tasksTitle]}>Tasks</Text>

          <View
            style={[
              styles.titleRow,
              {
                marginLeft: 'auto',
                marginRight: 10,
              },
            ]}>
            <MaterialIcons
              name="filter-list-alt"
              size={28}
              color={theme.textLight}
              // TODO implement filter function
              onPress={() => console.log('filter (TODO!!!)')}
            />
            <MaterialIcons
              name="sort"
              size={24}
              color={theme.textLight} // TODO implement sort function
              onPress={() => console.log('sort (TODO!!!)')}
            />
          </View>
        </View>

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
          style={[
            styles.addTaskBtn,
            { backgroundColor: themeType === 'light' ? '#a13030' : '#EC6565' },
          ]}
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
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignContent: 'center',
    marginHorizontal: 20,
    marginBottom: 6,
  },
  appName: {
    fontSize: 28,
    fontFamily: 'PoetsenOne-Regular',
  },
  tasksTitle: {
    flex: 1,
    fontSize: 26,
    fontFamily: 'Inter-Bold',
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
    borderRadius: 8,
    padding: 10,
  },
  addTaskTxt: {
    fontSize: 18,
    marginRight: 5,
    fontFamily: 'Inter-SemiBold',
  },
});

export default Home;
