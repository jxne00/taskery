import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../../theme/ThemeContext';
import useGlobalStyles from '../../theme/globalStyles';

import styles from './styles';

import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../services/redux/userSlice';
import { fetchTasks } from '../../services/redux/taskSlice';

import { auth } from '../../services/firebase';

import TaskList from './TaskList';
import CreateTask from './CreateTask';

import {
  selectAllTasks,
  selectTasksForToday,
  selectTasksForWeek,
  selectTasksForMonth,
} from '../../services/redux/taskSelectors';

/** The home screen that displays a list of tasks */
const Home = () => {
  const { theme, themeType } = useTheme();
  const global = useGlobalStyles();
  const dispatch = useDispatch();

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // task view options (today, week, month, all, range)
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [customPeriod, setCustomPeriod] = useState({ from: null, to: null });

  const userId = auth.currentUser?.uid;

  const user = useSelector((state) => state.user.data);
  const userLoading = useSelector((state) => state.user.isLoading);

  // get the tasks based on selected period
  const tasks = useSelector((state) => {
    switch (selectedPeriod) {
      case 'today':
        return selectTasksForToday(state);
      case 'week':
        return selectTasksForWeek(state);
      case 'month':
        return selectTasksForMonth(state);
      case 'all':
        return selectAllTasks(state);
      default:
        return selectAllTasks(state);
    }
  });
  const fetchIsLoading = useSelector((state) => state.tasks.loading.fetchTasks);
  const error = useSelector((state) => state.tasks.error);

  // get tasks and user state from redux store
  useEffect(() => {
    if (userId) {
      dispatch(fetchUser(userId));
      dispatch(fetchTasks(userId));
    }
  }, [userId, dispatch]);

  /** show createTask screen with pre-filled details */
  const handleEdit = (id) => {
    const taskDetail = tasks.find((task) => task.id === id);
    setShowTaskModal(true);
    setTaskToEdit(taskDetail);
  };

  /** delete task */
  const handleDelete = (id) => {
    // TODO delete task
    console.log('(TODO!!!) delete task with id: ', id);
  };

  /** display buttons for selecting view period */
  const optionButton = (view) => {
    // capitalize first letter
    const displayText = view.charAt(0).toUpperCase() + view.slice(1);
    const isSelected = selectedPeriod === view;

    return (
      <TouchableOpacity
        style={[
          styles.periodBtn,
          { backgroundColor: isSelected ? theme.blue : theme.gray },
        ]}
        onPress={() => setSelectedPeriod(view)}>
        <Text
          style={[
            styles.periodBtnText,
            {
              color: isSelected
                ? themeType === 'light'
                  ? '#fff'
                  : theme.text
                : theme.textLight,
            },
          ]}>
          {displayText}
        </Text>
      </TouchableOpacity>
    );
  };

  // title for each selected period
  const titles = {
    today: "Today's Tasks",
    week: "This Week's Tasks",
    month: "This Month's Tasks",
    all: 'All Tasks',
    range: 'Tasks in range',
  };

  return (
    <View style={[global.container, styles.container]}>
      {/* Header row */}
      <View style={styles.row}>
        {!userLoading ? (
          <Text style={styles.welcomeText}>
            <Text style={{ color: theme.text }}>Hello, </Text>
            <Text style={{ color: theme.blue }}>{user?.name}</Text>
            <Text style={{ color: theme.text }}>!</Text>
          </Text>
        ) : (
          <ActivityIndicator size="small" color={theme.textLight} />
        )}

        <MaterialIcons
          name="today"
          size={30}
          color={theme.text}
          style={{ marginLeft: 'auto' }}
          // TODO implement calendar function
          onPress={() => console.log('calendar (TODO!!!)')}
        />
      </View>

      {/* buttons to select view period */}
      <View style={styles.row}>
        {optionButton('all')}
        {optionButton('today')}
        {optionButton('week')}
        {optionButton('month')}
        {optionButton('range')}
      </View>

      {/* task list title */}
      <View style={styles.row}>
        <Text style={[styles.ViewTitleText, { color: theme.text }]}>
          {titles[selectedPeriod] || 'Tasks'} ({tasks.length})
        </Text>

        {/* filter & sort */}
        <View style={[global.row, styles.filterRow]}>
          <MaterialIcons
            name="filter-list-alt"
            size={26}
            color={theme.text}
            // TODO implement filter function
            onPress={() => console.log('filter (TODO!!!)')}
          />
          <MaterialIcons
            name="sort"
            size={26}
            color={theme.text} // TODO implement sort function
            onPress={() => console.log('sort (TODO!!!)')}
          />
        </View>
      </View>

      {/* show loading while fetching tasks */}
      {fetchIsLoading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.textLight} />
        </View>
      )}

      {/* show message if no tasks */}
      {!fetchIsLoading && tasks.length === 0 && (
        <View style={styles.centered}>
          <Text style={[global.text, { color: theme.text }]}>
            No tasks due!
          </Text>
        </View>
      )}

      {/* list of tasks */}
      {!fetchIsLoading && tasks.length > 0 && (
        <TaskList
          tasklist={tasks}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}

      {/* create new task */}
      <TouchableOpacity
        style={[styles.addTaskBtn, { backgroundColor: theme.blue }]}
        onPress={() => setShowTaskModal(true)}>
        <Text
          style={[
            styles.addTaskText,
            { color: themeType === 'light' ? '#fff' : theme.text },
          ]}>
          New Task
        </Text>

        <MaterialIcons
          name="add-task"
          size={26}
          color={themeType === 'light' ? theme.navActive : theme.text}
        />
      </TouchableOpacity>

      {/* modal for creating new task */}
      <CreateTask
        modalVisible={showTaskModal}
        setShowTaskModal={setShowTaskModal}
        userId={userId}
        editTask={taskToEdit}
        setEditTask={setTaskToEdit}
      />
    </View>
  );
};

export default Home;
