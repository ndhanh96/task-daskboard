// src/lib/db.ts
import { Database } from "bun:sqlite"; // Bun's native elixir—faster, no native module woes!
import { Task, TaskStatus } from "./tasks";

const db = new Database("tasks.db", {
  create: true,
  strict: true,
  safeIntegers: true,
}); // Create if absent, strict params, safe bigints
db.run("PRAGMA journal_mode = WAL;"); // WAL for concurrency supremacy

// Create table if not exists - like MySQL schema
db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    dueDate TEXT
  )
`);

// Typed CRUD functions
export function getAllTasks(): Task[] {
  const stmt = db.query("SELECT * FROM tasks ORDER BY dueDate DESC"); // query for caching bliss
  const rows = stmt.all() as Task[];
  return rows.map((row) => ({
    id: Number(row.id),
    title: row.title as string,
    description: row.description as string | undefined,
    status: row.status as TaskStatus,
    dueDate: row.dueDate as string,
  }));
}

export function addTask(task: Omit<Task, "id">): number {
  const stmt = db.query(
    "INSERT INTO tasks (title, description, status, dueDate) VALUES (?, ?, ?, ?)"
  ); // query caches for repeated inserts
  const info = stmt.run(
    task.title,
    task.description || null,
    task.status,
    task.dueDate ? task.dueDate : null
  );
  return Number(info.lastInsertRowid); // Cast to number—safe with your schema
}

export function updateTask(id: number, task: Partial<Task>): void {
  const fields = [];
  const values = [];
  const currentTaskStmt = db.query("SELECT * FROM tasks WHERE id = ?"); // Cached for frequent edits
  const currentTask = currentTaskStmt.get(id) as Task | undefined;
  if (!currentTask) {
    throw new Error(`Task with id ${id} not found`);
  }
  if (task.title !== undefined && task.title !== currentTask.title) {
    fields.push("title = ?");
    values.push(task.title);
  }
  if (
    task.description !== undefined &&
    task.description !== currentTask.description
  ) {
    fields.push("description = ?");
    values.push(task.description);
  }
  if (task.status !== undefined && task.status !== currentTask.status) {
    fields.push("status = ?");
    values.push(task.status);
  }
  if (task.dueDate !== undefined && task.dueDate !== currentTask.dueDate) {
    fields.push("dueDate = ?");
    values.push(task.dueDate ? task.dueDate : null);
  }
  if (fields.length === 0) return;

  const stmt = db.query(`UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`); // Dynamic, but Bun handles it swiftly
  stmt.run(...values, id);
}

export function deleteTask(id: number): void {
  const stmt = db.query("DELETE FROM tasks WHERE id = ?"); // Cached deletions
  stmt.run(id);
}

// Init: Call once to ensure DB ready
getAllTasks(); // Triggers create if needed

// Add to bottom of src/lib/db.ts

function seedMockData() {
  const countStmt = db.query("SELECT COUNT(*) as count FROM tasks"); // Cached count
  const { count } = countStmt.get() as { count: number };

  if (count === 0) {
    addTask({
      title: "Buy milk",
      description: "Get whole milk from the store",
      status: TaskStatus.PENDING,
      dueDate: new Date("2025-11-15").toISOString(),
    });
    addTask({
      title: "Code review",
      description: "Review pull request #42",
      status: TaskStatus.IN_PROGRESS,
      dueDate: new Date("2025-11-13").toISOString(),
    });
    addTask({
      title: "Deploy app",
      description: "Push to Vercel",
      status: TaskStatus.COMPLETED,
      dueDate: new Date("2025-11-12").toISOString(),
    });
  }
}

// Seed on load
seedMockData();
