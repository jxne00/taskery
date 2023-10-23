// helper fuctions for firebase related stuff

import firebase from 'firebase/compat/app';
import { auth, db, storage } from './config';

/**
 * fetch avatar urls from firebase storage
 */
const fetchAvatarUrls = async () => {
  let avatars = [];

  // get files name a1.png - a8.png from "/avatars" folder
  for (let i = 1; i <= 8; i++) {
    const path = `avatars/a${i}.png`;
    const url = await storage.ref(path).getDownloadURL();
    avatars.push(url);
  }
  return avatars;
};

/**
 * convert milliseconds to firebase timestamp type
 */
const toTimestamp = (milliseconds) => {
  const date = new Date(milliseconds);
  return firebase.firestore.Timestamp.fromDate(date);
};

export { fetchAvatarUrls, toTimestamp };
