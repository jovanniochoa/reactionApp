import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RecordsScreen from './RecordsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Reaction Time' }}
        />
        <Stack.Screen
          name="Records"
          component={RecordsScreen}
          options={{ title: 'Records' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HomeScreen = ({ navigation }) => {
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
      <Button
        title={buttonText}
        onPress={handleButtonClick}
        color={buttonColor}
      />
      <Button
        title="View Records"
        onPress={() =>
          navigation.navigate('Records', {
            serializedReactionTimes: JSON.stringify(reactionTimes),
          })
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
