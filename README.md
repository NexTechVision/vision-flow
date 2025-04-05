
# VisionFlow - Project Management Application

## Project Overview

VisionFlow is a comprehensive project management application designed to help teams organize tasks, track progress, and collaborate effectively. The application features a modern React frontend with a RESTful Express.js backend and PostgreSQL database.

## Frontend Technologies

- **React** with TypeScript
- **Vite** for fast development and bundling
- **Tailwind CSS** for styling
- **Shadcn UI** for component library
- **React Router** for navigation
- **React Query** for data fetching
- **Recharts** for data visualization

## Backend Implementation Guide

### Tech Stack

- **Express.js** - Node.js web application framework
- **PostgreSQL** - Relational database
- **Prisma/Sequelize** - ORM for database management (recommended)
- **JWT** - For authentication
- **Bcrypt** - For password hashing
- **Multer** - For file uploads

### API Base URL Configuration

The frontend is configured to connect to an API with a base URL defined in environment variables:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

For production, set this to your deployed API URL.

### Authentication System

Authentication is handled via JWT tokens stored in localStorage.

- Token key: `visionflow_auth_token`
- Authentication header: `Bearer {token}`
- Login, register, and logout endpoints implemented
- Current user retrieval endpoint

## Database Schema

### Entity Relationship Diagram

```
+---------------+       +---------------+       +---------------+
|     Users     |       |    Projects   |       |     Tasks     |
+---------------+       +---------------+       +---------------+
| id            |<----->| id            |<----->| id            |
| name          |       | name          |       | title         |
| email         |       | description   |       | description   |
| password_hash |       | status        |       | status        |
| role          |       | priority      |       | priority      |
| avatar_url    |       | deadline      |       | deadline      |
| created_at    |       | created_at    |       | created_at    |
| updated_at    |       | updated_at    |       | updated_at    |
+---------------+       | owner_id (FK) |       | assignee_id(FK)|
                        +---------------+       | project_id(FK) |
                                                +---------------+
                                                
+---------------+       +---------------+       +---------------+
|     Teams     |       | Project_Team  |       | Team_Member   |
+---------------+       +---------------+       +---------------+
| id            |<----->| id            |       | id            |
| name          |       | project_id(FK)|<----->| team_id (FK)  |
| description   |       | team_id (FK)  |       | user_id (FK)  |
| created_at    |       | created_at    |       | role          |
| updated_at    |       | updated_at    |       | created_at    |
| leader_id (FK)|       +---------------+       | updated_at    |
+---------------+                               +---------------+

+---------------+       +---------------+       +---------------+
|    Comments   |       |  Attachments  |       |   Activities  |
+---------------+       +---------------+       +---------------+
| id            |       | id            |       | id            |
| content       |       | file_name     |       | action        |
| task_id (FK)  |       | file_url      |       | description   |
| user_id (FK)  |       | file_size     |       | entity_type   |
| created_at    |       | file_type     |       | entity_id     |
| updated_at    |       | task_id (FK)  |       | user_id (FK)  |
+---------------+       | created_at    |       | created_at    |
                        | updated_at    |       +---------------+
                        +---------------+
```

### Database Tables Detail

#### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'member',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Projects Table

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'planning',
  priority VARCHAR(50) NOT NULL DEFAULT 'medium',
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL
);
```

#### Tasks Table

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'todo',
  priority VARCHAR(50) NOT NULL DEFAULT 'medium',
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL
);
```

#### Teams Table

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  leader_id UUID REFERENCES users(id) ON DELETE SET NULL
);
```

#### Project_Team Junction Table

```sql
CREATE TABLE project_team (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, team_id)
);
```

#### Team_Member Junction Table

```sql
CREATE TABLE team_member (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, user_id)
);
```

#### Comments Table

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Attachments Table

```sql
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(100),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Activities Table (for audit log)

