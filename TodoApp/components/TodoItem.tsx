import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Card, Text, Checkbox, IconButton, Chip } from 'react-native-paper';
import { Todo } from '../types/todo';
import { getPriorityColor, getCategoryIcon } from '../constants/categories';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const priorityColor = getPriorityColor(todo.priority);
  const categoryIcon = getCategoryIcon(todo.category);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = todo.due_date && !todo.completed && new Date(todo.due_date) < new Date();

  return (
    <Card style={[styles.card, todo.completed && styles.completedCard]} mode="elevated">
      <View style={styles.container}>
        <View style={[styles.priorityBar, { backgroundColor: priorityColor }]} />
        <Pressable
          style={styles.checkboxContainer}
          onPress={() => onToggle(todo.id, !todo.completed)}
        >
          <Checkbox
            status={todo.completed ? 'checked' : 'unchecked'}
            onPress={() => onToggle(todo.id, !todo.completed)}
            color="#6200ee"
          />
        </Pressable>
        <Pressable style={styles.content} onPress={() => onEdit(todo)}>
          <Text
            variant="titleMedium"
            style={[styles.title, todo.completed && styles.completedText]}
            numberOfLines={1}
          >
            {todo.title}
          </Text>
          {todo.description ? (
            <Text
              variant="bodySmall"
              style={[styles.description, todo.completed && styles.completedText]}
              numberOfLines={2}
            >
              {todo.description}
            </Text>
          ) : null}
          <View style={styles.metaRow}>
            <Chip icon={categoryIcon} compact style={styles.chip} textStyle={styles.chipText}>
              {todo.category}
            </Chip>
            <Chip
              compact
              style={[styles.chip, { backgroundColor: priorityColor + '20' }]}
              textStyle={[styles.chipText, { color: priorityColor }]}
            >
              {todo.priority}
            </Chip>
            {todo.due_date ? (
              <Chip
                icon="calendar"
                compact
                style={[styles.chip, isOverdue && styles.overdueChip]}
                textStyle={[styles.chipText, isOverdue && styles.overdueText]}
              >
                {formatDate(todo.due_date)}
              </Chip>
            ) : null}
          </View>
        </Pressable>
        <IconButton
          icon="delete-outline"
          size={20}
          onPress={() => onDelete(todo.id)}
          iconColor="#999"
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 4,
    overflow: 'hidden',
  },
  completedCard: {
    opacity: 0.6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  checkboxContainer: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingVertical: 8,
    paddingRight: 4,
  },
  title: {
    fontWeight: '600',
  },
  description: {
    color: '#666',
    marginTop: 2,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 4,
    flexWrap: 'wrap',
  },
  chip: {
    height: 24,
  },
  chipText: {
    fontSize: 10,
    marginVertical: 0,
  },
  overdueChip: {
    backgroundColor: '#FFEBEE',
  },
  overdueText: {
    color: '#F44336',
  },
});
