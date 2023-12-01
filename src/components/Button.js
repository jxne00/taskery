import { TouchableOpacity, Text } from 'react-native';

const Button = ({ onPress, text, bgCol, textCol, width }) => {
    width = width || '100%';

    return (
        <TouchableOpacity style={{ backgroundColor: bgCol }} onPress={onPress}>
            <Text style={{ color: textCol }}>{text}</Text>
        </TouchableOpacity>
    );
};

export default Button;
