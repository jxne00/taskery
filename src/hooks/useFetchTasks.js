import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from '../services/firebase';
import { fetchTasks } from '../services/redux/taskSlice';
import {
    selectAllTasks,
    selectTasksForToday,
    selectTasksForWeek,
    selectTasksForMonth,
    selectSortedTasks,
    filterByCompletion,
} from '../services/redux/taskSelectors';

/**
 * Custom hook for fetching tasks from redux store
 * @param {string} chosenTimeFrame - today, week, month, all
 * @param {string} sortOrder - date, priority, title
 * @param {boolean} showCompleted - show or hide completed tasks
 */
const useFetchTasks = (chosenTimeFrame, sortOrder, showCompleted) => {
    const dispatch = useDispatch();

    const userId = auth.currentUser?.uid;

    // select tasks based on chosenTimeFrame and sortOrder
    const tasks = useSelector((state) => {
        let selectedTasks;
        switch (chosenTimeFrame) {
            case 'today':
                selectedTasks = selectTasksForToday(state);
                break;
            case 'week':
                selectedTasks = selectTasksForWeek(state);
                break;
            case 'month':
                selectedTasks = selectTasksForMonth(state);
                break;
            case 'all':
                selectedTasks = selectAllTasks(state);
                break;
            default:
                selectedTasks = selectAllTasks(state);
        }

        // filter tasks by completion
        selectedTasks = filterByCompletion(state, selectedTasks, showCompleted);

        return selectSortedTasks(state, selectedTasks, sortOrder);
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
