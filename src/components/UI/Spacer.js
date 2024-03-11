import { View } from 'react-native';

/**
 * A custom spacer component
 * @param {number} height height of spacer
 * @param {string} width width of spacer
 */
const Spacer = ({ height, width }) => {
    width = width || '100%';
    height = height || 20;

    return <View style={{ height, width }} />;
};

export default Spacer;
