
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

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
              onClick={() => navigate("/projects/new")}
            >
              New Project
            </Button>
            <Button onClick={() => navigate("/tasks/new")}>New Task</Button>
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
                    onClick={() => navigate("/tasks/new")}
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
    </>
  );
};

export default Dashboard;
