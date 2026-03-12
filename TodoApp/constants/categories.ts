import { Category, Priority } from '../types/todo';

export const CATEGORIES: { label: string; value: Category; icon: string }[] = [
  { label: 'General', value: 'general', icon: 'folder' },
  { label: 'Work', value: 'work', icon: 'briefcase' },
  { label: 'Personal', value: 'personal', icon: 'account' },
  { label: 'Shopping', value: 'shopping', icon: 'cart' },
  { label: 'Health', value: 'health', icon: 'heart' },
];

export const PRIORITIES: { label: string; value: Priority; color: string }[] = [
  { label: 'Low', value: 'low', color: '#4CAF50' },
  { label: 'Medium', value: 'medium', color: '#FF9800' },
  { label: 'High', value: 'high', color: '#F44336' },
];

export function getPriorityColor(priority: Priority): string {
  return PRIORITIES.find((p) => p.value === priority)?.color ?? '#FF9800';
}

export function getCategoryIcon(category: Category): string {
  return CATEGORIES.find((c) => c.value === category)?.icon ?? 'folder';
}
