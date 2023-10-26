import { createSelector } from '@reduxjs/toolkit';

const selectAllTasks = (state) => state.tasks.data;

const selectTasksForToday = createSelector([selectAllTasks], (tasks) => {
  const today = new Date();

  const todayTasks = tasks.filter((task) => {
    const taskDate = new Date(task.deadline);
    return taskDate.toDateString() === today.toDateString();
  });

  return todayTasks.length ? todayTasks : [];
});

const selectTasksForWeek = createSelector([selectAllTasks], (tasks) => {
  const today = new Date();
  const endOfWeek = new Date(today);

  endOfWeek.setDate(today.getDate() + 7);

  const weekTasks = tasks.filter((task) => {
    const taskDate = new Date(task.deadline);
    return taskDate >= today && taskDate <= endOfWeek;
  });

  return weekTasks.length ? weekTasks : [];
});

// TODO month view
const selectTasksForMonth = createSelector([selectAllTasks], (tasks) => {
  const today = new Date();
  const endOfMonth = new Date(today);

  endOfMonth.setMonth(today.getMonth() + 1);

  const monthTasks = tasks.filter((task) => {
    const taskDate = new Date(task.deadline);
    return taskDate >= today && taskDate <= endOfMonth;
  });

  return monthTasks.length ? monthTasks : [];
});

// export const selectCompletedTasks = createSelector(
//   (state) => state.tasks,
//   (tasks) => tasks.filter((task) => task.completed),
// );

// const selectTasksForRange = (from, to) =>
//   createSelector([selectAllTasks], (tasks) => {
//     const fromDate = new Date(from);
//     const toDate = new Date(to);
//     return tasks.filter((task) => {
//       const taskDate = new Date(task.deadline);
//       return taskDate >= fromDate && taskDate <= toDate;
//     });
//   });

export {
  selectAllTasks,
  selectTasksForToday,
  selectTasksForWeek,
  selectTasksForMonth,
  // selectTasksForRange,
};
