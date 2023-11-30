import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native'; // Import LottieView


export default function PracticeScreen() {
  const navigation = useNavigation();

  const [buttonText, setButtonText] = useState('Start');
  const [buttonColor, setButtonColor] = useState('blue');
  const [startTime, setStartTime] = useState(null);
  const [reactionTimes, setReactionTimes] = useState([]);
  const intervalRef = useRef(null);

  const getRandomInterval = () => {
    return Math.floor(Math.random() * 5000) + 1000;
  };

  const handleButtonClick = () => {
    if (buttonText === 'Start') {
      setButtonText('Wait for Green');
      setButtonColor('red');

      intervalRef.current = setTimeout(() => {
        setButtonText('GREEN');
        setButtonColor('green');
        setStartTime(new Date().getTime());
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

      setButtonText(`Reaction Time: ${reactionTime.toFixed(2)}s`);
      setButtonColor('blue');
    } else {
      // Clear the timeout if the button is clicked before the 'GREEN' stage
      clearTimeout(intervalRef.current);

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
    backgroundColor: '#282c34',
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
});
