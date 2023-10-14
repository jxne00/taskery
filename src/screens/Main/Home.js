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

import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

import CustomStatusBar from '../../components/StatusBar';
import { useTheme } from '../../../utils/theme/ThemeContext';
import useGlobalStyles from '../../../utils/hooks/globalStyles';

const Home = ({ navigation }) => {
  const { theme } = useTheme();
  const global = useGlobalStyles();

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

        <Text style={global.text}>task list here</Text>

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
});

export default Home;
