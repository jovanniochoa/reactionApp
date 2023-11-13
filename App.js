import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './MainScreen';
import PracticeScreen from './PracticeScreen';
import PlayScreen from './PlayScreen';
import RecordsScreen from './RecordsScreen';
import { MusicProvider } from './MusicContext';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <MusicProvider>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Practice" component={PracticeScreen} />
          <Stack.Screen name="Play" component={PlayScreen} />
          <Stack.Screen name="Records" component={RecordsScreen} options={{ title: 'Records' }} />
        </Stack.Navigator>
      </MusicProvider>
    </NavigationContainer>
  );
};

export default App;
