import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * A custom divider with text in the middle
 * `------ like this ------`
 *
 * @param color color of divider line
 * @param text  text string to display
 * @param height  height of divider line
 * @param margin vertical margin of divider
 */
const HeaderDivider = ({ color, text, height, margin }) => {
  return (
    <View style={[styles.container, { marginVertical: margin }]}>
      <View style={[styles.line, { backgroundColor: color, height: height }]} />

      <Text style={[styles.text, { color: color }]}>{text}</Text>

      <View style={[styles.line, { backgroundColor: color, height: height }]} />
    </View>
  );
};

const Divider = ({ color, height, margin }) => {
  return (
    <View
      style={{
        height: height,
        backgroundColor: color,
        marginVertical: margin,
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
  },
  text: {
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export { HeaderDivider, Divider };
