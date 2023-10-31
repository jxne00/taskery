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

  // context menu styles
  optionsContainer: {
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
  },
  MenuOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },

  // completion status button
  taskStatusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 18,
    borderWidth: 1,
  },
  colorCircle: {
    width: 12,
    height: 12,
    borderRadius: 8,
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },

  addTaskLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '110%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTaskLoadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#fff',
  },
});

export default styles;
