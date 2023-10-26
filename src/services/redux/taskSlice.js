import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase/config';
import { toTimestamp } from '../firebase/helper';

/** fetch user's tasks from firestore */
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (userId) => {
    try {
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
    } catch (err) {
      alert(err);
    }
  },
);

/** add a new task to firestore */
export const addTask = createAsyncThunk(
  'tasks/addTask',
  async ({ userId, taskDetails }) => {
    try {
      // create a copy for firestore update
      // because firestore date has to be a timestamp
      const dataForStore = { ...updatedData };

      if (dataForStore.deadline) {
        // convert js date to firestore timestamp
        dataForStore.deadline = toTimestamp(dataForStore.deadline);
      }

      const doc = await db
        .collection('users')
        .doc(userId)
        .collection('tasks')
        .add(dataForStore);

      console.log('(AsyncThunk) new task added!');

      return { ...taskDetails, id: doc.id };
    } catch (err) {
      alert(err.message);
    }
  },
);

/** update existing task in firestore */
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ userId, taskId, updatedData }) => {
    try {
      // create a copy for firestore update
      // because firestore date has to be a timestamp
      const dataForStore = { ...updatedData };

      if (dataForStore.deadline) {
        // convert deadline to firestore timestamp
        dataForStore.deadline = toTimestamp(dataForStore.deadline);
      }

      await db
        .collection('users')
        .doc(userId)
        .collection('tasks')
        .doc(taskId)
        .update(dataForStore);

      console.log('(AsyncThunk) task updated!');

      return { ...updatedData, id: taskId };
    } catch (err) {
      alert(err.message);
    }
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
        state.data = state.data.map((task) =>
          task.id === action.payload.id ? action.payload : task,
        );
      });
  },
});

export default tasksSlice.reducer;
