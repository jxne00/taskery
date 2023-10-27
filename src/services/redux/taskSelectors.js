import { createSelector } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const EMPTY_ARRAY = [];

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


export {
  selectAllTasks,
  selectTasksForToday,
  selectTasksForWeek,
  selectTasksForMonth,
  // selectTasksForRange,
};
