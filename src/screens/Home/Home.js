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
import { fetchUser } from '../../services/redux/userSlice';
import { fetchTasks } from '../../services/redux/taskSlice';

import { auth } from '../../services/firebase/config';

import TaskList from './TaskList/Tasklist';
import CreateTask from './CreateTask/CreateTask';

// import {
//   selectTasksForToday,
//   selectTasksForWeek,
//   selectTasksForMonth,
// } from '../../services/redux/taskSelector';

/** The home screen that displays a list of tasks */
const Home = () => {
  const { theme, themeType } = useTheme();
  const global = useGlobalStyles();

  // get data from redux store
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const tasks = useSelector((state) => state.tasks.data);
  const taskIsLoading = useSelector((state) => state.tasks.isLoading);
  const taskError = useSelector((state) => state.tasks.error);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // task view options (today, week, month, all, range)
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  // date range for custom period view
  // const [customPeriod, setCustomPeriod] = useState({ from: null, to: null });

  const userId = auth.currentUser?.uid;

  // get tasks and user state from redux store
  useEffect(() => {
    if (userId) {
      dispatch(fetchUser(userId));
      dispatch(fetchTasks(userId));
    }
  }, [userId, dispatch]);

  console.log('(Home.js) fetched tasks:', JSON.stringify(tasks, null, 2));

  // get tasks based on selected period
  // const { tasks, isLoading, error } = useSelector((state) => {
  //   switch (selectedPeriod) {
  //     case 'today':
  //       return selectTasksForToday(state);
  //     case 'week':
  //       return selectTasksForWeek(state);
  //     case 'month':
  //       return selectTasksForMonth(state);
  //     case 'all':
  //       return state.tasks;
  //     // case 'range':
  //     //   return selectTasksForCustomRange(state, customPeriod.from, customPeriod.to);
  //     default:
  //       return state.tasks;
  //   }
  // });

  /** go to create task screen with pre-filled details */
  const handleEdit = (id) => {
    // get details of task to edit
    const taskDetail = tasks.find((task) => task.id === id);

    setShowTaskModal(true);
    setTaskToEdit(taskDetail);
  };

  /** delete task */
  const handleDelete = (id) => {
    // TODO delete task
    console.log('(TODO!!!) delete task with id: ', id);
  };

  /** change selected period */
  const selectedPeriodChange = (view) => {
    setSelectedPeriod(view);
    console.log('selected period: ', view);
  };

  /** display buttons for selecting view period */
  const PeriodViewOptions = () => {
    const optionButton = (view) => {
      // capitalize first letter
      const displayText = view.charAt(0).toUpperCase() + view.slice(1);
      const bgColor =
        selectedPeriod === view ? theme.orange : theme.backgroundSec;
      const textColor = selectedPeriod === view ? theme.text : theme.textLight;

      return (
        <TouchableOpacity
          style={[styles.periodViewButton, { backgroundColor: bgColor }]}
          onPress={() => selectedPeriodChange(view)}>
          <Text style={[styles.periodViewText, { color: textColor }]}>
            {displayText}
          </Text>
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.row}>
        {optionButton('today')}
        {optionButton('week')}
        {optionButton('month')}
        {optionButton('all')}
        {optionButton('range')}
      </View>
    );
  };

  const SetTitle = () => {
    switch (selectedPeriod) {
      case 'today':
        return "Today's Tasks";
      case 'week':
        return "This Week's Tasks";
      case 'month':
        return "This Month's Tasks";
      case 'all':
        return 'All Tasks';
      case 'range':
        return 'Tasks in range';
      default:
        return 'Tasks';
    }
  };

  // display error message if error
  if (taskError) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.red }]}>
        <Text style={{ color: theme.text }}>{taskError}</Text>
      </View>
    );
  }

  // display message if no tasks
  if (!taskIsLoading && !tasks) {
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
          <Text style={styles.welcomeText}>
            <Text style={{ color: theme.textLight }}>Hello, </Text>
            <Text style={{ color: theme.orange }}>{user?.name}</Text>
            <Text style={{ color: theme.textLight }}>!</Text>
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

        {/* buttons for selecting view period */}
        <PeriodViewOptions />

        {/* List of tasks */}
        <View style={styles.titleRow}>
          <Text style={[global.text, styles.tasksTitle]}>
            <SetTitle /> ({tasks.length})
          </Text>

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

        {taskIsLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.textLight} />
          </View>
        ) : (
          <TaskList
            tasklist={tasks}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        )}

        {/* button to create new task */}
        <TouchableOpacity
          style={[styles.addTaskBtn, { backgroundColor: theme.orange }]}
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
        <CreateTask
          modalVisible={showTaskModal}
          setShowTaskModal={setShowTaskModal}
          userId={userId}
          editTask={taskToEdit}
          setEditTask={setTaskToEdit}
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
  welcomeText: {
    fontSize: 22,
    fontFamily: 'PoetsenOne-Regular',
  },
  tasksTitle: {
    flex: 1,
    fontSize: 24,
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

  // period view options
  periodViewButton: {
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
  },
  periodViewText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});

export default Home;
