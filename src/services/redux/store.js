import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import taskReducer from './taskSlice';
import postReducer from './postSlice';

/** The Redux store */
const store = configureStore({
    reducer: {
        user: userReducer,
        tasks: taskReducer,
        posts: postReducer,
    },
});

export default store;
