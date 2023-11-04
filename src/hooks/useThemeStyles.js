import { StyleSheet } from 'react-native';
import { useTheme } from './useThemeContext';

/** common styles styled based on theme */
const useThemeStyles = () => {
  const { theme, themeType } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    // ==== texts ==== //
    textRegular: {
      color: theme.text,
      fontFamily: 'Inter-Regular',
      fontSize: 16,
    },
    textRegularLight: {
      color: theme.textLight,
      fontFamily: 'Inter-Regular',
      fontSize: 16,
    },
    textSemibold: {
      color: theme.text,
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
    },
    textBold: {
      color: theme.text,
      fontFamily: 'Inter-Bold',
      fontSize: 16,
    },
    textPoetsen: {
      color: theme.text,
      fontFamily: 'PoetsenOne-Regular',
      fontSize: 16,
    },

    // ==== headers ==== //
    headerText: {
      color: theme.text,
      fontFamily: 'Inter-Bold',
      fontSize: 24,
    },
    subHeaderText: {
      color: theme.text,
      fontFamily: 'Inter-SemiBold',
      fontSize: 18,
    },

    // ==== buttons ==== //
    blackBtn: {
      backgroundColor: themeType === 'light' ? '#000' : '#fff',
      padding: 10,
      borderRadius: 10,
    },
    blackBtnText: {
      color: themeType === 'light' ? '#fff' : '#000',
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
    },
    blueBtn: {
      backgroundColor: themeType === 'light' ? '#2D3C8C' : '#5050B3',
      padding: 10,
      borderRadius: 10,
    },
    blueBtnText: {
      color: themeType === 'light' ? '#fff' : '#d3d3d3',
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
    },
    grayBtn: {
      backgroundColor: themeType === 'light' ? '#E1DFDE' : '#5A5A5A',
      padding: 10,
      borderRadius: 10,
    },
    grayBtnText: {
      color: '#fff',
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
    },

    //
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    // overlay display when loading
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      fontSize: 22,
      fontFamily: 'Inter-Medium',
      color: '#cecece',
    },
  });
};

export default useThemeStyles;
