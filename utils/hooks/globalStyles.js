import { StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

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
    blueBtn: {
      backgroundColor: theme.btnBlue,
      color: '#fff',
    },
    blackBtn: {
      backgroundColor: theme.btnBlack,
      color: '#fff',
    },
  });
};

export default useGlobalStyles;
