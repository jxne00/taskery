import { StyleSheet } from 'react-native';
import { useTheme } from './useThemeContext';

/** A custom hook to use global styles */
const useGlobalStyles = () => {
    const { theme, themeType } = useTheme();

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        text: {
            color: theme.text,
            fontSize: 16,
            fontFamily: 'Inter-Regular',
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
        },
    });
};

export default useGlobalStyles;
