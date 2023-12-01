import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { toDateDisplay } from '../../../components/timeConverters';

/**
 * A modal to display task details
 * @param task - task object
 * @param showDetails - determines if modal is shown
 * @param setShowDetails - function to set modal visibility
 * @param handleEdit - function to handle editing of task
 */
const TaskDetail = ({ task, showDetails, setShowDetails, handleEdit }) => {
    console.log(task);
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

                    <Text style={styles.description}>{task.details}</Text>

                    <Text style={styles.date}>{toDateDisplay(task.deadline)}</Text>

                    <Text style={styles.date}>
                        {task.completed ? 'Completed' : 'Not Completed'}
                    </Text>

                    {/* subtasks */}
                    <Text style={styles.date}>Subtasks</Text>
                    {task.subtasks.map((subtask) => (
                        <Text key={subtask.id}>{subtask.title}</Text>
                    ))}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleEdit(task.id)}>
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
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
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 18,
        marginBottom: 10,
    },
    date: {
        fontSize: 16,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        backgroundColor: '#2196F3',
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
});

export default TaskDetail;
