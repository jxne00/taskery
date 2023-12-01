import { StyleSheet } from 'react-native';

let PRIMARY_COL = '#404258';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fcf8f6',
    },
    container: {
        flex: 1,
        backgroundColor: '#fcf8f6',
        alignItems: 'center',
    },
    title: {
        marginTop: 20,
        fontSize: 34,
        marginBottom: 10,
        fontFamily: 'PoetsenOne-Regular',
        textAlign: 'center',
        color: PRIMARY_COL,
    },
    subtitle: {
        fontSize: 16,
        color: '#3c3c3c',
        fontFamily: 'Inter-Medium',
    },

    // text input area
    inputContainer: {
        width: '90%',
        marginTop: '30%',
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 5,
        marginLeft: 5,
        color: PRIMARY_COL,
        fontFamily: 'Inter-Bold',
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 44,
        paddingHorizontal: 10,
        borderRadius: 18,
        backgroundColor: '#dddcdc',
    },
    inputRightIcon: {
        marginLeft: 'auto',
    },
    textInput: {
        height: 45,
        paddingHorizontal: 12,
        fontSize: 16,
        width: '100%',
        fontFamily: 'Inter-Medium',
    },
    focusedBox: {
        borderColor: PRIMARY_COL,
        borderWidth: 2,
    },

    // buttons
    buttonsContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 'auto',
    },
    loginBtn: {
        backgroundColor: PRIMARY_COL,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        height: 42,
    },
    loginText: {
        color: '#FDF3EC',
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
    },
    registerBtn: {
        borderBlockColor: '#242424',
        borderWidth: 1,
        height: 42,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        marginBottom: 20,
        marginTop: 10,
    },
    registerText: {
        color: '#242424',
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
    },

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

export default styles;
