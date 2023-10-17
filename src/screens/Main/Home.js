import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import CustomStatusBar from '../../components/StatusBar';
import { useTheme } from '../../../utils/theme/ThemeContext';
import useGlobalStyles from '../../../utils/hooks/globalStyles';

import CreateTask from '../../components/task/CreateTask';
import Tasklist from '../../components/task/Tasklist';

const Home = () => {
  const { theme, themeType } = useTheme();
  const global = useGlobalStyles();

  // visibility of "add task" modal
  const [showTaskModal, setShowTaskModal] = useState(false);

  return (
    <SafeAreaView style={global.container}>
      <View style={[global.container, styles.container]}>
        {/* Header */}
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

        {/* Task section */}
        <Text style={[global.text, styles.tasksTitle]}>Tasks</Text>

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
    fontFamily: 'OpenSans-Bold',
  },
  tasksTitle: {
    fontSize: 26,
    textDecorationLine: 'underline',
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
