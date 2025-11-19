"use server"; // Next.js directive: Server-only execution!

import { createClient } from "@libsql/client";
import { revalidatePath } from "next/cache"; // For post-mutation refresh—Next's magic!
import { Task, TaskStatus } from "./tasks";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Create table if not exists - like MySQL schema (async invocation)
await client.execute(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    dueDate TEXT
  )
`);

// Typed CRUD functions—now async for Turso's promise realm
export async function getAllTasks(): Promise<Task[]> {
  const res = await client.execute("SELECT * FROM tasks ORDER BY dueDate DESC");
  return res.rows.map((row) => ({
    id: Number(row[0]), // id (number/bigint-safe cast)
    title: row[1] as string,
    description: (row[2] ?? undefined) as string | undefined,
    status: row[3] as TaskStatus,
    dueDate: (row[4] ?? undefined) as string,
  }));
}

export async function addTaskAction(task: Omit<Task, "id">): Promise<number> {
  try {
    const res = await client.execute({
      sql: "INSERT INTO tasks (title, description, status, dueDate) VALUES (?, ?, ?, ?)",
      args: [
        task.title,
        task.description || null,
        task.status,
        task.dueDate || null,
      ],
    });
    revalidatePath("/"); // Or '/tasks' if routed—refreshes data on next fetch!
    return Number(res.lastInsertRowid!);
  } catch (error) {
    console.error("Add task error:", error);
    throw error; // Bubble for modal handling
  }
}

export async function updateTaskAction(
  id: number,
  task: Partial<Task>
): Promise<void> {
  const fields: string[] = [];
  const args = [];
  const currentRes = await client.execute({
    sql: "SELECT * FROM tasks WHERE id = ?",
    args: [id],
  });
  const currentTask = currentRes.rows[0] as unknown as
    | [number, string, string | null, string, string | null]
    | undefined;
  if (!currentTask) {
    throw new Error(`Task with id ${id} not found`);
  }
  const current = {
    id: Number(currentTask[0]),
    title: currentTask[1],
    description: currentTask[2] ?? undefined,
    status: currentTask[3] as TaskStatus,
    dueDate: currentTask[4] ?? undefined,
  };

  if (task.title !== undefined && task.title !== current.title) {
    fields.push("title = ?");
    args.push(task.title);
  }
  if (
    task.description !== undefined &&
    task.description !== current.description
  ) {
    fields.push("description = ?");
    args.push(task.description);
  }
  if (task.status !== undefined && task.status !== current.status) {
    fields.push("status = ?");
    args.push(task.status);
  }
  if (task.dueDate !== undefined && task.dueDate !== current.dueDate) {
    fields.push("dueDate = ?");
    args.push(task.dueDate);
  }
  if (fields.length === 0) return;

  await client.execute({
    sql: `UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`,
    args: [...args, id],
  });
  revalidatePath("/"); // Instant refresh post-update
}

export async function deleteTask(id: number): Promise<void> {
  await client.execute({
    sql: "DELETE FROM tasks WHERE id = ?",
    args: [id],
  });
  revalidatePath("/"); // Refresh after deletion
}

// Init: Ensure DB ready async
await getAllTasks(); // Triggers any lazy schema, fetches for peace

// Seed on load—async for Turso's grace
// async function seedMockData() {
//   const countRes = await client.execute("SELECT COUNT(*) as count FROM tasks");
//   const count = Number(countRes.rows[0][0]); // Safe number cast

//   if (count === 0) {
//     await addTask({
//       title: "Buy milk",
//       description: "Get whole milk from the store",
//       status: TaskStatus.PENDING,
//       dueDate: new Date("2025-11-15").toISOString(),
//     });
//     await addTask({
//       title: "Code review",
//       description: "Review pull request #42",
//       status: TaskStatus.IN_PROGRESS,
//       dueDate: new Date("2025-11-13").toISOString(),
//     });
//     await addTask({
//       title: "Deploy app",
//       description: "Push to Vercel",
//       status: TaskStatus.COMPLETED,
//       dueDate: new Date("2025-11-12").toISOString(),
//     });
//   }
// }

// Await the seed—top-level for module init
// await seedMockData();
