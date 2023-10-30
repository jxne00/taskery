import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../../hooks/useThemeContext';
import useGlobalStyles from '../../hooks/useGlobalStyles';

import DatePick from '../../components/DatePick';
import styles from './styles';

import useFetchTasks from '../../hooks/useFetchTasks';
import useFetchUser from '../../hooks/useFetchUser';

import TaskList from './TaskList';
import CreateTask from './CreateTask';

/** The home screen that displays a list of tasks */
const Home = () => {
  const { theme, themeType } = useTheme();
  const global = useGlobalStyles();

  // task view options (today, week, month, all, range)
  const [chosenTimeFrame, setChosenTimeFrame] = useState('today');
  const [customPeriod, setCustomPeriod] = useState({ from: null, to: null });
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [activePickerInput, setActivePickerInput] = useState(null); // 'from' or 'to'
  const [confirmRange, setConfirmRange] = useState(false);

  // fetch data from redux store
  const { user, userLoading } = useFetchUser();
  const { tasks, fetchIsLoading, fetchTasksError } = useFetchTasks(chosenTimeFrame);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

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

  /** set the active picker "to" or "from" */
  const handleOpenDatePicker = (input) => {
    setActivePickerInput(input);
    setOpenDatePicker(true);
  };

  /** set range value */
  const handlePickerConfirm = (date) => {
    if (activePickerInput === 'from') {
      setCustomPeriod({ ...customPeriod, from: date });
    } else if (activePickerInput === 'to') {
      setCustomPeriod({ ...customPeriod, to: date });
    }
    handlePickerCancel();
  };

  /** close date picker */
  const handlePickerCancel = () => {
    setActivePickerInput(null);
    setOpenDatePicker(false);
  };

  /** display buttons for selecting view period */
  const optionButton = (view) => {
    // capitalize first letter
    const displayText = view.charAt(0).toUpperCase() + view.slice(1);
    const isSelected = chosenTimeFrame === view;

    return (
      <TouchableOpacity
        style={[
          styles.periodBtn,
          { backgroundColor: isSelected ? theme.blue : theme.gray },
        ]}
        onPress={() => setChosenTimeFrame(view)}>
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

      {/* choosing date range */}
      {chosenTimeFrame === 'range' && (
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.rangePickButton, { borderColor: theme.text }]}
            onPress={() => handleOpenDatePicker('from')}>
            <MaterialIcons name="date-range" size={20} color={theme.text} />
            <Text style={[styles.periodBtnText, { color: theme.text, paddingLeft: 5 }]}>
              {customPeriod.from ? customPeriod.from.toLocaleDateString() : 'From'}
            </Text>
          </TouchableOpacity>

          <Text
            style={[styles.periodBtnText, { color: theme.text, marginHorizontal: 10 }]}>
            to
          </Text>

          <TouchableOpacity
            style={[styles.rangePickButton, { borderColor: theme.text }]}
            onPress={() => handleOpenDatePicker('to')}>
            <MaterialIcons name="date-range" size={20} color={theme.text} />
            <Text style={[styles.periodBtnText, { color: theme.text, paddingLeft: 5 }]}>
              {customPeriod.to ? customPeriod.to.toLocaleDateString() : 'To'}
            </Text>
          </TouchableOpacity>

          {/* confirm selected range */}
          <TouchableOpacity
            style={[styles.periodBtn, { backgroundColor: theme.blue }]}
            // TODO fix range timeframe option
            onPress={() => setConfirmRange(true)}>
            <Text
              style={[
                styles.periodBtnText,
                { color: themeType === 'light' ? '#fff' : theme.text },
              ]}>
              Confirm
            </Text>
          </TouchableOpacity>

          <DatePick
            openDatePicker={openDatePicker}
            setOpenDatePicker={setOpenDatePicker}
            handleConfirm={handlePickerConfirm}
            handleCancel={handlePickerCancel}
            date={activePickerInput === 'from' ? customPeriod.from : customPeriod.to}
          />
        </View>
      )}

      {/* task list title */}
      <View style={styles.row}>
        <Text style={[styles.ViewTitleText, { color: theme.text }]}>
          {titles[chosenTimeFrame] || 'Tasks'} ({tasks.length})
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
          <Text style={[global.text, { color: theme.text }]}>No tasks due!</Text>
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
        editTask={taskToEdit}
        setEditTask={setTaskToEdit}
      />
    </View>
  );
};

export default Home;
