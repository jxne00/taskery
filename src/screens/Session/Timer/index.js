import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Svg, Circle } from 'react-native-svg';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '../../../hooks/useThemeContext';
import useGlobalStyles from '../../../hooks/useGlobalStyles';

import { secondsToHMS } from '../../../components/timeConverters';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const strokeWidth = 10;
const radius = 40;
const circumference = 2 * Math.PI * radius;
const ONE_SECOND = 1000;

/** A countdown timer */
const Timer = () => {
  const { theme } = useTheme();
  const global = useGlobalStyles();

  const [timerIsActive, setTimerIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200);

  const [isInputMode, setIsInputMode] = useState(false);

  const [hrsInput, setHrsInput] = useState('00');
  const [minsInput, setMinsInput] = useState('20');
  const [secsInput, setSecsInput] = useState('00');

  const [sound, setSound] = useState();

  // get hours, minutes, seconds
  const { hours, minutes, seconds } = secondsToHMS(timeLeft);

  // timer params
  const duration = hours * 3600 + minutes * 60 + seconds;

  // animated value for stroke dashoffset
  const progress = useSharedValue(circumference);

  useEffect(() => {
    progress.value = withTiming(0, {
      duration: duration * 1000,
      easing: Easing.linear,
    });
  }, [duration]);

  // animated props for animated circle
  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: progress.value,
    };
  });

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
    else if (timerIsActive) endTimer();

    return () => clearInterval(interval);
  }, [timeLeft, timerIsActive]);

  useEffect(() => {
    // unload sound on unmount
    return sound ? () => sound.unloadAsync() : undefined;
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
      require('../../../assets/sound/clock-alarm.mp3'),
    );
    setSound(sound);

    await sound.playAsync();
  };

  /** reset hours, minutes, seconds back to default */
  const resetTimer = () => {
    setTimeLeft(
      parseInt(hrsInput) * 3600 + parseInt(minsInput) * 60 + parseInt(secsInput),
    );
  };

  /** toggle timer on & off */
  const toggleStartPause = () => {
    timerIsActive ? setTimerIsActive(false) : setTimerIsActive(true);
  };

  /** toggle input mode on & off */
  const handleInputMode = () => {
    if (isInputMode) {
      if (parseInt(minsInput) > 59) setMinsInput('59');
      if (parseInt(secsInput) > 59) setSecsInput('59');
      if (parseInt(hrsInput) > 99) setHrsInput('99');

      // get total in seconds
      setTimeLeft(
        parseInt(hrsInput) * 3600 + parseInt(minsInput) * 60 + parseInt(secsInput),
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
      {/* timer circle */}
      <Svg height="100" width="100" viewBox="0 0 100 100">
        <Circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={theme.textLight}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={theme.text}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
        />
      </Svg>

      {/* Centered Time Text */}
      {/* <View style={styles.timeWrapper}>
        <Text style={[global.textRegular, { color: theme.text }]}>
          {secondsToHMS(timeLeft).formatted}
        </Text>
      </View> */}

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
    marginHorizontal: '5%',
    marginVertical: '10%',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 3,
    borderRadius: 80,
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
    fontSize: 60,
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

  // timer
  timeWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    left: '50%',
    top: '50%',
    marginLeft: -40,
    marginTop: -40,
  },
});

export default Timer;
