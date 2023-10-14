import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native';
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
        {/* user's avatar */}
        <Image
          source={require('../../../assets/avatars/a1.png')}
          style={styles.avatar}
        />

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
  },
  settingsIcon: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    margin: 20,
  },
});

export default Profile;
