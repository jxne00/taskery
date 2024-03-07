import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    pageTitle: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 24,
    },
    halfLine: {
        width: '45%',
        height: 2,
        marginLeft: 15,
        marginBottom: 10,
    },
    postContainer: {
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        width: '95%',
        alignSelf: 'center',
    },
    topRow: {
        justifyContent: 'space-between',
    },
    createdDate: {
        fontSize: 12,
    },
    content: {
        marginTop: 5,
        marginBottom: 10,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 2,
    },

    viewSelect: {
        justifyContent: 'space-around',
        marginBottom: 10,
    },

    // comments modal
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    modalView: {
        margin: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    commentsContainer: {
        width: '100%',
        marginBottom: 10,
    },
    commentContainer: {
        width: '100%',
        marginBottom: 10,
    },
    comment: {
        fontSize: 16,
        marginBottom: 5,
    },
    commentAuthor: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    button: {
        backgroundColor: '#2196F3',
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    // modal styles
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    closeTouchableArea: {
        flex: 1,
    },
    modalView: {
        height: '50%',
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    emptyContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalToprow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    icon: {
        position: 'absolute',
        right: 10,
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        flex: 1,
    },
    // comment styles
    commentBox: {
        margin: 10,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderWidth: 1,
        borderRadius: 16,
    },
    addCommentBox: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 30,
        borderWidth: 1,
        margin: 10,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputComment: {
        flex: 1,
    },
});

export default styles;
