import { View } from 'react-native';

/**
 * A custom spacer component
 *
 * @param height height of spacer
 * @param width  width of spacer
 */
const Spacer = ({ height, width }) => {
    // default height and width
    width = width || '100%';
    height = height || 20;

    return <View style={{ height, width }} />;
};

export default Spacer;
