import React from 'react';
import { useFonts } from 'expo-font';
import { Provider } from 'react-redux';
import store from './src/services/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/hooks/useThemeContext';

const App = () => {
    // load custom fonts
    const [fontsLoaded] = useFonts({
        // font src: https://fonts.google.com/specimen/Inter
        'Inter-Regular': require('./src/assets/fonts/Inter-Regular.ttf'),
        'Inter-Bold': require('./src/assets/fonts/Inter-Bold.ttf'),
        'Inter-SemiBold': require('./src/assets/fonts/Inter-SemiBold.ttf'),
        'Inter-Medium': require('./src/assets/fonts/Inter-Medium.ttf'),
        // font src: https://www.dafont.com/poetsen-one.font
        'PoetsenOne-Regular': require('./src/assets/fonts/PoetsenOne-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Provider store={store}>
            <ThemeProvider>
                <AppNavigator />
            </ThemeProvider>
        </Provider>
    );
};

export default App;
