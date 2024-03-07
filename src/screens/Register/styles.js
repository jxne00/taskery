import { StyleSheet } from 'react-native';

let PRIMARY_COL = '#404258';
let BG_COL = '#FBFBFB';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: BG_COL,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: BG_COL,
    },

    backBtn: {
        position: 'absolute',
        top: 40,
        left: 20,
        color: '#0c0c0c',
    },

    title: {
        fontSize: 28,
        marginTop: '20%',
        textAlign: 'center',
        color: PRIMARY_COL,
        fontFamily: 'Inter-Bold',
    },

    inputContainer: {
        width: '90%',
        marginTop: '20%',
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
        borderRadius: 15,
        backgroundColor: '#e4e4e4',
    },
    inputRightIcon: {
        marginLeft: 'auto',
    },
    textInput: {
        height: 44,
        paddingHorizontal: 12,
        fontSize: 16,
        width: '100%',
        fontFamily: 'Inter-Medium',
    },
    focusedBox: {
        borderColor: PRIMARY_COL,
        borderWidth: 2,
    },

    registerBtn: {
        backgroundColor: PRIMARY_COL,
        borderRadius: 20,
        paddingVertical: 10,
        alignItems: 'center',
        width: '90%',
        marginTop: 'auto',
    },
    buttonText: {
        color: BG_COL,
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
    },
    toLoginText: {
        marginVertical: 18,
        color: '#292929',
        fontSize: 15,
        fontFamily: 'Inter-Medium',
    },
    loginTxt: {
        color: '#626478',
        fontFamily: 'Inter-Medium',
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
