
import { Project, Task, User, Team, Notification } from '../types';

export const currentUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://i.pravatar.cc/150?img=68',
  role: 'Admin',
};

export const users: User[] = [
  currentUser,
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://i.pravatar.cc/150?img=49',
    role: 'Manager',
  },
  {
    id: 'user-3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    avatar: 'https://i.pravatar.cc/150?img=59',
    role: 'Member',
  },
  {
    id: 'user-4',
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: 'Member',
  },
  {
    id: 'user-5',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    avatar: 'https://i.pravatar.cc/150?img=12',
    role: 'Viewer',
  },
];

export const tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Create dashboard layout',
    description: 'Design and implement the main dashboard layout with all necessary components.',
    status: 'To Do',
    priority: 'High',
    assigneeId: 'user-1',
    assignee: users[0],
    dueDate: '2025-04-15',
    createdAt: '2025-04-01',
    updatedAt: '2025-04-01',
    projectId: 'project-1',
    comments: [
      {
        id: 'comment-1',
        content: 'Let\'s make sure to include all KPIs from the requirements.',
        userId: 'user-2',
        user: users[1],
        createdAt: '2025-04-01T10:30:00Z',
      },
    ],
    attachments: [
      {
        id: 'attachment-1',
        name: 'dashboard-wireframe.png',
        url: '#',
        type: 'image/png',
        size: 1240000,
        uploadedBy: 'user-2',
        uploadedAt: '2025-04-01T10:35:00Z',
      },
    ],
    tags: ['Design', 'Frontend'],
  },
  {
    id: 'task-2',
    title: 'Implement authentication',
    description: 'Set up user authentication including login, registration, and password recovery.',
    status: 'In Progress',
    priority: 'Critical',
    assigneeId: 'user-3',
    assignee: users[2],
    dueDate: '2025-04-10',
    createdAt: '2025-03-28',
    updatedAt: '2025-04-02',
    projectId: 'project-1',
    comments: [],
    attachments: [],
    tags: ['Backend', 'Security'],
  },
  {
    id: 'task-3',
    title: 'Create Kanban board component',
    description: 'Implement the drag-and-drop Kanban board for task management.',
    status: 'Done',
    priority: 'High',
    assigneeId: 'user-1',
    assignee: users[0],
    dueDate: '2025-04-05',
    createdAt: '2025-03-25',
    updatedAt: '2025-04-05',
    projectId: 'project-1',
    comments: [
      {
        id: 'comment-2',
        content: 'This looks great, nice work!',
        userId: 'user-2',
        user: users[1],
        createdAt: '2025-04-05T16:30:00Z',
      },
    ],
    attachments: [],
    tags: ['Frontend', 'UX'],
  },
  {
    id: 'task-4',
    title: 'User role management',
    description: 'Implement the role management system with proper access controls.',
    status: 'Review',
    priority: 'Medium',
    assigneeId: 'user-3',
    assignee: users[2],
    dueDate: '2025-04-12',
    createdAt: '2025-03-30',
    updatedAt: '2025-04-06',
    projectId: 'project-1',
    comments: [],
    attachments: [],
    tags: ['Backend', 'Security'],
  },
  {
    id: 'task-5',
    title: 'Task detail page',
    description: 'Create the task detail page with all required fields and functionality.',
    status: 'To Do',
    priority: 'Medium',
    assigneeId: 'user-4',
    assignee: users[3],
    dueDate: '2025-04-18',
    createdAt: '2025-04-02',
    updatedAt: '2025-04-02',
    projectId: 'project-1',
    comments: [],
    attachments: [],
    tags: ['Frontend'],
  },
  {
    id: 'task-6',
    title: 'Export functionality',
    description: 'Implement export options for task lists in various formats (CSV, PDF, XLSX).',
    status: 'To Do',
    priority: 'Low',
    assigneeId: 'user-1',
    assignee: users[0],
    dueDate: '2025-04-25',
    createdAt: '2025-04-03',
    updatedAt: '2025-04-03',
    projectId: 'project-1',
    comments: [],
    attachments: [],
    tags: ['Backend', 'Feature'],
  },
  {
    id: 'task-7',
    title: 'Mobile responsive design',
    description: 'Ensure all components are responsive on mobile devices.',
    status: 'In Progress',
    priority: 'High',
    assigneeId: 'user-4',
    assignee: users[3],
    dueDate: '2025-04-15',
    createdAt: '2025-04-01',
    updatedAt: '2025-04-04',
    projectId: 'project-1',
    comments: [],
    attachments: [],
    tags: ['Frontend', 'UX'],
  },
  {
    id: 'task-8',
    title: 'API integration',
    description: 'Connect frontend with backend APIs for data management.',
    status: 'To Do',
    priority: 'High',
    assigneeId: 'user-3',
    assignee: users[2],
    dueDate: '2025-04-20',
    createdAt: '2025-04-03',
    updatedAt: '2025-04-03',
    projectId: 'project-1',
    comments: [],
    attachments: [],
    tags: ['Backend', 'Integration'],
  },
];

