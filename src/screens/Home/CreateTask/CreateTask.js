import React, { useEffect, useState } from 'react';
import {
  Modal,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, updateTask } from '../../../services/redux/taskSlice';

import DropDownPicker from 'react-native-dropdown-picker';
// import ColorPicker from 'reanimated-color-picker';

import useGlobalStyles from '../../../theme/globalStyles';
import { useTheme } from '../../../theme/ThemeContext';

import DeadlinePicker from './DeadlineSection';
import CategoryModal from './CategoryModal';

import Spacer from '../../../components/shared/Spacer';

/**
 * A modal to create a new task or edit existing task.
 *
 * @param modalVisible - visibility of modal
 * @param setShowTaskModal - modal visibility setter
 * @param userId - current user's id
 * @param editTask - details of task to be edited
 * @param setEditTask - setter for editTask
 */
const CreateTask = (props) => {
  const { modalVisible, setShowTaskModal, userId, editTask, setEditTask } =
    props;
  const dispatch = useDispatch();

  const { theme, themeType } = useTheme();
  const global = useGlobalStyles();

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

  // set initial values if on 'edit' mode
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      editTask.details && setDetails(editTask.details);
      setdeadline(new Date(editTask.deadline));
      setIsCompleted(editTask.is_complete);
      editTask.subtasks && setSubtasks(editTask.subtasks);
      editTask.category && setSelectedCategory(editTask.category);
      editTask.tags && setTags(editTask.tags);
    }
  }, [editTask]);

  /** handle adding of task */
  const handleSubmit = async () => {
    if (!title) {
      // title cannot be null
      Alert.alert('Title cannot be empty', 'Please set a title.');
      return;
    }

    // details of task
    const taskDetails = {
      title: title,
      details: details,
      is_complete: isCompleted,
      deadline: deadline.getTime(), // in milliseconds
      subtasks: subtasks,
      category: selectedCategory,
      tags: tags,
    };

    if (editTask) {
      // update task
      dispatch(
        updateTask({
          userId,
          taskId: editTask.id,
          updatedData: taskDetails,
        }),
      );
    } else {
      // create new task
      dispatch(
        addTask({
          userId,
          taskDetails,
        }),
      );
    }

    resetStates();
    setShowTaskModal(false);
  };

  // add a new (unique) tag to the list
  const addTag = () => {
    if (tag && !tags.some((t) => t.name.toLowerCase() === tag.toLowerCase())) {
      setTags([...tags, { name: tag, color: selectedColor }]);
      setTag('');
    } else {
      Alert.alert('Error adding tag', 'This tag already exists.', [
        { text: 'OK' },
      ]);
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
      setSubtasks([
        ...subtasks,
        { description: currentSubtask, completed: false },
      ]);
      setCurrentSubtask('');
    }
  };

  // remove a subtask from the array
  const removeSubtask = (index) => {
    let tempSubtasks = [...subtasks];
    tempSubtasks.splice(index, 1);
    setSubtasks(tempSubtasks);
  };

  // close modal & reset all states
  const handleCancelPress = () => {
    resetStates();
    if (editTask) {
      setEditTask(null);
    }
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
            <Text style={[styles.boxLabel, { color: theme.text }]}>
              Deadline
            </Text>
            <DeadlinePicker
              openPicker={datePickerOpen}
              setOpenPicker={setDatePickerOpen}
              date={deadline}
              setDate={setdeadline}
            />

            <Spacer />

            {/* ===== completion status section ===== */}
            <Text style={[styles.boxLabel, { color: theme.text }]}>Status</Text>
            <View style={styles.completionRow}>
              <TouchableOpacity
                onPress={() => setIsCompleted(false)}
                style={[
                  styles.completionBtn,
                  { borderWidth: isCompleted ? 1 : 3 },
                ]}>
                <AntDesign name={'close'} size={20} color={theme.text} />
                <Text
                  style={[
                    styles.completionText,
                    { fontFamily: isCompleted ? 'Inter-Medium' : 'Inter-Bold' },
                  ]}>
                  Not done
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsCompleted(true)}
                style={[
                  styles.completionBtn,
                  { borderWidth: isCompleted ? 3 : 1 },
                ]}>
                <AntDesign name={'check'} size={20} color={theme.text} />
                <Text
                  style={[
                    styles.completionText,
                    { fontFamily: isCompleted ? 'Inter-Bold' : 'Inter-Medium' },
                  ]}>
                  Completed
                </Text>
              </TouchableOpacity>
            </View>

            <Spacer />

            {/* ===== task details ===== */}
            <Text style={[styles.boxLabel, { color: theme.text }]}>
              Details
            </Text>
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
            <Text style={[styles.boxLabel, { color: theme.text }]}>
              Subtasks
            </Text>
            <View
              style={[styles.sectionContainer, { borderColor: theme.text }]}>
              {/* adding a new subtask */}
              <View style={styles.addSubtask}>
                <TextInput
                  value={currentSubtask}
                  style={[global.text, styles.subtaskInput]}
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

            <Text style={[styles.boxLabel, { color: theme.text }]}>
              Category
            </Text>
            <View
              style={[styles.sectionContainer, { borderColor: theme.text }]}>
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

            <View
              style={[styles.sectionContainer, { borderColor: theme.text }]}>
              <View style={styles.tagsContainer}>
                {/* tag color choices */}
                <View style={styles.colorContainer}>
                  {presetColors.map((color, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.colorOption, { backgroundColor: color }]}
                      onPress={() => setSelectedColor(color)}>
                      {selectedColor === color && <Text>✔</Text>}
                    </TouchableOpacity>
                  ))}
                </View>

                {/* add new tag */}
                <View style={styles.tagRow}>
                  <TextInput
                    value={tag}
                    onChangeText={setTag}
                    placeholder="Add Tag"
                    placeholderTextColor={theme.textLight}
                    style={styles.tagInput}
                    autoCapitalize="none"
                    autoComplete="off"
                  />
                  <Text
                    onPress={addTag}
                    style={[global.text, styles.addTagBtn]}>
                    Add
                  </Text>
                </View>

                {/* list of added tags */}
                {tags.map((t, index) => (
                  <View key={index} style={styles.row}>
                    <AntDesign
                      name={'closecircle'}
                      size={24}
                      color={theme.btnRed}
                      style={styles.Xicon}
                      onPress={() => removeTag(index)}
                    />
                    <View
                      style={[
                        styles.tag,
                        { backgroundColor: t.color, marginRight: 10 },
                      ]}
                    />
                    <Text style={global.text}>{t.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </KeyboardAwareScrollView>

          <Spacer />

          {/* ===== submit button ===== */}
          <TouchableOpacity style={styles.createBtn} onPress={handleSubmit}>
            <Text style={styles.createBtnText}>
              {editTask ? 'Update' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },

  header: {
    fontSize: 26,
    fontFamily: 'Inter-Bold',
  },
  cancelTxt: {
    fontSize: 20,
    marginLeft: 'auto',
    color: '#eb523b',
    fontFamily: 'Inter-SemiBold',
  },
  titleInput: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 20,
    fontSize: 18,
    fontFamily: 'Inter-Medium',
  },
  boxLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    paddingBottom: 10,
  },
  detailsInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingTop: 8,
    borderRadius: 8,
    height: 140,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },

  // ======= completion styles =======
  completionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  completionBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    width: '49%',
  },
  completionText: {
    fontSize: 16,
    marginLeft: 5,
    fontFamily: 'Inter-Regular',
  },

  // ======= button styles =======
  createBtn: {
    backgroundColor: '#84345a',
    padding: 10,
    borderRadius: 20,
    width: '90%',
    alignSelf: 'center',
    marginTop: 'auto',
  },
  createBtnText: {
    textAlign: 'center',
    fontSize: 20,
    paddingVertical: 2,
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
  },

  // ======= subtask styles =======

  addSubtask: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    fontFamily: 'Inter-Regular',
  },
  Xicon: {
    marginRight: 12,
  },
  subtask: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },

  subtaskInput: {
    borderBottomWidth: 1,
    padding: 10,
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },

  // ======= category styles =======
  categoryText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 20,
  },

  // ======= tag styles =======
  tagsContainer: {
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    flex: 1,
    fontFamily: 'Inter-Regular',
  },
  addTagBtn: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d4d4d4',
    backgroundColor: '#1e1c1c',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 14,
  },
  colorOption: {
    width: 25,
    height: 25,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },

  tag: {
    padding: 10,
    borderRadius: 5,
  },
});

export default CreateTask;
