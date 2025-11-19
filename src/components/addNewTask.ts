// 'use server';
import { addTaskAction } from "@/lib/db";
import { Task } from "@/lib/tasks";

type NewTaskFormValues = Omit<Task, "id">;

export const addNewTask = async ({
  title,
  description,
  status,
  dueDate,
}: NewTaskFormValues) => {
  const payload = {
    title,
    description,
    status,
    dueDate,
  };

  try {
    await addTaskAction({
      ...payload,
      dueDate: payload.dueDate
        ? new Date(payload.dueDate).toISOString()
        : new Date().toISOString(),
    });
  } catch (errorInfo) {
    console.log("Validation failed:", errorInfo);
  }
};
