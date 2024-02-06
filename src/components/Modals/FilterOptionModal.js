import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import MyCheckbox from '../Checkbox';

const FilterOptionModal = ({ visible, onClose, currentVals, setCurrentVals }) => {
    const [showStatus, setShowStatus] = useState(currentVals[0].value);
    const [showDescription, setShowDescription] = useState(currentVals[1].value);
    const [showDeadline, setShowDeadline] = useState(currentVals[2].value);
    const [showTags, setShowTags] = useState(currentVals[3].value);

    /**
     * Update filter options and close the modal
     */
    const applyChanges = () => {
        const updatedVals = [
            { label: 'Show Status', value: showStatus },
            { label: 'Show Description', value: showDescription },
            { label: 'Show Deadline', value: showDeadline },
            { label: 'Show Tags', value: showTags },
        ];
        setCurrentVals(updatedVals);
        onClose();
    };

    const optionContainer = (label, checked, setChecked) => {
        return (
            <View style={styles.checkboxRow}>
                <Text style={styles.checkboxLabel}>{label}</Text>
                <MyCheckbox checked={checked} setChecked={setChecked} />
            </View>
        );
    };

    return (
        <Modal visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <Text style={styles.title}>Filters</Text>

                {/* checkbox for each filter option */}
                {optionContainer('Show Completion Status', showStatus, setShowStatus)}
                {optionContainer(
                    'Show Task Description',
                    showDescription,
                    setShowDescription,
                )}
                {optionContainer('Show Task Deadline', showDeadline, setShowDeadline)}
                {optionContainer('Show Tags', showTags, setShowTags)}

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#E1DFDE' }]}
                        onPress={onClose}>
                        <Text style={(styles.buttonText, { color: '#000' })}>
                            Cancel
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#485498' }]}
                        onPress={applyChanges}>
                        <Text style={(styles.buttonText, { color: '#ffffff' })}>
                            Apply
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        paddingTop: '40%',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    title: {
        marginBottom: 20,
        fontSize: 26,
        fontFamily: 'Inter-Bold',
        color: '#fff',
    },

    // checkbox styles
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
        paddingHorizontal: 30,
    },
    checkboxLabel: {
        fontSize: 18,
        flex: 1,
        color: '#fff',
        fontFamily: 'Inter-Medium',
    },

    button: {
        padding: 10,
        margin: 10,
        borderRadius: 10,
        width: 100,
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 20,
    },
});

export default FilterOptionModal;
