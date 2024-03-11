import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'Inter-Bold',
    },
    backBtn: {
        margin: 12,
    },
    themeBox: {
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 14,
    },
    themeTitle: {
        fontSize: 18,
        marginBottom: 10,
        textDecorationLine: 'underline',
        fontFamily: 'Inter-Bold',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    optionText: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
    },
    signOutBtn: {
        width: '80%',
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginTop: 'auto',
        marginBottom: 20,
    },
    signOutTxt: {
        padding: 10,
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
    },
    pageButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 10,
        borderBottomWidth: 1,
        width: '80%',
        paddingVertical: 10,
    },
});

export default styles;
