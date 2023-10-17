import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: {},
  isLoading: false,
  error: null,
};

/**
 * Redux slice for user's tasks states
 */
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // start the fetch
    fetchTasksRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    // fetch successful
    fetchTasksSuccess: (state, action) => {
      state.isLoading = false;

      // convert tasks array into object
      // allows more efficient sorting/filtering
      action.payload.forEach((task) => {
        state.tasks[task.id] = task;
      });
    },
    // set error message if fetch unsuccessful
    fetchTasksFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // add new task & update state
    addTaskSuccess: (state, action) => {
      const newTask = action.payload;
      state.tasks[newTask.id] = newTask;
    },

    // =============== edit task (not implemented yet)
    editTaskSuccess: (state, action) => {
      const updatedTask = action.payload;
      state.tasks[updatedTask.id] = updatedTask;
    },

    // =============== delete task (not implemented yet)
    deleteTaskSuccess: (state, action) => {
      const taskId = action.payload;
      delete state.tasks[taskId];
    },
  },
});

export const {
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,

  addTaskSuccess,
  addTaskFailure,

  editTaskSuccess,
  editTaskFailure,

  deleteTaskSuccess,
  deleteTaskFailure,
} = taskSlice.actions;
export default taskSlice.reducer;
