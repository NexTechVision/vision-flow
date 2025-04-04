
import httpClient from "../lib/http-client";
import { Task } from "../types";

export interface CreateTaskData {
  title: string;
  description: string;
  status: string;
  priority: string;
  projectId: string;
  assigneeId?: string;
  dueDate?: string;
  tags?: string[];
}

const taskRepository = {
  async getAll(filters?: { projectId?: string; assigneeId?: string; status?: string }): Promise<Task[]> {
    return httpClient.get<Task[]>('/tasks', { params: filters as Record<string, string> });
  },

  async getById(id: string): Promise<Task> {
    return httpClient.get<Task>(`/tasks/${id}`);
  },

  async create(taskData: CreateTaskData): Promise<Task> {
    return httpClient.post<Task>('/tasks', taskData);
  },

  async update(id: string, taskData: Partial<CreateTaskData>): Promise<Task> {
    return httpClient.put<Task>(`/tasks/${id}`, taskData);
  },

  async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`/tasks/${id}`);
  },

  async updateStatus(id: string, status: string): Promise<Task> {
    return httpClient.patch<Task>(`/tasks/${id}/status`, { status });
  },

  async addComment(taskId: string, content: string): Promise<Task> {
    return httpClient.post<Task>(`/tasks/${taskId}/comments`, { content });
  },

  async addAttachment(taskId: string, formData: FormData): Promise<Task> {
    // Use a different approach for file uploads with FormData
    const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/tasks/${taskId}/attachments`;
    const token = localStorage.getItem('visionflow_auth_token');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload attachment');
    }

    return response.json();
  }
};

export default taskRepository;
