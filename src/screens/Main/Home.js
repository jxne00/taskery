/**
 * @todo
 * - dark mode toggle
 * - add task button
 * - task list
 * - calendar view
 * - task details screen
 * - filter tasks
 * - sort tasks
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

import CustomStatusBar from '../../components/StatusBar';
import { useTheme } from '../../../utils/theme/ThemeContext';
import useGlobalStyles from '../../../utils/hooks/globalStyles';

import CreateTask from '../../components/modals/CreateTask';
import Tasklist from '../../components/Tasklist';

const Home = ({ navigation }) => {
  const { theme, themeType } = useTheme();
  const global = useGlobalStyles();

  // visibility of "add task" modal
  const [showTaskModal, setShowTaskModal] = useState(false);

  return (
    <SafeAreaView style={global.container}>
      <View style={[global.container, styles.container]}>
        {/* Header */}
        <View style={styles.row}>
          <MaterialIcons name="add-task" size={28} color={theme.appName} />

          <Text style={[styles.appName, { color: theme.appName }]}>
            Taskery
          </Text>

          <MaterialIcons
            name="today"
            size={30}
            color={theme.text}
            style={styles.calendarIcon}
          />
        </View>

        {/* Task section */}
        <Text style={[global.text, styles.tasksTitle]}>Tasklist</Text>

        <Tasklist />

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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginTop: 10,
    marginBottom: 20,
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  tasksTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 20,
    textDecorationLine: 'underline',
  },
  calendarIcon: {
    marginLeft: 'auto',
  },
  addTaskBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 50,
    padding: 10,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addTaskTxt: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 6,
  },
});

export default Home;
