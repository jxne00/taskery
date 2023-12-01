import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchUser } from '../services/redux/userSlice';
import { auth } from '../services/firebase';

/** Custom hook to fetches user data from redux store */
const useFetchUser = () => {
    const dispatch = useDispatch();

    const userId = auth.currentUser?.uid;

    const user = useSelector((state) => state.user.data);
    const userLoading = useSelector((state) => state.user.isLoading);
    const userError = useSelector((state) => state.user.error);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUser(userId));
        }
    }, [userId, dispatch]);

    return { user, userLoading, userError };
};

export default useFetchUser;
