import React, { useContext, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';

import { MusicContext } from './MusicContext';

const MainScreen = () => {
  const navigation = useNavigation();
  const { isMusicPlaying, toggleMusic } = useContext(MusicContext);
  const soundRef = useRef(null);

  useEffect(() => {
    const loadMusic = async () => {
      try {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
        }

        const { sound } = await Audio.Sound.createAsync(
          require('./Doom.mp4'),
          {},
          onPlaybackStatusUpdate
        );
        soundRef.current = sound;

        if (isMusicPlaying) {
          await soundRef.current.playAsync();
        }
      } catch (error) {
        console.error('Error loading music', error);
      }
    };

    const onPlaybackStatusUpdate = (status) => {
      // Check if the sound has finished playing
      if (status.didJustFinish) {
        // Restart the sound
        soundRef.current.replayAsync();
      }
    };

    loadMusic();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [isMusicPlaying]);

  const handleToggleButtonClick = async () => {
    try {
      if (soundRef.current) {
        if (isMusicPlaying) {
          await soundRef.current.pauseAsync();
        } else {
          await soundRef.current.playAsync();
        }

        toggleMusic(); // Toggle the global music state
      }
    } catch (error) {
      console.error('Error toggling music', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Master</Text>
      <CustomButton title="Play" onPress={() => navigation.navigate('Play')} />
      <CustomButton title="Practice" onPress={() => navigation.navigate('Practice')} />
      <CustomButton title="Toggle Music" onPress={handleToggleButtonClick} />
    </View>
  );
};

const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'red',
    width: 150,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default MainScreen;
