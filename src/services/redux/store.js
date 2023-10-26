import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import taskReducer from './taskSlice';

/** setup redux store */
const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: taskReducer,
  },
});

export default store;
