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
import { useSelector } from 'react-redux';

import { useTheme } from '../../../hooks/useThemeContext';
import useThemeStyles from '../../../hooks/useThemeStyles';

const CalendarView = ({ navigation }) => {
    const themed = useThemeStyles();
    const { theme, themeType } = useTheme();

    const [selected, setSelected] = useState(new Date().toISOString().split('T')[0]);

    // fetch tasks from redux store
    const tasks = useSelector((state) => state.tasks.data);
    const tasksLoading = useSelector((state) => state.tasks.loading.fetchTasks);

    const dotMarkers = {
        completed: { key: 'completed', color: 'green' },
        pending: { key: 'pending', color: 'gray' },
        overdue: { key: 'overdue', color: 'orange' },
    };

    const getMarkedDates = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const markedDates = {};

        tasks.forEach((task) => {
            const taskDeadline = new Date(task.deadline);
            const dateString = taskDeadline.toISOString().split('T')[0]; // in YYYY-MM-DD

            // add dates to markedDates
            if (!markedDates[dateString]) {
                markedDates[dateString] = { dots: [] };
            }

            if (task.is_complete) {
                // completed tasks use green dot
                markedDates[dateString].dots.push(dotMarkers.completed);
            } else {
                if (taskDeadline < today) {
                    // incomplete overdue tasks use orange dot
                    markedDates[dateString].dots.push(dotMarkers.overdue);
                } else {
                    // incomplete non-overdue tasks use gray dot
                    markedDates[dateString].dots.push(dotMarkers.pending);
                }
            }
        });
        return markedDates;
    };

    return (
        <SafeAreaView style={[themed.container]}>
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

            {/* TODO: show tasks on click of a date */}
            <Calendar
                style={{
                    marginTop: 20,
                    height: 400,
                    backgroundColor: theme.background,
                    dayTextColor: theme.text,
                    monthTextColor: theme.text,
                }}
                current={selected}
                markingType={'multi-dot'}
                markedDates={getMarkedDates()}
                onDayPress={(day) => setSelected(day.dateString)}
                theme={{
                    calendarBackground: theme.background,
                    textSectionTitleColor: theme.blue,
                    arrowColor: theme.text,
                    monthTextColor: theme.text,
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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
