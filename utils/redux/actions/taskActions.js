// actions/tasksActions.js
import {
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,
  addTaskRequest,
  addTaskSuccess,
  addTaskFailure,
  editTaskSuccess,
  editTaskFailure,
  deleteTaskSuccess,
  deleteTaskFailure,
} from '../slices/taskSlice';
import { db } from '../../config/firebase';

/**
 * fetch all task documents from "tasks" collection in firestore
 * @param {string} userId - id of user to fetch tasks of
 */
const fetchTasks = (userId) => (dispatch) => {
  try {
    dispatch(fetchTasksRequest());

    return db
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .onSnapshot(
        (snapshot) => {
          const tasks = snapshot.docs.map((doc) => {
            const data = doc.data();

            // convert firebase timestamp to date string
            if (data.deadline) {
              data.deadline = data.deadline.toDate().toLocaleDateString();
            }

            return {
              id: doc.id,
              ...data,
            };
          });

          dispatch(fetchTasksSuccess(tasks));
        },
        (error) => {
          dispatch(fetchTasksFailure(error.message));
        },
      );
  } catch (error) {
    dispatch(fetchTasksFailure(error.message));
  }
};

/**
 * add a new task document to "tasks" collection in firestore
 * @param {string} userId - id of user to add task to
 * @param {object} taskData - the task data to add
 */
const addTask = (userId, taskData) => async (dispatch) => {
  try {
    //const deadlineTimestamp = firebase.firestore.Timestamp.fromDate(deadline);
    //const newTask = { ...task, deadline: deadlineTimestamp };
    const taskRef = await db
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .add(taskData);

    dispatch(addTaskSuccess({ id: taskRef.id, ...taskData }));
  } catch (error) {
    dispatch(addTaskFailure(error.message));
  }
};

/**
 * edit a task document in "tasks" collection in firestore
 * @param {string} userId - id of user to edit task of
 * @param {string} taskId - id of task to edit
 * @param {object} updatedData - the new data to use to update the task
 */
const editTask = (userId, taskId, updatedData) => async (dispatch) => {
  try {
    await db
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .doc(taskId)
      .update(updatedData);

    dispatch(editTaskSuccess({ id: taskId, ...updatedData }));
  } catch (error) {
    dispatch(editTaskFailure(error.message));
  }
};

/**
 * delete a task document from "tasks" collection in firestore
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
    dispatch(deleteTaskFailure(error.message));
  }
};

export { fetchTasks, addTask, editTask, deleteTask };
