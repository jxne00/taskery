import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { useTheme } from '../theme/ThemeContext';

/** A date picker to set range */
const DatePick = ({ openDatePicker, handleConfirm, handleCancel, date }) => {
  const { themeType } = useTheme();

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
