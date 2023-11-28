import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av'; // Import Audio from Expo AV
import LottieView from 'lottie-react-native';



export default function PlayScreen() {
  const navigation = useNavigation();

  const [buttonText, setButtonText] = useState('Start');
  const [buttonColor, setButtonColor] = useState('blue');
  const [startTime, setStartTime] = useState(null);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [lives, setLives] = useState(3); // Initialize with 3 lives
  const [score, setScore] = useState(0); // Initialize score
  const lottieRef = useRef(null); // Create a reference to the LottieView component
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
        lottieRef.current.pause(); // Pause the animation

        // Set a timer to reset the game if GREEN button is not clicked within 3 seconds
        intervalRef.current = setTimeout(() => {
          if (lives === 1) {
            playGameDieSound(); // Play the GameDie.wav sound
      
            // Show game over pop-up
            Alert.alert(
              'Game Over',
              `Your final score is: ${score}`,
              [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('Main'), // Navigate back to MainScreen
                },
              ],
              { cancelable: false }
            );
          } else {
            setLives((prevLives) => prevLives - 1)
            playDogDieSound(); // Play the DogDieSound.wav sound
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
        lottieRef.current.play();
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

  const hearts = Array.from({ length: lives }, (_, index) => index); // Create an array representing the number of lives


  return (
    <View style={styles.appContainer}>
      <LottieView
        ref={lottieRef} // Set the reference for the LottieView component
        source={require('./WalkingBurger.json')} // Replace this with the correct path to your Lottie animation file
        autoPlay={true}
        loop={true} // Ensure the loop is explicitly set to true
        style={styles.lottieAnimation} // Add or adjust styles as needed
      />
      <View style={styles.topRightContainer}>
        {hearts.map((_, index) => (
          <Image
            key={`heart_${index}`}
            source={require('./Heart.png')} // Replace this with the correct path to your image
            style={styles.heartImage}
          />
        ))}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.topLeftContainer}>
          <Text style={styles.scoreText}>Score: {score}</Text>
        </View>
        <CustomButton title={buttonText} onPress={handleButtonClick} color={buttonColor} />
        <Image
          source={require('./Fox.png')} // Replace this with the correct path to your image
          style={styles.foxImage}
        />
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
    position: 'relative', // Add this to make the lives and score text appear on top of the button
  },
  topLeftContainer: {
    position: 'absolute',
    top: 30,
    left: -70,
    zIndex: 1,
  },
  topRightContainer: {
    flexDirection: 'row', // Display items horizontally
    position: 'absolute',
    top: 20,
    right: 40,
    zIndex: 1,
  },
  heartImage: {
    width: 50, // Adjust the width of the heart image as needed
    height: 50, // Adjust the height of the heart image as needed
    marginRight: -30, // Adjust the spacing between hearts as needed
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50, // Adjust the top padding for content
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
  foxImage: {
    width: 150, // Adjust the width of the fox image as needed
    height: 150, // Adjust the height of the fox image as needed
    position: 'absolute',
    top: '33%', // Adjust the position of the fox image vertically
    left: -90, // Adjust the position of the fox image horizontally
    transform: [{ translateY: -50 }], // Center the fox image vertically
    zIndex: 1,
  },
  lottieAnimation: {
    width: 200, // Adjust the width of the animation
    height: 200, // Adjust the height of the animation
    position: 'absolute',
    top: '25%', // Adjust the position of the animation vertically
    left: '60%', // Adjust the position of the animation horizontally
    transform: [{ translateX: -100 }, { translateY: -100 }], // Center the animation
    zIndex: 1, // Ensure it's on top of other elements if needed
  },
});
