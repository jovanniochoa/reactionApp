// RecordsScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const RecordsScreen = ({ route }) => {
  const { serializedReactionTimes } = route.params;
  const reactionTimes = JSON.parse(serializedReactionTimes);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reaction Time Records</Text>
      <FlatList
        data={reactionTimes}
        keyExtractor={(item, index) => `record-${index}`}
        renderItem={({ item }) => (
          <View style={styles.recordItem}>
            <Text>{`Time: ${item.time}`}</Text>
            <Text>{`Reaction Time: ${item.reactionTime.toFixed(2)}s`}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recordItem: {
    marginBottom: 10,
  },
});

export default RecordsScreen;
