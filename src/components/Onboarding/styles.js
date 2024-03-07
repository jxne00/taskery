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
        padding: 20,
        backgroundColor: BG_COL,
    },
    title: {
        fontSize: 28,
        textAlign: 'center',
        color: PRIMARY_COL,
        marginBottom: 10,
        fontFamily: 'PoetsenOne-Regular',
    },
    subtitle: {
        fontSize: 16,
        color: '#232323',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'Inter-Regular',
    },

    inputContainer: {
        marginTop: 30,
        width: '100%',
    },
    inputLabel: {
        fontSize: 16,
        color: PRIMARY_COL,
        fontFamily: 'Inter-Bold',
        paddingRight: 5,
    },
    textInput: {
        padding: 10,
        borderBottomColor: '#5d5d5d',
        borderBottomWidth: 1,
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Inter-Medium',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },

    nextBtn: {
        backgroundColor: PRIMARY_COL,
        paddingVertical: 8,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '40%',
        shadowColor: '#3e3e3e',
        shadowOffset: { width: -1, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 5,
    },
    nextBtnText: {
        color: '#fff',
        fontSize: 18,
        marginRight: 10,
        fontFamily: 'Inter-SemiBold',
    },

    errorMsg: {
        fontSize: 16,
        color: '#a10101',
        backgroundColor: '#fbe0e0',
        padding: 8,
        marginTop: 20,
        fontFamily: 'Inter-Regular',
    },
});

export default styles;
