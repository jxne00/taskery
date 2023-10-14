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

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const Home = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.row}>
          <MaterialIcons name="add-task" size={28} color="#0137ac" />
          <Text style={styles.appName}>Taskery</Text>
          <FontAwesome
            name="moon-o"
            size={28}
            color="#282828"
            style={{ marginLeft: 'auto' }}
          />
        </View>

        {/* Task section */}
        <View style={styles.row}>
          <MaterialIcons name="today" size={28} color="#282828" />
          <Text style={styles.tasksTitle}>Tasklist</Text>
        </View>
        <Text>task list here</Text>

        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#0157ac',
    marginLeft: 20,
  },
  tasksTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 20,
    textDecorationLine: 'underline',
  },
});

export default Home;
