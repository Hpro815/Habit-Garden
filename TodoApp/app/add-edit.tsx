import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import {
  TextInput,
  Button,
  SegmentedButtons,
  Text,
  Chip,
} from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { insertTodo, updateTodo } from '../database/db';
import { CATEGORIES, PRIORITIES } from '../constants/categories';
import { Category, Priority } from '../types/todo';

export default function AddEditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    description?: string;
    priority?: string;
    category?: string;
    due_date?: string;
  }>();

  const isEditing = !!params.id;

  const [title, setTitle] = useState(params.title ?? '');
  const [description, setDescription] = useState(params.description ?? '');
  const [priority, setPriority] = useState<Priority>((params.priority as Priority) ?? 'medium');
  const [category, setCategory] = useState<Category>((params.category as Category) ?? 'general');
  const [dueDate, setDueDate] = useState<Date | null>(
    params.due_date ? new Date(params.due_date) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;

    setSaving(true);
    try {
      if (isEditing) {
        await updateTodo(Number(params.id), {
          title: title.trim(),
          description: description.trim() || null,
          priority,
          category,
          due_date: dueDate ? dueDate.toISOString().split('T')[0] : null,
        });
      } else {
        await insertTodo({
          title: title.trim(),
          description: description.trim() || null,
          priority,
          category,
          due_date: dueDate ? dueDate.toISOString().split('T')[0] : null,
        });
      }
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const onDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput
        label="Title *"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
        autoFocus={!isEditing}
      />

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <Text variant="labelLarge" style={styles.label}>
        Priority
      </Text>
      <SegmentedButtons
        value={priority}
        onValueChange={(value) => setPriority(value as Priority)}
        buttons={PRIORITIES.map((p) => ({
          value: p.value,
          label: p.label,
          checkedColor: p.color,
        }))}
        style={styles.segmented}
      />

      <Text variant="labelLarge" style={styles.label}>
        Category
      </Text>
      <View style={styles.categoryRow}>
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat.value}
            icon={cat.icon}
            selected={category === cat.value}
            onPress={() => setCategory(cat.value)}
            style={styles.categoryChip}
          >
            {cat.label}
          </Chip>
        ))}
      </View>

      <Text variant="labelLarge" style={styles.label}>
        Due Date
      </Text>
      <View style={styles.dateRow}>
        <Button
          mode="outlined"
          icon="calendar"
          onPress={() => setShowDatePicker(true)}
          style={styles.dateButton}
        >
          {dueDate
            ? dueDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'Select date'}
        </Button>
        {dueDate && (
          <Button mode="text" onPress={() => setDueDate(null)} textColor="#999">
            Clear
          </Button>
        )}
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate ?? new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      <Button
        mode="contained"
        onPress={handleSave}
        loading={saving}
        disabled={!title.trim() || saving}
        style={styles.saveButton}
        contentStyle={styles.saveButtonContent}
      >
        {isEditing ? 'Update Todo' : 'Add Todo'}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    color: '#666',
  },
  segmented: {
    marginBottom: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryChip: {
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dateButton: {
    flex: 1,
  },
  saveButton: {
    marginTop: 8,
    backgroundColor: '#6200ee',
  },
  saveButtonContent: {
    paddingVertical: 6,
  },
});
