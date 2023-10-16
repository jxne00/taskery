// import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import CustomStatusBar from './StatusBar';
import { useTheme } from '../../utils/theme/ThemeContext';
import useGlobalStyles from '../../utils/hooks/globalStyles';

import { auth } from '../../utils/config/firebase';

const Settings = ({ navigation }) => {
  const { theme, themeMode, setThemeMode } = useTheme();
  const global = useGlobalStyles();

  // signout user
  const handleSignout = () => {
    auth
      .signOut()
      .then(() => navigation.navigate('Login'))
      .catch((error) => {
        console.log('Error signing out: ', error);
      });
  };

  return (
    <SafeAreaView style={global.container}>
      <View style={global.container}>
        <FontAwesome
          name="chevron-left"
          size={24}
          color={theme.textLight}
          style={styles.backBtn}
          onPress={() => {
            navigation.goBack();
          }}
        />

        <Text style={[global.text, styles.title]}>Settings</Text>

        <View style={[styles.themeBox, { borderColor: theme.textLight }]}>
          <Text style={[global.text, styles.themeTitle]}>Appearance</Text>

          {/* toggle between dark, light or system theme */}
          {['Light', 'Dark', 'System'].map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => setThemeMode(mode.toLowerCase())}
              style={styles.option}>
              <Text style={[global.text, styles.optionText]}>
                {mode} {mode === 'System' ? '(default)' : ''}
              </Text>

              <FontAwesome
                name={
                  themeMode === mode.toLowerCase()
                    ? 'check-square-o'
                    : 'square-o'
                }
                size={24}
                color={theme.text}
                onPress={() => setThemeMode(mode.toLowerCase())}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.signOutBtn, { backgroundColor: theme.blue }]}
          onPress={handleSignout}>
          <Text style={styles.signOutTxt}>Sign Out</Text>
        </TouchableOpacity>

        <CustomStatusBar />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'OpenSans-Bold',
  },
  backBtn: {
    margin: 16,
  },
  themeBox: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 16,
    marginHorizontal: 14,
  },
  themeTitle: {
    fontSize: 20,
    marginBottom: 10,
    textDecorationLine: 'underline',
    fontFamily: 'OpenSans-Bold',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  optionText: {
    fontSize: 18,
    fontFamily: 'OpenSans-Medium',
  },
  signOutBtn: {
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginVertical: 20,
  },
  signOutTxt: {
    color: '#fff',
    padding: 10,
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
  },
});

export default Settings;
