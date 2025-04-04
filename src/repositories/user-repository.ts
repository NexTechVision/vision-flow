
import httpClient from "../lib/http-client";
import { User } from "../types";

const userRepository = {
  async getAll(): Promise<User[]> {
    return httpClient.get<User[]>('/users');
  },

  async getById(id: string): Promise<User> {
    return httpClient.get<User>(`/users/${id}`);
  },

  async update(id: string, userData: Partial<User>): Promise<User> {
    return httpClient.put<User>(`/users/${id}`, userData);
  },

  async updateAvatar(id: string, formData: FormData): Promise<User> {
    // Special handling for file upload
    const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/users/${id}/avatar`;
    const token = localStorage.getItem('visionflow_auth_token');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload avatar');
    }

    return response.json();
  },

  async changeRole(id: string, role: string): Promise<User> {
    return httpClient.patch<User>(`/users/${id}/role`, { role });
  }
};

export default userRepository;
