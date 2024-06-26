import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// firebase configurations
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
firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app();

/** Firebase authentication */
const auth = firebase.auth();

/** Firebase firestore */
const db = firebase.firestore();

/** Firebase storage */
const storage = firebase.storage();

export { auth, db, storage };
