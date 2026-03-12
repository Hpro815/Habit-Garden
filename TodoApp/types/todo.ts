export type Priority = 'low' | 'medium' | 'high';

export type Category = 'general' | 'work' | 'personal' | 'shopping' | 'health';

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority: Priority;
  category: Category;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export type TodoInsert = Omit<Todo, 'id' | 'created_at' | 'updated_at' | 'completed'>;
