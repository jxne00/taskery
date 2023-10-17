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
    fetchTasksRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchTasksSuccess: (state, action) => {
      state.isLoading = false;

      // convert tasks array into object
      action.payload.forEach((task) => {
        state.tasks[task.id] = task;
      });
    },
    fetchTasksFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // =============== add task (not implemented yet)
    addTaskRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    addTaskSuccess: (state, action) => {
      state.isLoading = false;
      state.tasks[action.payload.id] = action.payload;
    },
    addTaskFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // =============== edit task (not implemented yet)
    editTaskRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    editTaskSuccess: (state, action) => {
      const updatedTask = action.payload;
      state.tasks[updatedTask.id] = updatedTask;
    },
    editTaskFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // =============== delete task (not implemented yet)
    deleteTaskRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteTaskSuccess: (state, action) => {
      const taskId = action.payload;
      delete state.tasks[taskId];
    },
    deleteTaskFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,

  addTaskRequest,
  addTaskSuccess,
  addTaskFailure,

  editTaskRequest,
  editTaskSuccess,
  editTaskFailure,

  deleteTaskRequest,
  deleteTaskSuccess,
  deleteTaskFailure,
} = taskSlice.actions;
export default taskSlice.reducer;
