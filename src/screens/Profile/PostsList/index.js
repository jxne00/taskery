import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useGlobalStyles from '../../../theme/globalStyles';
import { useTheme } from '../../../theme/ThemeContext';

const PostsList = ({ data }) => {
  const { theme } = useTheme();
  const global = useGlobalStyles();

  const renderPost = (item) => {
    return (
      <View style={[styles.postContainer, { borderColor: theme.textLight }]}>
        <Text style={[styles.postTitle, { color: theme.text }]}>{item.title}</Text>

        {item.caption && (
          <Text style={[styles.postCaption, { color: theme.text }]}>
            {item.caption}
          </Text>
        )}

        <View style={{ height: 20 }} />

        {/* likes and comments */}
        <View style={styles.statRow}>
          <TouchableOpacity style={global.row}>
            <Ionicons
              name="md-heart-outline"
              size={20}
              color={theme.red}
              style={{ marginRight: 3 }}
            />
            <Text style={[global.text, { color: theme.text }]}>{item.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={global.row}
            // TODO: show comments
            onPress={() => {
              console.log('TODO: show comments');
            }}>
            <Text style={[global.text, { color: theme.textLight }]}>
              {item.comments} {item.comments === 1 ? 'comment' : 'comments'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderPost}
      keyExtractor={(item) => item.id.toString()}
      style={{ width: '100%' }}
      ListHeaderComponent={
        <Text style={[styles.postSectionHeader, { color: theme.text }]}>Posts</Text>
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
  postTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    paddingBottom: 5,
  },
  postCaption: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default PostsList;
