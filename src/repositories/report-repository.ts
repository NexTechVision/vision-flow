
import httpClient from "../lib/http-client";

export interface TaskStatusReport {
  name: string;
  value: number;
}

export interface TaskPriorityReport {
  name: string;
  value: number;
}

export interface ProjectProgressReport {
  name: string;
  progress: number;
  tasks: number;
}

export interface TaskCompletionTrendReport {
  name: string;
  completed: number;
}

export interface ReportData {
  tasksByStatus: TaskStatusReport[];
  tasksByPriority: TaskPriorityReport[];
  projectProgress: ProjectProgressReport[];
  taskCompletionTrend: TaskCompletionTrendReport[];
}

const reportRepository = {
  async getReportData(): Promise<ReportData> {
    return httpClient.get<ReportData>('/reports/dashboard');
  },
  
  async getTasksByStatus(): Promise<TaskStatusReport[]> {
    return httpClient.get<TaskStatusReport[]>('/reports/tasks-by-status');
  },
  
  async getTasksByPriority(): Promise<TaskPriorityReport[]> {
    return httpClient.get<TaskPriorityReport[]>('/reports/tasks-by-priority');
  },
  
  async getProjectProgress(): Promise<ProjectProgressReport[]> {
    return httpClient.get<ProjectProgressReport[]>('/reports/project-progress');
  },
  
  async getTaskCompletionTrend(timeframe: string = 'month'): Promise<TaskCompletionTrendReport[]> {
    return httpClient.get<TaskCompletionTrendReport[]>('/reports/task-completion-trend', {
      params: { timeframe }
    });
  }
};

export default reportRepository;
