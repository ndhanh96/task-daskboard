// src/lib/types.ts

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export interface Task {
  id: number; // Unique ID (auto-generated, e.g., via Date.now())
  title: string; // Short title
  description?: string; // Optional longer description
  status: TaskStatus; // Use enum for type safety
  dueDate: string; // Optional due date (can be string if serialized)
}
