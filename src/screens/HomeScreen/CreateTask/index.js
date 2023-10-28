import React, { useEffect, useState } from 'react';
import {
  Modal,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, updateTask } from '../../../services/redux/taskSlice';

import useGlobalStyles from '../../../theme/globalStyles';
import { useTheme } from '../../../theme/ThemeContext';

import Spacer from '../../../components/Spacer';
import styles from './styles';

import CategoryModal from './components/Category';
import CompletionComponent from './components/Completion';
import DeadlinePicker from './components/Deadline';
import TagComponent from './components/Tags';

/**
 * A modal to create a new task or edit existing task.
 *
 * @param modalVisible visibility of modal
 * @param setShowTaskModal modal visibility setter
 * @param userId current user's id
 * @param editTask details of task to be edited (only on edit)
 * @param setEditTask setter for editTask (only on edit)
 */
const CreateTask = (props) => {
  const { modalVisible, setShowTaskModal, userId, editTask, setEditTask } = props;
  const { theme, themeType } = useTheme();
  const global = useGlobalStyles();
  const dispatch = useDispatch();

  const isLoading = editTask
    ? useSelector((state) => state.tasks.loading.updateTask)
    : useSelector((state) => state.tasks.loading.addTask);

  // task title & details
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  // deadline
  const [deadline, setdeadline] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  // completion status
  const [isCompleted, setIsCompleted] = useState(false);
  // subtasks
  const [subtasks, setSubtasks] = useState([]);
  const [currentSubtask, setCurrentSubtask] = useState('');
  // category
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  // tags
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);
  // tag colors
  const presetColors = ['#0000ff', '#008080', '#ff0000', '#ee82ee', '#ffff00'];
  const [selectedColor, setSelectedColor] = useState(presetColors[0]);

  useEffect(() => {
    // set initial values if on 'editTask' mode
    const prefillDetails = () => {
      setTitle(editTask.title);
      editTask.details && setDetails(editTask.details);
      setdeadline(new Date(editTask.deadline));
      setIsCompleted(editTask.is_complete);
      editTask.subtasks && setSubtasks(editTask.subtasks);
      editTask.category && setSelectedCategory(editTask.category);
      editTask.tags && setTags(editTask.tags);
    };

    if (editTask) {
      prefillDetails();
    }
  }, [editTask]);

  /** handle create or update task */
  const handleSubmit = async () => {
    if (!title) {
      Alert.alert('Title cannot be empty', 'Please set a title.');
      return;
    }

    // full details of task
    const taskDetails = {
      title: title,
      details: details,
      is_complete: isCompleted,
      deadline: deadline.getTime(), // in milliseconds
      subtasks: subtasks,
      category: selectedCategory,
      tags: tags,
    };

    // add or update task
    const action = editTask
      ? updateTask({ userId, taskId: editTask.id, taskDetails })
      : addTask({ userId, taskDetails });

    // dispatch action & close modal only after done
    dispatch(action).then(() => {
      if (!isLoading) {
        resetStates();
        setShowTaskModal(false);
      }
    });
  };

  // add a new (unique) tag to the list
  const addTag = () => {
    if (tag && !tags.some((t) => t.name.toLowerCase() === tag.toLowerCase())) {
      setTags([...tags, { name: tag, color: selectedColor }]);
      setTag('');
    } else {
      Alert.alert('Error adding tag', 'This tag already exists.', [{ text: 'OK' }]);
    }
  };

  // remove a tag from the list
  const removeTag = (index) => {
    let tempTags = [...tags];
    tempTags.splice(index, 1);
    setTags(tempTags);
  };

  // add details of each new subtasks to array
  const createSubTask = () => {
    if (currentSubtask) {
      setSubtasks([...subtasks, { description: currentSubtask, completed: false }]);
      setCurrentSubtask('');
    }
  };

  // remove a subtask from the array
  const removeSubtask = (index) => {
    let tempSubtasks = [...subtasks];
    tempSubtasks.splice(index, 1);
    setSubtasks(tempSubtasks);
  };

  // close modal & reset all states when 'cancel' pressed
  const handleCancelPress = () => {
    resetStates();
    if (editTask) setEditTask(null);
    setShowTaskModal(false);
  };

  // reset all states
  const resetStates = () => {
    setTitle('');
    setDetails('');
    setdeadline(new Date());
    setSubtasks([]);
    setCurrentSubtask('');
    setSelectedCategory(null);
    setTag('');
    setTags([]);
    setSelectedColor(presetColors[0]);
    setShowCategoryModal(false);
    setIsCompleted(false);
    editTask && setEditTask(null);
  };

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <SafeAreaView style={global.container}>
        <View style={[global.container, styles.container]}>
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={'#fff'} />
              <Text style={styles.loadingText}>
                {editTask ? 'Updating...' : 'Creating...'}
              </Text>
            </View>
          )}

          <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
            {/* header */}
            <View style={styles.row}>
              <Text style={[global.text, styles.header]}>
                {editTask ? 'Edit task' : 'Create task'}
              </Text>
              <Text style={styles.cancelTxt} onPress={handleCancelPress}>
                Cancel
              </Text>
            </View>

            <Spacer />

            {/* ===== task title ===== */}
            <Text style={[styles.boxLabel, { color: theme.text }]}>Title</Text>
            <TextInput
              value={title}
              style={[
                styles.titleInput,
                { borderColor: theme.text, color: theme.text },
              ]}
              onChangeText={setTitle}
              placeholder={'Set a title'}
              placeholderTextColor={theme.textLight}
              autoCapitalize="none"
              autoComplete="off"
            />

            <Spacer />

            {/* ===== deadline section ===== */}
            <Text style={[styles.boxLabel, { color: theme.text }]}>Deadline</Text>
            <DeadlinePicker
              openPicker={datePickerOpen}
              setOpenPicker={setDatePickerOpen}
              date={deadline}
              setDate={setdeadline}
            />

            <Spacer />

            {/* ===== completion status section ===== */}
            <Text style={[styles.boxLabel, { color: theme.text }]}>Status</Text>
            <CompletionComponent
              isCompleted={isCompleted}
              setIsCompleted={setIsCompleted}
              theme={theme}
            />

            <Spacer />

            {/* ===== task details ===== */}
            <Text style={[styles.boxLabel, { color: theme.text }]}>Details</Text>
            <TextInput
              value={details}
              style={[
                styles.detailsInput,
                {
                  color: theme.text,
                  borderColor: theme.text,
                },
              ]}
              multiline={true}
              onChangeText={setDetails}
              placeholder={'Add any other task details here (optional)'}
              placeholderTextColor={theme.textLight}
              autoCapitalize="none"
              autoComplete="off"
            />

            <Spacer />

            {/* ===== subtasks section ===== */}
            <Text style={[styles.boxLabel, { color: theme.text }]}>Subtasks</Text>
            <View style={[styles.sectionContainer, { borderColor: theme.text }]}>
              {/* adding a new subtask */}
              <View style={styles.addSubtask}>
                <TextInput
                  value={currentSubtask}
                  style={[
                    global.text,
                    styles.subtaskInput,
                    { borderColor: theme.text },
                  ]}
                  onChangeText={setCurrentSubtask}
                  placeholder={'Add a subtask'}
                  placeholderTextColor={theme.textLight}
                  autoCapitalize="none"
                  autoComplete="off"
                />

                <AntDesign
                  name="pluscircleo"
                  size={30}
                  color={theme.text}
                  onPress={createSubTask}
                />
              </View>

              {/* list of subtasks */}
              {subtasks.length > 0 && (
                <>
                  {subtasks.map((sub, index) => (
                    <View key={index} style={styles.row}>
                      <AntDesign
                        name={'close'}
                        size={22}
                        color={theme.red}
                        style={styles.Xicon}
                        onPress={() => removeSubtask(index)}
                      />

                      <Text style={[global.text, styles.subtask]}>
                        {sub.description}
                      </Text>
                    </View>
                  ))}
                </>
              )}
            </View>

            <Spacer />

            {/* ===== category section ===== */}

            <Text style={[styles.boxLabel, { color: theme.text }]}>Category</Text>
            <View style={[styles.sectionContainer, { borderColor: theme.text }]}>
              <View style={styles.row}>
                {/* add a new category */}
                <AntDesign
                  name={selectedCategory ? 'edit' : 'addfolder'}
                  size={24}
                  color={theme.text}
                  onPress={() => setShowCategoryModal(true)}
                />
                <Text style={[styles.categoryText, { color: theme.text }]}>
                  {selectedCategory}
                </Text>
              </View>
            </View>

            {/* category modal */}
            <CategoryModal
              showCategoryModal={showCategoryModal}
              setShowCategoryModal={setShowCategoryModal}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              theme={theme}
            />

            <Spacer />

            {/* ===== tags section ===== */}
            <Text style={[styles.boxLabel, { color: theme.text }]}>Tags</Text>

            <View style={[styles.sectionContainer, { borderColor: theme.text }]}>
              <TagComponent
                tag={tag}
                setTag={setTag}
                tags={tags}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                presetColors={presetColors}
                addTag={addTag}
                removeTag={removeTag}
                theme={theme}
              />
            </View>
          </KeyboardAwareScrollView>

          <Spacer />

          {/* ===== submit button ===== */}
          <TouchableOpacity
            style={styles.createBtn}
            onPress={handleSubmit}
            disabled={isLoading}>
            <Text style={styles.createBtnText}>
              {!isLoading
                ? editTask
                  ? 'Update'
                  : 'Create'
                : editTask
                ? 'Updating...'
                : 'Creating...'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default CreateTask;
