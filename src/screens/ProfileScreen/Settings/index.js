import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch } from 'react-redux';
import { auth } from '../../../services/firebase';

import CustomStatusBar from '../../../components/StatusBar';
import InfoBox from '../../../components/InfoBox';

import { useTheme } from '../../../theme/ThemeContext';
import useGlobalStyles from '../../../theme/globalStyles';

/** The settings screen to manage app & account settings */
const Settings = ({ navigation, userId, isPublic, setIsPublic }) => {
  const { theme, themeMode, setThemeMode, themeType } = useTheme();
  const global = useGlobalStyles();
  const dispatch = useDispatch();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // signout user using firebase
  const handleSignout = async () => {
    try {
      await auth.signOut();
      dispatch({ type: 'LOGOUT' });
      navigation.navigate('Login');
    } catch (err) {
      console.log('Error signing out: ', err);
    }
  };

  useEffect(() => {
    // TODO: update 'is_public' in firestore
  }, [userId, isPublic]);

  return (
    <SafeAreaView style={global.container}>
      <View style={global.container}>
        {/* back button */}
        <Ionicons
          name="md-arrow-back"
          size={28}
          color={theme.text}
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
                size={22}
                color={theme.text}
                onPress={() => setThemeMode(mode.toLowerCase())}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 20 }} />

        {/* privacy */}
        <View style={[styles.themeBox, { borderColor: theme.textLight }]}>
          <Text style={[global.text, styles.themeTitle]}>Privacy</Text>

          <View style={styles.option}>
            <InfoBox
              title="Account Privacy"
              text="By setting your account to public, users in the community will be able to see your posts."
              iconColor={theme.text}
              bgColor={themeType === 'light' ? '#FDF3EC' : '#d0d0d0'}
            />
            <Text style={[global.text, styles.optionText]}>
              Account Privacy
            </Text>

            <DropDownPicker
              items={[
                { label: 'Public', value: true },
                { label: 'Private', value: false },
              ]}
              defaultValue={isPublic}
              placeholder={isPublic ? 'Public' : 'Private'}
              containerStyle={{ width: 100 }}
              style={{ backgroundColor: theme.navActive }}
              itemStyle={{
                justifyContent: 'flex-start',
              }}
              open={dropdownOpen}
              setOpen={setDropdownOpen}
              setValue={setIsPublic}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.signOutBtn, { backgroundColor: theme.btnBlack }]}
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
    fontFamily: 'Inter-Bold',
  },
  backBtn: {
    margin: 16,
  },
  themeBox: {
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 14,
  },
  themeTitle: {
    fontSize: 18,
    marginBottom: 10,
    textDecorationLine: 'underline',
    fontFamily: 'Inter-Bold',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  signOutBtn: {
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 'auto',
    marginBottom: 20,
  },
  signOutTxt: {
    color: '#fff',
    padding: 10,
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
});

export default Settings;
