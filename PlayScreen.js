import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PlayScreen() {
  const navigation = useNavigation();

  const [buttonText, setButtonText] = useState('Start');
  const [buttonColor, setButtonColor] = useState('blue');
  const [startTime, setStartTime] = useState(null);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);

  const getRandomInterval = () => {
    return Math.floor(Math.random() * 5000) + 1000; // Random interval between 1 to 6 seconds (1000-6000 ms)
  };

  const handleButtonClick = () => {
    if (buttonText === 'Start') {
      setButtonText('Wait for Green');
      setButtonColor('red');
      const interval = getRandomInterval();

      setTimeout(() => {
        setButtonColor('green');
        setStartTime(new Date().getTime());
      }, interval);
    } else if (buttonText === 'Wait for Green') {
      const endTime = new Date().getTime();
      const reactionTime = (endTime - startTime) / 1000; // Calculate reaction time in seconds

      // Serialize the reactionTimes array to JSON format
      const serializedReactionTimes = JSON.stringify([
        ...reactionTimes,
        { time: new Date().toLocaleString(), reactionTime },
      ]);

      // Save the serialized reactionTimes in state
      setReactionTimes(JSON.parse(serializedReactionTimes));
      setScore(score + 1);

      setButtonText(`Reaction Time: ${reactionTime.toFixed(2)}s`);
      setButtonColor('blue');
    } else {
      if (lives === 1) {
        // Navigate to the highscore screen when all lives are lost
        navigation.navigate('Highscore', { score });
      } else {
        setLives(lives - 1);
        setButtonText('Start');
        setButtonColor('blue');
      }
    }
  };

  useEffect(() => {
    if (lives === 0) {
      // Navigate to the highscore screen when all lives are lost
      navigation.navigate('Highscore', { score });
    }
  }, [lives, navigation, score]);

  return (
    <View style={styles.appContainer}>
      <CustomButton title={buttonText} onPress={handleButtonClick} color={buttonColor} />
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Lives: {lives}</Text>
        <Text style={styles.statsText}>Score: {score}</Text>
      </View>
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
    width: 150, // Set a fixed width for the button (adjust as needed)
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 10, // Rounded button corners
    shadowColor: 'rgba(0, 0, 0, 0.3)', // Shadow color for a subtle effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5, // Adjust shadow opacity
    elevation: 2, // Add elevation for Android shadow
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    color: 'white',
    fontSize: 16,
  },
});
