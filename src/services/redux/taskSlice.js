import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase/config';
import { toTimestamp } from '../firebase/helper';

/** fetch user's tasks from firestore */
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (userId) => {
    const tasksRef = db.collection('users').doc(userId).collection('tasks');
    const snapshot = await tasksRef.get();
    const tasks = [];

    snapshot.forEach((doc) => {
      const data = doc.data();

      if (data.deadline) {
        // convert firestore timestamp to milliseconds
        data.deadline = data.deadline.toMillis();
      }

      tasks.push({ ...data, id: doc.id });
      console.log('(AsyncThunk) tasks fetched!');
    });
    return tasks;
  },
);

/** add a new task to firestore */
export const addTask = createAsyncThunk(
  'tasks/addTask',
  async ({ userId, task }) => {
    const tasksRef = db.collection('users').doc(userId).collection('tasks');

    if (task.deadline) {
      // convert js date to firestore timestamp
      task.deadline = toTimestamp(task.deadline);
    }

    const doc = await tasksRef.add(task);
    console.log('(AsyncThunk) new task added!');

    return { ...task, id: doc.id };
  },
);

/** edit existing task in firestore */
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ userId, taskId, task }) => {
    const tasksRef = db.collection('users').doc(userId).collection('tasks');

    if (task.deadline) {
      // convert js date to firestore timestamp
      task.deadline = toTimestamp(task.deadline);
    }

    await tasksRef.doc(taskId).update(task);
    console.log('(AsyncThunk) task updated!');

    return { ...task, id: taskId };
  },
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // add new task to redux store
      .addCase(addTask.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })

      // update existing task in redux store
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (task) => task.id === action.payload.taskId,
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      });
  },
});

export default tasksSlice.reducer;
