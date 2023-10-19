import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// configure firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDIKiRFSjZWwAne2f4l6djZah7UhbK42IA',
  authDomain: 'taskery-6f430.firebaseapp.com',
  projectId: 'taskery-6f430',
  storageBucket: 'taskery-6f430.appspot.com',
  messagingSenderId: '32482288652',
  appId: '1:32482288652:web:e3c9921282d9427ac9ba29',
  measurementId: 'G-QLCEM9PJZQ',
};

// initialize firebase app
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// fetch avatar urls from firebase storage
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

// convert milliseconds to firebase timestamp
const toTimestamp = (milliseconds) => {
  const date = new Date(milliseconds);
  return firebase.firestore.Timestamp.fromDate(date);
};

export { auth, db, storage, fetchAvatarUrls, toTimestamp };
