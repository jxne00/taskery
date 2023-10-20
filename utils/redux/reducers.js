import { combineReducers } from 'redux';
import tasksReducer from './reducers/task';
import profileReducer from './reducers/profile';

// combine profile and tasks reducers
const appReducer = combineReducers({
  profile: profileReducer,
  tasks: tasksReducer,
});

// the main reducer
const rootReducer = (state, action) => {
  // reset entire redux state on logout
  if (action.type === 'LOGOUT') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
