import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { FontAwesome } from '@expo/vector-icons';

import { useTheme } from '../../../../hooks/useThemeContext';

/**
 * A date picker component to select a deadline for a task.
 * @param {boolean} openPicker - whether the date picker is open
 * @param {function} setOpenPicker - function to open/close the date picker
 * @param {object} date - selected date
 * @param {function} setDate - function to set the selected date
 */
const DeadlinePicker = ({ openPicker, setOpenPicker, date, setDate }) => {
    const { theme, themeType } = useTheme();

    const handleConfirm = (date) => {
        setDate(date);
        setOpenPicker(false);
    };

    const handleCancel = () => {
        setOpenPicker(false);
    };

    return (
        <>
            <View style={[styles.pickerRow, { borderColor: theme.text }]}>
                <Text style={[styles.dateText, { color: theme.text }]}>
                    {date.toLocaleDateString()}
                </Text>

                <FontAwesome
                    name="calendar-plus-o"
                    size={24}
                    color={theme.text}
                    onPress={() => setOpenPicker(true)}
                />
            </View>

            <DateTimePickerModal
                isVisible={openPicker}
                date={date}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                minimumDate={new Date()} // disable past dates
                themeVariant={themeType === 'light' ? 'light' : 'dark'}
                isDarkModeEnabled={themeType === 'dark'}
            />
        </>
    );
};

const styles = StyleSheet.create({
    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
    },
    dateText: {
        fontSize: 18,
        fontFamily: 'Inter-Medium',
        marginLeft: 10,
    },
});

export default DeadlinePicker;
