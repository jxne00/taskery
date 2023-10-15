import React, { useState } from 'react';
import {
  Modal,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';

import { useTheme } from '../../../utils/theme/ThemeContext';
import useGlobalStyles from '../../../utils/hooks/globalStyles';

const CreateTask = ({ modalVisible, setShowTaskModal }) => {
  const { theme } = useTheme();
  const global = useGlobalStyles();

  // task information
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [deadline, setdeadline] = useState(new Date());

  const [subtasks, setSubtasks] = useState([]);
  const [currentSubtask, setCurrentSubtask] = useState('');

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false);

  const handleAddTask = () => {
    console.log(
      'title: ',
      title,
      'details: ',
      details,
      'deadline: ',
      deadline,
      'subtasks: ',
      subtasks,
      'category: ',
      selectedCategory,
    );
  };

  // add a new unique category to the list
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
    setTitle('');
    setDetails('');
    setdeadline(new Date());
    setSubtasks([]);
    setCurrentSubtask('');
    setCategories([]);
    setSelectedCategory(null);
    setOpen(false);

    // close modal
    setShowTaskModal(false);
  };

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <SafeAreaView style={global.container}>
        <KeyboardAvoidingView behavior="padding" style={global.container}>
          <View style={[global.container, styles.container]}>
            {/* header */}
            <View style={styles.row}>
              <Text style={[global.text, styles.header]}>New Task</Text>

              <Text style={styles.cancelTxt} onPress={handleCancelPress}>
                Cancel
              </Text>
            </View>

            {/* task title input box */}
            <TextInput
              value={title}
              style={[global.text, styles.titleInput]}
              onChangeText={setTitle}
              placeholder={'Title'}
              placeholderTextColor={theme.textLight}
            />

            {/* task details input box */}
            <TextInput
              value={details}
              style={[global.text, styles.detailsInput]}
              multiline={true}
              onChangeText={setDetails}
              placeholder={'Add any other task details here (optional)'}
              placeholderTextColor={theme.textLight}
            />

            {/* display list of added subtasks */}
            {subtasks.length > 0 && (
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

            {/* add subtask input box */}
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
                color={theme.btnBlue}
                style={styles.addSubtaskBtn}
                onPress={createSubTask}
              />
            </View>

            {/* deadline calendar picker */}
            <View style={styles.deadlineContainer}>
              <Text style={[global.text, styles.deadlineTxt]}>Deadline:</Text>

              <DateTimePicker
                style={styles.datepicker}
                value={deadline}
                mode={'date'}
                display="default"
                minimumDate={new Date()} // disable past dates
                onChange={
                  // set deadline to selected date
                  (event, selectedDate) => {
                    const currentDate = selectedDate || deadline;
                    setdeadline(currentDate);
                  }
                }
              />
            </View>

            <View style={styles.categoryContainer}>
              <Text style={[global.text, styles.subtaskTitle]}>Category:</Text>

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
            </View>

            <TouchableOpacity style={styles.createBtn} onPress={handleAddTask}>
              <Text style={styles.createBtnText}>Create Task</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    fontWeight: 'bold',
  },
  cancelTxt: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 'auto',
    color: '#eb523b',
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 12,
    fontSize: 18,
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
  },

  // ======= deadline styles =======
  deadlineContainer: {
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center',
  },
  datepicker: {},
  deadlineTxt: {
    marginRight: 5,
    fontSize: 20,
    fontWeight: 'bold',
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
    fontSize: 18,
    paddingVertical: 4,
    fontWeight: 'bold',
    color: '#fff',
  },

  // ======= subtask styles =======
  subtaskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 20,
  },
  addSubtask: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  Xicon: {
    marginRight: 12,
  },
  subtask: {
    fontSize: 20,
  },

  subtaskInput: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    fontSize: 18,
  },
  addSubtaskBtn: {
    borderRadius: 5,
  },

  // ======= category styles =======
  categoryContainer: {
    marginVertical: 20,
  },
  dropdownContainer: {
    height: 38,
    marginBottom: 20,
    width: '80%',
    marginLeft: 15,
  },
  dropdownPicker: {
    backgroundColor: '#dcdcdc',
    borderColor: '#dcdcdc',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default CreateTask;
