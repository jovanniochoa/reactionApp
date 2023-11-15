import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av'; // Import Audio from Expo AV


export default function PlayScreen() {
  const navigation = useNavigation();

  const [buttonText, setButtonText] = useState('Start');
  const [buttonColor, setButtonColor] = useState('blue');
  const [startTime, setStartTime] = useState(null);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [lives, setLives] = useState(3); // Initialize with 3 lives
  const [score, setScore] = useState(0); // Initialize score

  const intervalRef = useRef(null);

  const getRandomInterval = () => {
    return Math.floor(Math.random() * 5000) + 1000;
  };

  const playCoinSound = async () => {
    const soundObject = new Audio.Sound();

    try {
      await soundObject.loadAsync(require('./Coin.wav'));
      await soundObject.setVolumeAsync(0.5); // Adjust the volume as needed (0.5 represents half of the max volume)
      await soundObject.playAsync();
      // Your logic after the sound plays goes here
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const playDogDieSound = async () => {
    const soundObject = new Audio.Sound();
  
    try {
      await soundObject.loadAsync(require('./DogDieSound.wav'));
      await soundObject.setVolumeAsync(1); // Adjust the volume as needed (0.5 represents half of the max volume)
      await soundObject.playAsync();
      // Your logic after the sound plays goes here
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const playGameDieSound = async () => {
    const soundObject = new Audio.Sound();
  
    try {
      await soundObject.loadAsync(require('./GameDie.mp3'));
      await soundObject.playAsync();
      // Your logic after the sound plays goes here
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handleButtonClick = () => {
    if (buttonText === 'Start') {
      setButtonText('Wait for Green');
      setButtonColor('red');

      intervalRef.current = setTimeout(() => {
        setButtonText('GREEN');
        setButtonColor('green');
        setStartTime(new Date().getTime());

        // Set a timer to reset the game if GREEN button is not clicked within 3 seconds
        intervalRef.current = setTimeout(() => {
          setLives((prevLives) => prevLives - 1);
          playDogDieSound(); // Play the DogDieSound.wav sound

          if (lives === 0) {
            playGameDieSound(); // Play the GameDie.wav sound
            // Additional logic or actions when the game ends
          }

          resetGame();
        }, 3000);
      }, getRandomInterval());
    } else if (buttonText === 'GREEN') {
      const endTime = new Date().getTime();
      const reactionTime = (endTime - startTime) / 1000;

      clearInterval(intervalRef.current);

      const updatedReactionTimes = [
        ...reactionTimes,
        { time: new Date().toLocaleString(), reactionTime },
      ];

      setReactionTimes(updatedReactionTimes);

      // Check if the button was pressed in the interval
      if (reactionTime <= 5) {
        playCoinSound(); // Play the coin sound
        // Update the scoreboard and reset the game
        setScore((prevScore) => prevScore + 1); // Increment score
        setButtonText(`Reaction Time: ${reactionTime.toFixed(2)}s`);
        setButtonColor('blue');
      } else {
        // Reset the game without decrementing lives
        resetGame();
      }

      // Set a timeout to automatically reset the game after the green interval
      intervalRef.current = setTimeout(() => {
        resetGame();
      }, getRandomInterval());
    } else {
      // Clear the timeout if the button is clicked before the 'GREEN' stage
      clearTimeout(intervalRef.current);

      setButtonText('Start');
      setButtonColor('blue');
    }
  };

  const resetGame = () => {
    // Reset the game without decrementing lives
    setButtonText('Start');
    setButtonColor('blue');
  };

  useEffect(() => {
    // Cleanup the timers when the component unmounts
    return () => {
      clearTimeout(intervalRef.current);
    };
  }, []);

  return (
    <View style={styles.appContainer}>
      <Text style={styles.livesText}>Lives: {lives}</Text>
      <Text style={styles.scoreText}>Score: {score}</Text>
      <CustomButton title={buttonText} onPress={handleButtonClick} color={buttonColor} />
      <CustomButton
        title="History"
        onPress={() =>
          navigation.navigate('Records', {
            serializedReactionTimes: JSON.stringify(reactionTimes),
          })
        }
        color="red"
      />
    </View>
  );
}

const CustomButton = ({ title, onPress, color }) => (
  <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  button: {
    width: 150,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  livesText: {
    color: 'white',
    fontSize: 20,
    marginBottom: 10,
  },
  scoreText: {
    color: 'white',
    fontSize: 20,
    marginBottom: 10,
  },
});
