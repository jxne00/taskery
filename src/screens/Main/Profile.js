import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../utils/theme/ThemeContext';
import useGlobalStyles from '../../../utils/hooks/globalStyles';
import CustomStatusBar from '../../components/StatusBar';

const Profile = ({ navigation }) => {
  const { theme } = useTheme();
  const global = useGlobalStyles();

  return (
    <SafeAreaView style={global.container}>
      <View style={[global.container, styles.container]}>
        <Text style={global.text}>This is the profile screen</Text>

        <Ionicons
          name="settings"
          size={28}
          style={styles.settingsIcon}
          color={theme.textLight}
          onPress={() => navigation.navigate('Settings')}
        />

        <CustomStatusBar />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
});

export default Profile;
