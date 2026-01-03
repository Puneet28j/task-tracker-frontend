import axios from "axios";
import { type Task } from "../types/task";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const fetchTasks = (params?: {
  status?: string;
  priority?: string;
  sort?: "asc" | "desc";
}) => api.get<Task[]>("/tasks", { params });
export const createTask = (data: Partial<Task>) =>
  api.post<Task>("/tasks", data);
export const updateStatus = (id: string, status: Task["status"]) =>
  api.put<Task>(`/tasks/${id}`, { status });
export const deleteTask = (id: string) => api.delete(`/tasks/${id}`);
