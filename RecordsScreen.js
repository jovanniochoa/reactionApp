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
            <Text style={styles.recordText}>{`Time: ${item.time}`}</Text>
            <Text style={styles.recordText}>{`Reaction Time: ${item.reactionTime.toFixed(2)}s`}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#282c34',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  recordItem: {
    marginBottom: 10,
  },
  recordText: {
    color: 'white',
  },
  divider: {
    height: 1, // Set the height of the divider line
    backgroundColor: 'gray', // Set the color of the divider line to white
  },
});

export default RecordsScreen;
