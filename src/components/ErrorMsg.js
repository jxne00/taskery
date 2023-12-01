import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../screens/Login/styles';

const ErrorMessage = ({ errorMsg }) => {
    <View style={styles.errorBox}>
        <Ionicons name="alert-circle-outline" size={20} color="#af0000" />
        <Text style={styles.errorMsg}>{errorMsg}</Text>
    </View>;
};

const styles = StyleSheet.create({
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffe0e0',
        width: '90%',
        height: 50,
        marginTop: 30,
        paddingHorizontal: 20,
        borderRadius: 8,
    },

    errorMsg: {
        color: '#af0000',
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        marginLeft: 10,
    },
});

export default ErrorMessage;
