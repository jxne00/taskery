import {
  fetchProfileRequest,
  fetchProfileSuccess,
  fetchProfileFailure,
} from '../slices/profileSlice';
import { db } from '../../config/firebase';

/**
 * redux thunk action to listen to profile changes
 */
const listenToProfileChanges = (userId) => (dispatch) => {
  dispatch(fetchProfileRequest());

  // get profile details from firestore
  const ref = db.collection('users').doc(userId);

  // attach listener to the document
  return ref.onSnapshot(
    (doc) => {
      if (doc.exists) {
        dispatch(fetchProfileSuccess(doc.data()));
      } else {
        dispatch(fetchProfileFailure('Profile does not exist.'));
      }
    },
    (error) => {
      dispatch(fetchProfileFailure(error.message));
    },
  );
};

export { listenToProfileChanges };
