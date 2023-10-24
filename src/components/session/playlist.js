import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';

import { useTheme } from '../../theme/ThemeContext';
import useGlobalStyles from '../../theme/globalStyles';

// sounds from https://pixabay.com/sound-effects/
import whitenoise from '../../assets/sound/white-noise.mp3';
import nature from '../../assets/sound/rain-thunder-nature.mp3';
import cafe from '../../assets/sound/cafe-ambience.mp3';
import birds from '../../assets/sound/bird-chirp.mp3';

/**
 * a playlist component to play sound from a list of sounds
 */
const Playlist = () => {
  const { theme } = useTheme();
  const global = useGlobalStyles();

  const [sound, setSound] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);

  const tracks = [
    { name: 'White Noise', file: whitenoise },
    { name: 'Nature', file: nature },
    { name: 'Cafe', file: cafe },
    { name: 'Birds Chirp', file: birds },
  ];

  // play the selected sound
  const playSound = async (index) => {
    // stop & unload first if another sound is playing
    if (sound && activeIndex !== index) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setPosition(0);
    }

    // load & play the sound
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        tracks[index].file,
      );
      setSound(newSound);
      setActiveIndex(index);

      console.log('Playing');
      await newSound.playAsync();
      setIsPlaying(true);
    } catch (error) {
      alert(error);
    }
  };

  // FIXME - resume restarts sound
  // pause or resume the sound
  const togglePause = async () => {
    if (!sound) return;

    if (isPlaying) {
      // save position where it paused
      const { positionMillis } = await sound.getStatusAsync();
      setPosition(positionMillis);

      await sound.pauseAsync();
    }
    // resume sound from paused position
    else {
      if (position > 0) {
        await sound.setPositionAsync(position);
      }

      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  // stop the sound
  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();

      setIsPlaying(false);
      setActiveIndex(-1);
      setPosition(0);
    }
  };

  // unload
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

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
