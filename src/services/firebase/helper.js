// helper fuctions for firebase related stuff

import firebase from 'firebase/compat/app';

/**
 * convert milliseconds to firebase timestamp type
 */
const toTimestamp = (milliseconds) => {
  const date = new Date(milliseconds);
  return firebase.firestore.Timestamp.fromDate(date);
};

export { toTimestamp };
