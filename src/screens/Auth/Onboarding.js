import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const Onboarding = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>This is the onboarding screen</Text>

      <TouchableOpacity
        style={{ marginTop: 20, backgroundColor: 'lightblue' }}
        onPress={() => navigation.navigate('HomeTabs')}>
        <Text>Proceed</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Onboarding;
