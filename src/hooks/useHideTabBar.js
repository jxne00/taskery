import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from './useThemeContext';

/** hook to hide the bottom tab bar when a screen is focused */
const useHideTabBar = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();

    useEffect(() => {
        const unsubscribeFocus = navigation.addListener('focus', () => {
            navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
        });

        const unsubscribeBlur = navigation.addListener('blur', () => {
            navigation.getParent()?.setOptions({
                tabBarStyle: {
                    backgroundColor: theme.background,
                    borderTopColor: theme.text,
                    paddingTop: 6,
                },
            });
        });

        return () => {
            unsubscribeFocus();
            unsubscribeBlur();
        };
    }, [navigation]);
};

export default useHideTabBar;
