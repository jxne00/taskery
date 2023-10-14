import React from 'react';
import { ThemeProvider } from './utils/theme/ThemeContext';
import AppNavigator from './src/navigation/AppNav';

const App = () => {
  /**
   * @todo
   * - load custom fonts
   */

  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
};

export default App;
