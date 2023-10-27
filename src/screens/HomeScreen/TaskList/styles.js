import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  flatlist: {
    width: '94%',
  },
  taskContainer: {
    padding: 10,
    borderWidth: 1,
    marginVertical: 6,
    borderRadius: 6,
  },
  toprow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskStatus: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  taskDeadline: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  taskTitle: {
    marginTop: 6,
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
  },
  taskDetail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  tagContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  tagBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    marginRight: 6,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 14,
    marginLeft: 5,
    fontFamily: 'Inter-SemiBold',
  },
  btmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  MenuOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
});

export default styles;