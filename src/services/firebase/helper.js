import firebase from 'firebase/compat/app';
import { storage } from './index';

/**
 * Converts milliseconds to firebase timestamp object
 * @param {number} milliseconds - time in milliseconds
 */
const toTimestamp = (milliseconds) => {
    const date = new Date(milliseconds);
    return firebase.firestore.Timestamp.fromDate(date);
};

/**
 * Stores the user avatar in firebase storage and returns the download url
 * @param {string} userId - ID of current user
 * @param {string} image - uri of the image to store
 */
const storeAvatar = async (userId, image) => {
    // store in storage path 'usersAvatar/{userId}'
    const storageRef = storage.ref(`usersAvatar/${userId}`);

    // convert to blob and upload
    const response = await fetch(image);
    const blob = await response.blob();
    await storageRef.put(blob);

    // return download url
    const url = await storageRef.getDownloadURL();
    return url;
};

export { toTimestamp, storeAvatar };
