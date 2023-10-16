import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';
import { lightTheme, darkTheme } from './themes';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const deviceTheme = Appearance.getColorScheme();
  const [themeMode, setThemeMode] = useState('system');
  const [theme, setTheme] = useState(
    deviceTheme === 'dark' ? darkTheme : lightTheme,
  );
  const [themeType, setThemeType] = useState('light');

  useEffect(() => {
    const updateTheme = (newTheme) => {
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
          setTheme(deviceTheme === 'dark' ? darkTheme : lightTheme);
          setThemeType(deviceTheme);
          break;
        default:
          setTheme(lightTheme);
          setThemeType('light');
      }
    };

    // listen for changes to system appearance
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (themeMode === 'system') {
        updateTheme(colorScheme);
      }
    });

    updateTheme(themeMode);

    return () => subscription.remove();
  }, [themeMode, deviceTheme]);

  return (
    <ThemeContext.Provider
      value={{ theme, themeMode, setThemeMode, themeType }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

export { ThemeProvider, useTheme };
