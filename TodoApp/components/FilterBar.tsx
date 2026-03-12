import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { CATEGORIES, PRIORITIES } from '../constants/categories';
import { Category, Priority } from '../types/todo';

interface FilterBarProps {
  selectedCategory: Category | null;
  selectedPriority: Priority | null;
  onCategoryChange: (category: Category | null) => void;
  onPriorityChange: (priority: Priority | null) => void;
}

export default function FilterBar({
  selectedCategory,
  selectedPriority,
  onCategoryChange,
  onPriorityChange,
}: FilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Chip
        selected={selectedCategory === null}
        onPress={() => onCategoryChange(null)}
        style={styles.chip}
        compact
      >
        All
      </Chip>
      {CATEGORIES.map((cat) => (
        <Chip
          key={cat.value}
          icon={cat.icon}
          selected={selectedCategory === cat.value}
          onPress={() =>
            onCategoryChange(selectedCategory === cat.value ? null : cat.value)
          }
          style={styles.chip}
          compact
        >
          {cat.label}
        </Chip>
      ))}
      <Chip style={[styles.chip, styles.separator]} disabled>|</Chip>
      {PRIORITIES.map((pri) => (
        <Chip
          key={pri.value}
          selected={selectedPriority === pri.value}
          onPress={() =>
            onPriorityChange(selectedPriority === pri.value ? null : pri.value)
          }
          style={styles.chip}
          selectedColor={pri.color}
          compact
        >
          {pri.label}
        </Chip>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  chip: {
    marginRight: 2,
  },
  separator: {
    backgroundColor: 'transparent',
    opacity: 0.3,
  },
});
