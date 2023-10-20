import {
  fetchProfileRequest,
  fetchProfileSuccess,
  fetchProfileFailure,
} from '../reducers/profile';
import { db } from '../../firebase/config';

/**
 * fetch user's profile from firestore
 */
const fetchProfile = (userId) => (dispatch) => {
  dispatch(fetchProfileRequest());

  // user document in firestore
  const ref = db.collection('users').doc(userId);

  // attach listener to the document
  return ref.onSnapshot(
    (doc) => {
      if (doc.exists) {
        const profile = doc.data();

        // convert firestore's 'timestamp' type to milliseconds
        if (profile.created_at) {
          profile.created_at = profile.created_at.toMillis();
        }

        console.log('\nprofile fetched: ', profile);
        dispatch(fetchProfileSuccess(profile));
      } else {
        dispatch(fetchProfileFailure('Profile does not exist.'));
      }
    },
    (err) => {
      dispatch(fetchProfileFailure(err.message));
    },
  );
};

export { fetchProfile };
