import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from './themeColors';

const ThemeContext = createContext();

// key for async storage
const THEME_ASYNC_KEY = 'theme';

/** Provider for the theme context */
const ThemeProvider = ({ children }) => {
  const deviceTheme = Appearance.getColorScheme();
  const [themeMode, setThemeMode] = useState('system');
  const [theme, setTheme] = useState(deviceTheme === 'dark' ? darkTheme : lightTheme);
  const [themeType, setThemeType] = useState('light');

  useEffect(() => {
    // get any stored theme from async storage
    const getSavedTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_ASYNC_KEY);
        if (storedTheme) setThemeMode(storedTheme);
      } catch (err) {
        alert('Failed to get saved theme (async storage)');
      }
    };

    getSavedTheme();
  }, []);

  // update theme whenever themeMode or deviceTheme changes
  useEffect(() => {
    const updateTheme = async (newTheme) => {
      const currentDeviceTheme = Appearance.getColorScheme();

      switch (newTheme) {
        case 'light':
          setTheme(lightTheme);
          setThemeType('light');
          break;
        case 'dark':
          setTheme(darkTheme);
          setThemeType('dark');
          break;
        case 'system':
          setTheme(currentDeviceTheme === 'dark' ? darkTheme : lightTheme);
          setThemeType(currentDeviceTheme);
          break;
        default:
          setTheme(lightTheme);
          setThemeType('light');
      }

      try {
        // save selected theme to async storage
        await AsyncStorage.setItem(THEME_ASYNC_KEY, newTheme);
      } catch (err) {
        alert('Failed to save theme (async storage)');
      }
    };

    // listen for changes to system appearance
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (themeMode === 'system') {
        updateTheme(colorScheme);
      }
    });

    updateTheme(themeMode);

    // cleanup on unmount
    return () => subscription.remove();
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode, themeType }}>
      {children}
    </ThemeContext.Provider>
  );
};

/** The hook to use theme context */
const useTheme = () => useContext(ThemeContext);

export { ThemeProvider, useTheme };
