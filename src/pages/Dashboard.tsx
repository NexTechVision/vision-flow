
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardStats from "../components/DashboardStats";
import { currentUser, tasks, projects } from "../data/mockData";
import TaskCard from "../components/TaskCard";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Activity, Clock, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    projectId: "",
    priority: "medium"
  });
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    key: ""
  });

  // Get current user's tasks
  const myTasks = tasks.filter(task => task.assigneeId === currentUser.id);
  const myRecentTasks = [...myTasks].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 5);
  
  const upcomingTasks = myTasks
    .filter(task => task.status !== 'Done' && task.dueDate)
    .sort((a, b) => new Date(a.dueDate || "").getTime() - new Date(b.dueDate || "").getTime())
    .slice(0, 5);

  const recentActivity = [...tasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const handleCreateTask = () => {
    if (!newTask.title.trim() || !newTask.projectId) {
      toast({
        title: "Missing information",
        description: "Task title and project are required",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would be an API call to create a task
    toast({
      title: "Task created",
      description: `"${newTask.title}" has been added successfully`
    });
    
    // Reset form and close dialog
    setNewTask({
      title: "",
      description: "",
      projectId: "",
      priority: "medium"
    });
    setIsNewTaskDialogOpen(false);
  };

  const handleCreateProject = () => {
    if (!newProject.name.trim() || !newProject.key.trim()) {
      toast({
        title: "Missing information",
        description: "Project name and key are required",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would be an API call to create a project
    toast({
      title: "Project created",
      description: `"${newProject.name}" has been created successfully`
    });
    
    // Reset form and close dialog
    setNewProject({
      name: "",
      description: "",
      key: ""
    });
    setIsNewProjectDialogOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | NexTechVision</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {currentUser.name}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsNewProjectDialogOpen(true)}
            >
              New Project
            </Button>
            <Button onClick={() => setIsNewTaskDialogOpen(true)}>New Task</Button>
          </div>
        </div>

        <DashboardStats />

        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>
                    Your recent projects and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.slice(0, 3).map(project => {
                      const projectTasks = tasks.filter(t => t.projectId === project.id);
                      const completedTasks = projectTasks.filter(t => t.status === 'Done').length;
                      const progress = projectTasks.length ? Math.round((completedTasks / projectTasks.length) * 100) : 0;
                      
                      return (
                        <div key={project.id} className="flex items-center space-x-4">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium leading-none cursor-pointer hover:text-primary"
                                 onClick={() => navigate(`/projects/${project.id}`)}>
                                {project.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {progress}%
                              </p>
                            </div>
                            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full" 
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Upcoming Tasks
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingTasks.length > 0 ? (
                      upcomingTasks.map(task => (
                        <div 
                          key={task.id} 
                          className="flex items-center cursor-pointer hover:bg-muted p-2 rounded-md"
                          onClick={() => navigate(`/tasks/${task.id}`)}
                        >
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium leading-none">{task.title}</p>
                              {task.dueDate && (
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(task.dueDate), "MMM d")}
                                </p>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {task.status}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No upcoming tasks</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="my-tasks" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRecentTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              {myRecentTasks.length === 0 && (
                <div className="col-span-2 text-center py-10">
                  <p className="text-muted-foreground">No tasks assigned to you</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setIsNewTaskDialogOpen(true)}
                  >
                    Create a new task
                  </Button>
                </div>
              )}
            </div>
            {myRecentTasks.length > 0 && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => navigate("/my-tasks")}
                >
                  View all tasks
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Recent changes across all projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentActivity.map((task, i) => {
                    const project = projects.find(p => p.id === task.projectId);
                    return (
                      <div key={task.id} className="flex">
                        <div className="relative mr-4">
                          <div className="absolute top-0 bottom-0 left-2.5 w-px bg-muted" />
                          <div className="relative bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center">
                            <Activity className="h-3 w-3" />
                          </div>
                        </div>
                        <div className="space-y-1 flex-1">
                          <p className="text-sm font-medium">
                            Task "{task.title}" was updated
                          </p>
                          <p className="text-xs text-muted-foreground">
                            in {project?.name} • {format(new Date(task.updatedAt), "MMM d, h:mm a")}
                          </p>
                          <p className="text-xs">
                            Status: <span className="font-medium">{task.status}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="taskTitle">Title</Label>
              <Input 
                id="taskTitle" 
                placeholder="Task title" 
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="taskDescription">Description</Label>
              <Textarea 
                id="taskDescription" 
                placeholder="Task description" 
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="taskProject">Project</Label>
                <Select 
                  value={newTask.projectId} 
                  onValueChange={(value) => setNewTask({...newTask, projectId: value})}
                >
                  <SelectTrigger id="taskProject">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="taskPriority">Priority</Label>
                <Select 
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({...newTask, priority: value})}
                >
                  <SelectTrigger id="taskPriority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTaskDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTask}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3">
                <Label htmlFor="projectName">Project Name</Label>
                <Input 
                  id="projectName" 
                  placeholder="Project name" 
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="projectKey">Key</Label>
                <Input 
                  id="projectKey" 
                  placeholder="KEY" 
                  value={newProject.key}
                  onChange={(e) => setNewProject({...newProject, key: e.target.value.toUpperCase()})}
                  maxLength={5}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="projectDescription">Description</Label>
              <Textarea 
                id="projectDescription" 
                placeholder="Project description" 
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewProjectDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProject}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dashboard;
