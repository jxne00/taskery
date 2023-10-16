import React from 'react';
import { useFonts } from 'expo-font';

import { ThemeProvider } from './utils/theme/ThemeContext';
import AppNavigator from './src/navigation/AppNav';

const App = () => {
  // load fonts from assets
  const [fontsLoaded] = useFonts({
    'OpenSans-Medium': require('./assets/fonts/OpenSans-Medium.ttf'),
    'OpenSans-Regular': require('./assets/fonts/OpenSans-Regular.ttf'),
    'OpenSans-SemiBold': require('./assets/fonts/OpenSans-SemiBold.ttf'),
    'OpenSans-Bold': require('./assets/fonts/OpenSans-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
};

export default App;
