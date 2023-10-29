import { StyleSheet } from 'react-native';

let PRIMARY_COL = '#583492';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDF3EC',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FDF3EC',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    color: PRIMARY_COL,
    marginBottom: 10,
    fontFamily: 'PoetsenOne-Regular',
  },
  subtitle: {
    fontSize: 16,
    color: '#232323',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },

  inputContainer: {
    marginTop: 30,
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    color: PRIMARY_COL,
    fontFamily: 'Inter-Bold',
    paddingRight: 5,
  },
  textInput: {
    padding: 10,
    borderBottomColor: '#5d5d5d',
    borderBottomWidth: 1,
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Inter-Medium',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  nextBtn: {
    backgroundColor: PRIMARY_COL,
    paddingVertical: 8,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '40%',
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 18,
    marginRight: 10,
    fontFamily: 'Inter-SemiBold',
  },
});

export default styles;
