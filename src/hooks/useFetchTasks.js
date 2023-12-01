import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchTasks } from '../services/redux/taskSlice';
import { auth } from '../services/firebase';

import {
    selectAllTasks,
    selectTasksForToday,
    selectTasksForWeek,
    selectTasksForMonth,
    selectTasksForRange,
} from '../services/redux/taskSelectors';

/** Custom hook for fetching tasks from redux store */
const useFetchTasks = (chosenTimeFrame) => {
    const dispatch = useDispatch();

    const userId = auth.currentUser?.uid;

    const tasks = useSelector((state) => {
        switch (chosenTimeFrame) {
            case 'today':
                return selectTasksForToday(state);
            case 'week':
                return selectTasksForWeek(state);
            case 'month':
                return selectTasksForMonth(state);
            case 'all':
                return selectAllTasks(state);
            default:
                return selectAllTasks(state);
        }
    });

    const fetchIsLoading = useSelector((state) => state.tasks.loading.fetchTasks);
    const fetchTasksError = useSelector((state) => state.tasks.error);

    useEffect(() => {
        if (userId) {
            dispatch(fetchTasks(userId));
        }
    }, [userId, dispatch]);

    return { tasks, fetchIsLoading, fetchTasksError };
};

export default useFetchTasks;
