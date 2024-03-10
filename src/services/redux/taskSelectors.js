import { createSelector } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

/** selector for all tasks */
const selectAllTasks = (state) => state.tasks.data;

/** selector for tasks due today */
const selectTasksForToday = createSelector([selectAllTasks], (tasks) => {
    const startOfDay = dayjs().startOf('day');
    const endOfDay = dayjs().endOf('day');

    return tasks.filter((task) => {
        const taskDate = dayjs(task.deadline);
        return taskDate.isBetween(startOfDay, endOfDay, null, '[]');
    });
});

/** selector for tasks due this week */
const selectTasksForWeek = createSelector([selectAllTasks], (tasks) => {
    const startOfWeek = dayjs().startOf('week');
    const endOfWeek = dayjs().endOf('week');

    return tasks.filter((task) => {
        const taskDate = dayjs(task.deadline);
        return taskDate.isBetween(startOfWeek, endOfWeek, null, '[]');
    });
});

/** selector for tasks due this month */
const selectTasksForMonth = createSelector([selectAllTasks], (tasks) => {
    const monthStart = dayjs().startOf('month');
    const monthEnd = dayjs().endOf('month');

    return tasks.filter((task) => {
        const taskDate = dayjs(task.deadline);
        return taskDate.isBetween(monthStart, monthEnd, null, '[]');
    });
});

const selectSortedTasks = createSelector(
    [(state, tasks) => tasks, (state, tasks, sortOrder) => sortOrder],
    (tasks, sortOrder) => {
        // sort tasks by deadline in asc or desc order
        return tasks.slice().sort((a, b) => {
            if (sortOrder === 'asc') {
                return dayjs(a.deadline).unix() - dayjs(b.deadline).unix();
            } else {
                return dayjs(b.deadline).unix() - dayjs(a.deadline).unix();
            }
        });
    },
);

const filterByCompletion = createSelector(
    [(state, tasks) => tasks, (state, tasks, showCompleted) => showCompleted],
    (tasks, showCompleted) => {
        if (!showCompleted) {
            return tasks.filter((task) => !task.is_complete);
        }
        return tasks;
    },
);

export {
    selectAllTasks,
    selectTasksForToday,
    selectTasksForWeek,
    selectTasksForMonth,
    selectSortedTasks,
    filterByCompletion,
};
