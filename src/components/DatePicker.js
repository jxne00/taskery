import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { FontAwesome } from '@expo/vector-icons';

import { useTheme } from '../../utils/theme/ThemeContext';

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
      <View style={styles.pickerRow}>
        <Text style={[styles.pickerText, { color: theme.text }]}>
          Deadline:
        </Text>

        <View style={[styles.box, { borderColor: theme.text }]}>
          <Text style={[styles.dateText, { color: theme.text }]}>
            {date.toLocaleDateString()}
          </Text>

          <FontAwesome
            name="calendar-plus-o"
            size={30}
            color={themeType === 'dark' ? '#fff' : '#000'}
            onPress={() => setOpenPicker(true)}
          />
        </View>
      </View>

      <DateTimePickerModal
        isVisible={openPicker}
        date={date}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        minimumDate={new Date()} // disable past dates
        isDarkModeEnabled={themeType === 'dark'}
      />
    </>
  );
};

const styles = StyleSheet.create({
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  dateText: {
    fontSize: 20,
    marginRight: 20,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
});

export default DeadlinePicker;
