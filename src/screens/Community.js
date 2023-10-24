import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

import CustomStatusBar from '../components/StatusBar';
import { useTheme } from '../theme/ThemeContext';
import useGlobalStyles from '../theme/globalStyles';

/** The community screen that shows posts shared by other uses */
const Community = () => {
  const { theme } = useTheme();
  const global = useGlobalStyles();

  return (
    <SafeAreaView style={global.container}>
      <View style={global.container}>
        <Text style={global.text}>This is the community screen</Text>
        <CustomStatusBar />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Community;
