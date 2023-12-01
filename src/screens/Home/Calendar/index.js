import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../hooks/useThemeContext';
import useThemeStyles from '../../../hooks/useThemeStyles';

const CalendarView = ({ navigation, route }) => {
    const themed = useThemeStyles();
    const { theme, themeType } = useTheme();

    const { tasks } = route.params;

    const [selected, setSelected] = useState(new Date());

    // marked dates
    const vacation = { key: 'vacation', color: '#ff4242', selectedDotColor: 'blue' };
    const massage = { key: 'massage', color: '#4e4efc', selectedDotColor: 'blue' };
    const workout = { key: 'workout', color: '#27ba27' };

    return (
        <SafeAreaView style={[themed.container, styles.container]}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[themed.row, styles.backButton, { borderColor: theme.text }]}>
                <Ionicons
                    name="arrow-back-circle"
                    size={25}
                    color={theme.textLight}
                    style={{ paddingRight: 10 }}
                />
                <Text style={themed.textRegular}>Back</Text>
            </TouchableOpacity>

            {/* https://wix.github.io/react-native-calendars/docs/Components/Calendar */}
            <Calendar
                style={{
                    marginTop: 20,
                    height: 400,
                    backgroundColor: themeType === 'light' ? '#fff' : '#9a9eac',
                    dayTextColor: theme.text,
                    monthTextColor: theme.text,
                }}
                headerStyle={{
                    backgroundColor: themeType === 'light' ? '#414141' : '#9a9eac',
                    borderBottomWidth: 0,
                }}
                hideExtraDays={true}
                // when a date is pressed
                onDayPress={(day) => {
                    setSelected(day.dateString);
                    console.log(day.dateString, 'pressed');
                }}
                // when a date is long pressed
                onDayLongPress={(day) => {
                    console.log(day.dateString, 'long pressed');
                }}
                current={selected}
                markingType={'multi-dot'}
                markedDates={{
                    '2023-11-16': {
                        dots: [vacation, massage, workout],
                        selected: true,
                        selectedColor: '#bfb5d7',
                    },
                    '2023-11-21': { dots: [massage, workout], disabled: true },
                }}
                theme={{
                    indicatorColor: '#ff0000',
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    },
    backButton: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 20,
        width: 100,
        marginHorizontal: 10,
    },
});

export default CalendarView;
