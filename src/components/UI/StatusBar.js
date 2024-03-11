import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../hooks/useThemeContext';

/**
 * A custom status bar component that changes according to theme
 */
const CustomStatusBar = () => {
    const { themeType } = useTheme();

    // set the status bar to "light" or "dark" based on theme
    return <StatusBar style={themeType === 'light' ? 'dark' : 'light'} />;
};

export default CustomStatusBar;
