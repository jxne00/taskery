import { createSelector } from '@reduxjs/toolkit';

// start of the day
const today = new Date();
today.setHours(0, 0, 0, 0);

// start of the week (sunday)
const weekStart = new Date(today);
weekStart.setDate(today.getDate() - today.getDay());

// end of the week (saturday)
const weekEnd = new Date(weekStart);
weekEnd.setDate(weekStart.getDate() + 7);

// start & end of the month
const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

/** selector for today's tasks */
const selectTasksForToday = createSelector(
  (state) => state.tasks,
  (tasks) =>
    Object.values(tasks).filter((task) => {
      const taskDate = task.deadline;
      return taskDate === today.getTime();
    }),
);

/** selector for this week's tasks */
const selectTasksForWeek = createSelector(
  (state) => state.tasks,
  (tasks) =>
    Object.values(tasks).filter((task) => {
      const taskDate = task.deadline;
      return (
        taskDate >= weekStart.getMilliseconds() &&
        taskDate <= weekEnd.getMilliseconds()
      );
    }),
);

/** selector for this month's tasks */
const selectTasksForMonth = createSelector(
  (state) => state.tasks,
  (tasks) =>
    Object.values(tasks).filter((task) => {
      const taskDate = task.deadline;
      return (
        taskDate >= monthStart.getMilliseconds() &&
        taskDate <= monthEnd.getMilliseconds()
      );
    }),
);

// export const selectTasksForCustomRange = (from, to) =>
//   createSelector(
//     (state) => state.tasks.tasks,
//     (tasks) =>
//       Object.values(tasks).filter((task) => {
//         const taskDate = new Date(task.deadline);
//         return taskDate >= new Date(from) && taskDate <= new Date(to);
//       }),
//   );

// export { selectTasksForToday, selectTasksForWeek, selectTasksForMonth };