```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action VARCHAR(50) NOT NULL,
  description TEXT,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Authentication Endpoints

```
POST /api/auth/register - Register a new user
POST /api/auth/login - Login a user
POST /api/auth/logout - Logout a user
GET /api/auth/me - Get current user information
PUT /api/auth/profile - Update user profile
PUT /api/auth/password - Change user password
```

### User Endpoints

```
GET /api/users - Get all users
GET /api/users/:id - Get user by ID
PUT /api/users/:id - Update user
POST /api/users/:id/avatar - Upload user avatar
PATCH /api/users/:id/role - Change user role
```

### Project Endpoints

```
GET /api/projects - Get all projects
GET /api/projects/:id - Get project by ID
POST /api/projects - Create a new project
PUT /api/projects/:id - Update a project
DELETE /api/projects/:id - Delete a project
GET /api/projects/:id/tasks - Get tasks for a project
```

### Task Endpoints

```
GET /api/tasks - Get all tasks
GET /api/tasks/:id - Get task by ID
POST /api/tasks - Create a new task
PUT /api/tasks/:id - Update a task
DELETE /api/tasks/:id - Delete a task
PATCH /api/tasks/:id/status - Update task status
PATCH /api/tasks/:id/assignee - Assign task to user
GET /api/tasks/:id/comments - Get comments for a task
POST /api/tasks/:id/comments - Add comment to a task
```

### Team Endpoints

```
GET /api/teams - Get all teams
GET /api/teams/:id - Get team by ID
POST /api/teams - Create a new team
PUT /api/teams/:id - Update a team
DELETE /api/teams/:id - Delete a team
GET /api/teams/:id/members - Get team members
POST /api/teams/:id/members - Add member to team
DELETE /api/teams/:id/members/:userId - Remove member from team
```

### Report Endpoints

```
GET /api/reports/overview - Get dashboard overview stats
GET /api/reports/performance - Get performance metrics
GET /api/reports/tasks/by-status - Get tasks grouped by status
GET /api/reports/tasks/by-priority - Get tasks grouped by priority
GET /api/reports/users/workload - Get user workload report
```

## Middleware Requirements

1. **Authentication Middleware**
   - Verify JWT tokens
   - Add user to request object

2. **Error Handling Middleware**
   - Standardized error responses
   - Validation error handling

3. **Validation Middleware**
   - Request data validation using Joi/Yup

4. **File Upload Middleware**
   - Configure Multer for avatar uploads
   - Validate file types and sizes

## Data Relationships

1. **One-to-Many Relationships**
   - User -> Projects (as owner)
   - User -> Tasks (as assignee)
   - Project -> Tasks
   - Team -> Members (Users)
   - Task -> Comments
   - Task -> Attachments

2. **Many-to-Many Relationships**
   - Projects <-> Teams (through project_team)
   - Teams <-> Users (through team_member)

## Implementation Notes

### Authentication Flow

1. User registers/logs in
2. Server validates credentials
3. Server generates JWT token
4. Token is sent to client
5. Client stores token in localStorage
6. Client includes token in Authorization header for subsequent requests

### File Upload Implementation

For avatar uploads:
1. Use Multer for file handling
2. Store files in a dedicated directory or cloud storage (S3 recommended)
3. Store file URLs in the database
4. Update user's avatar_url field

### Data Validation

Implement validation for:
- User registration data
- Project creation/update data
- Task creation/update data
- Comments
- Upload file types and sizes

### Permission System

Implement role-based access control:
- Admin: full access to all resources
- Manager: can manage projects, teams, and tasks
- Member: can manage assigned tasks and view relevant projects

## Environment Variables

For backend:
```
PORT=8000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/visionflow
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=24h
CORS_ORIGIN=http://localhost:5173
```

## Deployment Considerations

1. **Database**
   - Use connection pooling
   - Set up database backups
   - Consider read replicas for scaling

2. **API**
   - Implement rate limiting
   - Add proper CORS configuration
   - Set up monitoring and logging

3. **Security**
   - Store sensitive data in environment variables
   - Implement proper input validation
   - Set secure HTTP headers
   - Use HTTPS in production

## Development Workflow

1. Set up Express.js project with TypeScript
2. Configure PostgreSQL database and ORM
3. Implement authentication system
4. Create database migrations for all tables
5. Implement API endpoints
6. Add validation and error handling
7. Connect with frontend

This documentation provides a comprehensive guide for implementing the VisionFlow backend using Express.js and PostgreSQL.
