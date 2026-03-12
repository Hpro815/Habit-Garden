import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { FAB, Snackbar } from 'react-native-paper';
import { useRouter, useFocusEffect } from 'expo-router';
import { Todo, Category, Priority } from '../types/todo';
import { getAllTodos, getTodosByFilter, toggleTodoCompleted, deleteTodo } from '../database/db';
import TodoItem from '../components/TodoItem';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';

export default function HomeScreen() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null);
  const [snackbar, setSnackbar] = useState('');

  const loadTodos = useCallback(async () => {
    const data =
      selectedCategory || selectedPriority
        ? await getTodosByFilter(selectedCategory ?? undefined, selectedPriority ?? undefined)
        : await getAllTodos();
    setTodos(data);
  }, [selectedCategory, selectedPriority]);

  useFocusEffect(
    useCallback(() => {
      loadTodos();
    }, [loadTodos])
  );

  const handleToggle = async (id: number, completed: boolean) => {
    await toggleTodoCompleted(id, completed);
    await loadTodos();
  };

  const handleEdit = (todo: Todo) => {
    router.push({
      pathname: '/add-edit',
      params: {
        id: todo.id.toString(),
        title: todo.title,
        description: todo.description ?? '',
        priority: todo.priority,
        category: todo.category,
        due_date: todo.due_date ?? '',
      },
    });
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete Todo', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTodo(id);
          await loadTodos();
          setSnackbar('Todo deleted');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FilterBar
        selectedCategory={selectedCategory}
        selectedPriority={selectedPriority}
        onCategoryChange={(cat) => setSelectedCategory(cat)}
        onPriorityChange={(pri) => setSelectedPriority(pri)}
      />
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={todos.length === 0 ? styles.emptyList : styles.list}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/add-edit')}
        color="#fff"
      />
      <Snackbar
        visible={!!snackbar}
        onDismiss={() => setSnackbar('')}
        duration={2000}
      >
        {snackbar}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    paddingBottom: 80,
  },
  emptyList: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6200ee',
  },
});
