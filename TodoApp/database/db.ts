import * as SQLite from 'expo-sqlite';
import { Todo, TodoInsert, Priority, Category } from '../types/todo';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('todos.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER DEFAULT 0,
        priority TEXT DEFAULT 'medium',
        category TEXT DEFAULT 'general',
        due_date TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);
  }
  return db;
}

export async function getAllTodos(): Promise<Todo[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<any>(
    'SELECT * FROM todos ORDER BY completed ASC, CASE priority WHEN \'high\' THEN 0 WHEN \'medium\' THEN 1 WHEN \'low\' THEN 2 END, created_at DESC'
  );
  return rows.map(mapRowToTodo);
}

export async function getTodosByFilter(
  category?: Category,
  priority?: Priority
): Promise<Todo[]> {
  const database = await getDatabase();
  let query = 'SELECT * FROM todos WHERE 1=1';
  const params: any[] = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (priority) {
    query += ' AND priority = ?';
    params.push(priority);
  }

  query += ' ORDER BY completed ASC, CASE priority WHEN \'high\' THEN 0 WHEN \'medium\' THEN 1 WHEN \'low\' THEN 2 END, created_at DESC';

  const rows = await database.getAllAsync<any>(query, params);
  return rows.map(mapRowToTodo);
}

export async function insertTodo(todo: TodoInsert): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    'INSERT INTO todos (title, description, priority, category, due_date) VALUES (?, ?, ?, ?, ?)',
    [todo.title, todo.description ?? null, todo.priority, todo.category, todo.due_date ?? null]
  );
}

export async function updateTodo(
  id: number,
  updates: Partial<Omit<Todo, 'id' | 'created_at'>>
): Promise<void> {
  const database = await getDatabase();
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.title !== undefined) {
    fields.push('title = ?');
    values.push(updates.title);
  }
  if (updates.description !== undefined) {
    fields.push('description = ?');
    values.push(updates.description);
  }
  if (updates.completed !== undefined) {
    fields.push('completed = ?');
    values.push(updates.completed ? 1 : 0);
  }
  if (updates.priority !== undefined) {
    fields.push('priority = ?');
    values.push(updates.priority);
  }
  if (updates.category !== undefined) {
    fields.push('category = ?');
    values.push(updates.category);
  }
  if (updates.due_date !== undefined) {
    fields.push('due_date = ?');
    values.push(updates.due_date);
  }

  fields.push("updated_at = datetime('now')");
  values.push(id);

  await database.runAsync(
    `UPDATE todos SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
}

export async function deleteTodo(id: number): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM todos WHERE id = ?', [id]);
}

export async function toggleTodoCompleted(id: number, completed: boolean): Promise<void> {
  await updateTodo(id, { completed });
}

function mapRowToTodo(row: any): Todo {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    completed: row.completed === 1,
    priority: row.priority as Priority,
    category: row.category as Category,
    due_date: row.due_date,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
