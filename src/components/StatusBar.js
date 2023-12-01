import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../hooks/useThemeContext';

/**
 * custom status bar styled based on theme
 */
const CustomStatusBar = () => {
    const { themeType } = useTheme();

    // set the status bar to "light" or "dark" based on theme
    return <StatusBar style={themeType === 'light' ? 'dark' : 'light'} />;
};

export default CustomStatusBar;
