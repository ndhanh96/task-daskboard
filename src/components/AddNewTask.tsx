// 'use server';
import { TaskStatus } from "@/lib/tasks";
import axios from "axios";

interface NewTaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
}

export const addNewTask = async ({
  title,
  description,
  status,
}: NewTaskFormValues) => {
  const payload = {
    title,
    description,
    status,
    dueDate: new Date().toISOString(),
  };
  try {
    const res = await axios.post("/api/tasks", payload);
    return res;
  } catch (error) {
    throw error;
  }
};
