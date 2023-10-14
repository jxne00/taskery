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

  useEffect(() => {
    const updateTheme = (newTheme) => {
      switch (newTheme) {
        case 'light':
          setTheme(lightTheme);
          break;
        case 'dark':
          setTheme(darkTheme);
          break;
        case 'system':
          setTheme(deviceTheme === 'dark' ? darkTheme : lightTheme);
          break;
        default:
          setTheme(lightTheme);
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
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

export { ThemeProvider, useTheme };
