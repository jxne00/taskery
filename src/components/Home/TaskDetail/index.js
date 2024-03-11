import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useThemeContext';
import useThemeStyles from '../../../hooks/useThemeStyles';
import { toDateDisplay } from '../../../components/timeConverters';
import styles from './styles';

/**
 * A modal to display task details
 * @param {object} task - the task to display
 * @param {boolean} showDetails - whether the modal is visible
 * @param {function} setShowDetails - function to close the modal
 * @param {function} handleEdit - function to open the edit page
 */
const TaskDetail = ({ task, showDetails, setShowDetails, handleEdit }) => {
    const { theme } = useTheme();
    const themed = useThemeStyles();

    const subtaskExists = task.subtasks && task.subtasks.length > 0;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showDetails}
            onRequestClose={() => {
                setShowDetails(false);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.title}>{task.title}</Text>

                    {/* status & deadline in a row */}
                    <View style={[themed.row, styles.toprow]}>
                        <Text style={themed.textSemibold}>
                            Due: {toDateDisplay(task.deadline)}
                        </Text>

                        <View style={styles.taskStatusBtn}>
                            <View
                                style={[
                                    styles.colorCircle,
                                    {
                                        backgroundColor: task.completed
                                            ? theme.green
                                            : theme.orange,
                                    },
                                ]}
                            />
                            <Text style={styles.statusText}>
                                {task.completed ? 'Completed' : 'Not Done'}
                            </Text>
                        </View>
                    </View>

                    {/* additional notes */}
                    {task.details && (
                        <View style={styles.detailsContainer}>
                            <Text style={themed.textRegular}>Additional Note:</Text>
                            <Text style={styles.details}>{task.details}</Text>
                        </View>
                    )}

                    {/* subtasks */}
                    {subtaskExists && (
                        <View style={styles.subtasksContainer}>
                            <Text style={themed.textSemibold}>Subtasks:</Text>
                            <View style={styles.subtaskItems}>
                                {task.subtasks.map((subtask, index) => (
                                    <View key={index} style={styles.subtask}>
                                        {subtask.completed ? (
                                            <MaterialCommunityIcons
                                                name="checkbox-marked"
                                                size={24}
                                                color={theme.darkGray}
                                                style={styles.icon}
                                            />
                                        ) : (
                                            <MaterialCommunityIcons
                                                name="checkbox-blank"
                                                size={24}
                                                color={theme.darkGray}
                                                style={styles.icon}
                                            />
                                        )}
                                        <Text style={styles.subtaskText}>
                                            {subtask.description}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                // close modal and show edit page
                                setShowDetails(false);
                                handleEdit(task.id);
                            }}>
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            // close modal
                            onPress={() => setShowDetails(false)}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default TaskDetail;
