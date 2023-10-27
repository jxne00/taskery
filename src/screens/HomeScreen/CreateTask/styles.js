import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },

  header: {
    fontSize: 26,
    fontFamily: 'Inter-Bold',
  },
  cancelTxt: {
    fontSize: 20,
    marginLeft: 'auto',
    color: '#eb523b',
    fontFamily: 'Inter-SemiBold',
  },
  titleInput: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 20,
    fontSize: 18,
    fontFamily: 'Inter-Medium',
  },
  boxLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    paddingBottom: 10,
  },
  detailsInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingTop: 8,
    borderRadius: 8,
    height: 140,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },

  // ======= completion styles =======
  completionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  completionBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    width: '49%',
  },
  completionText: {
    fontSize: 16,
    marginLeft: 5,
    fontFamily: 'Inter-Regular',
  },

  // ======= button styles =======
  createBtn: {
    backgroundColor: '#84345a',
    padding: 10,
    borderRadius: 20,
    width: '90%',
    alignSelf: 'center',
    marginTop: 'auto',
  },
  createBtnText: {
    textAlign: 'center',
    fontSize: 20,
    paddingVertical: 2,
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
  },

  // ======= subtask styles =======

  addSubtask: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    fontFamily: 'Inter-Regular',
  },
  Xicon: {
    marginRight: 12,
  },
  subtask: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },

  subtaskInput: {
    borderBottomWidth: 1,
    padding: 10,
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },

  // ======= category styles =======
  categoryText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 20,
  },

  // ======= tag styles =======
  tagsContainer: {
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    flex: 1,
    fontFamily: 'Inter-Regular',
  },
  addTagBtn: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d4d4d4',
    backgroundColor: '#1e1c1c',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 14,
  },
  colorOption: {
    width: 25,
    height: 25,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },

  tag: {
    padding: 10,
    borderRadius: 5,
  },
});

export default styles;
