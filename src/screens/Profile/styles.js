import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    settingsIcon: {
        position: 'absolute',
        top: 10,
        right: 15,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 80,
        margin: 10,
    },
    profileName: {
        fontSize: 30,
        paddingRight: 5,
    },
    visContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 10,
        marginTop: 10,
    },
    visText: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        marginLeft: 5,
    },

    horizontalLine: {
        width: '98%',
        height: 1,
        marginTop: 20,
    },
    // stats
    statsContainer: {
        width: '100%',
        paddingHorizontal: 20,
    },
    statTitle: {
        fontSize: 22,
        marginTop: 20,
    },
    statBox: {
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        marginVertical: 10,
        borderRadius: 8,
    },
});

export default styles;
