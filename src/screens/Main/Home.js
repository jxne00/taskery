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
import { auth } from '../../../utils/config/firebase';

import CreateTask from '../../components/task/CreateTask';
import Tasklist from '../../components/task/Tasklist';

const Home = () => {
  const { theme, themeType } = useTheme();
  const global = useGlobalStyles();

  const [showTaskModal, setShowTaskModal] = useState(false);

  const userId = auth.currentUser.uid; // current user's id
  const dispatch = useDispatch(); // redux dispatch
  const { tasks, isLoading, error } = useSelector((state) => state.tasks);

  // fetch tasks
  useEffect(() => {
    dispatch(fetchTasks(userId));
  }, [userId]);

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
          <Tasklist tasklist={Object.values(tasks)} theme={theme} />
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

        {/* "create task" modal */}
        <CreateTask
          modalVisible={showTaskModal}
          setShowTaskModal={setShowTaskModal}
          userId={userId}
          dispatch={dispatch}
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
