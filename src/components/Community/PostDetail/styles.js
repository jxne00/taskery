import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    headerRow: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        marginTop: 10,
        marginBottom: 5,
        textAlign: 'center',
    },
    sentence: {
        flexDirection: 'row',
        alignSelf: 'center',
    },
    content: {
        fontSize: 18,
        marginTop: 40,
        marginBottom: 20,
    },

    // like and comment bar
    likeCommentBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 30,
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
