import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const CompletionComponent = ({ isCompleted, setIsCompleted, theme }) => {
  return (
    <View style={styles.completionRow}>
      <TouchableOpacity
        onPress={() => setIsCompleted(false)}
        style={[
          styles.completionBtn,
          { borderWidth: isCompleted ? 1 : 3, borderColor: theme.textLight },
        ]}>
        <AntDesign name={'close'} size={20} color={theme.text} />
        <Text
          style={[
            styles.completionText,
            {
              fontFamily: isCompleted ? 'Inter-Medium' : 'Inter-Bold',
              color: theme.text,
            },
          ]}>
          Not done
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setIsCompleted(true)}
        style={[
          styles.completionBtn,
          { borderWidth: isCompleted ? 3 : 1, borderColor: theme.textLight },
        ]}>
        <AntDesign name={'check'} size={20} color={theme.text} />
        <Text
          style={[
            styles.completionText,
            {
              fontFamily: isCompleted ? 'Inter-Bold' : 'Inter-Medium',
              color: theme.text,
            },
          ]}>
          Completed
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default CompletionComponent;
