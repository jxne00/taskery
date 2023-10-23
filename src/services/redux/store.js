import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';

import tasksReducer from './taskReducer';
import profileReducer from './profileReducer';

/** combine profile and tasks reducers */
const appReducer = combineReducers({
  profile: profileReducer,
  tasks: tasksReducer,
});

/** the main reducer */
const rootReducer = (state, action) => {
  // reset entire redux state on logout
  if (action.type === 'LOGOUT') {
    state = undefined;
  }
  return appReducer(state, action);
};

/** redux store */
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

export default store;
