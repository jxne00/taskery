import { combineReducers } from 'redux';
import tasksReducer from './slices/taskSlice';
import profileReducer from './slices/profileSlice';

/**
 * combines all reducers
 */
const rootReducer = combineReducers({
  profile: profileReducer,
  tasks: tasksReducer,
});

export default rootReducer;
