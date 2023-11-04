// helper fuctions for firebase related stuff

import firebase from 'firebase/compat/app';
import { storage } from './index';

/**
 * convert milliseconds to firebase timestamp type
 * @param milliseconds time in milliseconds
 */
const toTimestamp = (milliseconds) => {
  const date = new Date(milliseconds);
  return firebase.firestore.Timestamp.fromDate(date);
};

/**
 * store user's avatar image to firebase storage
 * @param userId firebase uid of the user
 * @param image image to store
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
