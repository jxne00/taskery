const temp = () => {
  <View
    style={[
      styles.timeContainer,
      { borderColor: isInputMode ? theme.textLight : theme.text },
    ]}>
    {/* hours */}
    {isInputMode ? (
      <TextInput
        style={[styles.timeInput, { color: theme.textLight }]}
        value={hrsInput}
        onChangeText={(text) => setHrsInput(text)}
      />
    ) : (
      <Text style={[styles.timeInput, { color: theme.text }]}>{hours}</Text>
    )}

    <Text style={styles.timeInput}>:</Text>

    {/* minutes */}
    {isInputMode ? (
      <TextInput
        style={[styles.timeInput, { color: theme.textLight }]}
        value={minsInput}
        onChangeText={(text) => setMinsInput(text)}
      />
    ) : (
      <Text style={[styles.timeInput, { color: theme.text }]}>{minutes}</Text>
    )}

    <Text style={styles.timeInput}>:</Text>

    {/* seconds */}
    {isInputMode ? (
      <TextInput
        style={[styles.timeInput, { color: theme.textLight }]}
        value={secsInput}
        onChangeText={(text) => setSecsInput(text)}
      />
    ) : (
      <Text style={[styles.timeInput, { color: theme.text }]}>{seconds}</Text>
    )}
  </View>;
};
