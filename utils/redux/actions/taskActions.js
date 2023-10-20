import { Alert } from 'react-native';
import {
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,
  addTaskSuccess,
  editTaskSuccess,
  deleteTaskSuccess,
} from '../reducers/task';
import { db } from '../../firebase/config';
import { toTimestamp } from '../../firebase/helper';

/**
 * fetch all task documents from "tasks" collection in firestore
 *
 * @param {string} userId - id of user to fetch tasks of
 */
const fetchTasks = (userId) => (dispatch) => {
  try {
    dispatch(fetchTasksRequest());

    const tasksRef = db.collection('users').doc(userId).collection('tasks');

    return tasksRef.onSnapshot(
      (snapshot) => {
        const tasks = snapshot.docs.map((doc) => {
          const data = doc.data();

          // firestore's 'timestamp' type is non-seriazable
          // but redux state must be serializable
          // so my solution is to convert dates to milliseconds
          if (data.deadline) {
            data.deadline = data.deadline.toMillis();
          }

          return {
            id: doc.id,
            ...data,
          };
        });

        console.log('\ntasks fetched: ', tasks);
        dispatch(fetchTasksSuccess(tasks));
      },
      (error) => {
        dispatch(fetchTasksFailure(error.message));
      },
    );
  } catch (error) {
    Alert.alert('error fetching tasks: ', error.message);
  }
};

/**
 * add new task document to "tasks" collection in firestore
 * and update redux state
 *
 * @param {string} userId - id of user to add task to
 * @param {object} taskData - the task data to add
 */
const addTask = (userId, taskData) => async (dispatch) => {
  try {
    // copy of task data to prevent mutation
    const taskDataCopy = { ...taskData };

    // convert deadline back to firestore 'timestamp' type
    // (only for the copy that will be added to firestore)
    if (taskDataCopy.deadline) {
      taskDataCopy.deadline = toTimestamp(taskDataCopy.deadline);
    }

    const taskRef = await db
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .add(taskDataCopy);

    dispatch(addTaskSuccess({ id: taskRef.id, ...taskData }));
  } catch (error) {
    Alert.alert('Error adding task', error.message);
  }
};

/**
 * edit a task document in "tasks" collection in firestore
 *
 * @param {string} userId - id of user to edit task of
 * @param {string} taskId - id of task to edit
 * @param {object} updatedData - the new data to use to update the task
 */
const updateTask = (userId, taskId, updatedData) => async (dispatch) => {
  try {
    const updatedDataCopy = { ...updatedData };

    if (updatedDataCopy.deadline) {
      updatedDataCopy.deadline = toTimestamp(updatedDataCopy.deadline);
    }

    await db
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .doc(taskId)
      .update(updatedDataCopy);

    dispatch(editTaskSuccess({ id: taskId, ...updatedData }));
  } catch (error) {
    Alert.alert('Error editing task', error.message);
  }
};

/**
 * delete a task document from "tasks" collection in firestore
 *
 * @param {string} userId - id of user to delete task of
 * @param {string} taskId - id of task to delete
 */
const deleteTask = (userId, taskId) => async (dispatch) => {
  try {
    await db
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .doc(taskId)
      .delete();

    dispatch(deleteTaskSuccess(taskId));
  } catch (error) {
    Alert.alert('Error deleting task', error.message);
  }
};

export { fetchTasks, addTask, updateTask, deleteTask };
