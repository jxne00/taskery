import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { useTheme } from '../hooks/useThemeContext';

/** A date picker to select a date */
const DatePick = (props) => {
    const { themeType } = useTheme();
    const { openDatePicker, handleConfirm, handleCancel, date } = props;

    return (
        <>
            <DateTimePickerModal
                isVisible={openDatePicker}
                mode="date"
                onConfirm={(date) => handleConfirm(date)}
                onCancel={handleCancel}
                date={date || new Date()}
                themeVariant={themeType === 'light' ? 'light' : 'dark'}
                isDarkModeEnabled={themeType === 'dark'}
            />
        </>
    );
};

export default DatePick;
