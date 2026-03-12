import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Icon } from 'react-native-paper';

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <Icon source="clipboard-check-outline" size={80} color="#ccc" />
      <Text variant="headlineSmall" style={styles.title}>
        No todos yet
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Tap the + button to add your first task
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  title: {
    marginTop: 16,
    color: '#999',
  },
  subtitle: {
    marginTop: 8,
    color: '#bbb',
    textAlign: 'center',
  },
});
