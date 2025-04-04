
import httpClient from "../lib/http-client";
import { Team } from "../types";

export interface CreateTeamData {
  name: string;
  description?: string;
}

const teamRepository = {
  async getAll(): Promise<Team[]> {
    return httpClient.get<Team[]>('/teams');
  },

  async getById(id: string): Promise<Team> {
    return httpClient.get<Team>(`/teams/${id}`);
  },

  async create(teamData: CreateTeamData): Promise<Team> {
    return httpClient.post<Team>('/teams', teamData);
  },

  async update(id: string, teamData: Partial<CreateTeamData>): Promise<Team> {
    return httpClient.put<Team>(`/teams/${id}`, teamData);
  },

  async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`/teams/${id}`);
  },

  async addMember(teamId: string, userId: string): Promise<void> {
    return httpClient.post<void>(`/teams/${teamId}/members`, { userId });
  },

  async removeMember(teamId: string, userId: string): Promise<void> {
    return httpClient.delete<void>(`/teams/${teamId}/members/${userId}`);
  },

  async addProject(teamId: string, projectId: string): Promise<void> {
    return httpClient.post<void>(`/teams/${teamId}/projects`, { projectId });
  },

  async removeProject(teamId: string, projectId: string): Promise<void> {
    return httpClient.delete<void>(`/teams/${teamId}/projects/${projectId}`);
  }
};

export default teamRepository;
