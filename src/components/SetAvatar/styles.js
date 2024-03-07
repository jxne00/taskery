import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    avatarImage: {
        width: 130,
        height: 130,
        borderRadius: 80,
    },
    editAvatarBtn: {
        color: '#000000',
        backgroundColor: '#c3c7db',
        borderRadius: 30,
        padding: 5,
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    deleteAvatarBtn: {
        color: '#f1f1f1',
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: '#383838',
        opacity: 0.7,
        padding: 3,
    },

    // modal styles
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalView: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        width: '90%',
    },

    // tab button styles
    tabRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        borderBottomWidth: 2,
        borderColor: '#ccc',
    },
    tab: {
        padding: 10,
        borderBottomWidth: 3,
        borderColor: 'transparent',
    },
    activeTab: {
        borderColor: '#0072e3',
    },
    tabText: {
        fontSize: 18,
        fontFamily: 'Inter-Bold',
    },

    // "default" tab styles
    title: {
        fontSize: 20,
        marginBottom: 20,
        fontFamily: 'Inter-Bold',
    },
    avatarsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    avatarImg: {
        width: width / 4,
        height: width / 4,
        margin: 2,
    },

    // "upload" tab styles
    imageBox: {
        width: width / 2,
        height: width / 2,
        borderWidth: 2,
        borderColor: '#333333',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 6,
        marginVertical: 10,
        borderRadius: 12,
        backgroundColor: '#e5e5e5',
        shadowColor: '#181818',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    iconRowText: {
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
    },

    // cancel & confirm buttons
    selectedAvatar: {
        borderWidth: 2,
        borderColor: '#5119c0',
        borderRadius: 8,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    buttonContainer: {
        width: '40%',
        padding: 10,
        borderRadius: 10,
        margin: 8,
        shadowColor: '#0f0f0f',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    btnText: {
        textAlign: 'center',
        color: '#ffffff',
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
    },
});

export default styles;
