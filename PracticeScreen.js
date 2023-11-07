import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PracticeScreen() {
  const navigation = useNavigation();

  const [buttonText, setButtonText] = useState('Start');
  const [buttonColor, setButtonColor] = useState('blue');
  const [startTime, setStartTime] = useState(null);
  const [reactionTimes, setReactionTimes] = useState([]);

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

      setButtonText(`Reaction Time: ${reactionTime.toFixed(2)}s`);
      setButtonColor('blue');
    } else {
      setButtonText('Start');
      setButtonColor('blue');
    }
  };

  return (
    <View style={styles.appContainer}>
      <CustomButton title={buttonText} onPress={handleButtonClick} color={buttonColor} />
      <CustomButton
        title="History"
        onPress={() =>
          navigation.navigate('Records', {
            serializedReactionTimes: JSON.stringify(reactionTimes),
          })
        }
        color="red" // Set the color of the "View Records" button to red
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
    width: 150, // Set a fixed width for the buttons (adjust as needed)
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
});
