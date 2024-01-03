import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '../../../hooks/useThemeContext';
import useThemeStyles from '../../../hooks/useThemeStyles';
import { toDateDisplay } from '../../../components/timeConverters';

/**
 * A modal to display task details
 * @param task - task object
 * @param showDetails - determines if modal is shown
 * @param setShowDetails - function to set modal visibility
 * @param handleEdit - function to handle editing of task
 */
// TODO style TaskDetail modal
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

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.9)',
    },
    modalView: {
        width: '95%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
    },
    toprow: {
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    detailsContainer: {
        width: '100%',
        marginVertical: 10,
    },
    details: {
        fontSize: 18,
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        padding: 10,
    },
    date: {
        fontSize: 16,
        marginBottom: 10,
    },
    subtasksContainer: {
        width: '100%',
        marginVertical: 10,
    },
    subtaskItems: {
        marginVertical: 10,
    },
    subtask: {
        marginBottom: 10,
        alignItems: 'center',
        flexDirection: 'row',
    },
    subtaskText: {
        fontSize: 16,
        marginLeft: 10,
    },
    icon: {
        marginRight: 10,
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        backgroundColor: '#175f99',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginVertical: 10,
        width: '40%',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },

    // task status button
    taskStatusBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 18,
        borderWidth: 1,
    },
    colorCircle: {
        width: 12,
        height: 12,
        borderRadius: 8,
        marginRight: 5,
    },
    statusText: {
        fontSize: 14,
        fontFamily: 'Inter-SemiBold',
    },
});

export default TaskDetail;
