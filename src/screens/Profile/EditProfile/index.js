import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../hooks/useThemeContext';
import CustomStatusBar from '../../../components/StatusBar';

// TODO implement edit profile functionality
const EditProfile = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { user, userId } = route.params;

  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar_path);
  const [is_public, setIsPublic] = useState(user.is_public);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Ionicons
            name="arrow-back-circle-outline"
            size={26}
            color={theme.text}
            onPress={() => navigation.goBack()}
          />

          <Text style={styles.headerText}> Edit Profile </Text>

          <View style={{ width: 26 }}/>
        </View>

        <TextInput
          placeholder={name}
          value={name}
          onChangeText={(text) => setName(text)}
        />
      </View>
      <CustomStatusBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
});

export default EditProfile;
