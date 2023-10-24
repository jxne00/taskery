import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../theme/ThemeContext';
import useGlobalStyles from '../../theme/globalStyles';

import { secondsToHMS } from '../helper/timeConverters';

const ONE_SECOND = 1000;

/** A countdown timer */
const Timer = () => {
  const { theme } = useTheme();
  const global = useGlobalStyles();

  const [timerIsActive, setTimerIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const [isInputMode, setIsInputMode] = useState(false);

  const [hrsInput, setHrsInput] = useState('00');
  const [minsInput, setMinsInput] = useState('00');
  const [secsInput, setSecsInput] = useState('00');

  const DEFAULT_HOURS = '00';
  const DEFAULT_MINUTES = '00';
  const DEFAULT_SECONDS = '00';

  // get hours, minutes, seconds
  const { hours, minutes, seconds } = secondsToHMS(timeLeft);

  const [sound, setSound] = useState();

  // set the countdown
  useEffect(() => {
    let interval;

    // decrement timeLeft by 1 second
    if (timeLeft > 0 && timerIsActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, ONE_SECOND);
    }
    // countdown ended
    else if (timerIsActive) {
      endTimer();
    }
    return () => clearInterval(interval);
  }, [timeLeft, timerIsActive]);

  useEffect(() => {
    // unload sound on unmount
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  /** play sound & vibration when timer ends */
  const endTimer = () => {
    playAlarm();

    // haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    setTimerIsActive(false);
    resetTimer();
  };

  /** play alarm sound */
  const playAlarm = async () => {
    // sound from: https://pixabay.com/sound-effects/
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sound/clock-alarm.mp3'),
    );
    setSound(sound);

    console.log('Playing alarm');
    await sound.playAsync();
  };

  /** reset hours, minutes, seconds back to default */
  const resetTimer = () => {
    setTimeLeft(
      parseInt(hrsInput) * 3600 +
        parseInt(minsInput) * 60 +
        parseInt(secsInput),
    );
  };

  /** toggle timer on & off */
  const toggleStartPause = () => {
    if (timerIsActive) {
      setTimerIsActive(false);
    } else {
      setTimerIsActive(true);
    }
  };

  /** toggle input mode on & off */
  const handleInputMode = () => {
    if (isInputMode) {
      if (parseInt(minsInput) > 59) setMinsInput('59');
      if (parseInt(secsInput) > 59) setSecsInput('59');
      if (parseInt(hrsInput) > 99) setHrsInput('99');

      // get total in seconds
      setTimeLeft(
        parseInt(hrsInput) * 3600 +
          parseInt(minsInput) * 60 +
          parseInt(secsInput),
      );

      setIsInputMode(false);
    } else {
      setHrsInput(hours);
      setMinsInput(minutes);
      setSecsInput(seconds);

      setIsInputMode(true);
    }
  };

  return (
    <View style={styles.container}>
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
          <Text style={[styles.timeInput, { color: theme.text }]}>
            {minutes}
          </Text>
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
          <Text style={[styles.timeInput, { color: theme.text }]}>
            {seconds}
          </Text>
        )}
      </View>

      {/* toggle input mode button */}
      <TouchableOpacity onPress={handleInputMode} style={styles.iconContainer}>
        <Text style={[styles.modeText, { color: theme.text }]}>
          {isInputMode ? 'Done' : 'Set timer'}
        </Text>
        <FontAwesome
          name={isInputMode ? 'check' : 'edit'}
          size={26}
          color={theme.text}
        />
      </TouchableOpacity>

      <View style={styles.buttonsContainer}>
        {/* reset button */}
        <TouchableOpacity
          onPress={resetTimer}
          style={[styles.timerBtn, { borderColor: theme.text }]}>
          <Text style={{ fontSize: 20, color: theme.text }}>Reset</Text>
        </TouchableOpacity>

        {/* start / pause button */}
        <TouchableOpacity
          onPress={toggleStartPause}
          style={[
            styles.timerBtn,
            {
              borderColor: theme.text,
              backgroundColor: timerIsActive ? theme.backgroundSec : null,
            },
          ]}>
          <Text
            style={{
              fontSize: 20,
              color: timerIsActive ? theme.green : theme.text,
            }}>
            {timerIsActive ? 'Pause' : 'Start'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'space-between',
    marginHorizontal: '5%',
    marginVertical: '10%',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 3,
    borderRadius: 10,
    paddingVertical: 14,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
  },
  timerBtn: {
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    paddingVertical: 8,
    borderRadius: 50,
  },
  timeInput: {
    fontSize: 70,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  inputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconContainer: {
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    borderWidth: 2,
    borderRadius: 2,
    paddingVertical: 4,
    width: 180,
  },
  modeText: {
    fontSize: 20,
    marginRight: 10,
    fontFamily: 'Inter-Regular',
  },
});

export default Timer;
