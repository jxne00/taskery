import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../hooks/useThemeContext';
import useThemeStyles from '../../../hooks/useThemeStyles';

const PostsList = ({ data }) => {
    const { theme } = useTheme();
    const themed = useThemeStyles();

    const renderPost = (item) => {
        return (
            <View style={[styles.postContainer, { borderColor: theme.textLight }]}>
                <Text style={themed.subHeaderText}>{item.title}</Text>

                <View style={{ height: 5 }} />

                {item.caption && <Text style={themed.textRegular}>{item.caption}</Text>}

                <View style={{ height: 20 }} />

                {/* likes and comments */}
                <View style={styles.statRow}>
                    <TouchableOpacity style={themed.row}>
                        <Ionicons
                            name="md-heart-outline"
                            size={20}
                            color={theme.red}
                            style={{ marginRight: 3 }}
                        />
                        <Text style={themed.textRegular}>{item.likes}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={themed.row}
                        onPress={() => {
                            // TODO comments page
                            console.log('TODO: show comments');
                        }}>
                        <Text style={themed.textRegularLight}>
                            {item.comments}{' '}
                            {item.comments === 1 ? 'comment' : 'comments'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <FlatList
            data={data}
            renderItem={({ item }) => renderPost(item)}
            keyExtractor={(item) => item.id}
            style={{ width: '100%' }}
            ListHeaderComponent={
                <Text style={[styles.postSectionHeader, { color: theme.text }]}>
                    Posts
                </Text>
            }
        />
    );
};

const styles = StyleSheet.create({
    postSectionHeader: {
        fontSize: 22,
        fontFamily: 'Inter-Bold',
        marginLeft: 13,
        marginTop: 20,
    },
    postContainer: {
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        width: '95%',
        alignSelf: 'center',
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});

export default PostsList;
