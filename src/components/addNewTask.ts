// 'use server';
import { Task } from "@/lib/tasks";
import axios from "axios";

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
    const res = await axios.post("/api/tasks", payload);
    return res;
  } catch (error) {
    throw error;
  }
};
