import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { useTheme } from '../../hooks/useThemeContext';
import useGlobalStyles from '../../hooks/useGlobalStyles';
import useFetchTasks from '../../hooks/useFetchTasks';
import useFetchUser from '../../hooks/useFetchUser';
import FilterModal from '../../components/Home/FilterModal';
import TaskList from '../../components/Home/TaskList';
import CreateTask from '../../components/Home/CreateTask';
import styles from './styles';

/**
 * The home screen which displays a list tasks
 */
const Home = ({ navigation }) => {
    const { theme, themeType } = useTheme();
    const global = useGlobalStyles();

    // task view options (today, week, month, all)
    const [chosenTimeFrame, setChosenTimeFrame] = useState('today');

    // manage sort options
    const [sortPickerOpen, setSortPickerOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const [sortOptions, setSortOptions] = useState([
        { label: 'Deadline (Ascending)', value: 'asc' },
        { label: 'Deadline (Descending)', value: 'desc' },
    ]);

    // show or hide completed tasks
    const [showCompleted, setShowCompleted] = useState(false);

    // fetch data from redux store
    const { user, userLoading } = useFetchUser();
    const { tasks, fetchIsLoading } = useFetchTasks(
        chosenTimeFrame,
        sortOrder,
        showCompleted,
    );

    // show or hide "create task" modal
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);

    // show or hide "filter" modal
    const [showFilterModal, setShowFilterModal] = useState(false);

    const [filterOptions, setFilterOptions] = useState([
        { label: 'Show Status', value: true },
        { label: 'Show Description', value: true },
        { label: 'Show Deadline', value: true },
        { label: 'Show Tags', value: true },
    ]);

    /** opens modal to edit the selected task */
    const handleEdit = (id) => {
        const taskDetail = tasks.find((task) => task.id === id);
        setShowTaskModal(true);
        setTaskToEdit(taskDetail);
    };

    /** display buttons for selecting view period */
    const optionButton = (view) => {
        // capitalize first letter
        const displayText = view.charAt(0).toUpperCase() + view.slice(1);
        const isSelected = chosenTimeFrame === view;

        return (
            <TouchableOpacity
                style={[
                    styles.periodBtn,
                    {
                        backgroundColor: isSelected ? theme.darkGray : theme.background,
                        borderColor: theme.darkGray,
                    },
                ]}
                onPress={() => setChosenTimeFrame(view)}>
                <Text
                    style={[
                        styles.periodBtnText,
                        {
                            color: isSelected
                                ? themeType === 'light'
                                    ? theme.gray
                                    : theme.text
                                : theme.darkGray,
                        },
                    ]}>
                    {displayText}
                </Text>
            </TouchableOpacity>
        );
    };

    // title for each selected period
    const titles = {
        today: "Today's Tasks",
        week: "This Week's Tasks",
        month: "This Month's Tasks",
        all: 'All Tasks',
    };

    return (
        <View style={[global.container, styles.container]}>
            {/* Header row */}
            <View style={styles.row}>
                {!userLoading ? (
                    <Text style={styles.welcomeText}>
                        <Text style={{ color: theme.text }}>Hi, </Text>
                        <Text style={{ color: theme.darkGray }}>{user?.name}</Text>
                        <Text style={{ color: theme.text }}> !</Text>
                    </Text>
                ) : (
                    <ActivityIndicator size="small" color={theme.textLight} />
                )}

                <MaterialIcons
                    name="today"
                    size={30}
                    color={theme.text}
                    style={{ marginLeft: 'auto' }}
                    onPress={() => navigation.navigate('Calendar')}
                />
            </View>

            {/* buttons to select view period */}
            <View style={styles.row}>
                {optionButton('all')}
                {optionButton('today')}
                {optionButton('week')}
                {optionButton('month')}
            </View>

            {/* task list title */}
            <View style={styles.row}>
                <Text style={[styles.ViewTitleText, { color: theme.text }]}>
                    {titles[chosenTimeFrame] || 'Tasks'} ({tasks.length})
                </Text>

                {tasks.length > 0 && (
                    // sorting and filtering options
                    <View style={[global.row, styles.filterRow]}>
                        <MaterialIcons
                            name="filter-list-alt"
                            size={26}
                            color={theme.text}
                            onPress={() => setShowFilterModal(!showFilterModal)}
                        />
                        <MaterialIcons
                            name="sort"
                            size={26}
                            color={theme.text}
                            onPress={() => setSortPickerOpen(!sortPickerOpen)}
                        />
                        {sortPickerOpen && (
                            <DropDownPicker
                                open={sortPickerOpen}
                                value={sortOrder}
                                items={sortOptions}
                                setOpen={setSortPickerOpen}
                                setValue={setSortOrder}
                                setItems={setSortOptions}
                                listMode="MODAL"
                                textStyle={{ color: theme.text }}
                                onChangeValue={(value) => {
                                    // Update tasks sorting based on selected value
                                    console.log(`pressed sort by ${value}`);
                                    setSortOrder(value);
                                }}
                            />
                        )}

                        {/* Modal to set filter options */}
                        <FilterModal
                            visible={showFilterModal}
                            currentVals={filterOptions}
                            setCurrentVals={setFilterOptions}
                            onClose={() => setShowFilterModal(false)}
                        />
                    </View>
                )}
            </View>

            {/* show loading while fetching tasks */}
            {fetchIsLoading && (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={theme.textLight} />
                </View>
            )}

            {/* show message if no tasks */}
            {!fetchIsLoading && tasks.length === 0 && (
                <View style={styles.centered}>
                    <Text style={[global.text, { color: theme.text }]}>
                        No tasks due.
                    </Text>
                </View>
            )}

            {/* list of tasks */}
            {!fetchIsLoading && tasks.length > 0 && (
                <>
                    <View style={styles.checkboxContainer}>
                        <TouchableOpacity
                            onPress={() => setShowCompleted(!showCompleted)}>
                            {showCompleted ? (
                                <MaterialIcons
                                    name="check-box"
                                    size={24}
                                    color={theme.text}
                                />
                            ) : (
                                <MaterialIcons
                                    name="check-box-outline-blank"
                                    size={24}
                                    color={theme.text}
                                />
                            )}
                        </TouchableOpacity>
                        <Text style={[styles.checkboxLabel, { color: theme.text }]}>
                            Show completed
                        </Text>
                    </View>
                    <TaskList
                        tasklist={tasks}
                        handleEdit={handleEdit}
                        filters={filterOptions}
                    />
                </>
            )}

            {/* create new task */}
            <TouchableOpacity
                style={[styles.addTaskBtn, { backgroundColor: theme.darkGray }]}
                onPress={() => setShowTaskModal(true)}>
                <Text
                    style={[
                        styles.addTaskText,
                        { color: themeType === 'light' ? '#fff' : theme.text },
                    ]}>
                    New Task
                </Text>

                <MaterialIcons
                    name="add-task"
                    size={24}
                    color={themeType === 'light' ? theme.navActive : theme.text}
                />
            </TouchableOpacity>

            {/* modal for creating new task */}
            <CreateTask
                modalVisible={showTaskModal}
                setShowTaskModal={setShowTaskModal}
                editTask={taskToEdit}
                setEditTask={setTaskToEdit}
            />
        </View>
    );
};

export default Home;
