
import httpClient from "../lib/http-client";
import { Project } from "../types";

export interface CreateProjectData {
  name: string;
  description: string;
  key: string;
  dueDate?: string;
}

const projectRepository = {
  async getAll(): Promise<Project[]> {
    return httpClient.get<Project[]>('/projects');
  },

  async getById(id: string): Promise<Project> {
    return httpClient.get<Project>(`/projects/${id}`);
  },

  async create(projectData: CreateProjectData): Promise<Project> {
    return httpClient.post<Project>('/projects', projectData);
  },

  async update(id: string, projectData: Partial<CreateProjectData>): Promise<Project> {
    return httpClient.put<Project>(`/projects/${id}`, projectData);
  },

  async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`/projects/${id}`);
  },

  async addMember(projectId: string, userId: string): Promise<void> {
    return httpClient.post<void>(`/projects/${projectId}/members`, { userId });
  },

  async removeMember(projectId: string, userId: string): Promise<void> {
    return httpClient.delete<void>(`/projects/${projectId}/members/${userId}`);
  },

  async updateBoard(projectId: string, boardData: any): Promise<Project> {
    return httpClient.put<Project>(`/projects/${projectId}/board`, boardData);
  }
};

export default projectRepository;
