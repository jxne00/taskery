import { createSlice } from '@reduxjs/toolkit';

// initial state of tasks
const initialState = {
  tasks: {},
  isLoading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // start fetching tasks
    fetchTasksRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    // tasks successfully fetched
    fetchTasksSuccess: (state, action) => {
      state.isLoading = false;
      state.tasks = {
        ...state.tasks,
        ...action.payload.reduce((acc, task) => {
          acc[task.id] = task;
          return acc;
        }, {}),
      };
    },
    // tasks fetching failed
    fetchTasksFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    addTaskSuccess: (state, action) => {
      state.tasks[action.payload.id] = action.payload;
    },

    editTaskSuccess: (state, action) => {
      state.tasks[action.payload.id] = action.payload;
    },

    deleteTaskSuccess: (state, action) => {
      delete state.tasks[action.payload];
    },
  },
});

export const {
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,
  addTaskSuccess,
  editTaskSuccess,
  deleteTaskSuccess,
} = taskSlice.actions;

export default taskSlice.reducer;
