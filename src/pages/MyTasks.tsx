
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currentUser, tasks, projects } from "../data/mockData";
import TaskCard from "../components/TaskCard";
import { Filter, Search, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "../components/Layout";
import { Status } from "../types";

const MyTasks = () => {
  const [filterStatus, setFilterStatus] = useState<Status | "All">("All");
  const [filterPriority, setFilterPriority] = useState<string>("All");
  const [filterProject, setFilterProject] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Get current user's tasks
  const myTasks = tasks.filter(task => task.assigneeId === currentUser.id);

  const filteredTasks = myTasks.filter(task => {
    // Apply status filter
    if (filterStatus !== "All" && task.status !== filterStatus) return false;
    
    // Apply priority filter
    if (filterPriority !== "All" && task.priority !== filterPriority) return false;
    
    // Apply project filter
    if (filterProject !== "All" && task.projectId !== filterProject) return false;
    
    // Apply search
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchTermLower) ||
        task.description.toLowerCase().includes(searchTermLower) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
      );
    }
    
    return true;
  });

  const statusCounts = {
    "To Do": myTasks.filter(t => t.status === "To Do").length,
    "In Progress": myTasks.filter(t => t.status === "In Progress").length,
    "Review": myTasks.filter(t => t.status === "Review").length,
    "Done": myTasks.filter(t => t.status === "Done").length,
  };

  return (
    <Layout>
      <Helmet>
        <title>My Tasks | NexTechVision</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
            <p className="text-muted-foreground">
              Manage and track your assigned tasks
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">All Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myTasks.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts["In Progress"]}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts["Review"]}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts["Done"]}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-full md:w-64">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="w-full md:w-auto">
              <Select value={filterStatus} onValueChange={setFilterStatus as any}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-auto">
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Priorities</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-auto">
              <Select value={filterProject} onValueChange={setFilterProject}>
                <SelectTrigger className="w-full md:w-52">
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Projects</SelectItem>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks
                .filter(task => task.status !== 'Done')
                .map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              
              {filteredTasks.filter(task => task.status !== 'Done').length === 0 && (
                <div className="col-span-3 text-center py-10">
                  <p className="text-muted-foreground">No active tasks found</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks
                .filter(task => task.status === 'Done')
                .map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              
              {filteredTasks.filter(task => task.status === 'Done').length === 0 && (
                <div className="col-span-3 text-center py-10">
                  <p className="text-muted-foreground">No completed tasks found</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              
              {filteredTasks.length === 0 && (
                <div className="col-span-3 text-center py-10">
                  <p className="text-muted-foreground">No tasks found</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyTasks;
