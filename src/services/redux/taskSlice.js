import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase';
import { toTimestamp } from '../firebase/helper';

/** fetch user's tasks from firestore */
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (userId) => {
    try {
        console.log(': (AsyncThunk) fetching tasks!');
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
        });

        return tasks;
    } catch (err) {
        alert(err);
    }
});

/** add a new task to firestore */
export const addTask = createAsyncThunk(
    'tasks/addTask',
    async ({ userId, taskDetails }) => {
        if (!userId) {
            alert('Please log in to add a task!');
            return;
        }

        try {
            // create a copy for firestore update
            // because firestore date has to be a timestamp
            const dataForStore = { ...taskDetails };

            if (dataForStore.deadline) {
                // convert js date to firestore timestamp
                dataForStore.deadline = toTimestamp(dataForStore.deadline);
            }

            const docRef = await db
                .collection('users')
                .doc(userId)
                .collection('tasks')
                .add(dataForStore);

            return { ...taskDetails, id: docRef.id };
        } catch (err) {
            alert(err.message);
        }
    },
);

/** update existing task in firestore */
export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ userId, taskId, taskDetails }) => {
        try {
            // create a copy for firestore update
            // because firestore date has to be a timestamp
            const dataForStore = { ...taskDetails };

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

            return { ...taskDetails, id: taskId };
        } catch (err) {
            alert(err.message);
        }
    },
);

/** delete task from firestore */
export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async ({ userId, taskId }) => {
        try {
            await db
                .collection('users')
                .doc(userId)
                .collection('tasks')
                .doc(taskId)
                .delete();

            console.log('(AsyncThunk) task deleted!');

            return taskId;
        } catch (err) {
            alert(err.message);
        }
    },
);

/** toggle completion status of a task */
export const toggleCompletion = createAsyncThunk(
    'tasks/toggleCompletion',
    async ({ userId, taskId, is_complete }) => {
        try {
            const newStatus = !is_complete;
            await db
                .collection('users')
                .doc(userId)
                .collection('tasks')
                .doc(taskId)
                .update({
                    is_complete: newStatus,
                });

            console.log('(AsyncThunk) task status toggled!');

            return { taskId, is_complete: newStatus };
        } catch (err) {
            alert(err.message);
        }
    },
);

/** redux slice for tasks */
const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        data: [],
        loading: {
            // loading states for each thunk
            fetchTasks: false,
            addTask: false,
            updateTask: false,
            deleteTask: false,
            updateStatus: false,
        },
        error: null,
        filters: {
            status: 'all', // 'all', 'completed', 'incomplete', 'overdue'
            searchBy: 'all', // 'all', 'title', 'description'
            searchTerm: '',
            sortBy: 'deadline', // 'deadline', 'title'
            sortOrder: 'asc', // 'asc', 'desc'
        },
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ======= store fetched tasks ======= //
            .addCase(fetchTasks.pending, (state) => {
                state.loading.fetchTasks = true;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading.fetchTasks = false;
                state.data = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading.fetchTasks = false;
                state.error = action.error.message;
            })

            // =========== add new task =========== //
            .addCase(addTask.pending, (state) => {
                state.loading.addTask = true;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.loading.addTask = false;
                state.data.push(action.payload);
            })
            .addCase(addTask.rejected, (state, action) => {
                state.loading.addTask = false;
                alert(action.error.message);
            })

            // ============ update task ============ //
            .addCase(updateTask.pending, (state) => {
                state.loading.updateTask = true;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.data = state.data.map((task) =>
                    task.id === action.payload.id ? action.payload : task,
                );
                state.loading.updateTask = false;
            })

            // ============= delete task ============= //
            .addCase(deleteTask.pending, (state) => {
                state.loading.deleteTask = true;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading.deleteTask = false;
                state.data = state.data.filter((task) => task.id !== action.payload);
            })

            // ======== toggle completion status ======== //
            .addCase(toggleCompletion.pending, (state) => {
                state.loading.updateStatus = true;
            })
            .addCase(toggleCompletion.fulfilled, (state, action) => {
                state.loading.updateStatus = false;

                const task = state.data.find(
                    (task) => task.id === action.payload.taskId,
                );
                if (task) task.is_complete = action.payload.is_complete;
            });
    },
});

export default tasksSlice.reducer;
