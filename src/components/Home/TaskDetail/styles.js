import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.9)',
    },
    modalView: {
        width: '95%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
    },
    toprow: {
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    detailsContainer: {
        width: '100%',
        marginVertical: 10,
    },
    details: {
        fontSize: 18,
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        padding: 10,
    },
    date: {
        fontSize: 16,
        marginBottom: 10,
    },
    subtasksContainer: {
        width: '100%',
        marginVertical: 10,
    },
    subtaskItems: {
        marginVertical: 10,
    },
    subtask: {
        marginBottom: 10,
        alignItems: 'center',
        flexDirection: 'row',
    },
    subtaskText: {
        fontSize: 16,
        marginLeft: 10,
    },
    icon: {
        marginRight: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        backgroundColor: '#175f99',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginVertical: 10,
        width: '40%',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    // task status button
    taskStatusBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 18,
        borderWidth: 1,
    },
    colorCircle: {
        width: 12,
        height: 12,
        borderRadius: 8,
        marginRight: 5,
    },
    statusText: {
        fontSize: 14,
        fontFamily: 'Inter-SemiBold',
    },
});

export default styles;
