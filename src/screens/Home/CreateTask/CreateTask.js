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

import DeadlinePicker from './DatePicker';
import HeaderDivider from '../../../components/shared/HeaderDivider';
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

  // subtasks
  const [subtasks, setSubtasks] = useState([]);
  const [currentSubtask, setCurrentSubtask] = useState('');

  // category
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false);

  // tags & tag color
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);
  const presetColors = ['#0000ff', '#008080', '#ff0000', '#ee82ee', '#ffff00'];
  const [selectedColor, setSelectedColor] = useState(presetColors[0]);

  const [isLoading, setIsLoading] = useState(false);

  // set initial values if on 'edit' mode
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      editTask.details && setDetails(editTask.details);
      setdeadline(new Date(editTask.deadline));
      editTask.subtasks && setSubtasks(editTask.subtasks);
      if (editTask.category) {
        setCategories([{ label: editTask.category, value: editTask.category }]);
        setSelectedCategory(editTask.category);
      }
      editTask.tags && setTags(editTask.tags);
    }
  }, [editTask]);

  /** handle adding of task */
  const handleSubmit = async () => {
    setIsLoading(true);

    if (!title) {
      // title cannot be null
      Alert.alert('Title cannot be empty', 'Please set a title.');
      setIsLoading(false);
      return;
    }

    // details of task
    const taskDetails = {
      title: title,
      details: details,
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
      dispatch(addTask(userId, taskDetails));
    }

    setIsLoading(false);

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

  // add a new (unique) category to the list
  const addNewCategory = () => {
    Alert.prompt(
      'Add New Category',
      'Set a name for the new category:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Done',
          onPress: (newCategory) => {
            const inLowercase = newCategory.toLowerCase();

            if (
              // check for duplicates
              !categories.some((cat) => cat.value.toLowerCase() === inLowercase)
            ) {
              // add new category to list
              setCategories([
                ...categories,
                { label: newCategory, value: inLowercase },
              ]);
              setSelectedCategory(inLowercase);
            } else {
              // duplicated value found
              Alert.alert(
                'Category already exists',
                'Please choose another name.',
                [{ text: 'OK' }],
                { cancelable: false },
              );
            }
          },
        },
      ],
      'plain-text',
    );
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
    setCategories([]);
    setSelectedCategory(null);
    setOpen(false);
    setTag('');
    setTags([]);
    setSelectedColor(presetColors[0]);
  };

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <SafeAreaView style={global.container}>
        <View style={[global.container, styles.container]}>
          {/* header */}
          <View style={styles.row}>
            <Text style={[global.text, styles.header]}>
              {editTask ? 'Edit task' : 'Create task'}
            </Text>
            <Text style={styles.cancelTxt} onPress={handleCancelPress}>
              Cancel
            </Text>
          </View>

          <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
            {/* ===== task title ===== */}
            <Text style={[styles.boxLabel, { color: theme.text }]}>Title</Text>
            <TextInput
              value={title}
              style={[
                styles.titleInput,
                { borderColor: theme.text, color: theme.text },
              ]}
              onChangeText={setTitle}
              placeholder={'Title of your task'}
              placeholderTextColor={theme.textLight}
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
            />

            <Spacer />

            {/* ===== subtasks section ===== */}
            <Text style={[styles.boxLabel, { color: theme.text }]}>
              Subtasks
            </Text>
            {subtasks.length > 0 && (
              // display added subtasks only if there are
              <>
                {subtasks.map((sub, index) => (
                  <View key={index} style={styles.row}>
                    <AntDesign
                      name={'closecircle'}
                      size={24}
                      color={theme.btnRed}
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

            {/* adding a new subtask */}
            <View style={styles.addSubtask}>
              <TextInput
                value={currentSubtask}
                style={[global.text, styles.subtaskInput]}
                onChangeText={setCurrentSubtask}
                placeholder={'Add a subtask'}
                placeholderTextColor={theme.textLight}
              />

              <AntDesign
                name="pluscircle"
                size={32}
                color={themeType === 'dark' ? '#e8e8e8' : '#313131'}
                style={styles.addSubtaskBtn}
                onPress={createSubTask}
              />
            </View>

            <Spacer />

            {/* ===== category section ===== */}
            <>
              <Text style={[styles.boxLabel, { color: theme.text }]}>
                Category
              </Text>
              <View style={styles.row}>
                {/* add a new category */}
                <AntDesign
                  name="addfolder"
                  size={30}
                  color={theme.btnBlue}
                  onPress={addNewCategory}
                />

                {/* category picker */}
                <DropDownPicker
                  // items={categories}
                  items={categories.map((cat) => ({
                    label: cat.label, // displayed label
                    value: cat.value, // actual value
                  }))}
                  defaultValue={selectedCategory}
                  placeholder="Select a category"
                  placeholderStyle={{ color: theme.textLight, fontSize: 18 }}
                  containerStyle={styles.dropdownContainer}
                  style={styles.dropdownPicker}
                  dropDownStyle={{
                    backgroundColor: '#fafafa',
                  }}
                  open={open}
                  setOpen={setOpen}
                  value={selectedCategory}
                  setValue={setSelectedCategory}
                  onChangeValue={
                    // set category
                    (value) => {
                      setSelectedCategory(value);
                    }
                  }
                  labelStyle={{ color: '#1e1e1e', fontSize: 18 }}
                />
              </View>
            </>

            <Spacer />

            {/* ===== tags section ===== */}
            <Text style={[styles.boxLabel, { color: theme.text }]}>Tags</Text>

            <View style={styles.tagsContainer}>
              {/* add new tag */}
              <View style={styles.tagRow}>
                <TextInput
                  value={tag}
                  onChangeText={setTag}
                  placeholder="Add Tag"
                  placeholderTextColor={theme.textLight}
                  style={styles.tagInput}
                />
                <Text onPress={addTag} style={[global.text, styles.addTagBtn]}>
                  Add
                </Text>
              </View>

              {/* tag color choices */}
              <View style={styles.colorContainer}>
                <Text style={[styles.subtask, { color: theme.text }]}>
                  Colors:
                </Text>
                {presetColors.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.colorOption, { backgroundColor: color }]}
                    onPress={() => setSelectedColor(color)}>
                    {selectedColor === color && <Text>✔</Text>}
                  </TouchableOpacity>
                ))}
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
          </KeyboardAwareScrollView>

          {/* ===== submit button ===== */}
          <TouchableOpacity style={styles.createBtn} onPress={handleSubmit}>
            <Text style={styles.createBtnText}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : editTask ? (
                'Update'
              ) : (
                'Create'
              )}
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
    marginBottom: 20,
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
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    height: 140,
    textAlignVertical: 'top',
    fontSize: 16,
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
    fontFamily: 'Inter-Bold',
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
    fontSize: 18,
    fontFamily: 'Inter-Regular',
  },

  subtaskInput: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    fontSize: 18,
    fontFamily: 'Inter-Regular',
  },
  addSubtaskBtn: {
    borderRadius: 5,
  },

  // ======= category styles =======

  dropdownContainer: {
    height: 38,
    width: '80%',
    marginLeft: 15,
  },
  dropdownPicker: {
    backgroundColor: '#dcdcdc',
    borderColor: '#dcdcdc',
    borderWidth: 1,
    borderRadius: 5,
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
    fontSize: 18,
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
    width: 30,
    height: 30,
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
