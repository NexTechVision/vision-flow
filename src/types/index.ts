
export type Role = 'Admin' | 'Manager' | 'Member' | 'Viewer' | string;

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export type Status = 'To Do' | 'In Progress' | 'Review' | 'Done' | string;

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  user: User;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assigneeId?: string;
  assignee?: User;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  comments: Comment[];
  attachments: Attachment[];
  tags: string[];
}

export interface Column {
  id: string;
  title: Status;
  taskIds: string[];
}

export interface Board {
  columns: {
    [key: string]: Column;
  };
  columnOrder: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  key: string;
  lead: User;
  createdAt: string;
  updatedAt: string;
  members: User[];
  board: Board;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  members: User[];
  createdAt: string;
  updatedAt: string;
  projects: string[];
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}
