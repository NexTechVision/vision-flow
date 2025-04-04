
import { Helmet } from "react-helmet";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { tasks } from "../data/mockData";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import TaskCard from "../components/TaskCard";

const MyTasks = () => {
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    deadline: "",
  });

  const handleNewTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Missing information",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Task created",
      description: `"${newTask.title}" has been created successfully`,
    });

    setNewTask({
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      deadline: "",
    });
    setIsNewTaskDialogOpen(false);
  };

  const myTasks = tasks.filter(task => task.assigneeId === "user-1");

  return (
    <Layout>
      <div className="p-6 md:p-8">
        <Helmet>
          <title>My Tasks | VisionFlow</title>
        </Helmet>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2 md:mb-0">My Tasks</h1>
          <Button onClick={() => setIsNewTaskDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myTasks.length > 0 ? (
            myTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <div className="col-span-full bg-card rounded-md border shadow-sm p-6 text-center">
              <p className="text-muted-foreground">You don't have any tasks assigned to you.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsNewTaskDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create a new task
              </Button>
            </div>
          )}
        </div>
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
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="taskDescription">Description</Label>
              <Textarea
                id="taskDescription"
                placeholder="Task description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="taskStatus">Status</Label>
                <Select
                  value={newTask.status}
                  onValueChange={(value) =>
                    setNewTask({ ...newTask, status: value })
                  }
                >
                  <SelectTrigger id="taskStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="taskPriority">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) =>
                    setNewTask({ ...newTask, priority: value })
                  }
                >
                  <SelectTrigger id="taskPriority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="taskDeadline">Deadline</Label>
              <Input
                id="taskDeadline"
                type="date"
                value={newTask.deadline}
                onChange={(e) =>
                  setNewTask({ ...newTask, deadline: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleNewTask}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default MyTasks;
