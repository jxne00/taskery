import { StyleSheet } from 'react-native';

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

export default styles;