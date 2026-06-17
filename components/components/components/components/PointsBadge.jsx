import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PointsBadge({ points }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>⭐ {points}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  text: {
    color: '#ffd700',
    fontWeight: 'bold',
    fontSize: 16,
  },
});