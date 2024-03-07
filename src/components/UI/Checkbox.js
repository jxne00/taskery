import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * A custom checkbox component
 */
const MyCheckbox = ({ checked, setChecked }) => {
    return (
        <TouchableOpacity
            style={styles.checkboxBase}
            onPress={() => setChecked(!checked)}>
            {checked && <Ionicons name="checkmark" size={22} color={'#fff'} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    checkboxBase: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#b7b7b7',
    },
});

export default MyCheckbox;
