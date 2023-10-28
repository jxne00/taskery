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
  filterRow: {
    marginLeft: 'auto',
    marginRight: 5,
  },

  welcomeText: {
    fontSize: 22,
    fontFamily: 'PoetsenOne-Regular',
  },
  ViewTitleText: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },

  // create task
  addTaskBtn: {
    position: 'absolute',
    bottom: 20,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    padding: 10,
  },
  addTaskText: {
    fontSize: 18,
    marginRight: 5,
    fontFamily: 'Inter-SemiBold',
  },

  // period view options
  periodBtn: {
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 5,
  },
  periodBtnText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});

export default styles;
