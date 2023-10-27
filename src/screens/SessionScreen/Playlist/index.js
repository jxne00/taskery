import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';

import { useTheme } from '../../../theme/ThemeContext';
import useGlobalStyles from '../../../theme/globalStyles';

/**
 * a playlist component to play sound from a list of sounds
 */
const Playlist = () => {
  const { theme } = useTheme();
  const global = useGlobalStyles();

  // tracks from: https://pixabay.com/sound-effects/
  const tracks = [
    { name: 'White Noise', file: require('../../../assets/sound/whitenoise.mp3') },
    { name: 'Nature', file: require('../../../assets/sound/nature.mp3') },
    { name: 'Cafe', file: require('../../../assets/sound/cafe-ambience.mp3') },
    { name: 'Birds Chirp', file: require('../../../assets/sound/bird-chirp.mp3') },
  ];

  const [sound, setSound] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);

  // unload sound on unmount
  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  /** play the selected sound */
  const playSound = async (index) => {
    try {
      // stop & unload first if another sound is playing
      if (sound && activeIndex !== index) {
        resetSound();
      }

      // resume from pause
      if (sound && activeIndex === index) {
        await sound.playAsync(position);
        setIsPlaying(true);
        return;
      }

      // load & play the sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        tracks[index].file,
      );
      setSound(newSound);
      setActiveIndex(index);

      await newSound.playAsync();
      setIsPlaying(true);
    } catch (err) {
      alert('Error playing sound', err);
    }
  };

  /** pause sound and save its position */
  const togglePause = async () => {
    if (isPlaying) {
      // save position where it paused
      const { positionMillis } = await sound.getStatusAsync();
      setPosition(positionMillis);

      await sound.pauseAsync();
    }
    setIsPlaying(!isPlaying);
  };

  /** stop the sound */
  const stopSound = async () => {
    if (sound) {
      resetSound();
    }
  };

  /** reset sound and states */
  const resetSound = async () => {
    await sound.stopAsync();
    await sound.unloadAsync();

    setIsPlaying(false);
    setActiveIndex(-1);
    setPosition(0);
    setSound(null);
  };

  return (
    <View style={styles.container}>
      {/* list of sounds */}
      {tracks.map((track, index) => (
        <View
          key={index}
          style={[
            styles.trackRow,
            {
              borderColor:
                activeIndex === index
                  ? isPlaying
                    ? theme.green
                    : theme.orange
                  : theme.textLight,
            },
          ]}>
          <Text
            style={[
              global.text,
              styles.trackName,
              {
                // green = playing, orange = paused
                color:
                  activeIndex === index
                    ? isPlaying
                      ? theme.green
                      : theme.orange
                    : theme.text,
              },
            ]}>
            {track.name}
          </Text>

          {/* play/pause button */}
          <FontAwesome
            name={activeIndex === index && isPlaying ? 'pause' : 'play'}
            size={24}
            color={theme.text}
            style={{ marginHorizontal: 10 }}
            onPress={() => {
              if (activeIndex === index && isPlaying) {
                togglePause();
              } else {
                playSound(index);
              }
            }}
          />

          {/* show stop button for active sound */}
          {activeIndex === index && (
            <FontAwesome
              name="stop"
              size={24}
              style={{ marginHorizontal: 10 }}
              color={theme.text}
              onPress={stopSound}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: '10%',
  },
  trackName: {
    flex: 1,
    fontFamily: 'Inter-Medium',
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});

export default Playlist;
