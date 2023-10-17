import React, { useState } from 'react';
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

import DropDownPicker from 'react-native-dropdown-picker';
// import ColorPicker from 'reanimated-color-picker';

import { useTheme } from '../../../utils/theme/ThemeContext';
import useGlobalStyles from '../../../utils/hooks/globalStyles';

import { auth, db } from '../../../utils/config/firebase';

import DeadlinePicker from '../DatePicker';
import { HeaderDivider, Divider } from '../Elements';

const CreateTask = ({ modalVisible, setShowTaskModal }) => {
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

  // tags
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);
  const presetColors = ['#0000ff', '#008080', '#ff0000', '#ee82ee', '#ffff00'];
  const [selectedColor, setSelectedColor] = useState(presetColors[0]);

  // add task to firestore
  const handleAddTask = async () => {
    // make sure there is title entered
    if (!title) {
      Alert.alert('Title cannot be empty', 'Please set a title.');
      return;
    }

    // all details to be added to firestore
    const taskDetails = {
      title,
      details,
      deadline,
      subtasks,
      category: selectedCategory,
      tags,
    };

    // get current user
    const user = auth.currentUser;

    // add task to firestore collection: users/{user.uid}/tasks
    await db
      .collection('users')
      .doc(user.uid)
      .collection('tasks')
      .add(taskDetails)
      .then(() => {
        // reset states and close modal on success
        setShowTaskModal(false);
        resetStates();
      })
      .catch((err) => {
        // show alert if unsuccessful
        Alert.alert('Error adding task', err.message);
      });
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
    // reset all states
    resetStates();

    // close modal
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
            <Text style={[global.text, styles.header]}>New Task</Text>
            <Text style={styles.cancelTxt} onPress={handleCancelPress}>
              Cancel
            </Text>
          </View>

          <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
            {/* ===== task title ===== */}
            <TextInput
              value={title}
              style={[global.text, styles.titleInput]}
              onChangeText={setTitle}
              placeholder={'Title'}
              placeholderTextColor={theme.textLight}
            />

            {/* ===== task details ===== */}
            <TextInput
              value={details}
              style={[global.text, styles.detailsInput]}
              multiline={true}
              onChangeText={setDetails}
              placeholder={'Add any other task details here (optional)'}
              placeholderTextColor={theme.textLight}
            />

            {/* ===== subtasks section ===== */}

            {subtasks.length > 0 && (
              // display added subtasks only if there are
              <>
                <Text style={[global.text, styles.subtaskTitle]}>Subtasks</Text>
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

            <View style={{ height: 20 }} />

            {/* ===== deadline section ===== */}
            <DeadlinePicker
              openPicker={datePickerOpen}
              setOpenPicker={setDatePickerOpen}
              date={deadline}
              setDate={setdeadline}
            />

            <HeaderDivider
              color={theme.textLight}
              text={'Category'}
              height={2}
              margin={30}
            />

            {/* ===== category section ===== */}
            <>
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

            <HeaderDivider
              color={theme.textLight}
              text={'Tags'}
              height={2}
              margin={30}
            />

            {/* ===== tags section ===== */}
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
          <TouchableOpacity style={styles.createBtn} onPress={handleAddTask}>
            <Text style={styles.createBtnText}>Create Task</Text>
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
    fontSize: 28,
    fontFamily: 'OpenSans-Bold',
  },
  cancelTxt: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 'auto',
    color: '#eb523b',
    fontFamily: 'OpenSans-SemiBold',
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 12,
    fontSize: 18,
    fontFamily: 'OpenSans-SemiBold',
  },
  detailsInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 14,
    height: 140,
    textAlignVertical: 'top',
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
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
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'OpenSans-Bold',
  },

  // ======= subtask styles =======
  subtaskTitle: {
    fontSize: 20,
    marginBottom: 12,
    marginTop: 20,
    fontFamily: 'OpenSans-Bold',
  },
  addSubtask: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    fontFamily: 'OpenSans-Regular',
  },
  Xicon: {
    marginRight: 12,
  },
  subtask: {
    fontSize: 20,
    fontFamily: 'OpenSans-Regular',
  },

  subtaskInput: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
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
    fontFamily: 'OpenSans-Regular',
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
