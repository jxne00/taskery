import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Appearance } from 'react-native';
import { useTheme } from '../../utils/theme/ThemeContext';

const CustomStatusBar = () => {
  const { themeMode } = useTheme();

  const statusBarStyle =
    themeMode === 'system'
      ? Appearance.getColorScheme() === 'dark'
        ? 'light'
        : 'dark'
      : themeMode === 'dark'
      ? 'light'
      : 'dark';

  return <StatusBar style={statusBarStyle} />;
};

export default CustomStatusBar;
