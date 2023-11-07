import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MainScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Master</Text>
      <CustomButton title="Play" onPress={() => navigation.navigate('Play')} />
      <CustomButton title="Practice" onPress={() => navigation.navigate('Practice')} />
    </View>
  );
}

const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
  >
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
    backgroundColor: 'red', // Set button background color to red
    width: 150, // Set a fixed width for the buttons (adjust as needed)
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 10, // Rounded button corners
    elevation: 2, // Add elevation for Android shadow
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default MainScreen;
