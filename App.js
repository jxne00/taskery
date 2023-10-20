import React from 'react';
import { useFonts } from 'expo-font';
import { Provider } from 'react-redux';
import store from './utils/redux/store';

import { ThemeProvider } from './utils/theme/ThemeContext';
import AppNavigator from './src/navigation/AppNav';

const App = () => {
  // load fonts from assets
  const [fontsLoaded] = useFonts({
    // src: https://fonts.google.com/specimen/Inter
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),

    // src: https://www.dafont.com/poetsen-one.font
    'PoetsenOne-Regular': require('./assets/fonts/PoetsenOne-Regular.ttf'),
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
