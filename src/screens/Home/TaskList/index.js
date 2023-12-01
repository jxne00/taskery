import React, { useState } from 'react';
import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../../hooks/useThemeContext';
import { auth } from '../../../services/firebase';
import {
    toggleCompletion,
    deleteTask,
    addTask,
} from '../../../services/redux/taskSlice';
import { toDateDisplay } from '../../../components/timeConverters';
import styles from './styles';
import TaskDetail from '../TaskDetail';

/**
 * A flatlist of tasks with its details
 * @param tasklist - list of tasks
 * @param handleEdit - handle editing of task
 */
const TaskList = ({ tasklist, handleEdit }) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const userId = auth.currentUser?.uid;

    const toggleIsLoading = useSelector((state) => state.tasks.loading.updateStatus);
    const duplicateIsLoading = useSelector((state) => state.tasks.loading.addTask);
    const deleteIsLoading = useSelector((state) => state.tasks.loading.deleteTask);

    const [togglingID, setTogglingID] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showTaskDetail, setShowTaskDetail] = useState(false);

    /** handle context menu press */
    const handleMenuPress = (value, id) => {
        switch (value) {
            case 'edit':
                handleEdit(id);
                break;
            case 'delete':
                handleDelete(id);
                break;
            case 'duplicate':
                handleDuplicate(id);
                break;
            default:
                break;
        }
    };

    /** delete a task */
    const handleDelete = (id) => {
        dispatch(deleteTask({ userId, taskId: id }));
        // TODO swipe to delete
        // TODO multi-select delete
    };

    /** creates a duplicate of an existing task */
    const handleDuplicate = (id) => {
        const taskDetails = tasklist.find((task) => task.id === id);
        const { title, details, deadline, is_complete, tags, subtasks } = taskDetails;

        const newTask = {
            title: `${title} (copy)`,
            details,
            deadline,
            is_complete,
            tags,
            subtasks,
        };
        dispatch(addTask({ userId, taskDetails: newTask }));
    };

    /** toggles task completion status */
    const handleStatusToggle = (id, is_complete) => {
        setTogglingID(id);
        dispatch(toggleCompletion({ userId, taskId: id, is_complete })).then(() =>
            setTogglingID(null),
        );
    };

    /** each task item in the flatlist */
    const renderTask = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                // show task details
                setSelectedTask(item);
                setShowTaskDetail(true);
            }}
            style={[styles.taskContainer, { borderColor: theme.textLight }]}>
            <View style={styles.toprow}>
                {/* task completion status */}
                <TouchableOpacity
                    style={[styles.taskStatusBtn, { borderColor: theme.textLight }]}
                    onPress={() => handleStatusToggle(item.id, item.is_complete)}>
                    <View
                        style={[
                            styles.colorCircle,
                            {
                                backgroundColor: item.is_complete
                                    ? theme.green
                                    : theme.orange,
                            },
                        ]}
                    />

                    <Text style={[styles.statusText, { color: theme.textLight }]}>
                        {toggleIsLoading && togglingID === item.id
                            ? 'Loading...'
                            : item.is_complete
                            ? 'Completed'
                            : 'Not Done'}
                    </Text>
                </TouchableOpacity>

                {/* deadline */}
                <Text style={[styles.taskDeadline, { color: theme.textLight }]}>
                    <AntDesign name="calendar" size={16} color={theme.textLight} />{' '}
                    {toDateDisplay(item.deadline)}
                </Text>
            </View>

            <Text style={[styles.taskTitle, { color: theme.text }]}>{item.title}</Text>

            {/* details of task */}
            {item.details && (
                <Text style={[styles.taskDetail, { color: theme.text }]}>
                    {item.details}
                </Text>
            )}

            <View style={styles.btmRow}>
                {/* tags */}
                {item.tags && (
                    <View style={styles.tagContainer}>
                        {item.tags.map((tag) => (
                            <View
                                key={tag.name}
                                style={[
                                    styles.tagBox,
                                    { backgroundColor: theme.backgroundSec },
                                ]}>
                                <AntDesign name="tag" size={16} color={tag.color} />
                                <Text style={[styles.tagText, { color: theme.text }]}>
                                    {tag.name}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* context menu with 'edit', 'delete', 'duplicate' options */}
                <Menu onSelect={(value) => handleMenuPress(value, item.id)}>
                    <MenuTrigger>
                        <Ionicons
                            name="ellipsis-vertical"
                            size={20}
                            color={theme.text}
                        />
                    </MenuTrigger>

                    <MenuOptions
                        optionsContainerStyle={[
                            styles.optionsContainer,
                            {
                                backgroundColor: theme.background,
                                borderColor: theme.text,
                            },
                        ]}>
                        <MenuOption value="edit">
                            <Text
                                style={[styles.MenuOptionText, { color: theme.text }]}>
                                Edit
                            </Text>
                        </MenuOption>

                        <MenuOption value="duplicate">
                            <Text
                                style={[styles.MenuOptionText, { color: theme.text }]}>
                                Duplicate
                            </Text>
                        </MenuOption>

                        <MenuOption value="delete">
                            <Text
                                style={[styles.MenuOptionText, { color: theme.text }]}>
                                Delete
                            </Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <FlatList
                data={tasklist}
                keyExtractor={(item) => item.id}
                renderItem={renderTask}
                style={styles.flatlist}
            />

            {/* show task details when a task is selected */}
            {selectedTask && (
                <TaskDetail
                    task={selectedTask}
                    showDetails={showTaskDetail}
                    setShowDetails={setShowTaskDetail}
                    handleEdit={handleEdit}
                />
            )}

            {/* show loading indicator when duplicating or deleting a task */}
            {(duplicateIsLoading || deleteIsLoading) && (
                <View style={styles.addTaskLoading}>
                    <ActivityIndicator size="large" color={theme.blue} />
                    <Text style={styles.addTaskLoadingText}>
                        {duplicateIsLoading
                            ? 'Duplicating task...'
                            : 'Deleting task...'}
                    </Text>
                </View>
            )}
        </>
    );
};

export default TaskList;