export const projects: Project[] = [
  {
    id: 'project-1',
    name: 'NexTechVision Development',
    description: 'Development of the NexTechVision application.',
    key: 'NTV',
    lead: users[0],
    createdAt: '2025-03-15',
    updatedAt: '2025-04-01',
    members: users,
    board: {
      columns: {
        'column-1': {
          id: 'column-1',
          title: 'To Do',
          taskIds: tasks.filter(task => task.status === 'To Do').map(task => task.id),
        },
        'column-2': {
          id: 'column-2',
          title: 'In Progress',
          taskIds: tasks.filter(task => task.status === 'In Progress').map(task => task.id),
        },
        'column-3': {
          id: 'column-3',
          title: 'Review',
          taskIds: tasks.filter(task => task.status === 'Review').map(task => task.id),
        },
        'column-4': {
          id: 'column-4',
          title: 'Done',
          taskIds: tasks.filter(task => task.status === 'Done').map(task => task.id),
        },
      },
      columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
    },
  },
  {
    id: 'project-2',
    name: 'Marketing Campaign',
    description: 'Q2 2025 Marketing Campaign Planning and Execution',
    key: 'MC',
    lead: users[1],
    createdAt: '2025-03-20',
    updatedAt: '2025-03-25',
    members: [users[0], users[1], users[4]],
    board: {
      columns: {
        'column-1': {
          id: 'column-1',
          title: 'To Do',
          taskIds: [],
        },
        'column-2': {
          id: 'column-2',
          title: 'In Progress',
          taskIds: [],
        },
        'column-3': {
          id: 'column-3',
          title: 'Review',
          taskIds: [],
        },
        'column-4': {
          id: 'column-4',
          title: 'Done',
          taskIds: [],
        },
      },
      columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
    },
  },
];

export const teams: Team[] = [
  {
    id: 'team-1',
    name: 'Development Team',
    description: 'Main development team for all projects',
    members: [users[0], users[2], users[3]],
    createdAt: '2025-03-10',
    updatedAt: '2025-03-15',
    projects: ['project-1'],
  },
  {
    id: 'team-2',
    name: 'Marketing Team',
    description: 'Marketing strategy and content creation',
    members: [users[1], users[4]],
    createdAt: '2025-03-12',
    updatedAt: '2025-03-18',
    projects: ['project-2'],
  },
];

export const notifications: Notification[] = [
  {
    id: 'notification-1',
    title: 'Task Assigned',
    description: 'You have been assigned to the task "Create dashboard layout"',
    type: 'info',
    read: false,
    createdAt: '2025-04-01T09:30:00Z',
    link: '/tasks/task-1',
  },
  {
    id: 'notification-2',
    title: 'Task Completed',
    description: 'Task "Create Kanban board component" has been marked as completed',
    type: 'success',
    read: true,
    createdAt: '2025-04-05T16:35:00Z',
    link: '/tasks/task-3',
  },
  {
    id: 'notification-3',
    title: 'New Comment',
    description: 'Jane Smith commented on "Create dashboard layout"',
    type: 'info',
    read: false,
    createdAt: '2025-04-01T10:32:00Z',
    link: '/tasks/task-1',
  },
  {
    id: 'notification-4',
    title: 'Upcoming Due Date',
    description: 'Task "Implement authentication" is due tomorrow',
    type: 'warning',
    read: false,
    createdAt: '2025-04-09T08:00:00Z',
    link: '/tasks/task-2',
  },
];

export const getTaskById = (id: string): Task | undefined => {
  return tasks.find(task => task.id === id);
};

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const getTasksByProjectId = (projectId: string): Task[] => {
  return tasks.filter(task => task.projectId === projectId);
};

export const getTasksByAssignee = (userId: string): Task[] => {
  return tasks.filter(task => task.assigneeId === userId);
};
